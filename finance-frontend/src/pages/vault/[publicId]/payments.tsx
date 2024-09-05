import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import Head from 'next/head';
import {
  Flex, Grid
} from "@chakra-ui/react";
import React from "react";
import {useRouter} from "next/router"
import {ProtectedVault} from "@/components/vault/ProtectedVault"
import {PaymentsCard} from "@/components/payment/PaymentsCard"
import {ExportCard} from "@/components/payment/export/ExportCard"

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
            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
              gap={4}
              width="full">
              {permissions.includes("PAYMENT_READ") && (
                <PaymentsCard vault={vault} permissions={permissions} />
              )}
              {permissions.includes("PAYMENT_READ") && (
                <ExportCard vault={vault} permissions={permissions} />
              )}
            </Grid>
          </Flex>
        </>
      }
    </ProtectedVault>
  );
}