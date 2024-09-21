import {Accordion, AccordionButton, AccordionItem, Box, Flex, Heading, Text} from "@chakra-ui/react"
import React, {useEffect, useState} from "react"
import {
  AnalyticsOverviewStatisticType,
  TransactionExpensesRange,
  TransactionExpensesResponse,
  VaultResponse
} from "@/components/api"
import {useApi} from "@/hooks/useApi"

interface AnalyticsSummaryCardItemProperties {
  vault: VaultResponse
  statisticType: AnalyticsOverviewStatisticType
}

export const AnalyticsSummaryCardItem = ({
  vault, statisticType
}: AnalyticsSummaryCardItemProperties) => {
  const api = useApi()
  const [totalTransactionsMade, setTotalTransactionsMade] = useState<number | undefined>(undefined)
  const [totalExpenses, setTotalExpenses] = useState<TransactionExpensesResponse | undefined>(undefined)
  const [averageExpenses, setAverageExpenses] = useState<TransactionExpensesResponse | undefined>(undefined)

  useEffect(() => {
    if (statisticType === AnalyticsOverviewStatisticType.TotalTransactionsMade) {
      api.get(`/transactions/${vault.id}/amount`)
        .then(response => setTotalTransactionsMade(response.data.amount))
        .catch(error => console.error(error))
    }

    if (statisticType === AnalyticsOverviewStatisticType.TotalExpenses) {
      api.get(`/transactions/${vault.id}/expenses?currency=PLN&start=${new Date(vault.createdAt).toISOString()}`)
        .then(response => setTotalExpenses(response.data.total))
        .catch(error => console.error(error))
    }

    if (statisticType === AnalyticsOverviewStatisticType.AverageExpenses) {
      api.get(`/transactions/${vault.id}/expenses/average?currency=PLN&range=${TransactionExpensesRange.Month}`)
        .then(response => setAverageExpenses(response.data.total))
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
                <Heading size='sm'
                         isTruncated
                         maxWidth={'70%'}>
                  {statisticType === AnalyticsOverviewStatisticType.TotalTransactionsMade && 'Total Transactions Made'}
                  {statisticType === AnalyticsOverviewStatisticType.TotalExpenses && 'Total Expenses'}
                  {statisticType === AnalyticsOverviewStatisticType.AverageExpenses && 'Average Expenses (per month)'}
                </Heading>
                {
                  totalTransactionsMade &&
                    <Heading size={'md'}>
                      {totalTransactionsMade}
                    </Heading>
                }
                {
                  totalExpenses && totalExpenses.amount > 0 &&
                    <Heading size={'md'}>
                      {totalExpenses.amount.toFixed(2)} {totalExpenses.currency}
                    </Heading>
                }
                {
                  totalExpenses && totalExpenses.amount === 0 &&
                    <Heading size={'md'}>
                        0.00 {totalExpenses.currency}
                    </Heading>
                }
                {
                  averageExpenses && averageExpenses.amount > 0 &&
                    <Heading size={'md'}>
                      {averageExpenses.amount.toFixed(2)} {averageExpenses.currency}
                    </Heading>
                }
                {
                  averageExpenses && averageExpenses.amount === 0 &&
                    <Heading size={'md'}>
                        0.00 {averageExpenses.currency}
                    </Heading>
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