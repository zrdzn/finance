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
import {useRouter} from "next/router";
import {TransactionProductsPopover} from "@/components/transaction/TransactionProductsPopover";
import {ImportButton} from "@/components/transaction/import/ImportButton";
import {CsvImport} from "@/components/transaction/import/CsvImport";
import {ImageImport} from "@/components/transaction/import/ImageImport";
import {ExportButton} from "@/components/transaction/export/ExportButton";
import {CsvExport} from "@/components/transaction/export/CsvExport";

type VaultResponse = Components.Schemas.VaultResponse;
type TransactionResponse = Components.Schemas.TransactionResponse;

interface TransactionsCardProperties {
  vault: VaultResponse
  permissions: string[]
}

export const TransactionsCard = ({ vault, permissions }: TransactionsCardProperties) => {
  const theme = useTheme()
  const { api } = useApi()
  const t = useTranslations("Transactions")
  const [transactions, setTransactions] = useState<TransactionResponse[]>([])
  const [queriedTransactions, setQueriedTransactions] = useState<TransactionResponse[]>([])
  const { formatNumber } = useNumberFormatter()
  const { formatDate } = useDateFormatter()
  const router = useRouter()
  const { isOpen: isCsvImportOpen, onOpen: onCsvImportOpen, onClose: onCsvImportClose } = useDisclosure()
  const { isOpen: isCsvExportOpen, onOpen: onCsvExportOpen, onClose: onCsvExportClose } = useDisclosure()
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
          backgroundColor={theme.background.secondary}
          color={theme.text.primary}
      >
          <CardHeader>
              <Text fontSize="sm" fontWeight={"600"}>
                  {t("card.title")}
              </Text>
          </CardHeader>
      <CardBody>
        <Flex
          direction={{ base: "column", md: "row" }}
          justifyContent={'space-between'}
          gap={4}
          mb={4}>
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
          <Flex wrap="wrap" gap={2} justifyContent={{ base: "flex-start", md: "flex-end" }}>
            {
              permissions.includes("TRANSACTION_CREATE") && <AddTransactionButton vault={vault} />
            }
            {
              permissions.includes("TRANSACTION_CREATE") &&
                <ImportButton openCsv={onCsvImportOpen} openImage={onImageOpen} />
            }
            {
              permissions.includes("TRANSACTION_READ") &&
                <ExportButton openCsv={onCsvExportOpen} />
            }
          </Flex>
          <CsvImport vault={vault} isOpen={isCsvImportOpen} onClose={onCsvImportClose} permissions={permissions} />
          <CsvExport vault={vault} isOpen={isCsvExportOpen} onClose={onCsvExportClose} permissions={permissions} />
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
                            // todo add pagination
                              .slice(0, 50)
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
                                      <Td>
                                        <Flex wrap="wrap" gap={2} justifyContent="flex-start">
                                          {
                                            permissions.includes("TRANSACTION_UPDATE") && <EditTransactionButton transaction={transaction} />
                                          }
                                          <TransactionProductsPopover vault={vault} transaction={transaction} permissions={permissions} />
                                          <AddScheduleButton transactionId={transaction.id} />
                                          {
                                            permissions.includes("TRANSACTION_DELETE") && <DeleteButton onClick={(event) => handleTransactionDelete(event, transaction.id)} />
                                          }
                                        </Flex>
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