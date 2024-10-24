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
import {useTranslations} from "next-intl";
import {useDateFormatter} from "@/hooks/useDateFormatter";
import {Components} from "@/api/api";

type VaultInvitationResponse = Components.Schemas.VaultInvitationResponse;

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
  const t = useTranslations("Invitations")
  const {formatDate} = useDateFormatter()

  const handleInvitationDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api
      .then(client => client.removeVaultInvitation({ vaultId: invitation.vault.id, userEmail: invitation.userEmail }))
      .then(() => {
        toast.success(t('invitation-deleted-success').replace("%email%", invitation.userEmail))
        setTimeout(() => router.reload(), 1000)
      })
      .catch(error => {
        console.error(error)
        toast.error(t('invitation-deleted-error').replace("%email%", invitation.userEmail))
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
                      <TagLabel>{t('expires-tag').replace("%date%", formatDate(invitation.expiresAt, true))}</TagLabel>
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