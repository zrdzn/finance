import {
  Accordion, AccordionButton, AccordionItem,
  AccordionPanel,
  Box, Button,
  Flex,
  Heading,
  Text
} from "@chakra-ui/react"
import React from "react"
import {PaymentProductWithProductResponse} from "@/components/api"
import {useApi} from "@/hooks/apiClient"
import {useRouter} from "next/router"
import {FaTrash} from "react-icons/fa"
import toast from "react-hot-toast"

interface PaymentProductsCardItemProperties {
  paymentProduct: PaymentProductWithProductResponse
}

export const PaymentProductsCardItem = ({
  paymentProduct
}: PaymentProductsCardItemProperties) => {
  const api = useApi()
  const router = useRouter()

  const handlePaymentProductDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api.delete(`/payment/${paymentProduct.paymentId}/products/${paymentProduct.id}`)
      .then(() => {
        toast.success(`Product ${paymentProduct.product.name} has been deleted from the payment`)
        setTimeout(() => router.reload(), 1000)
      })
      .catch(error => {
        console.error(error)
        toast.error(`Failed to delete product ${paymentProduct.product.name} from the payment`)
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
                  {paymentProduct.product.name}
                </Heading>
                <Heading size={'md'}>
                  {(paymentProduct.unitAmount * paymentProduct.quantity).toFixed(2)}
                </Heading>
              </Flex>
              <Flex justifyContent={'space-between'}>
                <Text color={'dimgray'}
                      fontSize={'sm'}
                      letterSpacing={0.5}>
                  {paymentProduct.quantity}x
                </Text>
                <Text color={'dimgray'}
                      fontSize={'sm'}
                      letterSpacing={0.5}>
                  {paymentProduct.unitAmount.toFixed(2)}/unit
                </Text>
              </Flex>
            </Box>
          </AccordionButton>
      </AccordionItem>
    </Accordion>
  )
}