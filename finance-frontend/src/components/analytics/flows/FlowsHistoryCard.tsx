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
  StatHelpText, StatArrow, HStack
} from "@chakra-ui/react"
import React, {useEffect, useState} from "react"
import {useTheme} from "@/hooks/useTheme"
import {useTranslations} from "next-intl";
import {TransactionFlowsRange, TransactionType} from "@/api/types";
import {useNumberFormatter} from "@/hooks/useNumberFormatter";
import {useApi} from "@/hooks/useApi";
import {Components} from "@/api/api";

type VaultResponse = Components.Schemas.VaultResponse;
type TransactionFlowsResponse = Components.Schemas.TransactionFlowsResponse;

interface FlowsHistoryCardProperties {
  vault: VaultResponse
  transactionType: TransactionType,
  flowsRange: TransactionFlowsRange
}

export const FlowsHistoryCard = ({
                                   vault, transactionType,
                                   flowsRange }: FlowsHistoryCardProperties) => {
  const api = useApi()
  const t = useTranslations("Analytics")
  const { formatNumber } = useNumberFormatter()
  const [flows, setFlows] = useState<TransactionFlowsResponse>({
    total: {
        amount: 0,
        currency: 'PLN'
    },
    count: {
      amount: 0
    }
  })

  useEffect(() => {
    const startDate = new Date()
    if (flowsRange === 'DAY') startDate.setDate(startDate.getDate() - 1)
    if (flowsRange === 'WEEK') startDate.setDate(startDate.getDate() - 7)
    if (flowsRange === 'MONTH') startDate.setMonth(startDate.getMonth() - 1)
    if (flowsRange === 'YEAR') startDate.setFullYear(startDate.getFullYear() - 1)

    api
        .then(client => client.getFlowsByVaultId({
          vaultId: vault.id,
          transactionType: transactionType,
          start: startDate.toISOString()
        })
            .then(response => setFlows(response.data)))
        .catch(error => console.error(error))
  }, [api, transactionType, flowsRange, vault.id])

  return (
      <Card margin={2} boxShadow="md" borderRadius="md" overflow="hidden">
        <CardBody>
          <Stat>
            <StatLabel>
              {transactionType === 'INCOMING' && t('history.income-title')}
              {transactionType === 'OUTGOING' && t('history.expenses-title')}
              &nbsp;
              (
              {flowsRange === 'DAY' && t('history.day')}
              {flowsRange === 'WEEK' && t('history.week')}
              {flowsRange === 'MONTH' && t('history.month')}
              {flowsRange === 'YEAR' && t('history.year')}
              )
            </StatLabel>

            <StatNumber>
              {flows && (
                  <HStack alignItems="center">
                    <Text
                        fontSize="2xl"
                        fontWeight="600"
                        color={flows.total.amount === 0 ? 'black' : transactionType === "INCOMING" ? 'green' : 'crimson'}
                        isTruncated
                    >
                      {flows.total.amount !== 0 && (
                          <StatArrow
                              type={transactionType === "INCOMING" ? 'increase' : 'decrease'}
                              mr={2}
                          />
                      )}
                      {formatNumber(flows.total.amount)}
                    </Text>
                    <Text
                        fontSize="xl"
                        isTruncated
                    >
                      {flows.total.currency}
                    </Text>
                  </HStack>
              )}
            </StatNumber>

            <StatHelpText fontSize="sm" color="gray.600" mt={2}>
              {flows.total.amount === 0
                  ? t('history.no-transactions', { period: t(`history.${flowsRange.toLowerCase()}`) })
                  : `${t('history.transactions-amount')} ${flows.count.amount}`}
            </StatHelpText>
          </Stat>
        </CardBody>
      </Card>
  )
}