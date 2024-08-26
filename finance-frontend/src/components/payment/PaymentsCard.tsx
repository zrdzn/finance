import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Link,
  Stack,
  StackDivider,
  Text
} from "@chakra-ui/react"
import {AddPaymentButton} from "@/components/payment/AddPaymentButton"
import React, {useEffect, useState} from "react"
import {useTheme} from "@/hooks/theme"
import {PaymentResponse, ProductResponse, VaultResponse} from "@/components/api"
import {useApi} from "@/hooks/apiClient"
import {PaymentsCardItem} from "@/components/payment/PaymentsCardItem"
import {InvitationCreateButton} from "@/components/member/invitation/InvitationCreateButton"
import {SearchBar} from "@/components/shared/SearchBar"
import {AddProductButton} from "@/components/product/AddProductButton"
import {router} from "next/client"
import {useRouter} from "next/router"

interface PaymentsCardProperties {
  vault: VaultResponse
  permissions: string[]
}

export const PaymentsCard = ({ vault, permissions }: PaymentsCardProperties) => {
  const theme = useTheme()
  const api = useApi()
  const router = useRouter()
  const [payments, setPayments] = useState<PaymentResponse[]>([])
  const [queriedPayments, setQueriedPayments] = useState<PaymentResponse[]>([])

  useEffect(() => {
    api.get(`/payment/${vault.id}`)
      .then(response => {
        setPayments(response.data.payments)
        setQueriedPayments(response.data.payments)
      })
      .catch(error => console.error(error))
  }, [api, vault.id]);

  const handleSearchResults = (results: PaymentResponse[]) => {
    setQueriedPayments(results)
  }

  const handlePaymentCreate = () => {
    router.reload()
  }

  return (
    <Card margin={2}>
      <CardHeader backgroundColor={theme.secondaryColor}
                  color={theme.textColor}>
        <Flex alignItems={'center'}
              justifyContent={'space-between'}>
          <Heading size='sm' textTransform={'uppercase'}>Payments</Heading>
        </Flex>
      </CardHeader>
      <CardBody>
        <Flex justifyContent={'space-between'}
              gap={4}>
          <SearchBar
            placeholder="Search payments"
            content={payments}
            onSearch={handleSearchResults}
            filter={(payment, query) => {
              if (payment.description === null) {
                return false
              }

              return payment.description.toLowerCase().includes(query.toLowerCase())}
            }
          />
          {
            permissions.includes("PAYMENT_CREATE") && <AddPaymentButton vault={vault} />
          }
        </Flex>
        <Divider mt={4} />
        <Stack gap={0}>
          {
            queriedPayments.length === 0 && <Text size={'sm'}>There are no payments</Text>
          }
          {
            queriedPayments &&
            queriedPayments.sort((payment, nextPayment) => new Date(nextPayment.payedAt).getTime() - new Date(payment.payedAt).getTime())
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