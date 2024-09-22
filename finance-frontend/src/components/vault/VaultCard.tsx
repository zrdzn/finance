import {Button, Card, CardBody, CardFooter, Divider, Heading, Stack, Text,} from '@chakra-ui/react'
import React, {useEffect, useState} from "react"
import {useTheme} from "@/hooks/useTheme"
import {useApi} from "@/hooks/useApi"
import {UsernameResponse} from "@/components/api"
import {useRouter} from "next/router"
import toast from "react-hot-toast"

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
      .then(() => toast.success(`Welcome back ${username?.username}!`))
      .catch((error) => console.error(error))
  }

  return (
    <Card width='sm'
          mt={8}>
      <CardBody>
        <Stack mt='6' spacing='3'>
          <Text fontSize='md' fontWeight={'600'}>{name}</Text>
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