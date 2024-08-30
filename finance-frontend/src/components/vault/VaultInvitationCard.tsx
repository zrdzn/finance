import {
  Button,
  Card,
  CardBody,
  Stack,
  Heading,
  Divider,
  CardFooter, Text,
} from '@chakra-ui/react'
import React, {useEffect, useState} from "react"
import {useTheme} from "@/hooks/theme"
import {useApi} from "@/hooks/apiClient"
import {UsernameResponse, VaultInvitationResponse, VaultResponse} from "@/components/api"
import {useRouter} from "next/router"
import toast from "react-hot-toast"

interface VaultInvitationCardProperties {
  invitation: VaultInvitationResponse
}

export const VaultInvitationCard = ({ invitation }: VaultInvitationCardProperties) => {
  const theme = useTheme()
  const api = useApi()
  const router = useRouter()
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
        toast.success(`Welcome to ${invitation.vault.name}!`)
        setTimeout(() => router.push(`/vault/${invitation.vault.publicId}`), 1000)
      })
      .catch((error) => console.error(error))
  }

  const handleCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api.delete(`/vaults/${invitation.vault.id}/invitations/${invitation.userEmail}`)
      .then(() => {
        toast.success(`Invitation cancelled`)
        setTimeout(() => router.reload(), 1000)
      })
      .catch(error => console.error(error))
  }

  return (
    <Card width='sm'
          mt={8}>
      <CardBody>
        <Stack mt='6' spacing='3'>
          <Heading size='md'>{invitation.vault.name}</Heading>
          <Text color={'dimgray'}>
            Created by {username?.username || 'Unknown'}
          </Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter justifyContent={'end'}
                  gap={2}>
        <Button backgroundColor={theme.primaryColor}
                color={theme.textColor}
                onClick={handleJoin}>
          Join
        </Button>
        <Button backgroundColor={'red.400'}
                color={theme.textColor}
                onClick={handleCancel}>
          Cancel
        </Button>
      </CardFooter>
    </Card>
  )
}