import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Divider,
  Flex,
  Heading, HStack, Link,
  Stack,
  Text
} from "@chakra-ui/react"
import React, {useEffect, useState} from "react"
import {SearchBar} from "@/components/shared/SearchBar"
import {useApi} from "@/hooks/useApi"
import {useRouter} from "next/router"
import {AddTransactionProductsButton} from "@/components/transaction/product/AddTransactionProductsButton"
import {TransactionProductsCardItem} from "@/components/transaction/product/TransactionProductsCardItem"
import {EditTransactionButton} from "@/components/transaction/EditTransactionButton"
import {DeleteButton} from "@/components/shared/DeleteButton"
import toast from "react-hot-toast"
import {FaCaretDown, FaCaretUp} from "react-icons/fa"
import {useDateFormatter} from "@/hooks/useDateFormatter"
import {useTranslations} from "next-intl";
import {Components} from "@/api/api";
import {AddScheduleButton} from "@/components/transaction/schedule/AddScheduleButton";
import {useNumberFormatter} from "@/hooks/useNumberFormatter";

type TransactionResponse = Components.Schemas.TransactionResponse;
type TransactionProductWithProductResponse = Components.Schemas.TransactionProductResponse;

interface TransactionsCardItemProperties {
  vaultId: number
  transaction: TransactionResponse
  permissions: string[]
}

export const TransactionsCardItem = ({
  vaultId,
  transaction,
  permissions
}: TransactionsCardItemProperties) => {
  const api = useApi()
  const router = useRouter()
  const { formatNumber } = useNumberFormatter()
  const { formatDate } = useDateFormatter()
  const t = useTranslations("Transactions")
  const [transactionProducts, setTransactionProducts] = useState<TransactionProductWithProductResponse[]>([])
  const [queriedTransactionProducts, setQueriedTransactionProducts] = useState<TransactionProductWithProductResponse[]>([])

  useEffect(() => {
    api
        .then(client => client.getTransactionProducts({ transactionId: transaction.id })
            .then(response => {
                setTransactionProducts(response.data.products)
                setQueriedTransactionProducts(response.data.products)
            }))
        .catch(error => console.error(error))
  }, [api, transaction.id]);

  const handleSearchResults = (results: TransactionProductWithProductResponse[]) => {
    setQueriedTransactionProducts(results)
  }

  const handleTransactionDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api
        .then(client => client.deleteTransaction({ transactionId: transaction.id }))
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
    <Accordion allowToggle width={'full'} allowMultiple={false}>
      <AccordionItem width={'full'}
                     paddingY={4}
                     borderTop={'none'}>
          <AccordionButton width={'full'}>
            <Box width={'full'}>
              <Flex justifyContent={'space-between'}>
                <HStack width="70%">
                  <Text fontSize={{ base: 'lg', md: 'xl' }}>
                    {
                      transaction.transactionType === 'INCOMING' ? <FaCaretUp color="green" /> : <FaCaretDown color="crimson" />
                    }
                  </Text>
                  <Text fontSize='md'
                        isTruncated
                        fontWeight={'600'}
                        title={transaction.description}
                        maxWidth={'70%'}>
                    {transaction.description}
                  </Text>
                </HStack>
                <HStack>
                  {
                    transaction.transactionType === 'INCOMING' ?
                      <Text fontSize={'xl'} fontWeight={'600'} color={'green'}>{formatNumber(transaction.total)}</Text> :
                      <Text fontSize={'xl'} fontWeight={'600'} color={'crimson'}>{formatNumber(transaction.total)}</Text>
                  }
                  <Text fontSize={'xl'} fontWeight={'600'}>
                    {transaction.currency}
                  </Text>
                </HStack>
              </Flex>
              <Flex justifyContent={'space-between'}>
                <Text color={'dimgray'}
                      fontSize={'sm'}
                      letterSpacing={0.2}>
                  {formatDate(transaction.createdAt, true)}
                </Text>
                <Text color={'dimgray'}
                      fontSize={'sm'}
                      letterSpacing={0.5}>
                  {transaction.transactionMethod}
                </Text>
              </Flex>
            </Box>
          </AccordionButton>
        <AccordionPanel pb={4}>
          <Flex justifyContent={'end'} gap={2}>
            {
              permissions.includes("TRANSACTION_UPDATE") && <EditTransactionButton transaction={transaction} />
            }
            <AddScheduleButton transactionId={transaction.id} />
            {
              permissions.includes("TRANSACTION_DELETE") && <DeleteButton onClick={handleTransactionDelete} />
            }
          </Flex>
          <Flex justifyContent={'space-between'}
                mt={4}
                gap={4}>
            <SearchBar
              placeholder={t('product.search-placeholder')}
              content={transactionProducts}
              onSearch={handleSearchResults}
              filter={(transactionProduct, query) => transactionProduct.product.name.toLowerCase().includes(query.toLowerCase())}
            />
            <AddTransactionProductsButton vaultId={vaultId} transactionId={transaction.id} />
          </Flex>
          <Divider mt={4} />
          <Stack gap={0}>
            {
              queriedTransactionProducts.length === 0 &&
                <Flex justifyContent={'center'}
                      mt={4}>
                    <Text size={'sm'}>{t('product.no-products')}</Text>
                </Flex>
            }
            {
              queriedTransactionProducts &&
              queriedTransactionProducts.map(transactionProduct => <TransactionProductsCardItem key={transactionProduct.id} transactionProduct={transactionProduct} />)
            }
          </Stack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}