import {Card, CardBody, CardHeader, Divider, Flex, Heading, Stack, Text} from "@chakra-ui/react"
import React, {useEffect, useState} from "react"
import {useTheme} from "@/hooks/useTheme"
import {ProductResponse, VaultResponse} from "@/components/api"
import {useApi} from "@/hooks/useApi"
import {CategoriesCardItem} from "@/components/product/category/CategoriesCardItem"
import {AddCategoryButton} from "@/components/product/category/AddCategoryButton"
import {SearchBar} from "@/components/shared/SearchBar"

interface CategoriesCardProperties {
  vault: VaultResponse
  permissions: string[]
}

export const CategoriesCard = ({ vault, permissions }: CategoriesCardProperties) => {
  const theme = useTheme()
  const api = useApi()
  const [categories, setCategories] = useState<ProductResponse[]>([])
  const [queriedCategories, setQueriedCategories] = useState<ProductResponse[]>([])

  useEffect(() => {
    api.get(`/categories/vault/${vault.id}`)
      .then(response => {
        setCategories(response.data.categories)
        setQueriedCategories(response.data.categories)
      })
      .catch(error => console.error(error))
  }, [api, vault.id]);

  const handleSearchResults = (results: ProductResponse[]) => {
    setQueriedCategories(results)
  }

  return (
    <Card margin={2}>
      <CardHeader backgroundColor={theme.secondaryColor}
                  color={theme.textColor}>
        <Flex alignItems={'center'}
              justifyContent={'space-between'}>
          <Heading size='sm' textTransform={'uppercase'}>Categories</Heading>
        </Flex>
      </CardHeader>
      <CardBody>
        <Flex justifyContent={'space-between'}
              gap={4}>
          <SearchBar
            placeholder="Search categories"
            content={categories}
            onSearch={handleSearchResults}
            filter={(category, query) => category.name.toLowerCase().includes(query.toLowerCase())}
          />
          {
            permissions.includes("CATEGORY_CREATE") && <AddCategoryButton vaultId={vault.id} />
          }
        </Flex>
        <Divider mt={4} />
        <Stack gap={0}>
          {
            queriedCategories.length === 0 &&
              <Flex justifyContent={'center'}
                    mt={4}>
                  <Text size={'sm'}>There are no categories</Text>
              </Flex>
          }
          {
            queriedCategories &&
            queriedCategories.map(category => <CategoriesCardItem key={category.id}
                                                                  category={category}
                                                                  permissions={permissions} />)
          }
        </Stack>
      </CardBody>
    </Card>
  )
}