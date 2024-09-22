import {Accordion, AccordionButton, AccordionItem, Box, Flex, Heading, Text} from "@chakra-ui/react"
import React, {useEffect, useState} from "react"
import {TransactionFlowsRange, TransactionFlowsResponse, TransactionType, VaultResponse} from "@/components/api"
import {useApi} from "@/hooks/useApi"

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
  const [flows, setFlows] = useState<TransactionFlowsResponse>({
    amount: 0,
    currency: 'PLN'
  })

  useEffect(() => {
    const startDate = new Date()
    if (flowsRange === TransactionFlowsRange.Day) startDate.setDate(startDate.getDate() - 1)
    if (flowsRange === TransactionFlowsRange.Week) startDate.setDate(startDate.getDate() - 7)
    if (flowsRange === TransactionFlowsRange.Month) startDate.setMonth(startDate.getMonth() - 1)
    if (flowsRange === TransactionFlowsRange.Year) startDate.setFullYear(startDate.getFullYear() - 1)

    api.get(`/transactions/${vault.id}/flows?transactionType=${transactionType}&currency=PLN&start=${startDate.toISOString()}`)
      .then(response => setFlows(response.data.total))
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
                  {flowsRange === TransactionFlowsRange.Day && 'Last 24 hours'}
                  {flowsRange === TransactionFlowsRange.Week && 'Last 7 days'}
                  {flowsRange === TransactionFlowsRange.Month && 'Last 30 days'}
                  {flowsRange === TransactionFlowsRange.Year && 'Last 365 days'}
                </Text>
                {
                  flows && flows.amount > 0 &&
                    <Text fontSize='xl'
                          fontWeight={'600'}>
                      {flows.amount.toFixed(2)} {flows.currency}
                    </Text>
                }
                {
                  flows && flows.amount === 0 &&
                    <Text fontSize='xl'
                          fontWeight={'600'}>
                      0.00 {flows.currency}
                    </Text>
                }
                {
                  !flows &&
                    <Text fontSize='xl'
                          fontWeight={'600'}>
                        N/A
                    </Text>
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