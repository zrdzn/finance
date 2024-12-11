import {Accordion, Card, CardBody, CardHeader, Divider, Flex, Heading, Stack, Text} from "@chakra-ui/react"
import {AddTransactionButton} from "@/components/transaction/AddTransactionButton"
import React, {useEffect, useState} from "react"
import {useTheme} from "@/hooks/useTheme"
import {useApi} from "@/hooks/useApi"
import {TransactionsCardItem} from "@/components/transaction/TransactionsCardItem"
import {SearchBar} from "@/components/shared/SearchBar"
import {useTranslations} from "next-intl";
import {Components} from "@/api/api";

type VaultResponse = Components.Schemas.VaultResponse;
type TransactionResponse = Components.Schemas.TransactionResponse;

interface TransactionsCardProperties {
  vault: VaultResponse
  permissions: string[]
}

export const TransactionsCard = ({ vault, permissions }: TransactionsCardProperties) => {
  const theme = useTheme()
  const api = useApi()
  const t = useTranslations("Transactions")
  const [transactions, setTransactions] = useState<TransactionResponse[]>([])
  const [queriedTransactions, setQueriedTransactions] = useState<TransactionResponse[]>([])

  useEffect(() => {
      api
          .then(client => client.getTransactionsByVaultId({ vaultId: vault.id })
            .then(response => {
                setTransactions(response.data.transactions)
                setQueriedTransactions(response.data.transactions)
            }))
          .catch(error => console.error(error))
  }, [api, vault.id]);

  const handleSearchResults = (results: TransactionResponse[]) => {
    setQueriedTransactions(results)
  }

  return (
    <Card margin={2} width={'full'}>
      <CardHeader backgroundColor={theme.secondaryColor}
                  color={theme.textColor}>
        <Flex alignItems={'center'}
              justifyContent={'space-between'}>
          <Text fontSize='md' fontWeight={'600'} textTransform={'uppercase'}>{t('card.title')}</Text>
        </Flex>
      </CardHeader>
      <CardBody>
        <Flex justifyContent={'space-between'}
              gap={4}>
          <SearchBar
            placeholder={t('card.search-placeholder')}
            content={transactions}
            onSearch={handleSearchResults}
            filter={(transaction, query) => {
              if (transaction.description === undefined) {
                return false
              }

              return transaction.description.toLowerCase().includes(query.toLowerCase())}
            }
          />
          {
            permissions.includes("TRANSACTION_CREATE") && <AddTransactionButton vault={vault} />
          }
        </Flex>
        <Divider mt={4} />
        <Stack gap={0}>
            {
              queriedTransactions.length === 0 && <Text size={'sm'}>{t('card.no-transactions')}</Text>
            }
            {
              queriedTransactions &&
              queriedTransactions.sort((transaction, nextTransaction) => new Date(nextTransaction.createdAt).getTime() - new Date(transaction.createdAt).getTime())
                .map(transaction =>
                  <>
                    <TransactionsCardItem key={transaction.id}
                                          vaultId={vault.id}
                                          transaction={transaction}
                                          permissions={permissions} />
                    <Divider />
                  </>
                )
            }
        </Stack>
      </CardBody>
    </Card>
  )
}