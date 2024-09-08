import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import Head from 'next/head';
import {
  Flex, Grid
} from "@chakra-ui/react";
import React from "react";
import {ProtectedVault} from "@/components/vault/ProtectedVault"
import {PaymentsCard} from "@/components/payment/PaymentsCard"
import {SettingsCard} from "@/components/settings/SettingsCard"
import {useRouter} from "next/router"
import {LastPaymentsCard} from "@/components/payment/LastPaymentsCard"
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