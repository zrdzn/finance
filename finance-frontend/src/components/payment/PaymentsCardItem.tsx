import {
  Accordion, AccordionButton, AccordionIcon, AccordionItem,
  AccordionPanel,
  Box,
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
import {PaymentResponse} from "@/components/api"

interface PaymentsCardItemProperties {
  payment: PaymentResponse
}

export const PaymentsCardItem = ({
  payment
}: PaymentsCardItemProperties) => {
  return (
    <Accordion allowToggle width={'full'}>
      <AccordionItem width={'full'}
                     paddingY={4}
                     borderTop={'none'}>
          <AccordionButton width={'full'}>
            <Box width={'full'}>
              <Flex justifyContent={'space-between'}>
                <Heading size='sm'
                         textTransform='uppercase'
                         isTruncated
                         maxWidth={'70%'}>
                  {payment.description}
                </Heading>
                <Heading size={'md'}>
                  {payment.total.toFixed(2)} {payment.currency}
                </Heading>
              </Flex>
              <Flex justifyContent={'space-between'}>
                <Text color={'dimgray'}
                      fontSize={'sm'}
                      letterSpacing={0.2}>
                  {new Date(payment.payedAt).toLocaleDateString()}
                </Text>
                <Text color={'dimgray'}
                      fontSize={'sm'}
                      letterSpacing={0.5}>
                  {payment.paymentMethod}
                </Text>
              </Flex>
            </Box>
          </AccordionButton>
        <AccordionPanel pb={4}>
          list of products will appear here
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}