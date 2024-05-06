import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import Head from 'next/head';
import {
  Flex
} from "@chakra-ui/react";
import React from "react";
import {useRouter} from "next/router"
import {ProtectedVault} from "@/components/vault/ProtectedVault"
import {PaymentsCard} from "@/components/payment/PaymentsCard"

export default function Payments(): ReactJSXElement {
  const router = useRouter()
  const publicId = router.query.publicId

  return (
    <ProtectedVault publicId={publicId}>
      { vault =>
        <>
          <Head>
            <title>Finance - Payments</title>
          </Head>
          <Flex justifyContent={'center'}>
            <Flex direction={'column'} width={'full'} justifyContent={'center'}>
              <PaymentsCard vault={vault} />
            </Flex>
          </Flex>
        </>
      }
    </ProtectedVault>
  );
}