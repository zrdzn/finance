import {
  Accordion,
  AccordionButton,
  AccordionItem,
  Box,
  Flex,
  Heading,
  HStack,
  Tag,
  TagLabel,
  Text
} from "@chakra-ui/react"
import React, {useEffect, useState} from "react"
import {ProductResponse} from "@/components/api"
import {useApi} from "@/hooks/useApi"
import {EditProductButton} from "@/components/product/EditProductButton"
import {useRouter} from "next/router"
import {DeleteButton} from "@/components/shared/DeleteButton"
import toast from "react-hot-toast"

interface ProductsCardItemProperties {
  product: ProductResponse
  permissions: string[]
}

export const ProductsCardItem = ({
  product,
  permissions
}: ProductsCardItemProperties) => {
  const api = useApi()
  const router = useRouter()
  const [category, setCategory] = useState<ProductResponse | undefined>(undefined)

  useEffect(() => {
    api.get(`/categories/${product.categoryId}`)
      .then(response => setCategory(response.data))
      .catch(error => console.error(error))
  }, [api, product.categoryId]);

  const handleProductDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api.delete(`/products/${product.id}`)
      .then(() => {
        toast.success('Product deleted')
        setTimeout(() => router.reload(), 1000)
      })
      .catch(error => console.error(error))
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
                <Flex w={'full'}
                      gap={3}
                      alignItems={'center'}>
                  <Text fontSize='md' fontWeight={'600'}
                           maxWidth={'70%'}>
                    {product.name}
                  </Text>
                  <HStack spacing={4}>
                    {
                      category !== undefined &&
                      <Tag size={'sm'} colorScheme='cyan'>
                        <TagLabel>{category.name}</TagLabel>
                      </Tag>
                    }
                  </HStack>
                </Flex>
                <HStack spacing={2}>
                  {
                    permissions.includes("PRODUCT_UPDATE") && <EditProductButton product={product} />
                  }
                  {
                    permissions.includes("PRODUCT_DELETE") && <DeleteButton onClick={handleProductDelete} />
                  }
                </HStack>
              </Flex>
            </Box>
          </AccordionButton>
      </AccordionItem>
    </Accordion>
  )
}