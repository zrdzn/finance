import {Card, CardBody, CardHeader, Flex, Heading, Stack} from "@chakra-ui/react"
import React from "react"
import {useTheme} from "@/hooks/useTheme"
import {AnalyticsOverviewStatisticType, VaultResponse} from "@/components/api"
import {AnalyticsSummaryCardItem} from "@/components/analytics/AnalyticsSummaryCardItem"

interface AnalyticsSummaryCardProperties {
  vault: VaultResponse
  permissions: string[]
}

export const AnalyticsSummaryCard = ({ vault, permissions }: AnalyticsSummaryCardProperties) => {
  const theme = useTheme()

  return (
    <Card margin={2}>
      <CardHeader backgroundColor={theme.secondaryColor}
                  color={theme.textColor}>
        <Flex alignItems={'center'}
              justifyContent={'space-between'}>
          <Heading size='sm' textTransform={'uppercase'}>Summary</Heading>
        </Flex>
      </CardHeader>
      <CardBody>
        <Stack gap={0}>
          <AnalyticsSummaryCardItem vault={vault} statisticType={AnalyticsOverviewStatisticType.TotalTransactionsMade} />
          <AnalyticsSummaryCardItem vault={vault} statisticType={AnalyticsOverviewStatisticType.TotalExpenses} />
          <AnalyticsSummaryCardItem vault={vault} statisticType={AnalyticsOverviewStatisticType.AverageExpenses} />
        </Stack>
      </CardBody>
    </Card>
  )
}