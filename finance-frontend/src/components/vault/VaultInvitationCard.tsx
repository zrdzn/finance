import {Button, Card, CardBody, CardFooter, Divider, Heading, Stack, Text,} from '@chakra-ui/react'
import React, {useEffect, useState} from "react"
import {useTheme} from "@/hooks/useTheme"
import {useApi} from "@/hooks/useApi"
import {useRouter} from "next/router"
import toast from "react-hot-toast"
import {useTranslations} from "next-intl";
import {Components} from "@/api/api";

type VaultInvitationResponse = Components.Schemas.VaultInvitationResponse;
type UsernameResponse = Components.Schemas.UsernameResponse;

interface VaultInvitationCardProperties {
  invitation: VaultInvitationResponse
}

export const VaultInvitationCard = ({ invitation }: VaultInvitationCardProperties) => {
  const theme = useTheme()
  const { api } = useApi()
  const router = useRouter()
  const t = useTranslations("Overview")
  const [username, setUsername] = useState<UsernameResponse | undefined>(undefined)

  useEffect(() => {
    api
        .then(client => client.getUsernameByUserId({ userId: invitation.vault.ownerId })
            .then(response => setUsername(response.data)))
        .catch(error => console.error(error))
  }, [api, invitation.vault.ownerId]);

  const handleJoin = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api
        .then(client => client.acceptVaultInvitation({ invitationId: invitation.id }))
        .then(() => {
            toast.success(t('invitation-accepted').replace("%vault_name%", invitation.vault.name))
            setTimeout(() => router.push(`/vault/${invitation.vault.publicId}`), 1000)
        })
        .catch((error) => console.error(error))
  }

  const handleCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api
        .then(client => client.removeVaultInvitation({
            vaultId: invitation.vault.id,
            userEmail: invitation.userEmail
        }))
        .then(() => {
            toast.success(t('invitation-cancelled-success'))
            setTimeout(() => router.reload(), 1000)
        })
        .catch(error => console.error(error))
  }

  return (
    <Card width={{ base: '100%', sm: 'sm' }}
          backgroundColor={theme.background.secondary}
          color={theme.text.primary}
          mt={8}>
      <CardBody>
        <Stack mt='6' spacing='3'>
          <Text fontSize='md' fontWeight={'600'}>{invitation.vault.name}</Text>
          <Text color={theme.text.secondary}>
              {t('invitation-card.created-by').replace("%username%", username?.username ?? "Unknown")}
          </Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter justifyContent={'end'}
                  gap={2}>
        <Button backgroundColor={theme.secondary}
                color={'#f8f8f8'}
                fontWeight={'400'}
                onClick={handleJoin}>
            {t('invitation-card.join')}
        </Button>
        <Button backgroundColor={'red.400'}
                color={'#f8f8f8'}
                fontWeight={'400'}
                onClick={handleCancel}>
            {t('invitation-card.cancel')}
        </Button>
      </CardFooter>
    </Card>
  )
}
