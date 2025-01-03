import {
  Accordion,
  AccordionButton,
  AccordionItem,
  Box,
  Flex,
  HStack,
  Tag,
  TagLabel,
  Text
} from "@chakra-ui/react"
import React from "react"
import {useApi} from "@/hooks/useApi"
import {useRouter} from "next/router"
import {DeleteButton} from "@/components/shared/DeleteButton"
import toast from "react-hot-toast"
import {EditMemberButton} from "@/components/member/EditMemberButton";
import {useAuthentication} from "@/hooks/useAuthentication";
import {useTranslations} from "next-intl";
import {Components} from "@/api/api";
import {AccountAvatar} from "@/components/account/AccountAvatar";

type VaultMemberResponse = Components.Schemas.VaultMemberResponse;
type VaultRoleResponse = Components.Schemas.VaultRoleResponse;

interface MembersCardItemProperties {
  member: VaultMemberResponse
  vaultRole: VaultRoleResponse
}

export const MembersCardItem = ({
  member,
  vaultRole
}: MembersCardItemProperties) => {
  const api = useApi()
  const router = useRouter()
  const { details } = useAuthentication()
  const t = useTranslations("Members")

  const handleMemberDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api
      .then(client => client.removeVaultMember({ vaultId: member.vaultId, userId: member.id }))
      .then(() => {
        toast.success(t('member-deleted-success').replace("%username%", member.user.username))
        setTimeout(() => router.reload(), 1000)
      })
      .catch(error => {
        console.error(error)
        toast.error(t('member-deleted-error').replace("%username%", member.user.username))
      })
  }

  return (
    <Accordion allowToggle width={'full'}>
      <AccordionItem width={'full'}
                     paddingY={4}
                     borderTop={'none'}>
          <AccordionButton width={'full'}>
            <Box width={'full'}>
              <Flex justifyContent={'space-between'}
                    alignItems={'center'}>
                <Flex w={'full'}
                      gap={3}
                      alignItems={'center'}>
                  <AccountAvatar size={'sm'} />
                  <Text fontSize='md' fontWeight={'600'}
                           maxWidth={'70%'}>
                    {member.user.username}
                  </Text>
                  <HStack spacing={4}>
                    {
                      member.vaultRole === 'OWNER' &&
                        <Tag size={'sm'} colorScheme='red'>
                            <TagLabel>{t('card.roles.owner')}</TagLabel>
                        </Tag>
                    }
                    {
                      member.vaultRole === 'MANAGER' &&
                        <Tag size={'sm'} colorScheme='purple'>
                            <TagLabel>{t('card.roles.manager')}</TagLabel>
                        </Tag>
                    }
                    {
                      member.vaultRole === 'MEMBER' &&
                        <Tag size={'sm'} colorScheme='green'>
                            <TagLabel>{t('card.roles.member')}</TagLabel>
                        </Tag>
                    }
                  </HStack>
                </Flex>
                <HStack spacing={2}>
                  {
                      member.vaultRole !== 'OWNER' &&
                      member.user.email !== details?.email &&
                      vaultRole.permissions.includes("MEMBER_UPDATE") && <EditMemberButton member={member} />
                  }
                  {
                    member.vaultRole !== 'OWNER' &&
                    member.user.email !== details?.email &&
                    vaultRole.permissions.includes("MEMBER_REMOVE") &&
                    <DeleteButton onClick={handleMemberDelete} />
                  }
                </HStack>
              </Flex>
              <Flex justifyContent={'space-between'}>
                <Text color={'dimgray'}
                      fontSize={'sm'}
                      letterSpacing={0.2}>
                  {member.user.email}
                </Text>
              </Flex>
            </Box>
          </AccordionButton>
      </AccordionItem>
    </Accordion>
  )
}