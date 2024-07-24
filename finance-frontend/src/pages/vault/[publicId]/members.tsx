import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import Head from 'next/head';
import {
  Flex
} from "@chakra-ui/react";
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
      { vault =>
        <>
          <Head>
            <title>Finance - Members</title>
          </Head>
          <Flex justifyContent={'center'}>
            <Flex direction={'column'} width={'full'} justifyContent={'center'}>
              <MembersCard vault={vault} />
              <InvitationsCard vault={vault} />
            </Flex>
          </Flex>
        </>
      }
    </ProtectedVault>
  );
}