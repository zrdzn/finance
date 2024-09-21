import {Accordion, AccordionButton, AccordionItem, Box, Flex, Heading, Text} from "@chakra-ui/react"
import React, {useEffect, useState} from "react"
import {TransactionExpensesRange, TransactionExpensesResponse, VaultResponse} from "@/components/api"
import {useApi} from "@/hooks/useApi"

interface ExpensesCardItemProperties {
  vault: VaultResponse
  expensesRange: TransactionExpensesRange
}

export const ExpensesCardItem = ({
  vault,
  expensesRange
}: ExpensesCardItemProperties) => {
  const api = useApi()
  const [expenses, setExpenses] = useState<TransactionExpensesResponse>({
    amount: 0,
    currency: 'PLN'
  })

  useEffect(() => {
    const startDate = new Date()
    if (expensesRange === TransactionExpensesRange.Day) startDate.setDate(startDate.getDate() - 1)
    if (expensesRange === TransactionExpensesRange.Week) startDate.setDate(startDate.getDate() - 7)
    if (expensesRange === TransactionExpensesRange.Month) startDate.setMonth(startDate.getMonth() - 1)
    if (expensesRange === TransactionExpensesRange.Year) startDate.setFullYear(startDate.getFullYear() - 1)

    api.get(`/transactions/${vault.id}/expenses?currency=PLN&start=${startDate.toISOString()}`)
      .then(response => setExpenses(response.data.total))
      .catch(error => console.error(error))
  }, [api, expensesRange, vault.id])

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
                  {expensesRange === TransactionExpensesRange.Day && 'Last 24 hours'}
                  {expensesRange === TransactionExpensesRange.Week && 'Last 7 days'}
                  {expensesRange === TransactionExpensesRange.Month && 'Last 30 days'}
                  {expensesRange === TransactionExpensesRange.Year && 'Last 365 days'}
                </Heading>
                {
                  expenses && expenses.amount > 0 &&
                    <Heading size={'md'}>
                      {expenses.amount.toFixed(2)} {expenses.currency}
                    </Heading>
                }
                {
                  expenses && expenses.amount === 0 &&
                    <Heading size={'md'}>
                      0.00 {expenses.currency}
                    </Heading>
                }
                {
                  !expenses &&
                    <Heading size={'md'}>
                        N/A
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