import {Accordion, AccordionButton, AccordionItem, Box, Flex, Heading, Text} from "@chakra-ui/react"
import React from "react"
import {ProductResponse} from "@/components/api"
import {useApi} from "@/hooks/useApi"
import {useRouter} from "next/router"
import {DeleteButton} from "@/components/shared/DeleteButton"
import toast from "react-hot-toast"

interface CategoriesCardItemProperties {
  category: ProductResponse
  permissions: string[]
}

export const CategoriesCardItem = ({
  category,
  permissions
}: CategoriesCardItemProperties) => {
  const api = useApi()
  const router = useRouter()

  const handleCategoryDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api.delete(`/categories/${category.id}`)
      .then(() => {
        toast.success(`Category deleted`)
        setTimeout(() => router.reload(), 1000)
      })
      .catch(error => {
        console.error(error)
        toast.error('Failed to delete category')
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
                       isTruncated
                       maxWidth={'70%'}>
                {category.name}
              </Heading>
              {
                permissions.includes("CATEGORY_DELETE") && <DeleteButton onClick={handleCategoryDelete} />
              }
            </Flex>
            <Flex justifyContent={'space-between'}>
              <Text color={'dimgray'}
                    fontSize={'sm'}
                    letterSpacing={0.2}>
              </Text>
            </Flex>
          </Box>
        </AccordionButton>
      </AccordionItem>
    </Accordion>
  )
}