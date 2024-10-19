import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import Head from 'next/head';
import {Flex, Grid} from "@chakra-ui/react";
import React from "react";
import {useRouter} from "next/router"
import {ProtectedVault} from "@/components/vault/ProtectedVault"
import {MembersCard} from "@/components/member/MembersCard"
import {InvitationsCard} from "@/components/member/invitation/InvitationsCard"

export default function Members(): ReactJSXElement {
  const router = useRouter()
  const publicId = router.query.publicId

  return (
    <ProtectedVault publicId={publicId}>
      { (vault, vaultRole) =>
        <>
          <Head>
            <title>Finance - Members</title>
          </Head>
          <Flex justifyContent="center" p={4}>
            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
              gap={4}
              width="full">
              {vaultRole.permissions.includes("MEMBER_READ") && (
                <MembersCard vault={vault} vaultRole={vaultRole} />
              )}
              {vaultRole.permissions.includes("MEMBER_INVITE_READ") && (
                <InvitationsCard vault={vault} permissions={vaultRole.permissions} />
              )}
            </Grid>
          </Flex>
        </>
      }
    </ProtectedVault>
  );
}