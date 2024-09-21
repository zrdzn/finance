import {Card, CardBody, CardHeader, Flex, Heading, Stack} from "@chakra-ui/react"
import React from "react"
import {useTheme} from "@/hooks/useTheme"
import {TransactionExpensesRange, VaultResponse} from "@/components/api"
import {ExpensesCardItem} from "@/components/analytics/expenses/ExpensesCardItem"

interface ExpensesStatisticCardProperties {
  vault: VaultResponse
}

export const ExpensesCard = ({ vault }: ExpensesStatisticCardProperties) => {
  const theme = useTheme()

  return (
    <Card margin={2}>
      <CardHeader backgroundColor={theme.secondaryColor}
                  color={theme.textColor}>
        <Flex alignItems={'center'}
              justifyContent={'space-between'}>
          <Heading size='sm' textTransform={'uppercase'}>Expenses</Heading>
        </Flex>
      </CardHeader>
      <CardBody>
        <Stack gap={0}>
          <ExpensesCardItem vault={vault} expensesRange={TransactionExpensesRange.Day} />
          <ExpensesCardItem vault={vault} expensesRange={TransactionExpensesRange.Week} />
          <ExpensesCardItem vault={vault} expensesRange={TransactionExpensesRange.Month} />
          <ExpensesCardItem vault={vault} expensesRange={TransactionExpensesRange.Year} />
        </Stack>
      </CardBody>
    </Card>
  )
}