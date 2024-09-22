import {Accordion, AccordionButton, AccordionItem, Box, Flex, Heading, Text} from "@chakra-ui/react"
import React from "react"
import {TransactionProductWithProductResponse} from "@/components/api"
import {useApi} from "@/hooks/useApi"
import {useRouter} from "next/router"
import toast from "react-hot-toast"

interface TransactionProductsCardItemProperties {
  transactionProduct: TransactionProductWithProductResponse
}

export const TransactionProductsCardItem = ({
  transactionProduct
}: TransactionProductsCardItemProperties) => {
  const api = useApi()
  const router = useRouter()

  const handleTransactionProductDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api.delete(`/transactions/${transactionProduct.transactionId}/products/${transactionProduct.id}`)
      .then(() => {
        toast.success(`Product ${transactionProduct.product.name} has been deleted from the transaction`)
        setTimeout(() => router.reload(), 1000)
      })
      .catch(error => {
        console.error(error)
        toast.error(`Failed to delete product ${transactionProduct.product.name} from the transaction`)
      })
  }

  return (
    <Accordion allowToggle width={'full'}>
      <AccordionItem width={'full'}
                     paddingY={4}
                     borderTop={'none'}>
          <AccordionButton width={'full'}>
            <Box width={'full'}>
              <Flex justifyContent={'space-between'}
                    alignItems={'center'}>
                <Heading size='sm'
                         textTransform='uppercase'
                         isTruncated
                         maxWidth={'70%'}>
                  {transactionProduct.product.name}
                </Heading>
                <Heading size={'md'}>
                  {(transactionProduct.unitAmount * transactionProduct.quantity).toFixed(2)}
                </Heading>
              </Flex>
              <Flex justifyContent={'space-between'}>
                <Text color={'dimgray'}
                      fontSize={'sm'}
                      letterSpacing={0.5}>
                  {transactionProduct.quantity}x
                </Text>
                <Text color={'dimgray'}
                      fontSize={'sm'}
                      letterSpacing={0.5}>
                  {transactionProduct.unitAmount.toFixed(2)}/unit
                </Text>
              </Flex>
            </Box>
          </AccordionButton>
      </AccordionItem>
    </Accordion>
  )
}