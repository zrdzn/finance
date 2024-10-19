import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import Head from 'next/head';
import {Flex, Grid} from "@chakra-ui/react";
import React from "react";
import {ProtectedVault} from "@/components/vault/ProtectedVault"
import {useRouter} from "next/router"
import {AnalyticsSummaryCard} from "@/components/analytics/AnalyticsSummaryCard"
import {FlowsHistoryCard} from "@/components/analytics/flows/FlowsHistoryCard"
import {TransactionType} from "@/components/api"

export default function Statistics(): ReactJSXElement {
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
            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
              gap={4}
              width="full">
              <AnalyticsSummaryCard vault={vault} permissions={vaultRole.permissions} />
              <FlowsHistoryCard vault={vault} transactionType={TransactionType.Incoming} />
              <FlowsHistoryCard vault={vault} transactionType={TransactionType.Outgoing} />
            </Grid>
          </Flex>
        </>
      }
    </ProtectedVault>
  );
}