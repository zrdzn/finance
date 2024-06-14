import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import {Layout} from "@/components/Layout";
import Head from 'next/head';
import {
  Button,
  Flex, Heading, HStack, Link
} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {useApi} from "@/hooks/apiClient"
import {VaultCard} from "@/components/vault/VaultCard"
import {useTheme} from "@/hooks/theme"
import {useRouter} from "next/router"
import {useAuthentication} from "@/hooks/authentication"

interface VaultResponse {
  id: number
  publicId: string
  ownerId: number
  name: string
}

export default function Main(): ReactJSXElement {
  const api = useApi()
  const theme = useTheme()
  const [vaults, setVaults] = useState<VaultResponse[]>([])
  const router = useRouter();
  const { authenticationDetails } = useAuthentication()

  useEffect(() => {
    api.get('/vaults')
      .then((response) => setVaults(response.data.vaults))
      .catch((error) => console.error(error))
  }, [api]);

  useEffect(() => {
    if (!authenticationDetails) {
      router.push("/login")
    }
  }, [authenticationDetails, router]);

  if (!authenticationDetails) {
    return <></>
  }

  return (
    <Layout>
      <Head>
        <title>Finance - Manage Vaults</title>
      </Head>
      <Flex justifyContent={'center'}
            alignItems={'center'}
            direction={'column'}
            mt={6}>
        {
          vaults.length === 0 && <Heading size={'lg'}>No vaults found</Heading>
        }
        {
          vaults && <Heading size={'lg'}>Browse your vaults</Heading> && vaults.map((vault) =>
              <>
                <VaultCard key={vault.id} publicId={vault.publicId} ownerId={vault.ownerId} name={vault.name} />
              </>
          )
        }
        <HStack mt={8}>
          <Button backgroundColor={theme.primaryColor}
                  color={theme.textColor}>
            <Link href={'/vault/setup'}>Create new</Link>
          </Button>
          <Button backgroundColor={theme.secondaryColor}
                  isDisabled
                  color={theme.textColor}>Join existing</Button>
        </HStack>
      </Flex>
    </Layout>
  );
}