import {
  Accordion, AccordionButton, AccordionItem,
  AccordionPanel,
  Box, Button,
  Flex,
  Heading,
  Text
} from "@chakra-ui/react"
import React from "react"
import {ProductPriceResponse} from "@/components/api"
import {useApi} from "@/hooks/apiClient"
import {useRouter} from "next/router"
import {FaTrash} from "react-icons/fa"

interface ProductPricesCardItemProperties {
  productPrice: ProductPriceResponse
}

export const ProductPricesCardItem = ({
  productPrice
}: ProductPricesCardItemProperties) => {
  const api = useApi()
  const router = useRouter()

  const handleProductPriceDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api.delete(`/products/prices/${productPrice.id}`)
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
                         textTransform='uppercase'
                         isTruncated
                         maxWidth={'70%'}>
                  {productPrice.price.currency}
                </Heading>
                <Button colorScheme={'red'}
                        size={'md'}
                        onClick={handleProductPriceDelete}>
                  <FaTrash />
                </Button>
              </Flex>
              <Flex justifyContent={'space-between'}>
                <Text color={'dimgray'}
                      fontSize={'sm'}
                      letterSpacing={0.2}>
                  {productPrice.price.amount.toFixed(2)}
                </Text>
              </Flex>
            </Box>
          </AccordionButton>
      </AccordionItem>
    </Accordion>
  )
}