import {
  Box,
  Card,
  CardBody,
  CardHeader, Divider,
  Flex,
  FormControl, FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  StackDivider,
  Text
} from "@chakra-ui/react"
import {AddPaymentButton} from "@/components/payment/AddPaymentButton"
import React, {useEffect, useState} from "react"
import {useTheme} from "@/hooks/theme"
import {PaymentResponse, ProductResponse, VaultResponse} from "@/components/api"
import {useApi} from "@/hooks/apiClient"
import {PaymentsCardItem} from "@/components/payment/PaymentsCardItem"
import {AddProductButton} from "@/components/product/AddProductButton"
import {ProductsCardItem} from "@/components/product/ProductsCardItem"
import {SearchBar} from "@/components/shared/SearchBar"
import {useRouter} from "next/router"

interface ProductsCardProperties {
  vault: VaultResponse
}

export const ProductsCard = ({ vault }: ProductsCardProperties) => {
  const theme = useTheme()
  const api = useApi()
  const router = useRouter()
  const [products, setProducts] = useState<ProductResponse[]>([])
  const [queriedProducts, setQueriedProducts] = useState<ProductResponse[]>([])

  useEffect(() => {
    api.get(`/products/${vault.id}`)
      .then(response => {
        setProducts(response.data.products)
        setQueriedProducts(response.data.products)
      })
      .catch(error => console.error(error))
  }, [api, vault.id]);

  const handleSearchResults = (results: ProductResponse[]) => {
    setQueriedProducts(results)
  }

  const handleProductCreate = () => {
    router.reload()
  }

  return (
    <Card margin={2}>
      <CardHeader backgroundColor={theme.secondaryColor}
                  color={theme.textColor}>
        <Flex alignItems={'center'}
              justifyContent={'space-between'}>
          <Heading size='sm' textTransform={'uppercase'}>Products</Heading>
        </Flex>
      </CardHeader>
      <CardBody>
        <Flex justifyContent={'space-between'}
              gap={4}>
          <SearchBar
            placeholder="Search products"
            content={products}
            onSearch={handleSearchResults}
            filter={(product, query) => product.name.toLowerCase().includes(query.toLowerCase())}
          />
          <AddProductButton vaultId={vault.id} onCreate={handleProductCreate} />
        </Flex>
        <Divider mt={4} />
        <Stack gap={0}>
          {
            queriedProducts.length === 0 &&
              <Flex justifyContent={'center'}
                    mt={4}>
                  <Text size={'sm'}>There are no products</Text>
              </Flex>
          }
          {
            queriedProducts &&
            queriedProducts.map(product => <ProductsCardItem key={product.id} product={product} />)
          }
        </Stack>
      </CardBody>
    </Card>
  )
}