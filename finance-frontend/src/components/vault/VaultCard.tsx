import {Button, Card, CardBody, CardFooter, Divider, Heading, Stack, Text,} from '@chakra-ui/react'
import React, {useEffect, useState} from "react"
import {useTheme} from "@/hooks/useTheme"
import {useApi} from "@/hooks/useApi"
import {useRouter} from "next/router"
import toast from "react-hot-toast"
import {useTranslations} from "next-intl";
import { Components } from '@/api/api'

type UsernameResponse = Components.Schemas.UsernameResponse;

interface VaultCardProperties {
  publicId: string
  ownerId: number
  name: string
}

export const VaultCard = ({ publicId, ownerId, name }: VaultCardProperties) => {
  const theme = useTheme()
  const api = useApi()
  const t = useTranslations("Overview")
  const router = useRouter()
  const [username, setUsername] = useState<UsernameResponse | undefined>(undefined)

  useEffect(() => {
    api
        .then(client => client.getUsernameByUserId({ userId: ownerId })
            .then(response => setUsername(response.data)))
        .catch(error => console.error(error))
  }, [api, ownerId])

  const handleRedirect = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    router.push(`/vault/${publicId}`)
      .then(() => toast.success(t('welcome').replace("%username%", username?.username ?? "Unknown")))
      .catch((error) => console.error(error))
  }

  return (
    <Card width='sm'
          mt={8}>
      <CardBody>
        <Stack mt='6' spacing='3'>
          <Text fontSize='md' fontWeight={'600'}>{name}</Text>
          <Text color={'dimgray'}>
            {t('vault-card.created-by').replace("%username%", username?.username ?? "Unknown")}
          </Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter justifyContent={'end'}>
        <Button backgroundColor={theme.primaryColor}
                color={'#f8f8f8'} fontWeight={'400'}
                onClick={handleRedirect}>
          {t('vault-card.redirect')}
        </Button>
      </CardFooter>
    </Card>
  )
}
