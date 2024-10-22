import {Card, CardBody, Text, CardHeader, Flex, Heading, Stack} from "@chakra-ui/react"
import React from "react"
import {useTheme} from "@/hooks/useTheme"
import {TransactionFlowsRange, TransactionType, VaultResponse} from "@/components/api"
import {FlowsHistoryCardItem} from "@/components/analytics/flows/FlowsHistoryCardItem"
import {useTranslations} from "next-intl";

interface FlowsHistoryCardProperties {
  vault: VaultResponse
  transactionType: TransactionType
}

export const FlowsHistoryCard = ({ vault, transactionType }: FlowsHistoryCardProperties) => {
  const theme = useTheme()
  const t = useTranslations("Analytics")

  return (
    <Card margin={2}>
      <CardHeader backgroundColor={theme.secondaryColor}
                  color={theme.textColor}>
        <Flex alignItems={'center'}
              justifyContent={'space-between'}>
          <Text fontSize='md' fontWeight={'600'} textTransform={'uppercase'}>
            {
              transactionType === TransactionType.Incoming && t('history.income-title')
            }
            {
              transactionType === TransactionType.Outgoing && t('history.expenses-title')
            }
          </Text>
        </Flex>
      </CardHeader>
      <CardBody>
        <Stack gap={0}>
          <FlowsHistoryCardItem vault={vault} transactionType={transactionType} flowsRange={TransactionFlowsRange.Day} />
          <FlowsHistoryCardItem vault={vault} transactionType={transactionType} flowsRange={TransactionFlowsRange.Week} />
          <FlowsHistoryCardItem vault={vault} transactionType={transactionType} flowsRange={TransactionFlowsRange.Month} />
          <FlowsHistoryCardItem vault={vault} transactionType={transactionType} flowsRange={TransactionFlowsRange.Year} />
        </Stack>
      </CardBody>
    </Card>
  )
}