import {Card, CardBody, CardHeader, Flex, Text, Stack} from "@chakra-ui/react"
import React from "react"
import {useTheme} from "@/hooks/useTheme"
import {AnalyticsSummaryCardItem} from "@/components/analytics/AnalyticsSummaryCardItem"
import {useTranslations} from "next-intl";
import {Components} from "@/api/api";

type VaultResponse = Components.Schemas.VaultResponse;

interface AnalyticsSummaryCardProperties {
  vault: VaultResponse
  permissions: string[]
}

export const AnalyticsSummaryCard = ({ vault, permissions }: AnalyticsSummaryCardProperties) => {
  const theme = useTheme()
  const t = useTranslations("Analytics")

  return (
    <Card margin={2}>
      <CardHeader backgroundColor={theme.secondaryColor}
                  color={theme.textColor}>
        <Flex alignItems={'center'}
              justifyContent={'space-between'}>
          <Text fontSize='md' fontWeight={'600'} textTransform={'uppercase'}>{t('summary.title')}</Text>
        </Flex>
      </CardHeader>
      <CardBody>
        <Stack gap={0}>
          <AnalyticsSummaryCardItem vault={vault} statisticType={'BALANCE'} />
          <AnalyticsSummaryCardItem vault={vault} statisticType={'INCOME'} />
          <AnalyticsSummaryCardItem vault={vault} statisticType={'EXPENSES'} />
          <AnalyticsSummaryCardItem vault={vault} statisticType={'TRANSACTIONS'} />
        </Stack>
      </CardBody>
    </Card>
  )
}