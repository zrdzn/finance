import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import Head from 'next/head';
import {Grid} from "@chakra-ui/react";
import React from "react";
import {ProtectedVault} from "@/components/vault/ProtectedVault"
import {useRouter} from "next/router"
import {ExpensesCard} from "@/components/analytics/expenses/ExpensesCard"
import {AverageCard} from "@/components/analytics/expenses/average/AverageExpensesCard"
import {AnalyticsSummaryCard} from "@/components/analytics/AnalyticsSummaryCard"

export default function Statistics(): ReactJSXElement {
  const router = useRouter()
  const publicId = router.query.publicId

  return (
    <ProtectedVault publicId={publicId}>
      { (vault, permissions) =>
        <>
          <Head>
            <title>Finance - Settings</title>
          </Head>
          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
            gap={4}
            width="full">
            <AnalyticsSummaryCard vault={vault} permissions={permissions} />
            <ExpensesCard vault={vault} />
            <AverageCard vault={vault} />
          </Grid>
        </>
      }
    </ProtectedVault>
  );
}