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
    Card, CardHeader, Divider,
} from "@chakra-ui/react"
import React, {useEffect, useState} from "react"
import {useTheme} from "@/hooks/useTheme"
import {useApi} from "@/hooks/useApi"
import {AddCategoryButton} from "@/components/product/category/AddCategoryButton"
import {SearchBar} from "@/components/shared/SearchBar"
import {useTranslations} from "next-intl";
import {Components} from "@/api/api";
import {useRouter} from "next/router";
import toast from "react-hot-toast";
import {DeleteButton} from "@/components/shared/DeleteButton";

type VaultResponse = Components.Schemas.VaultResponse
type CategoryResponse = Components.Schemas.CategoryResponse;

interface CategoriesCardProperties {
    vault: VaultResponse
    permissions: string[]
}

export const CategoriesCard = ({ vault, permissions }: CategoriesCardProperties) => {
    const api = useApi()
    const theme = useTheme()
    const router = useRouter()
    const t = useTranslations("Categories")
    const [categories, setCategories] = useState<CategoryResponse[]>([])
    const [queriedCategories, setQueriedCategories] = useState<CategoryResponse[]>([])

    useEffect(() => {
        api
            .then((client) =>
                client.getCategoriesByVaultId({ vaultId: vault.id }).then((response) => {
                    setCategories(response.data.categories)
                    setQueriedCategories(response.data.categories)
                })
            )
            .catch((error) => console.error(error))
    }, [api, vault.id])

    const handleSearchResults = (results: CategoryResponse[]) => {
        setQueriedCategories(results)
    }

    const handleCategoryDelete = (categoryId: number) => {
        api
            .then((client) => client.deleteCategory({ categoryId: categoryId }))
            .then(() => {
                toast.success(t("category-deleted-success"))
                setTimeout(() => router.reload(), 1000)
            })
            .catch((error) => {
                console.error(error)
                toast.error(t("category-deleted-error"))
            })
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
                        content={categories}
                        onSearch={handleSearchResults}
                        filter={(category, query) =>
                            category.name.toLowerCase().includes(query.toLowerCase())
                        }
                    />
                    {permissions.includes("CATEGORY_CREATE") && (
                        <AddCategoryButton vaultId={vault.id} />
                    )}
                </Flex>
                <Box overflowX="auto">
                    <Table variant={"simple"}>
                        <Thead>
                            <Tr>
                                <Th>{t("table.name")}</Th>
                                <Th>{t("table.actions")}</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {queriedCategories.length === 0 ? (
                                <Tr>
                                    <Td colSpan={2}>
                                        <Text textAlign="center" size="sm">
                                            {t("card.no-categories")}
                                        </Text>
                                    </Td>
                                </Tr>
                            ) : (
                                queriedCategories.map((category) => (
                                    <Tr key={category.id}>
                                        <Td>{category.name}</Td>
                                        <Td>
                                            <HStack spacing={2}>
                                                {permissions.includes("CATEGORY_DELETE") && (
                                                    <DeleteButton
                                                        onClick={() => handleCategoryDelete(category.id)}
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