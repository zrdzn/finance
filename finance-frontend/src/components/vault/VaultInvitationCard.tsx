import {Button, Card, CardBody, CardFooter, Divider, Heading, Stack, Text,} from '@chakra-ui/react'
import React, {useEffect, useState} from "react"
import {useTheme} from "@/hooks/useTheme"
import {useApi} from "@/hooks/useApi"
import {UsernameResponse, VaultInvitationResponse} from "@/components/api"
import {useRouter} from "next/router"
import toast from "react-hot-toast"
import {useTranslations} from "next-intl";

interface VaultInvitationCardProperties {
  invitation: VaultInvitationResponse
}

export const VaultInvitationCard = ({ invitation }: VaultInvitationCardProperties) => {
  const theme = useTheme()
  const api = useApi()
  const router = useRouter()
  const t = useTranslations("Overview")
  const [username, setUsername] = useState<UsernameResponse | undefined>(undefined)

  useEffect(() => {
    api.get(`/users/${invitation.vault.ownerId}/username`)
      .then((response) => setUsername({ username: response.data.username }))
      .catch(error => console.error(error))
  }, [api, invitation.vault.ownerId]);

  const handleJoin = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api.post(`/vaults/invitations/${invitation.id}/accept`)
      .then(() => {
        toast.success(t('invitation-accepted').replace("%vault_name%", invitation.vault.name))
        setTimeout(() => router.push(`/vault/${invitation.vault.publicId}`), 1000)
      })
      .catch((error) => console.error(error))
  }

  const handleCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api.delete(`/vaults/${invitation.vault.id}/invitations/${invitation.userEmail}`)
      .then(() => {
        toast.success(t('invitation-cancelled-success'))
        setTimeout(() => router.reload(), 1000)
      })
      .catch(error => console.error(error))
  }

  return (
    <Card width='sm'
          mt={8}>
      <CardBody>
        <Stack mt='6' spacing='3'>
          <Text fontSize='md' fontWeight={'600'}>{invitation.vault.name}</Text>
          <Text color={'dimgray'}>
              {t('invitation-card.created-by').replace("%username%", username?.username ?? "Unknown")}
          </Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter justifyContent={'end'}
                  gap={2}>
        <Button backgroundColor={theme.primaryColor}
                color={theme.textColor}
                onClick={handleJoin}>
            {t('invitation-card.join')}
        </Button>
        <Button backgroundColor={'red.400'}
                color={theme.textColor}
                onClick={handleCancel}>
            {t('invitation-card.cancel')}
        </Button>
      </CardFooter>
    </Card>
  )
}