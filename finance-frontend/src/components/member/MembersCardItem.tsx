import {
  Accordion,
  AccordionButton,
  AccordionItem,
  Box,
  Flex,
  Heading,
  HStack,
  Tag,
  TagLabel,
  Text
} from "@chakra-ui/react"
import React from "react"
import {VaultMemberResponse, VaultRoleResponse} from "@/components/api"
import {useApi} from "@/hooks/useApi"
import {useRouter} from "next/router"
import {DeleteButton} from "@/components/shared/DeleteButton"
import toast from "react-hot-toast"
import {EditProductButton} from "@/components/product/EditProductButton";
import {EditMemberButton} from "@/components/member/EditMemberButton";
import {useAuthentication} from "@/hooks/useAuthentication";

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
  const { authenticationDetails } = useAuthentication()

  const handleMemberDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api.delete(`/vaults/${member.vaultId}/members/${member.id}`)
      .then(() => {
        toast.success(`Member ${member.user.username} has been deleted`)
        setTimeout(() => router.reload(), 1000)
      })
      .catch(error => {
        console.error(error)
        toast.error(`Failed to delete member ${member.user.username}`)
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
                  <Text fontSize='md' fontWeight={'600'}
                           maxWidth={'70%'}>
                    {member.user.username}
                  </Text>
                  <HStack spacing={4}>
                    {
                      member.vaultRole === 'OWNER' &&
                        <Tag size={'sm'} colorScheme='red'>
                            <TagLabel>Owner</TagLabel>
                        </Tag>
                    }
                    {
                      member.vaultRole === 'MANAGER' &&
                        <Tag size={'sm'} colorScheme='purple'>
                            <TagLabel>Manager</TagLabel>
                        </Tag>
                    }
                    {
                      member.vaultRole === 'MEMBER' &&
                        <Tag size={'sm'} colorScheme='green'>
                            <TagLabel>Member</TagLabel>
                        </Tag>
                    }
                  </HStack>
                </Flex>
                <HStack spacing={2}>
                  {
                      member.vaultRole !== 'OWNER' &&
                      member.user.email !== authenticationDetails?.email &&
                      vaultRole.permissions.includes("MEMBER_UPDATE") && <EditMemberButton member={member} />
                  }
                  {
                    member.vaultRole !== 'OWNER' &&
                    member.user.email !== authenticationDetails?.email &&
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