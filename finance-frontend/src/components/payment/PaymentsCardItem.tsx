import {
  Accordion, AccordionButton, AccordionIcon, AccordionItem,
  AccordionPanel,
  Box,
  Card,
  CardBody,
  CardHeader, Divider,
  Flex,
  Heading,
  Link,
  Stack,
  StackDivider,
  Text
} from "@chakra-ui/react"
import {AddPaymentButton} from "@/components/payment/AddPaymentButton"
import React, {useEffect, useState} from "react"
import {useTheme} from "@/hooks/theme"
import {
  ProductResponse,
  PaymentResponse, PaymentProductWithProductResponse,
} from "@/components/api"
import {SearchBar} from "@/components/shared/SearchBar"
import {useApi} from "@/hooks/apiClient"
import {useRouter} from "next/router"
import {AddPaymentProductsButton} from "@/components/payment/product/AddPaymentProductsButton"
import {PaymentProductsCardItem} from "@/components/payment/product/PaymentProductsCardItem"
import {EditPaymentButton} from "@/components/payment/EditPaymentButton"
import {DeleteButton} from "@/components/shared/DeleteButton"

interface PaymentsCardItemProperties {
  vaultId: number
  payment: PaymentResponse
}

export const PaymentsCardItem = ({
  vaultId,
  payment
}: PaymentsCardItemProperties) => {
  const api = useApi()
  const router = useRouter()
  const [paymentProducts, setPaymentProducts] = useState<PaymentProductWithProductResponse[]>([])
  const [queriedPaymentProducts, setQueriedPaymentProducts] = useState<PaymentProductWithProductResponse[]>([])

  useEffect(() => {
    api.get(`/payment/${payment.id}/products`)
      .then(response => {
        setPaymentProducts(response.data.products)
        setQueriedPaymentProducts(response.data.products)
      })
      .catch(error => console.error(error))
  }, [api, payment.id]);

  const handleSearchResults = (results: PaymentProductWithProductResponse[]) => {
    setQueriedPaymentProducts(results)
  }

  const handlePaymentDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api.delete(`/payment/${payment.id}`)
      .then(() => router.reload())
      .catch(error => console.error(error))
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
                  {payment.description}
                </Heading>
                <Heading size={'md'}>
                  {payment.total.toFixed(2)} {payment.currency}
                </Heading>
              </Flex>
              <Flex justifyContent={'space-between'}>
                <Text color={'dimgray'}
                      fontSize={'sm'}
                      letterSpacing={0.2}>
                  {new Date(payment.payedAt).toLocaleDateString()}
                </Text>
                <Text color={'dimgray'}
                      fontSize={'sm'}
                      letterSpacing={0.5}>
                  {payment.paymentMethod}
                </Text>
              </Flex>
            </Box>
          </AccordionButton>
        <AccordionPanel pb={4}>
          <Flex justifyContent={'end'} gap={2}>
            <EditPaymentButton payment={payment} />
            <DeleteButton onClick={handlePaymentDelete} />
          </Flex>
          <Flex justifyContent={'space-between'}
                mt={4}
                gap={4}>
            <SearchBar
              placeholder="Search products"
              content={paymentProducts}
              onSearch={handleSearchResults}
              filter={(paymentProduct, query) => paymentProduct.product.name.toLowerCase().includes(query.toLowerCase())}
            />
            <AddPaymentProductsButton vaultId={vaultId} paymentId={payment.id} />
          </Flex>
          <Divider mt={4} />
          <Stack gap={0}>
            {
              queriedPaymentProducts.length === 0 &&
                <Flex justifyContent={'center'}
                      mt={4}>
                    <Text size={'sm'}>There are no products added</Text>
                </Flex>
            }
            {
              queriedPaymentProducts &&
              queriedPaymentProducts.map(paymentProduct => <PaymentProductsCardItem key={paymentProduct.id} paymentProduct={paymentProduct} />)
            }
          </Stack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}