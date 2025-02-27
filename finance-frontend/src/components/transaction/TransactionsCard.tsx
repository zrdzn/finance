import {
    Accordion,
    Box,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Flex,
    Heading, HStack,
    Stack,
    Table, Tag, TagLabel, Tbody, Td,
    Text, Th,
    Thead, Tr, useDisclosure
} from "@chakra-ui/react"
import {AddTransactionButton} from "@/components/transaction/AddTransactionButton"
import React, {useEffect, useState} from "react"
import {useTheme} from "@/hooks/useTheme"
import {useApi} from "@/hooks/useApi"
import {SearchBar} from "@/components/shared/SearchBar"
import {useTranslations} from "next-intl";
import {Components} from "@/api/api";
import {AccountAvatar} from "@/components/account/AccountAvatar";
import {FaCaretDown, FaCaretUp, FaClock} from "react-icons/fa";
import {EditTransactionButton} from "@/components/transaction/EditTransactionButton";
import {AddScheduleButton} from "@/components/transaction/schedule/AddScheduleButton";
import {DeleteButton} from "@/components/shared/DeleteButton";
import {useNumberFormatter} from "@/hooks/useNumberFormatter";
import {useDateFormatter} from "@/hooks/useDateFormatter";
import toast from "react-hot-toast";
import {router} from "next/client";
import {useRouter} from "next/router";
import {TransactionProductsPopover} from "@/components/transaction/TransactionProductsPopover";
import {ImportButton} from "@/components/transaction/import/ImportButton";
import {CsvImport} from "@/components/transaction/import/CsvImport";
import {ImageImport} from "@/components/transaction/import/ImageImport";

type VaultResponse = Components.Schemas.VaultResponse;
type TransactionResponse = Components.Schemas.TransactionResponse;

interface TransactionsCardProperties {
  vault: VaultResponse
  permissions: string[]
}

export const TransactionsCard = ({ vault, permissions }: TransactionsCardProperties) => {
  const theme = useTheme()
  const api = useApi()
  const t = useTranslations("Transactions")
  const [transactions, setTransactions] = useState<TransactionResponse[]>([])
  const [queriedTransactions, setQueriedTransactions] = useState<TransactionResponse[]>([])
  const { formatNumber } = useNumberFormatter()
  const { formatDate } = useDateFormatter()
  const router = useRouter()
  const { isOpen: isCsvOpen, onOpen: onCsvOpen, onClose: onCsvClose } = useDisclosure()
  const { isOpen: isImageOpen, onOpen: onImageOpen, onClose: onImageClose } = useDisclosure()

  useEffect(() => {
      api
          .then(client => client.getTransactionsByVaultId({ vaultId: vault.id })
            .then(response => {
                setTransactions(response.data.transactions)
                setQueriedTransactions(response.data.transactions)
            }))
          .catch(error => console.error(error))
  }, [api, vault.id]);

  const handleSearchResults = (results: TransactionResponse[]) => {
    setQueriedTransactions(results)
  }

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
          width={'full'}
          boxShadow="base"
          borderRadius="lg"
          backgroundColor="whiteAlpha.900"
          border="1px solid"
          borderColor="gray.200"
      >
          <CardHeader>
              <Text fontSize="sm" fontWeight={"600"}>
                  {t("card.title")}
              </Text>
          </CardHeader>
      <CardBody>
        <Flex justifyContent={'space-between'} gap={4} mb={4}>
          <SearchBar
            placeholder={t('card.search-placeholder')}
            content={transactions}
            onSearch={handleSearchResults}
            filter={(transaction, query) => {
              if (transaction.description === undefined) {
                return false
              }

              return transaction.description.toLowerCase().includes(query.toLowerCase())}
            }
          />
          {
            permissions.includes("TRANSACTION_CREATE") && <AddTransactionButton vault={vault} />
          }
          {
            permissions.includes("TRANSACTION_CREATE") &&
              <ImportButton openCsv={onCsvOpen} openImage={onImageOpen} />
          }
          <CsvImport vault={vault} isOpen={isCsvOpen} onClose={onCsvClose} permissions={permissions} />
          <ImageImport vault={vault} isOpen={isImageOpen} onClose={onImageClose} permissions={permissions} />
        </Flex>
          <Box overflowX="auto">
              <Table variant={"simple"}>
                  <Thead>
                      <Tr>
                          <Th>{t("table.user")}</Th>
                          <Th>{t("table.created")}</Th>
                          <Th>{t("table.method")}</Th>
                          <Th>{t("table.description")}</Th>
                          <Th>{t("table.total")}</Th>
                          <Th>{t("table.actions")}</Th>
                      </Tr>
                  </Thead>
                  <Tbody>
                      {queriedTransactions.length === 0 ? (
                          <Tr>
                              <Td colSpan={6}>
                                  <Text textAlign="center" size="sm">
                                      {t("card.no-transactions")}
                                  </Text>
                              </Td>
                          </Tr>
                      ) : (
                          queriedTransactions
                              .sort((transactions, nextTransaction) => new Date(nextTransaction.createdAt).getTime() - new Date(transactions.createdAt).getTime())
                              .slice(0, 3)
                              .map((transaction) => (
                                  <Tr key={transaction.id}>
                                      <Td>
                                          <HStack>
                                              <AccountAvatar size={'sm'} username={transaction.user.username} />
                                              <Text>
                                                  {transaction.user.username}
                                              </Text>
                                          </HStack>
                                      </Td>
                                      <Td>
                                          <Tag size="sm" colorScheme="gray">
                                              <TagLabel>
                                                  <HStack>
                                                      <FaClock />
                                                      <Text fontSize={{ base: 'xs', md: 'sm' }}>{formatDate(transaction.createdAt, true)}</Text>
                                                  </HStack>
                                              </TagLabel>
                                          </Tag>
                                      </Td>
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
                                              <TransactionProductsPopover transaction={transaction} permissions={permissions} />
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
      </CardBody>
    </Card>
  )
}