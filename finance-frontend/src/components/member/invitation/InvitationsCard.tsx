import {Card, CardBody, CardHeader, Divider, Flex, Heading, Stack, Text} from "@chakra-ui/react"
import React, {useEffect, useState} from "react"
import {useTheme} from "@/hooks/useTheme"
import {VaultInvitationResponse, VaultResponse} from "@/components/api"
import {useApi} from "@/hooks/useApi"
import {SearchBar} from "@/components/shared/SearchBar"
import {useRouter} from "next/router"
import {InvitationsCardItem} from "@/components/member/invitation/InvitationsCardItem"
import {InvitationCreateButton} from "@/components/member/invitation/InvitationCreateButton"

interface InvitationsCardProperties {
  vault: VaultResponse
  permissions: string[]
}

export const  InvitationsCard = ({ vault, permissions }: InvitationsCardProperties) => {
  const theme = useTheme()
  const api = useApi()
  const router = useRouter()
  const [invitations, setInvitations] = useState<VaultInvitationResponse[]>([])
  const [queriedInvitations, setQueriedInvitations] = useState<VaultInvitationResponse[]>([])

  useEffect(() => {
    api.get(`/vaults/${vault.id}/invitations`)
      .then(response => {
        setInvitations(response.data.vaultInvitations)
        setQueriedInvitations(response.data.vaultInvitations)
      })
      .catch(error => console.error(error))
  }, [api, vault.id]);

  const handleSearchResults = (results: VaultInvitationResponse[]) => {
    setQueriedInvitations(results)
  }

  return (
    <Card margin={2}>
      <CardHeader backgroundColor={theme.secondaryColor}
                  color={theme.textColor}>
        <Flex alignItems={'center'}
              justifyContent={'space-between'}>
          <Text fontSize='md' fontWeight={'600'} textTransform={'uppercase'}>Invitations</Text>
        </Flex>
      </CardHeader>
      <CardBody>
        <Flex justifyContent={'space-between'}
              gap={4}>
          <SearchBar
            placeholder="Search invitations"
            content={invitations}
            onSearch={handleSearchResults}
            filter={(invitation, query) => {
              return invitation.userEmail.toLowerCase().includes(query.toLowerCase())
            }}
          />
          {
            permissions.includes("MEMBER_INVITE_CREATE") && <InvitationCreateButton vaultId={vault.id} />
          }
        </Flex>
        <Divider mt={4} />
        <Stack gap={0}>
          {
            queriedInvitations.length === 0 &&
              <Flex justifyContent={'center'}
                    mt={4}>
                  <Text size={'sm'}>There are no invitations</Text>
              </Flex>
          }
          {
            queriedInvitations &&
            queriedInvitations.map(invitation => <InvitationsCardItem key={invitation.id}
                                                                      invitation={invitation}
                                                                      permissions={permissions} />)
          }
        </Stack>
      </CardBody>
    </Card>
  )
}