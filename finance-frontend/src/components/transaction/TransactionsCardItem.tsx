import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Divider,
  Flex,
  Heading, HStack,
  Stack,
  Text
} from "@chakra-ui/react"
import React, {useEffect, useState} from "react"
import {TransactionProductWithProductResponse, TransactionResponse,} from "@/components/api"
import {SearchBar} from "@/components/shared/SearchBar"
import {useApi} from "@/hooks/useApi"
import {useRouter} from "next/router"
import {AddTransactionProductsButton} from "@/components/transaction/product/AddTransactionProductsButton"
import {TransactionProductsCardItem} from "@/components/transaction/product/TransactionProductsCardItem"
import {EditTransactionButton} from "@/components/transaction/EditTransactionButton"
import {DeleteButton} from "@/components/shared/DeleteButton"
import toast from "react-hot-toast"
import {FaCircleCheck} from "react-icons/fa6"
import {FaCaretDown, FaCaretUp} from "react-icons/fa"
import {useDateFormatter} from "@/hooks/useDateFormatter"

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
  const { formatDate } = useDateFormatter()
  const [transactionProducts, setTransactionProducts] = useState<TransactionProductWithProductResponse[]>([])
  const [queriedTransactionProducts, setQueriedTransactionProducts] = useState<TransactionProductWithProductResponse[]>([])

  useEffect(() => {
    api.get(`/transactions/${transaction.id}/products`)
      .then(response => {
        setTransactionProducts(response.data.products)
        setQueriedTransactionProducts(response.data.products)
      })
      .catch(error => console.error(error))
  }, [api, transaction.id]);

  const handleSearchResults = (results: TransactionProductWithProductResponse[]) => {
    setQueriedTransactionProducts(results)
  }

  const handleTransactionDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api.delete(`/transactions/${transaction.id}`)
      .then(() => {
        toast.success('Transaction deleted')
        setTimeout(() => router.reload(), 1000)
      })
      .catch(error => {
        console.error(error)
        toast.error('Failed to delete transaction')
      })
  }

  return (
    <Accordion allowToggle width={'full'}>
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
                        maxWidth={'70%'}>
                    {transaction.description}
                  </Text>
                </HStack>
                <HStack>
                  {
                    transaction.transactionType === 'INCOMING' ?
                      <Text fontSize={'xl'} fontWeight={'600'} color={'green'}>{transaction.total.toFixed(2)}</Text> :
                      <Text fontSize={'xl'} fontWeight={'600'} color={'crimson'}>{transaction.total.toFixed(2)}</Text>
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
            {
              permissions.includes("TRANSACTION_DELETE") && <DeleteButton onClick={handleTransactionDelete} />
            }
          </Flex>
          <Flex justifyContent={'space-between'}
                mt={4}
                gap={4}>
            <SearchBar
              placeholder="Search products"
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
                    <Text size={'sm'}>There are no products added</Text>
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