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
import {CategoryResponse, PaymentResponse} from "@/components/api"
import {useApi} from "@/hooks/apiClient"

interface CategoriesCardItemProperties {
  category: CategoryResponse
}

export const CategoriesCardItem = ({
  category
}: CategoriesCardItemProperties) => {
  const api = useApi()

  const handleCategoryDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api.delete(`/categories/${category.id}`)
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
                       textTransform='uppercase'
                       isTruncated
                       maxWidth={'70%'}>
                {category.name}
              </Heading>
              <Button colorScheme={'red'}
                      size={'md'}
                      onClick={handleCategoryDelete}>
                Delete
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