import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import Head from 'next/head';
import {Button, Flex, HStack, Link, Text} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {useApi} from "@/hooks/useApi"
import {VaultCard} from "@/components/vault/VaultCard"
import {useTheme} from "@/hooks/useTheme"
import {useRouter} from "next/router"
import {useAuthentication} from "@/hooks/useAuthentication"
import {VaultInvitationCard} from "@/components/vault/VaultInvitationCard"
import { Layout } from "@/components/Layout";
import {GetStaticPropsContext} from "next";
import {useTranslations} from "next-intl";
import {Components} from "@/api/api";

type VaultInvitationResponse = Components.Schemas.VaultInvitationResponse;

interface VaultResponse {
  id: number
  publicId: string
  ownerId: number
  name: string
}

export default function Homepage(): ReactJSXElement {
  const api = useApi()
  const theme = useTheme()
  const [yourVaults, setYourVaults] = useState<VaultResponse[]>([])
  const [vaultInvitations, setVaultInvitations] = useState<VaultInvitationResponse[]>([])
  const router = useRouter();
  const t = useTranslations('Homepage')
  const { details } = useAuthentication()

  useEffect(() => {
    if (!details) {
      router.push("/login")
    }
  }, [details, router]);

  useEffect(() => {
    api
        .then(client => client.getVaults()
            .then(response => {
                setYourVaults(response.data.vaults)
              if (details?.email) {
                return client.getVaultInvitationsByUserEmail(details.email);
              }

              return null
            })
          .then(response => {
            if (response && response.data) {
              setVaultInvitations(response.data.vaultInvitations)
            } else {
              setVaultInvitations([])
            }
          })
        )
        .catch(error => console.error(error))
  }, [api, details]);

  if (!details) {
    return <></>
  }

  return (
    <>
      <Layout>
        <Head>
          <title>{t('title')}</title>
        </Head>
        <Flex direction={'column'}
              gap={16}>
          <Flex justifyContent={'center'}
                alignItems={'center'}
                direction={'column'}
                mt={6}>
            <Text fontSize='xl' fontWeight={'600'}>{t('your-vaults')}</Text>
            {
              yourVaults.length === 0 && <Text fontSize={'lg'}>{t('no-vaults')}</Text>
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
              <Button backgroundColor={theme.secondary}
                      color={'#f8f8f8'}
                      fontWeight={'400'}>
                <Link href={'/vault/setup'}>{t('create-vault')}</Link>
              </Button>
            </HStack>
          </Flex>
          <Flex justifyContent={'center'}
                alignItems={'center'}
                direction={'column'}
                gap={4}
                mt={6}>
            <Text fontSize='xl' fontWeight={'600'}>{t('invitations')}</Text>
            {
              vaultInvitations.length === 0 && <Text fontSize={'lg'}>{t('no-invitations')}</Text>
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

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`../locales/${context.locale}.json`)).default
    }
  }
}
