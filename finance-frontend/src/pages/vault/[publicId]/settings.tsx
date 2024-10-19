import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import Head from 'next/head';
import {Flex} from "@chakra-ui/react";
import React from "react";
import {ProtectedVault} from "@/components/vault/ProtectedVault"
import {SettingsCard} from "@/components/settings/SettingsCard"
import {useRouter} from "next/router"

export default function Settings(): ReactJSXElement {
  const router = useRouter()
  const publicId = router.query.publicId

  return (
    <ProtectedVault publicId={publicId}>
      { (vault, vaultRole) =>
        <>
          <Head>
            <title>Finance - Settings</title>
          </Head>
          <Flex justifyContent="center" p={4}>
            <Flex
              direction="column"
              width={{ base: 'full', md: '80%', lg: '60%' }}
              maxWidth="800px"
              justifyContent="center">
              {vaultRole.permissions.includes("SETTINGS_READ") && (
                <SettingsCard vault={vault} permissions={vaultRole.permissions} />
              )}
            </Flex>
          </Flex>
        </>
      }
    </ProtectedVault>
  );
}