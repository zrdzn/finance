import {Box, Card, CardBody, CardHeader, Flex, Heading, Link, Stack, StackDivider, Text} from "@chakra-ui/react"
import {AddPaymentButton} from "@/components/payment/AddPaymentButton"
import React, {useEffect, useState} from "react"
import {useTheme} from "@/hooks/theme"
import {PaymentResponse, VaultResponse} from "@/components/api"
import {useApi} from "@/hooks/apiClient"
import {PaymentsCardItem} from "@/components/payment/PaymentsCardItem"

interface LastPaymentsCardProperties {
  vault: VaultResponse
}

export const LastPaymentsCard = ({ vault }: LastPaymentsCardProperties) => {
  const theme = useTheme()
  const api = useApi()
  const [payments, setPayments] = useState<PaymentResponse[]>([])

  useEffect(() => {
    api.get(`/payment/${vault.id}`)
      .then(response => setPayments(response.data.payments))
      .catch(error => console.error(error))
  }, [api, vault.id]);

  return (
    <Card margin={2}>
      <CardHeader backgroundColor={theme.secondaryColor}
                  color={theme.textColor}>
        <Flex alignItems={'center'}
              justifyContent={'space-between'}>
          <Heading size='md'>Last payments</Heading>
        </Flex>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider/>} spacing='4'>
          {
            payments.length === 0 && <Text size={'sm'}>There are no payments</Text>
          }
          {
            payments &&
            payments.sort((payment, nextPayment) => new Date(nextPayment.payedAt).getTime() - new Date(payment.payedAt).getTime())
              .slice(0, 3)
              .map(payment => <PaymentsCardItem key={payment.id} payment={payment} />)
          }
          <Box>
            <Flex justifyContent={'space-between'}>
              <Box />
              <Link color={'dimgray'}
                    fontSize={'sm'}
                    href={`/vault/${vault.publicId}/payments`}
                    letterSpacing={0.5}>
                View All
              </Link>
            </Flex>
          </Box>
        </Stack>
      </CardBody>
    </Card>
  )
}