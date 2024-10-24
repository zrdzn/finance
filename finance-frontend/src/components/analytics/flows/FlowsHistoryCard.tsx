import {Card, CardBody, Text, CardHeader, Flex, Heading, Stack} from "@chakra-ui/react"
import React from "react"
import {useTheme} from "@/hooks/useTheme"
import {FlowsHistoryCardItem} from "@/components/analytics/flows/FlowsHistoryCardItem"
import {useTranslations} from "next-intl";
import {TransactionType} from "@/api/types";
import {Components} from "@/api/api";

type VaultResponse = Components.Schemas.VaultResponse;

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
              transactionType === 'INCOMING' && t('history.income-title')
            }
            {
              transactionType === 'OUTGOING' && t('history.expenses-title')
            }
          </Text>
        </Flex>
      </CardHeader>
      <CardBody>
        <Stack gap={0}>
          <FlowsHistoryCardItem vault={vault} transactionType={transactionType} flowsRange={'DAY'} />
          <FlowsHistoryCardItem vault={vault} transactionType={transactionType} flowsRange={'WEEK'} />
          <FlowsHistoryCardItem vault={vault} transactionType={transactionType} flowsRange={'MONTH'} />
          <FlowsHistoryCardItem vault={vault} transactionType={transactionType} flowsRange={'YEAR'} />
        </Stack>
      </CardBody>
    </Card>
  )
}