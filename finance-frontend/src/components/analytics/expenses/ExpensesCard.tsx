import {
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs
} from "@chakra-ui/react"
import React, {useEffect, useState} from "react"
import {useTheme} from "@/hooks/theme"
import {PaymentExpensesRange, PaymentResponse, VaultResponse} from "@/components/api"
import {useApi} from "@/hooks/apiClient"
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
          <Tabs isFitted>
            <TabList>
              <Tab>24 hours</Tab>
              <Tab>7 days</Tab>
              <Tab>30 days</Tab>
              <Tab>365 days</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <ExpensesCardItem vault={vault} expensesRange={PaymentExpensesRange.Day} />
              </TabPanel>
              <TabPanel>
                <ExpensesCardItem vault={vault} expensesRange={PaymentExpensesRange.Week} />
              </TabPanel>
              <TabPanel>
                <ExpensesCardItem vault={vault} expensesRange={PaymentExpensesRange.Month} />
              </TabPanel>
              <TabPanel>
                <ExpensesCardItem vault={vault} expensesRange={PaymentExpensesRange.Year} />
              </TabPanel>
            </TabPanels>
          </Tabs>
      </CardBody>
    </Card>
  )
}