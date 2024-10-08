import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import Head from 'next/head';
import {Button, Flex, Heading, HStack, Link, Text} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {useApi} from "@/hooks/useApi"
import {VaultCard} from "@/components/vault/VaultCard"
import {useTheme} from "@/hooks/useTheme"
import {useRouter} from "next/router"
import {useAuthentication} from "@/hooks/useAuthentication"
import {VaultInvitationCard} from "@/components/vault/VaultInvitationCard"
import {VaultInvitationResponse} from "@/components/api"
import { Layout } from "@/components/Layout";

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
      <Layout>
        <Head>
          <title>Finance - Manage Vaults</title>
        </Head>
        <Flex direction={'column'}
              gap={16}>
          <Flex justifyContent={'center'}
                alignItems={'center'}
                direction={'column'}
                mt={6}>
            <Text fontSize='xl' fontWeight={'600'}>Your vaults</Text>
            {
              yourVaults.length === 0 && <Text fontSize={'lg'}>You aren&apos;t added to any vault!</Text>
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
            <Text fontSize='xl' fontWeight={'600'}>Invitations</Text>
            {
              vaultInvitations.length === 0 && <Text fontSize={'lg'}>You don&apos;t have any invitations!</Text>
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
      </Layout>
    </>
  )
}