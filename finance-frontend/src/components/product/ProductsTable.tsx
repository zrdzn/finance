import React, { useEffect, useState } from "react"
import { useApi } from "@/hooks/useApi"
import { useTranslations } from "next-intl"
import { useRouter } from "next/router"
import { Components } from "@/api/api"
import {
    CardBody,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Flex,
    HStack,
    Button,
    Tag,
    TagLabel,
    Text,
    Box,
    Card, CardHeader,
} from "@chakra-ui/react"
import { EditProductButton } from "@/components/product/EditProductButton"
import { DeleteButton } from "@/components/shared/DeleteButton"
import toast from "react-hot-toast"
import { AddProductButton } from "@/components/product/AddProductButton"
import { SearchBar } from "@/components/shared/SearchBar"
import {useNumberFormatter} from "@/hooks/useNumberFormatter";
import {useTheme} from "@/hooks/useTheme";

type ProductResponse = Components.Schemas.ProductResponse
type VaultResponse = Components.Schemas.VaultResponse

interface ProductsTableProperties {
  vault: VaultResponse
  permissions: string[]
}

export const ProductsTable = ({ vault, permissions }: ProductsTableProperties) => {
  const { api } = useApi()
  const router = useRouter()
  const theme = useTheme()
  const t = useTranslations("Products")
  const [products, setProducts] = useState<ProductResponse[]>([])
  const [queriedProducts, setQueriedProducts] = useState<ProductResponse[]>([])
  const { formatNumber } = useNumberFormatter()

  useEffect(() => {
    api
        .then(client => client.getProductsByVaultId({ vaultId: vault.id })
            .then(response => {
              setProducts(response.data.products)
              setQueriedProducts(response.data.products)
            }))
        .catch(error => console.error(error))
  }, [api, vault.id])

  const handleSearchResults = (results: ProductResponse[]) => {
    setQueriedProducts(results)
  }

  const handleProductCreate = () => {
    router.reload()
  }

    return (
        <Card
            margin={4}
            boxShadow="base"
            borderRadius="lg"
            overflow="hidden"
            backgroundColor={theme.background.secondary}
            color={theme.text.primary}
        >
            <CardHeader>
                <Text fontSize="sm" fontWeight={"600"}>
                    {t("card.title")}
                </Text>
            </CardHeader>
            <CardBody>
                <Flex justifyContent={"space-between"} gap={4} mb={4}>
                    <SearchBar
                        placeholder={t("card.search-placeholder")}
                        content={products}
                        onSearch={handleSearchResults}
                        filter={(product, query) => product.name.toLowerCase().includes(query.toLowerCase())}
                    />
                    {permissions.includes("PRODUCT_CREATE") && (
                        <AddProductButton vaultId={vault.id} onCreate={handleProductCreate} />
                    )}
                </Flex>
                <Box overflowX="auto">
                    <Table variant={'simple'}>
                        <Thead>
                            <Tr>
                              <Th>{t("table.name")}</Th>
                              <Th>{t("table.category")}</Th>
                              <Th>{t("table.price")}</Th>
                              <Th>{t("table.actions")}</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {queriedProducts.length === 0 ? (
                                <Tr>
                                    <Td colSpan={4}>
                                        <Text textAlign="center" size="sm">
                                            {t("card.no-products")}
                                        </Text>
                                    </Td>
                                </Tr>
                            ) : (
                                queriedProducts.map((product) => (
                                    <Tr key={product.id}>
                                      <Td>{product.name}</Td>
                                      <Td>{product.category?.name}</Td>
                                      <Td>{formatNumber(product.unitAmount)}</Td>
                                      <Td>
                                        <HStack spacing={2}>
                                          {permissions.includes("PRODUCT_UPDATE") && (
                                            <EditProductButton product={product} />
                                          )}
                                          {permissions.includes("PRODUCT_DELETE") && (
                                            <DeleteButton
                                              onClick={() => {
                                                api
                                                  .then((client) => client.deleteProduct({ productId: product.id }))
                                                  .then(() => {
                                                    toast.success(t("product-deleted-success"))
                                                    setTimeout(() => router.reload(), 1000)
                                                  })
                                                  .catch((error) => console.error(error))
                                              }}
                                            />
                                          )}
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