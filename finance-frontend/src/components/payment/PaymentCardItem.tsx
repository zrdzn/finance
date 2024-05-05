import {Box, Card, CardBody, CardHeader, Flex, Heading, Link, Stack, StackDivider, Text} from "@chakra-ui/react"
import {AddPaymentButton} from "@/components/payment/AddPaymentButton"
import React from "react"
import {useTheme} from "@/hooks/theme"
import {PaymentResponse} from "@/components/api"

interface LastPaymentsCardItemProperties {
  payment: PaymentResponse
}

export const PaymentCardItem = ({
  payment
}: LastPaymentsCardItemProperties) => {
  return (
      <Box>
        <Flex justifyContent={'space-between'}>
          <Heading size='sm'
                   textTransform='uppercase'
                   isTruncated
                   maxWidth={'70%'}>
            {payment.description}
          </Heading>
          <Heading size={'md'}>
            {payment.total} {payment.currency}
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
  )
}