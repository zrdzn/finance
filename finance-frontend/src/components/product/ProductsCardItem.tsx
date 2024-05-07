import {
  Accordion, AccordionButton, AccordionIcon, AccordionItem,
  AccordionPanel,
  Box, Button,
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
import {PaymentResponse, ProductPriceResponse, ProductResponse} from "@/components/api"
import {useApi} from "@/hooks/apiClient"
import {ProductPricesCardItem} from "@/components/product/ProductPricesCardItem"
import {SearchBar} from "@/components/shared/SearchBar"
import {AddProductButton} from "@/components/product/AddProductButton"
import {AddProductPriceButton} from "@/components/product/AddProductPriceButton"

interface ProductsCardItemProperties {
  product: ProductResponse
}

export const ProductsCardItem = ({
  product
}: ProductsCardItemProperties) => {
  const api = useApi()
  const [productPrices, setProductPrices] = useState<ProductPriceResponse[]>([])
  const [queriedProductPrices, setQueriedProductPrices] = useState<ProductPriceResponse[]>([])

  useEffect(() => {
    api.get(`/products/${product.id}/prices`)
      .then(response => {
        setProductPrices(response.data.productPrices)
        setQueriedProductPrices(response.data.productPrices)
      })
      .catch(error => console.error(error))
  }, [api, product.id]);

  const handleProductDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api.delete(`/products/${product.id}`)
      .catch(error => console.error(error))
  }

  const handleSearchResults = (results: ProductPriceResponse[]) => {
    setQueriedProductPrices(results)
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
                  {product.name}
                </Heading>
                <Button colorScheme={'red'}
                        size={'md'}
                        onClick={handleProductDelete}>
                  Delete
                </Button>
              </Flex>
              <Flex justifyContent={'space-between'}>
                <Text color={'dimgray'}
                      fontSize={'sm'}
                      letterSpacing={0.2}>
                  {productPrices.length} prices
                </Text>
              </Flex>
            </Box>
          </AccordionButton>
        <AccordionPanel pb={4}>
          <Flex justifyContent={'space-between'}
                gap={4}>
            <SearchBar
              placeholder="Search prices"
              content={productPrices}
              onSearch={handleSearchResults}
              filter={(product, query) => product.price.currency.toLowerCase().includes(query.toLowerCase())}
            />
            <AddProductPriceButton productId={product.id} />
          </Flex>
          <Divider mt={4} />
          <Stack gap={0}>
            {
              queriedProductPrices.length === 0 &&
                <Flex justifyContent={'center'}
                      mt={4}>
                    <Text size={'sm'}>There are no product prices</Text>
                </Flex>
            }
            {
              queriedProductPrices &&
              queriedProductPrices.map(productPrice => <ProductPricesCardItem key={product.id} productPrice={productPrice} />)
            }
          </Stack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}