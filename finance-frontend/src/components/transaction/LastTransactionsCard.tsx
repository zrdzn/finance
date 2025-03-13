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
  const api = useApi()
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

  const handleTransactionDelete = (event: React.MouseEvent<HTMLButtonElement>, transactionId: number) => {
    event.preventDefault()

    api
        .then(client => client.deleteTransaction({ transactionId: transactionId }))
        .then(() => {
          toast.success(t('transaction-deleted-success'))
          setTimeout(() => router.reload(), 1000)
        })
        .catch(error => {
          console.error(error)
          toast.error(t('transaction-deleted-error'))
        })
  }

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
                  <Th>{t("recent.table.actions")}</Th>
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
                        .slice(0, 3)
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
                              <Text fontSize={{ base: 'lg', md: 'xl' }}>
                                {
                                  transaction.transactionType === 'INCOMING' ? <FaCaretUp color="green" /> : <FaCaretDown color="crimson" />
                                }
                              </Text>
                              {
                                transaction.transactionType === 'INCOMING' ?
                                    <Text fontSize={'lg'} fontWeight={'600'} color={'green'}>{formatNumber(transaction.total)}</Text> :
                                    <Text fontSize={'lg'} fontWeight={'600'} color={'crimson'}>{formatNumber(transaction.total)}</Text>
                              }
                              <Text fontSize={'lg'} fontWeight={'600'}>
                                {transaction.currency}
                              </Text>
                            </HStack>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              {
                                  permissions.includes("TRANSACTION_UPDATE") && <EditTransactionButton transaction={transaction} />
                              }
                              <TransactionProductsPopover vault={vault} transaction={transaction} permissions={permissions} />
                              <AddScheduleButton transactionId={transaction.id} />
                              {
                                  permissions.includes("TRANSACTION_DELETE") && <DeleteButton onClick={(event) => handleTransactionDelete(event, transaction.id)} />
                              }
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
              <Link color={'dimgray'}
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