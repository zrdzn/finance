import {Accordion, AccordionButton, AccordionItem, Box, Flex, Heading, Text} from "@chakra-ui/react"
import React, {useEffect, useState} from "react"
import {
  AnalyticsOverviewStatisticType,
  PaymentExpensesRange,
  PaymentExpensesResponse,
  VaultResponse
} from "@/components/api"
import {useApi} from "@/hooks/apiClient"

interface AnalyticsSummaryCardItemProperties {
  vault: VaultResponse
  statisticType: AnalyticsOverviewStatisticType
}

export const AnalyticsSummaryCardItem = ({
  vault, statisticType
}: AnalyticsSummaryCardItemProperties) => {
  const api = useApi()
  const [totalPaymentsMade, setTotalPaymentsMade] = useState<number | undefined>(undefined)
  const [totalExpenses, setTotalExpenses] = useState<PaymentExpensesResponse | undefined>(undefined)
  const [averageExpenses, setAverageExpenses] = useState<PaymentExpensesResponse | undefined>(undefined)

  useEffect(() => {
    if (statisticType === AnalyticsOverviewStatisticType.TotalPaymentsMade) {
      api.get(`/payment/${vault.id}/amount`)
        .then(response => setTotalPaymentsMade(response.data.amount))
        .catch(error => console.error(error))
    }

    if (statisticType === AnalyticsOverviewStatisticType.TotalExpenses) {
      api.get(`/payment/${vault.id}/expenses?currency=PLN&start=${new Date(vault.createdAt).toISOString()}`)
        .then(response => setTotalExpenses(response.data.total))
        .catch(error => console.error(error))
    }

    if (statisticType === AnalyticsOverviewStatisticType.AverageExpenses) {
      api.get(`/payment/${vault.id}/expenses/average?currency=PLN&range=${PaymentExpensesRange.Month}`)
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
                  {statisticType === AnalyticsOverviewStatisticType.TotalPaymentsMade && 'Total Payments Made'}
                  {statisticType === AnalyticsOverviewStatisticType.TotalExpenses && 'Total Expenses'}
                  {statisticType === AnalyticsOverviewStatisticType.AverageExpenses && 'Average Expenses (per month)'}
                </Heading>
                {
                  totalPaymentsMade &&
                    <Heading size={'md'}>
                      {totalPaymentsMade}
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