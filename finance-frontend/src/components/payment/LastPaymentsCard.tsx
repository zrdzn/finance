import {Box, Card, CardBody, CardHeader, Flex, Heading, Link, Stack, Text} from "@chakra-ui/react"
import React, {useEffect, useState} from "react"
import {useTheme} from "@/hooks/useTheme"
import {PaymentResponse, VaultResponse} from "@/components/api"
import {useApi} from "@/hooks/useApi"
import {PaymentsCardItem} from "@/components/payment/PaymentsCardItem"

interface LastPaymentsCardProperties {
  vault: VaultResponse
  permissions: string[]
}

export const LastPaymentsCard = ({ vault, permissions }: LastPaymentsCardProperties) => {
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
          <Heading size='sm' textTransform={'uppercase'}>Last payments</Heading>
        </Flex>
      </CardHeader>
      <CardBody>
        <Stack gap={0}>
          {
            payments.length === 0 && <Text size={'sm'}>There are no payments</Text>
          }
          {
            payments &&
            payments.sort((payment, nextPayment) => new Date(nextPayment.createdAt).getTime() - new Date(payment.createdAt).getTime())
              .slice(0, 3)
              .map(payment => <PaymentsCardItem key={payment.id}
                                                vaultId={vault.id}
                                                payment={payment}
                                                permissions={permissions} />)
          }
          <Box paddingTop={4}>
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