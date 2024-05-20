import {Card, CardBody, CardHeader, Flex, Heading, Stack} from "@chakra-ui/react"
import React, {useEffect, useState} from "react"
import {useTheme} from "@/hooks/theme"
import {PaymentExpensesRange, PaymentResponse, VaultResponse} from "@/components/api"
import {useApi} from "@/hooks/apiClient"
import {ExpensesCardItem} from "@/components/analytics/expenses/ExpensesCardItem"
import {AverageExpensesCardItem} from "@/components/analytics/expenses/average/AverageExpensesCardItem"

interface AverageExpensesStatisticCardProperties {
  vault: VaultResponse
}

export const AverageCard = ({ vault }: AverageExpensesStatisticCardProperties) => {
  const theme = useTheme()
  const api = useApi()

  return (
    <Card margin={2}>
      <CardHeader backgroundColor={theme.secondaryColor}
                  color={theme.textColor}>
        <Flex alignItems={'center'}
              justifyContent={'space-between'}>
          <Heading size='sm' textTransform={'uppercase'}>Average Expenses</Heading>
        </Flex>
      </CardHeader>
      <CardBody>
        <Stack gap={0}>
          <AverageExpensesCardItem vault={vault} expensesRange={PaymentExpensesRange.Day} />
          <AverageExpensesCardItem vault={vault} expensesRange={PaymentExpensesRange.Week} />
          <AverageExpensesCardItem vault={vault} expensesRange={PaymentExpensesRange.Month} />
          <AverageExpensesCardItem vault={vault} expensesRange={PaymentExpensesRange.Year} />
        </Stack>
      </CardBody>
    </Card>
  )
}