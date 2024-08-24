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
      { (vault, permissions) =>
        <>
          <Head>
            <title>Finance - Payments</title>
          </Head>
          <Flex justifyContent="center" p={4}>
            <Flex
              direction="column"
              width={{ base: 'full', md: '80%', lg: '60%' }}
              maxWidth="800px"
              justifyContent="center">
              {permissions.includes("PAYMENT_READ") && (
                <PaymentsCard vault={vault} permissions={permissions} />
              )}
            </Flex>
          </Flex>
        </>
      }
    </ProtectedVault>
  );
}