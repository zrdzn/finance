import {Accordion, AccordionButton, AccordionItem, Box, Flex, Heading, Text} from "@chakra-ui/react"
import React, {useEffect, useState} from "react"
import {TransactionExpensesRange, TransactionExpensesResponse, VaultResponse} from "@/components/api"
import {useApi} from "@/hooks/useApi"

interface AverageExpensesCardItemProperties {
  vault: VaultResponse
  expensesRange: TransactionExpensesRange
}

export const AverageExpensesCardItem = ({
  vault,
  expensesRange
}: AverageExpensesCardItemProperties) => {
  const api = useApi()
  const [expenses, setExpenses] = useState<TransactionExpensesResponse>({
    amount: 0,
    currency: 'PLN'
  })

  useEffect(() => {
    api.get(`/payment/${vault.id}/expenses/average?currency=PLN&range=${expensesRange}`)
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
                  {expensesRange === TransactionExpensesRange.Day && 'Per day'}
                  {expensesRange === TransactionExpensesRange.Week && 'Per week'}
                  {expensesRange === TransactionExpensesRange.Month && 'Per month'}
                  {expensesRange === TransactionExpensesRange.Year && 'Per year'}
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