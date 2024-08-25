import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import {Layout} from "@/components/Layout";
import Head from 'next/head';
import {
  Button,
  Flex, Heading, HStack, Link, Text
} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {useApi} from "@/hooks/apiClient"
import {VaultCard} from "@/components/vault/VaultCard"
import {useTheme} from "@/hooks/theme"
import {useRouter} from "next/router"
import {useAuthentication} from "@/hooks/authentication"
import {VaultInvitationCard} from "@/components/vault/VaultInvitationCard"
import {VaultInvitationResponse} from "@/components/api"

interface VaultResponse {
  id: number
  publicId: string
  ownerId: number
  name: string
}

export default function Main(): ReactJSXElement {
  const api = useApi()
  const theme = useTheme()
  const [yourVaults, setYourVaults] = useState<VaultResponse[]>([])
  const [vaultInvitations, setVaultInvitations] = useState<VaultInvitationResponse[]>([])
  const router = useRouter();
  const { authenticationDetails } = useAuthentication()

  useEffect(() => {
    if (!authenticationDetails) {
      router.push("/login")
    }
  }, [authenticationDetails, router]);

  useEffect(() => {
    api.get('/vaults')
      .then(response => {
        setYourVaults(response.data.vaults)
        return api.get(`/vaults/invitations/${authenticationDetails?.email}`)
      })
      .then(response => setVaultInvitations(response.data.vaultInvitations))
      .catch((error) => console.error(error))
  }, [api, authenticationDetails]);

  if (!authenticationDetails) {
    return <></>
  }

  return (
    <>
      <Head>
        <title>Finance - Manage Vaults</title>
      </Head>
      <Flex direction={'column'}
            gap={16}>
        <Flex justifyContent={'center'}
              alignItems={'center'}
              direction={'column'}
              mt={6}>
          <Heading size={'lg'}>Your vaults</Heading>
          {
            yourVaults.length === 0 && <Text fontSize={'lg'}>You are not in any vault</Text>
          }
          {
            yourVaults &&
              <>
                  <Flex wrap={"wrap"}
                        columnGap={4}
                        justifyContent={'center'}>
                    {yourVaults.map((vault) =>
                      <VaultCard key={vault.id} publicId={vault.publicId} ownerId={vault.ownerId} name={vault.name} />
                    )}
                  </Flex>
              </>
          }
          <HStack mt={8}>
            <Button backgroundColor={theme.primaryColor}
                    color={theme.textColor}>
              <Link href={'/vault/setup'}>Create new</Link>
            </Button>
          </HStack>
        </Flex>
        <Flex justifyContent={'center'}
              alignItems={'center'}
              direction={'column'}
              gap={4}
              mt={6}>
          <Heading size={'lg'}>Invitations</Heading>
          {
            vaultInvitations.length === 0 && <Text fontSize={'lg'}>You do not have any invitations</Text>
          }
          {
            vaultInvitations &&
              <>
                  <Flex wrap={"wrap"}
                        columnGap={4}
                        justifyContent={'center'}>
                    {vaultInvitations.map((invitation) =>
                      <VaultInvitationCard key={invitation.id} invitation={invitation} />
                    )}
                  </Flex>
              </>
          }
        </Flex>
      </Flex>
    </>
  )
}