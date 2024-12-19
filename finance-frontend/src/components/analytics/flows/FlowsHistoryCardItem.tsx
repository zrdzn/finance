import {Accordion, AccordionButton, AccordionItem, Box, Flex, Heading, HStack, Text} from "@chakra-ui/react"
import React, {useEffect, useState} from "react"
import {useApi} from "@/hooks/useApi"
import {useTranslations} from "next-intl";
import {Components} from "@/api/api";
import {TransactionFlowsRange, TransactionType} from "@/api/types";
import {useNumberFormatter} from "@/hooks/useNumberFormatter";

type VaultResponse = Components.Schemas.VaultResponse;
type Price = Components.Schemas.Price;

interface FlowsHistoryCardItemProperties {
  vault: VaultResponse
  transactionType: TransactionType
  flowsRange: TransactionFlowsRange
}

export const FlowsHistoryCardItem = ({
  vault,
  transactionType,
  flowsRange
}: FlowsHistoryCardItemProperties) => {
  const api = useApi()
  const { formatNumber } = useNumberFormatter()
  const t = useTranslations("Analytics")
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
          currency: 'PLN',
          start: startDate.toISOString()
        })
            .then(response => setFlows(response.data.total)))
        .catch(error => console.error(error))
  }, [api, transactionType, flowsRange, vault.id])

  return (
    <Accordion allowToggle width={'full'}>
      <AccordionItem width={'full'}
                     paddingY={4}
                     borderTop={'none'}>
          <AccordionButton width={'full'}>
            <Box width={'full'}>
              <Flex justifyContent={'space-between'}>
                <Text fontSize='md'
                      fontWeight={'600'}
                      isTruncated
                      maxWidth={'70%'}>
                  {flowsRange === 'DAY' && t('history.day')}
                  {flowsRange === 'WEEK' && t('history.week')}
                  {flowsRange === 'MONTH' && t('history.month')}
                  {flowsRange === 'YEAR' && t('history.year')}
                </Text>
                {
                  flows && flows.amount > 0 &&
                    <HStack>
                        <Text fontSize='xl'
                              fontWeight={'600'}
                              color={transactionType === "INCOMING" ? 'green' : 'crimson'}
                              isTruncated>
                          {formatNumber(flows.amount)}
                        </Text>
                        <Text fontSize='md'
                              fontWeight={'600'}
                              isTruncated>
                          {flows.currency}
                        </Text>
                    </HStack>
                }
                {
                  flows && flows.amount === 0 &&
                    <HStack>
                        <Text fontSize='xl'
                              fontWeight={'600'}
                              isTruncated>
                            {formatNumber(0.00)}
                        </Text>
                        <Text fontSize={'md'}
                              fontWeight={'600'}
                              isTruncated>
                          {flows.currency}
                        </Text>
                    </HStack>
                }
              </Flex>
              <Flex justifyContent={'space-between'}>
                <Text color={'dimgray'}
                      fontSize={'sm'}
                      letterSpacing={0.2}>
                </Text>
                <Text color={'dimgray'}
                      fontSize={'sm'}
                      letterSpacing={0.5}>
                </Text>
              </Flex>
            </Box>
          </AccordionButton>
      </AccordionItem>
    </Accordion>
  )
}
