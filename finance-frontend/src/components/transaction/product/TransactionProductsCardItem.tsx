import {Accordion, AccordionButton, AccordionItem, Box, Flex, Heading, Text} from "@chakra-ui/react"
import React from "react"
import {Components} from "@/api/api";
import {useNumberFormatter} from "@/hooks/useNumberFormatter";

type TransactionProductResponse = Components.Schemas.TransactionProductResponse;

interface TransactionProductsCardItemProperties {
  transactionProduct: TransactionProductResponse
}

export const TransactionProductsCardItem = ({
  transactionProduct
}: TransactionProductsCardItemProperties) => {
  const { formatNumber } = useNumberFormatter()

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
                  {formatNumber(transactionProduct.unitAmount * transactionProduct.quantity)}
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
                  {formatNumber(transactionProduct.unitAmount)}/unit
                </Text>
              </Flex>
            </Box>
          </AccordionButton>
      </AccordionItem>
    </Accordion>
  )
}