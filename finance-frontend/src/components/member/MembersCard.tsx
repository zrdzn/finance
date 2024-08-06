import {
  Box,
  Card,
  CardBody,
  CardHeader, Divider,
  Flex,
  FormControl, FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  StackDivider,
  Text
} from "@chakra-ui/react"
import {AddPaymentButton} from "@/components/payment/AddPaymentButton"
import React, {useEffect, useState} from "react"
import {useTheme} from "@/hooks/theme"
import {PaymentResponse, ProductResponse, VaultMemberResponse, VaultResponse} from "@/components/api"
import {useApi} from "@/hooks/apiClient"
import {PaymentsCardItem} from "@/components/payment/PaymentsCardItem"
import {AddProductButton} from "@/components/product/AddProductButton"
import {ProductsCardItem} from "@/components/product/ProductsCardItem"
import {SearchBar} from "@/components/shared/SearchBar"
import {useRouter} from "next/router"
import {MembersCardItem} from "@/components/member/MembersCardItem"

interface MembersCardProperties {
  vault: VaultResponse
}

export const MembersCard = ({ vault }: MembersCardProperties) => {
  const theme = useTheme()
  const api = useApi()
  const router = useRouter()
  const [members, setMembers] = useState<VaultMemberResponse[]>([])
  const [queriedMembers, setQueriedMembers] = useState<VaultMemberResponse[]>([])

  useEffect(() => {
    api.get(`/vaults/${vault.id}/members`)
      .then(response => {
        setMembers(response.data.vaultMembers)
        setQueriedMembers(response.data.vaultMembers)
      })
      .catch(error => console.error(error))
  }, [api, vault.id]);

  const handleSearchResults = (results: VaultMemberResponse[]) => {
    setQueriedMembers(results)
  }

  return (
    <Card margin={2}>
      <CardHeader backgroundColor={theme.secondaryColor}
                  color={theme.textColor}>
        <Flex alignItems={'center'}
              justifyContent={'space-between'}>
          <Heading size='sm' textTransform={'uppercase'}>Members</Heading>
        </Flex>
      </CardHeader>
      <CardBody>
        <Flex justifyContent={'space-between'}
              gap={4}>
          <SearchBar
            placeholder="Search members"
            content={members}
            onSearch={handleSearchResults}
            filter={(member, query) => {
              return member.user.username.toLowerCase().includes(query.toLowerCase()) ||
                member.user.email.toLowerCase().includes(query.toLowerCase())
            }}
          />
        </Flex>
        <Divider mt={4} />
        <Stack gap={0}>
          {
            queriedMembers.length === 0 &&
              <Flex justifyContent={'center'}
                    mt={4}>
                  <Text size={'sm'}>There are no members</Text>
              </Flex>
          }
          {
            queriedMembers &&
            queriedMembers.map(member => <MembersCardItem key={member.id} member={member} />)
          }
        </Stack>
      </CardBody>
    </Card>
  )
}