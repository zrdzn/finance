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
  StatHelpText, StatArrow, HStack, theme
} from "@chakra-ui/react"
import React, {useEffect, useState} from "react"
import {useTranslations} from "next-intl";
import {TransactionFlowsRange, TransactionType} from "@/api/types";
import {useNumberFormatter} from "@/hooks/useNumberFormatter";
import {useApi} from "@/hooks/useApi";
import {Components} from "@/api/api";
import {useTheme} from "@/hooks/useTheme";

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
  const { api } = useApi()
  const t = useTranslations("Analytics")
  const theme = useTheme()
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

  const getColor = () => {
    if (transactionType === "INCOMING") return theme.text.green;
    if (transactionType === "OUTGOING") return theme.text.red;
    return flows.total.amount > 0 ? theme.text.green : flows.total.amount < 0 ? theme.text.red : theme.text.primary;
  };

  const getArrowType = () => {
    if (transactionType === "INCOMING") return "increase";
    if (transactionType === "OUTGOING") return "decrease";
    return flows.total.amount > 0 ? "increase" : "decrease";
  };

  return (
      <Card
          margin={4}
          boxShadow="base"
          borderRadius="lg"
          overflow="hidden"
          backgroundColor={theme.background.secondary}
          color={theme.text.primary}
      >
        <CardBody>
          <Stat>
            <StatLabel>
              {transactionType === 'INCOMING' && t('income-title')}
              {transactionType === 'OUTGOING' && t('expenses-title')}&nbsp;(
              {flowsRange === 'DAY' && t('day')}
              {flowsRange === 'WEEK' && t('week')}
              {flowsRange === 'MONTH' && t('month')}
              {flowsRange === 'YEAR' && t('year')}
              )
            </StatLabel>

            <StatNumber>
              {flows && (
                  <HStack alignItems="center">
                    <Text
                        fontSize="2xl"
                        fontWeight="600"
                        color={getColor()}
                        isTruncated
                    >
                      {flows.total.amount !== 0 && (
                          <StatArrow
                              type={getArrowType()}
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

            <StatHelpText fontSize="sm" color={theme.text.secondary} mt={2}>
              {flows && flows.total.amount === 0
                  ? t('no-transactions')
                  : (
                      <>
                        {t('transactions-amount')}{" "}
                        <Text as="span" fontSize={'md'} ml={1} color={theme.text.primary} fontWeight={flows.count.amount > 0 ? "bold" : "normal"}>
                          {flows.count.amount}
                        </Text>
                      </>
                  )}
            </StatHelpText>
          </Stat>
        </CardBody>
      </Card>
  )
}