import {Accordion, Card, CardBody, CardHeader, Divider, Flex, Heading, Stack, Text} from "@chakra-ui/react"
import {AddTransactionButton} from "@/components/transaction/AddTransactionButton"
import React, {useEffect, useState} from "react"
import {useTheme} from "@/hooks/useTheme"
import {TransactionResponse, VaultResponse} from "@/components/api"
import {useApi} from "@/hooks/useApi"
import {TransactionsCardItem} from "@/components/transaction/TransactionsCardItem"
import {SearchBar} from "@/components/shared/SearchBar"
import {useRouter} from "next/router"

interface TransactionsCardProperties {
  vault: VaultResponse
  permissions: string[]
}

export const TransactionsCard = ({ vault, permissions }: TransactionsCardProperties) => {
  const theme = useTheme()
  const api = useApi()
  const [transactions, setTransactions] = useState<TransactionResponse[]>([])
  const [queriedTransactions, setQueriedTransactions] = useState<TransactionResponse[]>([])

  useEffect(() => {
    api.get(`/transactions/${vault.id}`)
      .then(response => {
        setTransactions(response.data.transactions)
        setQueriedTransactions(response.data.transactions)
      })
      .catch(error => console.error(error))
  }, [api, vault.id]);

  const handleSearchResults = (results: TransactionResponse[]) => {
    setQueriedTransactions(results)
  }

  return (
    <Card margin={2}>
      <CardHeader backgroundColor={theme.secondaryColor}
                  color={theme.textColor}>
        <Flex alignItems={'center'}
              justifyContent={'space-between'}>
          <Heading size='sm' textTransform={'uppercase'}>Transactions</Heading>
        </Flex>
      </CardHeader>
      <CardBody>
        <Flex justifyContent={'space-between'}
              gap={4}>
          <SearchBar
            placeholder="Search transactions"
            content={transactions}
            onSearch={handleSearchResults}
            filter={(transaction, query) => {
              if (transaction.description === null) {
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
          <Accordion allowToggle width={'full'} allowMultiple={false}>
            {
              queriedTransactions.length === 0 && <Text size={'sm'}>There are no transactions</Text>
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
          </Accordion>
        </Stack>
      </CardBody>
    </Card>
  )
}