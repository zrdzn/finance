import {Accordion, AccordionButton, AccordionItem, Box, Flex, Heading, HStack, Text} from "@chakra-ui/react"
import React, {useEffect, useState} from "react"
import {
  AnalyticsOverviewStatisticType,
  TransactionFlowsRange,
  TransactionFlowsResponse,
  VaultResponse
} from "@/components/api"
import {useApi} from "@/hooks/useApi"
import exp from "constants"

interface AnalyticsSummaryCardItemProperties {
  vault: VaultResponse
  statisticType: AnalyticsOverviewStatisticType
}

export const AnalyticsSummaryCardItem = ({
  vault, statisticType
}: AnalyticsSummaryCardItemProperties) => {
  const api = useApi()
  const [balance, setBalance] = useState<TransactionFlowsResponse | undefined>(undefined)
  const [income, setIncome] = useState<TransactionFlowsResponse | undefined>(undefined)
  const [expenses, setExpenses] = useState<TransactionFlowsResponse | undefined>(undefined)
  const [transactions, setTransactions] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (statisticType === AnalyticsOverviewStatisticType.Balance) {
      api.get(`/transactions/${vault.id}/flows?currency=PLN&start=${new Date(vault.createdAt).toISOString()}`)
        .then(response => setBalance(response.data.total))
        .catch(error => console.error(error))
    }

    if (statisticType === AnalyticsOverviewStatisticType.Income) {
      api.get(`/transactions/${vault.id}/flows?transactionType=INCOMING&currency=PLN&start=${new Date(vault.createdAt).toISOString()}`)
        .then(response => setIncome(response.data.total))
        .catch(error => console.error(error))
    }

    if (statisticType === AnalyticsOverviewStatisticType.Expenses) {
      api.get(`/transactions/${vault.id}/flows?transactionType=OUTGOING&currency=PLN&start=${new Date(vault.createdAt).toISOString()}`)
        .then(response => setExpenses(response.data.total))
        .catch(error => console.error(error))
    }

    if (statisticType === AnalyticsOverviewStatisticType.Transactions) {
      api.get(`/transactions/${vault.id}/amount`)
        .then(response => setTransactions(response.data.amount))
        .catch(error => console.error(error))
    }
  }, [api, statisticType, vault.createdAt, vault.id])

  return (
    <Accordion allowToggle width={'full'}>
      <AccordionItem width={'full'}
                     paddingY={4}
                     borderTop={'none'}>
          <AccordionButton width={'full'}>
            <Box width={'full'}>
              <Flex justifyContent={'space-between'}>
                <Text fontSize='md'
                      fontWeight={'600'}
                      isTruncated
                      maxWidth={'70%'}>
                  {statisticType === AnalyticsOverviewStatisticType.Balance && 'Balance'}
                  {statisticType === AnalyticsOverviewStatisticType.Income && 'Income'}
                  {statisticType === AnalyticsOverviewStatisticType.Expenses && 'Expenses'}
                  {statisticType === AnalyticsOverviewStatisticType.Transactions && 'Transactions'}
                </Text>
                {
                  balance && balance.amount > 0 &&
                    <HStack>
                        <Text fontSize='xl'
                              fontWeight={'600'}
                              color={'green'}
                              isTruncated>
                          {balance.amount.toFixed(2)}
                        </Text>
                        <Text fontSize='md'
                              fontWeight={'600'}
                              isTruncated>
                          {balance.currency}
                        </Text>
                    </HStack>
                }
                {
                  balance && balance.amount === 0 &&
                    <Text fontSize='xl'
                          fontWeight={'600'}
                          isTruncated>
                        0.00 {balance.currency}
                    </Text>
                }
                {
                  balance && balance.amount < 0 &&
                    <HStack>
                        <Text fontSize='xl'
                              fontWeight={'600'}
                              color={'crimson'}
                              isTruncated>
                          {balance.amount.toFixed(2)}
                        </Text>
                        <Text fontSize='md'
                              fontWeight={'600'}
                              isTruncated>
                          {balance.currency}
                        </Text>
                    </HStack>
                }
                {
                  income && income.amount > 0 &&
                    <HStack>
                        <Text fontSize='xl'
                              fontWeight={'600'}
                              color={'green'}
                              isTruncated>
                          {income.amount.toFixed(2)}
                        </Text>
                        <Text fontSize='md'
                              fontWeight={'600'}
                              isTruncated>
                          {income.currency}
                        </Text>
                    </HStack>
                }
                {
                  income && income.amount === 0 &&
                    <Text fontSize='xl'
                          fontWeight={'600'}
                          isTruncated>
                        0.00 {income.currency}
                    </Text>
                }
                {
                  expenses && expenses.amount > 0 &&
                    <HStack>
                        <Text fontSize='xl'
                              fontWeight={'600'}
                              color={'crimson'}
                              isTruncated>
                          {expenses.amount.toFixed(2)}
                        </Text>
                        <Text fontSize='md'
                              fontWeight={'600'}
                              isTruncated>
                          {expenses.currency}
                        </Text>
                    </HStack>
                }
                {
                  expenses && expenses.amount === 0 &&
                    <Text fontSize='xl'
                          fontWeight={'600'}
                          isTruncated>
                        0.00 {expenses.currency}
                    </Text>
                }
                {
                  transactions !== undefined && (
                    <Text fontSize='xl' fontWeight='600' isTruncated>
                      {transactions.toLocaleString()}
                    </Text>
                  )
                }
              </Flex>
              <Flex justifyContent={'space-between'}>
                <Text color={'dimgray'}
                      fontSize={'sm'}
                      letterSpacing={0.2}>
                </Text>
                <Text color={'dimgray'}
                      fontSize={'sm'}
                      letterSpacing={0.5}>
                </Text>
              </Flex>
            </Box>
          </AccordionButton>
      </AccordionItem>
    </Accordion>
  )
}