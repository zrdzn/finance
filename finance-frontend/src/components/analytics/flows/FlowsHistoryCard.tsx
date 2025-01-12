import {
  Card,
  CardBody,
  Text,
  CardHeader,
  Flex,
  Heading,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText, StatArrow
} from "@chakra-ui/react"
import React, {useEffect, useState} from "react"
import {useTheme} from "@/hooks/useTheme"
import {useTranslations} from "next-intl";
import {TransactionFlowsRange, TransactionType} from "@/api/types";
import {useNumberFormatter} from "@/hooks/useNumberFormatter";
import {useApi} from "@/hooks/useApi";
import {Components} from "@/api/api";

type VaultResponse = Components.Schemas.VaultResponse;
type Price = Components.Schemas.Price;

interface FlowsHistoryCardProperties {
  vault: VaultResponse
  transactionType: TransactionType,
  flowsRange: TransactionFlowsRange
}

export const FlowsHistoryCard = ({
                                   vault, transactionType,
                                   flowsRange }: FlowsHistoryCardProperties) => {
  const theme = useTheme()
  const api = useApi()
  const t = useTranslations("Analytics")
  const { formatNumber } = useNumberFormatter()
  const [flows, setFlows] = useState<Price>({
    amount: 0,
    currency: 'PLN'
  })

  useEffect(() => {
    const startDate = new Date()
    if (flowsRange === 'DAY') startDate.setDate(startDate.getDate() - 1)
    if (flowsRange === 'WEEK') startDate.setDate(startDate.getDate() - 7)
    if (flowsRange === 'MONTH') startDate.setMonth(startDate.getMonth() - 1)
    if (flowsRange === 'YEAR') startDate.setFullYear(startDate.getFullYear() - 1)

    api
        .then(client => client.getExpensesByVaultId({
          vaultId: vault.id,
          transactionType: transactionType,
          start: startDate.toISOString()
        })
            .then(response => setFlows(response.data.total)))
        .catch(error => console.error(error))
  }, [api, transactionType, flowsRange, vault.id])

  return (
    <Card margin={2}>
      <CardBody>
        <Stat>
          <StatLabel>
            {
                transactionType === 'INCOMING' && t('history.income-title')
            }
            {
                transactionType === 'OUTGOING' && t('history.expenses-title')
            }&nbsp;({flowsRange === 'DAY' && t('history.day')}
            {flowsRange === 'WEEK' && t('history.week')}
            {flowsRange === 'MONTH' && t('history.month')}
            {flowsRange === 'YEAR' && t('history.year')})
          </StatLabel>
          <StatNumber>£0.00</StatNumber>
          <StatHelpText>
            <StatArrow type='increase' />
            Feb 12 - Feb 28
          </StatHelpText>
        </Stat>
      </CardBody>
    </Card>
  )
}