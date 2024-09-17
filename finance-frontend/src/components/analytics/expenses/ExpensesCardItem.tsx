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
import {ExpensesChart} from "@/components/analytics/expenses/ExpensesChart"

interface ExpensesCardItemProperties {
  vault: VaultResponse;
  expensesRange: PaymentExpensesRange;
}

export const ExpensesCardItem = ({ vault, expensesRange }: ExpensesCardItemProperties) => {
  const api = useApi();
  const [expenses, setExpenses] = useState<PaymentExpensesResponse>({
    amount: 0,
    currency: 'PLN'
  });

  useEffect(() => {
    const startDate = new Date();
    if (expensesRange === PaymentExpensesRange.Day) startDate.setDate(startDate.getDate() - 1);
    if (expensesRange === PaymentExpensesRange.Week) startDate.setDate(startDate.getDate() - 7);
    if (expensesRange === PaymentExpensesRange.Month) startDate.setMonth(startDate.getMonth() - 1);
    if (expensesRange === PaymentExpensesRange.Year) startDate.setFullYear(startDate.getFullYear() - 1);

    api.get(`/payment/${vault.id}/expenses?currency=PLN&start=${startDate.toISOString()}`)
      .then(response => setExpenses(response.data.total))
      .catch(error => console.error(error));
  }, [api, expensesRange, vault.id]);

  return (
    <Accordion allowToggle width={'full'}>
      <AccordionItem width={'full'} paddingY={4} borderTop={'none'}>
        <AccordionButton width={'full'}>
          <Box width={'full'}>
            <Flex justifyContent={'space-between'}>
              <Heading size='sm' isTruncated maxWidth={'70%'}>
                Total
              </Heading>
              <Heading size={'md'}>
                {expenses.amount.toFixed(2)} {expenses.currency}
              </Heading>
            </Flex>
            <Flex justifyContent={'center'} mt={6}>
              <Box width={{ base: '100%', sm: '100%', md: '100%' }} height={{ base: '250px', sm: '250px', md: '250px' }}>
                <ExpensesChart vault={vault} expensesRange={expensesRange} />
              </Box>
            </Flex>
          </Box>
        </AccordionButton>
      </AccordionItem>
    </Accordion>
  );
};