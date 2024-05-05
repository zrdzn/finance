import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import Head from 'next/head';
import {
  Flex
} from "@chakra-ui/react";
import React from "react";
import {useRouter} from "next/router"
import {ProtectedVault} from "@/components/vault/ProtectedVault"
import {HistoryPaymentsCard} from "@/components/payment/HistoryPaymentsCard"

export default function History(): ReactJSXElement {
  const router = useRouter()
  const publicId = router.query.publicId

  return (
    <ProtectedVault publicId={publicId}>
      { vault =>
        <>
          <Head>
            <title>Finance - History</title>
          </Head>
          <Flex justifyContent={'center'}>
            <Flex direction={'column'} width={'full'} justifyContent={'center'}>
              <HistoryPaymentsCard vault={vault} />
            </Flex>
          </Flex>
        </>
      }
    </ProtectedVault>
  );
}