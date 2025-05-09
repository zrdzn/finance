import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  HStack,
  Link,
  Stack,
  Table, Tag, TagLabel,
  Tbody, Td,
  Text,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react"
import React, {useEffect, useState} from "react"
import {useTheme} from "@/hooks/useTheme"
import {useApi} from "@/hooks/useApi"
import {useTranslations} from "next-intl";
import {Components} from "@/api/api";
import {DeleteButton} from "@/components/shared/DeleteButton";
import {AccountAvatar} from "@/components/account/AccountAvatar";
import {useNumberFormatter} from "@/hooks/useNumberFormatter";
import {useDateFormatter} from "@/hooks/useDateFormatter";
import {FaCaretDown, FaCaretUp, FaClock} from "react-icons/fa";
import {EditTransactionButton} from "@/components/transaction/EditTransactionButton";
import {AddScheduleButton} from "@/components/transaction/schedule/AddScheduleButton";
import toast from "react-hot-toast";
import {useRouter} from "next/router";
import {TransactionProductsPopover} from "@/components/transaction/TransactionProductsPopover";

type VaultResponse = Components.Schemas.VaultResponse;
type TransactionResponse = Components.Schemas.TransactionResponse;

interface LastTransactionsCardProperties {
  vault: VaultResponse
  permissions: string[]
}

export const LastTransactionsCard = ({ vault, permissions }: LastTransactionsCardProperties) => {
  const theme = useTheme()
  const { api } = useApi()
  const t = useTranslations("Transactions")
  const [transactions, setTransactions] = useState<TransactionResponse[]>([])
  const { formatNumber } = useNumberFormatter()
  const { formatDate } = useDateFormatter()
  const router = useRouter()

  useEffect(() => {
    api
        .then(client => client.getTransactionsByVaultId({ vaultId: vault.id })
            .then(response => setTransactions(response.data.transactions)))
        .catch(error => console.error(error))
  }, [api, vault.id]);

  return (
      <Card
          margin={4}
          boxShadow="base"
          borderRadius="lg"
          overflow="hidden"
          backgroundColor={theme.background.secondary}
          color={theme.text.primary}
      >
        <CardHeader>
          <Text fontSize="sm" fontWeight={"600"}>
            {t("recent.card.title")}
          </Text>
        </CardHeader>
      <CardBody>
        <Stack gap={4}>
          <Box overflowX="auto">
            <Table variant={"simple"}>
              <Thead>
                <Tr>
                  <Th>{t("recent.table.user")}</Th>
                  <Th>{t("recent.table.created")}</Th>
                  <Th>{t("recent.table.method")}</Th>
                  <Th>{t("recent.table.description")}</Th>
                  <Th>{t("recent.table.total")}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {transactions.length === 0 ? (
                    <Tr>
                      <Td colSpan={6}>
                        <Text textAlign="center" size="sm">
                          {t("recent.card.no-transactions")}
                        </Text>
                      </Td>
                    </Tr>
                ) : (
                    transactions
                        .sort((transactions, nextTransaction) => new Date(nextTransaction.createdAt).getTime() - new Date(transactions.createdAt).getTime())
                        .slice(0, 5)
                        .map((transaction) => (
                        <Tr key={transaction.id}>
                          <Td>
                            <HStack>
                              <AccountAvatar size={'sm'} userId={transaction.user.id} />
                              <Text>
                                {transaction.user.username}
                              </Text>
                            </HStack>
                          </Td>
                          <Td>{formatDate(transaction.createdAt, true)}</Td>
                          <Td>{transaction.transactionMethod}</Td>
                          <Td>{transaction.description}</Td>
                          <Td>
                            <HStack>
                              {
                                transaction.transactionType === 'INCOMING' ?
                                  <Text fontSize={{ base: 'lg', md: 'xl' }} color={theme.text.green}><FaCaretUp /></Text> :
                                  <Text fontSize={{ base: 'lg', md: 'xl' }} color={theme.text.red}><FaCaretDown /></Text>
                              }
                              {
                                transaction.transactionType === 'INCOMING' ?
                                    <Text fontSize={'lg'} fontWeight={'600'} color={theme.text.green}>{formatNumber(transaction.total)}</Text> :
                                    <Text fontSize={'lg'} fontWeight={'600'} color={theme.text.red}>{formatNumber(transaction.total)}</Text>
                              }
                              <Text fontSize={'lg'} fontWeight={'600'}>
                                {transaction.currency}
                              </Text>
                            </HStack>
                          </Td>
                        </Tr>
                    ))
                )}
              </Tbody>
            </Table>
          </Box>
          <Box paddingTop={4}>
            <Flex justifyContent={'space-between'}>
              <Box />
              <Link color={theme.text.secondary}
                    fontSize={'sm'}
                    href={`/vault/${vault.publicId}/transactions`}
                    letterSpacing={0.5}>
                {t('recent.card.view-all')}
              </Link>
            </Flex>
          </Box>
        </Stack>
      </CardBody>
    </Card>
  )
}