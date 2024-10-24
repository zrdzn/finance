import {Card, CardBody, CardHeader, Divider, Flex, Stack, Text} from "@chakra-ui/react"
import React, {useEffect, useState} from "react"
import {useTheme} from "@/hooks/useTheme"
import {useApi} from "@/hooks/useApi"
import {SearchBar} from "@/components/shared/SearchBar"
import {MembersCardItem} from "@/components/member/MembersCardItem"
import {useTranslations} from "next-intl";
import {Components} from "@/api/api";

type VaultResponse = Components.Schemas.VaultResponse;
type VaultRoleResponse = Components.Schemas.VaultRoleResponse;
type VaultMemberResponse = Components.Schemas.VaultMemberResponse;

interface MembersCardProperties {
  vault: VaultResponse
  vaultRole: VaultRoleResponse
}

export const MembersCard = ({ vault, vaultRole }: MembersCardProperties) => {
  const theme = useTheme()
  const api = useApi()
  const t = useTranslations("Members")
  const [members, setMembers] = useState<VaultMemberResponse[]>([])
  const [queriedMembers, setQueriedMembers] = useState<VaultMemberResponse[]>([])

  useEffect(() => {
    api
      .then(client => client.getVaultMembers({ vaultId: vault.id })
        .then(response => {
          setMembers(response.data.vaultMembers)
          setQueriedMembers(response.data.vaultMembers)
        }))
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
          <Text fontSize='md' fontWeight={'600'} textTransform={'uppercase'}>{t('card.title')}</Text>
        </Flex>
      </CardHeader>
      <CardBody>
        <Flex justifyContent={'space-between'}
              gap={4}>
          <SearchBar
            placeholder={t('card.search-placeholder')}
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
                  <Text size={'sm'}>{t('card.no-members')}</Text>
              </Flex>
          }
          {
            queriedMembers &&
            queriedMembers.map(member => <MembersCardItem key={member.id}
                                                          member={member}
                                                          vaultRole={vaultRole} />)
          }
        </Stack>
      </CardBody>
    </Card>
  )
}