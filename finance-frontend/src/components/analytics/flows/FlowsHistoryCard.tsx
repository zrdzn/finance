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
      <Card
          margin={4}
          boxShadow="base"
          borderRadius="lg"
          overflow="hidden"
          backgroundColor="whiteAlpha.900"
          border="1px solid"
          borderColor="gray.200"
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
              {flows && flows.total.amount === 0
                  ? t('no-transactions')
                  : (
                      <>
                        {t('transactions-amount')}{" "}
                        <Text as="span" fontSize={'md'} ml={1} color={'black'} fontWeight={flows.count.amount > 0 ? "bold" : "normal"}>
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