import {Box, Card, CardBody, CardHeader, Flex, Heading, Link, Stack, Text} from "@chakra-ui/react"
import React, {useEffect, useState} from "react"
import {useTheme} from "@/hooks/useTheme"
import {TransactionResponse, VaultResponse} from "@/components/api"
import {useApi} from "@/hooks/useApi"
import {TransactionsCardItem} from "@/components/transaction/TransactionsCardItem"

interface LastTransactionsCardProperties {
  vault: VaultResponse
  permissions: string[]
}

export const LastTransactionsCard = ({ vault, permissions }: LastTransactionsCardProperties) => {
  const theme = useTheme()
  const api = useApi()
  const [transactions, setTransactions] = useState<TransactionResponse[]>([])

  useEffect(() => {
    api.get(`/transactions/${vault.id}`)
      .then(response => setTransactions(response.data.transactions))
      .catch(error => console.error(error))
  }, [api, vault.id]);

  return (
    <Card margin={2}>
      <CardHeader backgroundColor={theme.secondaryColor}
                  color={theme.textColor}>
        <Flex alignItems={'center'}
              justifyContent={'space-between'}>
          <Text fontSize='md' fontWeight={'600'} textTransform={'uppercase'}>Last transactions</Text>
        </Flex>
      </CardHeader>
      <CardBody>
        <Stack gap={0}>
          {
            transactions.length === 0 && <Text size={'sm'}>There are no transactions</Text>
          }
          {
            transactions &&
            transactions.sort((transactions, nextTransaction) => new Date(nextTransaction.createdAt).getTime() - new Date(transactions.createdAt).getTime())
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
                View All
              </Link>
            </Flex>
          </Box>
        </Stack>
      </CardBody>
    </Card>
  )
}