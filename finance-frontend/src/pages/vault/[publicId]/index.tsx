import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import Head from 'next/head';
import {Flex, Grid} from "@chakra-ui/react";
import React from "react";
import {useRouter} from "next/router"
import {LastPaymentsCard} from "@/components/payment/LastPaymentsCard"
import {ProtectedVault} from "@/components/vault/ProtectedVault"
import {AnalyticsSummaryCard} from "@/components/analytics/AnalyticsSummaryCard"

export default function Dashboard(): ReactJSXElement {
  const router = useRouter()
  const publicId = router.query.publicId

  return (
    <ProtectedVault publicId={publicId}>
      { (vault, permissions) =>
        <>
          <Head>
            <title>Finance - Overview ({vault.name})</title>
          </Head>
          <Flex justifyContent="center"
                p={4}>
            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
              gap={4}
              width="full">
              <LastPaymentsCard vault={vault} permissions={permissions} />
              <AnalyticsSummaryCard vault={vault} permissions={permissions} />
            </Grid>
          </Flex>
        </>
      }
    </ProtectedVault>
  );
}