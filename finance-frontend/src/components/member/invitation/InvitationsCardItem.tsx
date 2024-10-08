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
import {VaultInvitationResponse} from "@/components/api"
import {useApi} from "@/hooks/useApi"
import {useRouter} from "next/router"
import {DeleteButton} from "@/components/shared/DeleteButton"
import toast from "react-hot-toast"

interface InvitationsCardItemProperties {
  invitation: VaultInvitationResponse
  permissions: string[]
}

export const InvitationsCardItem = ({
  invitation,
  permissions
}: InvitationsCardItemProperties) => {
  const api = useApi()
  const router = useRouter()

  const handleInvitationDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api.delete(`/vaults/${invitation.vault.id}/invitations/${invitation.userEmail}`)
      .then(() => {
        toast.success(`Invitation for ${invitation.userEmail} has been deleted`)
        setTimeout(() => router.reload(), 1000)
      })
      .catch(error => {
        console.error(error)
        toast.error(`Failed to delete invitation for ${invitation.userEmail}`)
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
                    {invitation.userEmail}
                  </Text>
                  <HStack spacing={4}>
                    <Tag size={'sm'} colorScheme='red'>
                      <TagLabel>Expires {new Date(invitation.expiresAt * 1000).toLocaleDateString()}</TagLabel>
                    </Tag>
                  </HStack>
                </Flex>
                <HStack spacing={2}>
                  {
                    permissions.includes("MEMBER_INVITE_DELETE") && <DeleteButton onClick={handleInvitationDelete} />
                  }
                </HStack>
              </Flex>
            </Box>
          </AccordionButton>
      </AccordionItem>
    </Accordion>
  )
}