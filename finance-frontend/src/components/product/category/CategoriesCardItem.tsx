import {
  Accordion, AccordionButton, AccordionIcon, AccordionItem,
  AccordionPanel,
  Box, Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Link,
  Stack,
  StackDivider,
  Text
} from "@chakra-ui/react"
import {AddPaymentButton} from "@/components/payment/AddPaymentButton"
import React from "react"
import {useTheme} from "@/hooks/theme"
import {ProductResponse, PaymentResponse} from "@/components/api"
import {useApi} from "@/hooks/apiClient"
import {FaTrash} from "react-icons/fa"
import {useRouter} from "next/router"

interface CategoriesCardItemProperties {
  category: ProductResponse
}

export const CategoriesCardItem = ({
  category
}: CategoriesCardItemProperties) => {
  const api = useApi()
  const router = useRouter()

  const handleCategoryDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api.delete(`/categories/${category.id}`)
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
            <Flex justifyContent={'space-between'}
                  alignItems={'center'}>
              <Heading size='sm'
                       isTruncated
                       maxWidth={'70%'}>
                {category.name}
              </Heading>
              <Button colorScheme={'red'}
                      size={'md'}
                      onClick={handleCategoryDelete}>
                <FaTrash />
              </Button>
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