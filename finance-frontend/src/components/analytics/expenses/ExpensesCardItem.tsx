import {
  Accordion, AccordionButton, AccordionIcon, AccordionItem,
  AccordionPanel,
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Link,
  Stack,
  StackDivider,
  Text
} from "@chakra-ui/react"
import {AddPaymentButton} from "@/components/payment/AddPaymentButton"
import React, {useEffect, useState} from "react"
import {useTheme} from "@/hooks/theme"
import {PaymentExpensesRange, PaymentExpensesResponse, PaymentResponse, VaultResponse} from "@/components/api"
import {useApi} from "@/hooks/apiClient"

interface ExpensesCardItemProperties {
  vault: VaultResponse
  expensesRange: PaymentExpensesRange
}

export const ExpensesCardItem = ({
  vault,
  expensesRange
}: ExpensesCardItemProperties) => {
  const api = useApi()
  const [expenses, setExpenses] = useState<PaymentExpensesResponse>({
    amount: 0,
    currency: 'PLN'
  })

  useEffect(() => {
    const startDate = new Date()
    if (expensesRange === PaymentExpensesRange.Day) startDate.setDate(startDate.getDate() - 1)
    if (expensesRange === PaymentExpensesRange.Week) startDate.setDate(startDate.getDate() - 7)
    if (expensesRange === PaymentExpensesRange.Month) startDate.setMonth(startDate.getMonth() - 1)
    if (expensesRange === PaymentExpensesRange.Year) startDate.setFullYear(startDate.getFullYear() - 1)

    api.get(`/payment/${vault.id}/expenses?currency=PLN&start=${startDate.toISOString()}`)
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
                  {expensesRange === PaymentExpensesRange.Day && 'Last 24 hours'}
                  {expensesRange === PaymentExpensesRange.Week && 'Last 7 days'}
                  {expensesRange === PaymentExpensesRange.Month && 'Last 30 days'}
                  {expensesRange === PaymentExpensesRange.Year && 'Last 365 days'}
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