import {Card, CardBody, CardHeader, Divider, Flex, Heading, Stack, Text} from "@chakra-ui/react"
import React, {useEffect, useState} from "react"
import {useTheme} from "@/hooks/useTheme"
import {VaultMemberResponse, VaultResponse} from "@/components/api"
import {useApi} from "@/hooks/useApi"
import {SearchBar} from "@/components/shared/SearchBar"
import {useRouter} from "next/router"
import {MembersCardItem} from "@/components/member/MembersCardItem"

interface MembersCardProperties {
  vault: VaultResponse
  permissions: string[]
}

export const MembersCard = ({ vault, permissions }: MembersCardProperties) => {
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
          <Text fontSize='md' fontWeight={'600'} textTransform={'uppercase'}>Members</Text>
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
            queriedMembers.map(member => <MembersCardItem key={member.id}
                                                          member={member}
                                                          permissions={permissions} />)
          }
        </Stack>
      </CardBody>
    </Card>
  )
}