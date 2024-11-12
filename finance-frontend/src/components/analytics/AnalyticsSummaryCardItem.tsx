import {Accordion, AccordionButton, AccordionItem, Box, Flex, HStack, Text} from "@chakra-ui/react"
import React, {useEffect, useState} from "react"
import {useApi} from "@/hooks/useApi"
import {useTranslations} from "next-intl";
import {AnalyticsOverviewStatisticType} from "@/api/types";
import {Components} from "@/api/api";

type VaultResponse = Components.Schemas.VaultResponse;
type Price = Components.Schemas.Price;

interface AnalyticsSummaryCardItemProperties {
  vault: VaultResponse
  statisticType: AnalyticsOverviewStatisticType
}

export const AnalyticsSummaryCardItem = ({
  vault, statisticType
}: AnalyticsSummaryCardItemProperties) => {
  const api = useApi()
  const t = useTranslations("Analytics")
  const [balance, setBalance] = useState<Price | undefined>(undefined)
  const [income, setIncome] = useState<Price | undefined>(undefined)
  const [expenses, setExpenses] = useState<Price | undefined>(undefined)
  const [transactions, setTransactions] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (statisticType === 'BALANCE') {
      api
        .then(client => client.getExpensesByVaultId({
          vaultId: vault.id,
          currency: 'PLN',
          start: new Date(vault.createdAt).toISOString()
        })
          .then(response => setBalance(response.data.total)))
        .catch(error => console.error(error))
    }

    if (statisticType === 'INCOME') {
      api
        .then(client => client.getExpensesByVaultId({
          vaultId: vault.id,
          transactionType: 'INCOMING',
          currency: 'PLN',
          start: new Date(vault.createdAt).toISOString()
        })
          .then(response => setIncome(response.data.total)))
        .catch(error => console.error(error))
    }

    if (statisticType === 'EXPENSES') {
      api
        .then(client => client.getExpensesByVaultId({
          vaultId: vault.id,
          transactionType: 'OUTGOING',
          currency: 'PLN',
          start: new Date(vault.createdAt).toISOString()
        })
          .then(response => setExpenses(response.data.total)))
        .catch(error => console.error(error))
    }

    if (statisticType === 'TRANSACTIONS') {
      api
        .then(client => client.getTransactionsAmountByVaultId({ vaultId: vault.id })
          .then(response => setTransactions(response.data.amount)))
        .catch(error => console.error(error))
    }
  }, [api, statisticType, vault.createdAt, vault.id])

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
                  {statisticType === 'BALANCE' && t('summary.balance')}
                  {statisticType === 'INCOME' && t('summary.income')}
                  {statisticType === 'EXPENSES' && t('summary.expenses')}
                  {statisticType === 'TRANSACTIONS' && t('summary.transactions')}
                </Text>
                {
                  balance && balance.amount > 0 &&
                    <HStack>
                        <Text fontSize='xl'
                              fontWeight={'600'}
                              color={'green'}
                              isTruncated>
                          {balance.amount.toFixed(2)}
                        </Text>
                        <Text fontSize='md'
                              fontWeight={'600'}
                              isTruncated>
                          {balance.currency}
                        </Text>
                    </HStack>
                }
                {
                  balance && balance.amount === 0 &&
                    <HStack>
                        <Text fontSize='xl'
                              fontWeight={'600'}
                              isTruncated>
                            0.00
                        </Text>
                        <Text fontSize={'md'}
                              fontWeight={'600'}
                              isTruncated>
                          {balance.currency}
                        </Text>
                    </HStack>
                }
                {
                  balance && balance.amount < 0 &&
                    <HStack>
                        <Text fontSize='xl'
                              fontWeight={'600'}
                              color={'crimson'}
                              isTruncated>
                          {balance.amount.toFixed(2)}
                        </Text>
                        <Text fontSize='md'
                              fontWeight={'600'}
                              isTruncated>
                          {balance.currency}
                        </Text>
                    </HStack>
                }
                {
                  income && income.amount > 0 &&
                    <HStack>
                        <Text fontSize='xl'
                              fontWeight={'600'}
                              color={'green'}
                              isTruncated>
                          {income.amount.toFixed(2)}
                        </Text>
                        <Text fontSize='md'
                              fontWeight={'600'}
                              isTruncated>
                          {income.currency}
                        </Text>
                    </HStack>
                }
                {
                  income && income.amount === 0 &&
                    <HStack>
                        <Text fontSize='xl'
                              fontWeight={'600'}
                              isTruncated>
                            0.00
                        </Text>
                        <Text fontSize={'md'}
                              fontWeight={'600'}
                              isTruncated>
                          {income.currency}
                        </Text>
                    </HStack>
                }
                {
                  expenses && expenses.amount > 0 &&
                    <HStack>
                        <Text fontSize='xl'
                              fontWeight={'600'}
                              color={'crimson'}
                              isTruncated>
                          {expenses.amount.toFixed(2)}
                        </Text>
                        <Text fontSize='md'
                              fontWeight={'600'}
                              isTruncated>
                          {expenses.currency}
                        </Text>
                    </HStack>
                }
                {
                  expenses && expenses.amount === 0 &&
                    <HStack>
                        <Text fontSize='xl'
                              fontWeight={'600'}
                              isTruncated>
                            0.00
                        </Text>
                        <Text fontSize={'md'}
                              fontWeight={'600'}
                              isTruncated>
                          {expenses.currency}
                        </Text>
                    </HStack>
                }
                {
                  transactions !== undefined && (
                    <Text fontSize='md' fontWeight='600' isTruncated>
                      {transactions.toLocaleString()}
                    </Text>
                  )
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
