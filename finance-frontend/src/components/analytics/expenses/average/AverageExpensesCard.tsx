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
import {AverageExpensesCardItem} from "@/components/analytics/expenses/average/AverageExpensesCardItem"

interface AverageExpensesStatisticCardProperties {
  vault: VaultResponse
}

export const AverageCard = ({ vault }: AverageExpensesStatisticCardProperties) => {
  const theme = useTheme()

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
        <Tabs isFitted>
          <TabList>
            <Tab>Per day</Tab>
            <Tab>Per week</Tab>
            <Tab>Per month</Tab>
            <Tab>Per year</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <AverageExpensesCardItem vault={vault} expensesRange={PaymentExpensesRange.Day} />
            </TabPanel>
            <TabPanel>
              <AverageExpensesCardItem vault={vault} expensesRange={PaymentExpensesRange.Week} />
            </TabPanel>
            <TabPanel>
              <AverageExpensesCardItem vault={vault} expensesRange={PaymentExpensesRange.Month} />
            </TabPanel>
            <TabPanel>
              <AverageExpensesCardItem vault={vault} expensesRange={PaymentExpensesRange.Year} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </CardBody>
    </Card>
  )
}