import {Box, Card, CardBody, CardHeader, Flex, Heading, Link, Stack, Text} from "@chakra-ui/react"
import React, {useEffect, useState} from "react"
import {useTheme} from "@/hooks/useTheme"
import {useApi} from "@/hooks/useApi"
import {TransactionsCardItem} from "@/components/transaction/TransactionsCardItem"
import {useTranslations} from "next-intl";
import {Components} from "@/api/api";

type VaultResponse = Components.Schemas.VaultResponse;
type TransactionResponse = Components.Schemas.TransactionResponse;

interface LastTransactionsCardProperties {
  vault: VaultResponse
  permissions: string[]
}

export const LastTransactionsCard = ({ vault, permissions }: LastTransactionsCardProperties) => {
  const theme = useTheme()
  const api = useApi()
  const t = useTranslations("Transactions")
  const [transactions, setTransactions] = useState<TransactionResponse[]>([])

  useEffect(() => {
    api
        .then(client => client.getTransactionsByVaultId({ vaultId: vault.id })
            .then(response => setTransactions(response.data.transactions)))
        .catch(error => console.error(error))
  }, [api, vault.id]);

  return (
    <Card margin={2}>
      <CardHeader backgroundColor={theme.secondaryColor}
                  color={theme.textColor}>
        <Flex alignItems={'center'}
              justifyContent={'space-between'}>
          <Text fontSize='md' fontWeight={'600'} textTransform={'uppercase'}>{t('recent.card.title')}</Text>
        </Flex>
      </CardHeader>
      <CardBody>
        <Stack gap={4}>
          {
            transactions.length === 0 && <Text size={'sm'}>{t('recent.card.no-transactions')}</Text>
          }
          {
            transactions &&
            transactions
                .sort((transactions, nextTransaction) => new Date(nextTransaction.createdAt).getTime() - new Date(transactions.createdAt).getTime())
                .slice(0, 3)
                .map(transaction => <TransactionsCardItem key={transaction.id}
                                                    vaultId={vault.id}
                                                    transaction={transaction}
                                                    permissions={permissions} />)
          }
          <Box paddingTop={4}>
            <Flex justifyContent={'space-between'}>
              <Box />
              <Link color={'dimgray'}
                    fontSize={'sm'}
                    href={`/vault/${vault.publicId}/transactions`}
                    letterSpacing={0.5}>
                {t('recent.card.view-all')}
              </Link>
            </Flex>
          </Box>
        </Stack>
      </CardBody>
    </Card>
  )
}