import {Accordion, AccordionButton, AccordionItem, Box, Flex, Heading, Text} from "@chakra-ui/react"
import React from "react"
import {TransactionProductWithProductResponse} from "@/components/api"
import {useApi} from "@/hooks/useApi"
import {useRouter} from "next/router"
import toast from "react-hot-toast"

interface TransactionProductsCardItemProperties {
  transactionProduct: TransactionProductWithProductResponse
}

export const TransactionProductsCardItem = ({
  transactionProduct
}: TransactionProductsCardItemProperties) => {
  return (
    <Accordion allowToggle width={'full'}>
      <AccordionItem width={'full'}
                     paddingY={4}
                     borderTop={'none'}>
          <AccordionButton width={'full'}>
            <Box width={'full'}>
              <Flex justifyContent={'space-between'}
                    alignItems={'center'}>
                <Text fontSize='md' fontWeight={'600'}
                         textTransform='uppercase'
                         isTruncated
                         maxWidth={'70%'}>
                  {transactionProduct.product.name}
                </Text>
                <Text fontSize='md' fontWeight={'600'}>
                  {(transactionProduct.unitAmount * transactionProduct.quantity).toFixed(2)}
                </Text>
              </Flex>
              <Flex justifyContent={'space-between'}>
                <Text color={'dimgray'}
                      fontSize={'sm'}
                      letterSpacing={0.5}>
                  {transactionProduct.quantity}x
                </Text>
                <Text color={'dimgray'}
                      fontSize={'sm'}
                      letterSpacing={0.5}>
                  {transactionProduct.unitAmount.toFixed(2)}/unit
                </Text>
              </Flex>
            </Box>
          </AccordionButton>
      </AccordionItem>
    </Accordion>
  )
}