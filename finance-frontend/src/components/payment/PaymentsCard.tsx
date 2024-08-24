import {Box, Card, CardBody, CardHeader, Flex, Heading, Link, Stack, StackDivider, Text} from "@chakra-ui/react"
import {AddPaymentButton} from "@/components/payment/AddPaymentButton"
import React, {useEffect, useState} from "react"
import {useTheme} from "@/hooks/theme"
import {PaymentResponse, VaultResponse} from "@/components/api"
import {useApi} from "@/hooks/apiClient"
import {PaymentsCardItem} from "@/components/payment/PaymentsCardItem"
import {InvitationCreateButton} from "@/components/member/invitation/InvitationCreateButton"

interface PaymentsCardProperties {
  vault: VaultResponse
  permissions: string[]
}

export const PaymentsCard = ({ vault, permissions }: PaymentsCardProperties) => {
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
          <Heading size='sm' textTransform={'uppercase'}>Payments</Heading>
          {
            permissions.includes("PAYMENT_CREATE") && <AddPaymentButton vaultId={vault.id} />
          }
        </Flex>
      </CardHeader>
      <CardBody>
        <Stack gap={0}>
          {
            payments.length === 0 && <Text size={'sm'}>There are no payments</Text>
          }
          {
            payments &&
            payments.sort((payment, nextPayment) => new Date(nextPayment.payedAt).getTime() - new Date(payment.payedAt).getTime())
              .map(payment => <PaymentsCardItem key={payment.id}
                                                vaultId={vault.id}
                                                payment={payment}
                                                permissions={permissions} />)
          }
        </Stack>
      </CardBody>
    </Card>
  )
}