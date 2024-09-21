import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Divider,
  Flex,
  Heading,
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
                <Heading size='sm'
                         isTruncated
                         maxWidth={'70%'}>
                  {transaction.description}
                </Heading>
                <Heading size={'md'}>
                  {transaction.total.toFixed(2)} {transaction.currency}
                </Heading>
              </Flex>
              <Flex justifyContent={'space-between'}>
                <Text color={'dimgray'}
                      fontSize={'sm'}
                      letterSpacing={0.2}>
                  {new Date(transaction.createdAt * 1000).toLocaleDateString()}
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