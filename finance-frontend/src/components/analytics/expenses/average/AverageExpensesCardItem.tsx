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

interface AverageExpensesCardItemProperties {
  vault: VaultResponse
  expensesRange: PaymentExpensesRange
}

export const AverageExpensesCardItem = ({
  vault,
  expensesRange
}: AverageExpensesCardItemProperties) => {
  const api = useApi()
  const [expenses, setExpenses] = useState<PaymentExpensesResponse>({
    amount: 0,
    currency: 'PLN'
  })

  useEffect(() => {
    console.log('expensesRange', expensesRange)
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
                  {expensesRange === PaymentExpensesRange.Day && 'Per day'}
                  {expensesRange === PaymentExpensesRange.Week && 'Per week'}
                  {expensesRange === PaymentExpensesRange.Month && 'Per month'}
                  {expensesRange === PaymentExpensesRange.Year && 'Per year'}
                </Heading>
                {
                  expenses && expenses.amount > 0 &&
                    <Heading size={'md'}>
                      {expenses.amount.toFixed(2)} {expenses.currency}
                    </Heading>
                }
                {
                  !expenses || expenses.amount === 0 &&
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