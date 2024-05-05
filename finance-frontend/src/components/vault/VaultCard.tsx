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
import {UsernameResponse} from "@/components/api"
import {useRouter} from "next/router"

interface VaultCardProperties {
  publicId: string
  ownerId: number
  name: string
}

export const VaultCard = ({ publicId, ownerId, name }: VaultCardProperties) => {
  const theme = useTheme()
  const api = useApi()
  const router = useRouter()
  const [username, setUsername] = useState<UsernameResponse | undefined>(undefined)

  useEffect(() => {
    api.get(`/users/${ownerId}/username`)
      .then((response) => setUsername({ username: response.data.username }))
      .catch((error) => console.error(error))
  }, [api, ownerId]);

  const handleRedirect = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    router.push(`/vault/${publicId}`)
      .catch((error) => console.error(error))
  }

  return (
    <Card width='sm'
          mt={8}>
      <CardBody>
        <Stack mt='6' spacing='3'>
          <Heading size='md'>{name}</Heading>
          <Text color={'dimgray'}>
            Created by {username?.username || 'Unknown'}
          </Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter justifyContent={'end'}>
        <Button backgroundColor={theme.primaryColor}
                color={theme.textColor}
                onClick={handleRedirect}>
          Go
        </Button>
      </CardFooter>
    </Card>
  )
}