import {Card, CardBody, CardHeader, Divider, Flex, Heading, Stack, Text} from "@chakra-ui/react"
import React, {useEffect, useState} from "react"
import {useTheme} from "@/hooks/useTheme"
import {useApi} from "@/hooks/useApi"
import {CategoriesCardItem} from "@/components/product/category/CategoriesCardItem"
import {AddCategoryButton} from "@/components/product/category/AddCategoryButton"
import {SearchBar} from "@/components/shared/SearchBar"
import {useTranslations} from "next-intl";
import {Components} from "@/api/api";

type ProductResponse = Components.Schemas.ProductResponse;
type VaultResponse = Components.Schemas.VaultResponse;

interface CategoriesCardProperties {
  vault: VaultResponse
  permissions: string[]
}

export const CategoriesCard = ({ vault, permissions }: CategoriesCardProperties) => {
  const theme = useTheme()
  const api = useApi()
  const t = useTranslations("Categories")
  const [categories, setCategories] = useState<ProductResponse[]>([])
  const [queriedCategories, setQueriedCategories] = useState<ProductResponse[]>([])

  useEffect(() => {
    api
      .then(client => client.getCategoriesByVaultId({ vaultId: vault.id })
        .then(response => {
          setCategories(response.data.categories)
          setQueriedCategories(response.data.categories)
        }))
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
          <Text fontSize='md' fontWeight={'600'} textTransform={'uppercase'}>{t('card.title')}</Text>
        </Flex>
      </CardHeader>
      <CardBody>
        <Flex justifyContent={'space-between'}
              gap={4}>
          <SearchBar
            placeholder={t('card.search-placeholder')}
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
                  <Text size={'sm'}>{t('card.no-categories')}</Text>
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