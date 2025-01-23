import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import Head from 'next/head';
import {Card, CardBody, Flex, Grid, Stat, StatHelpText, StatLabel, StatNumber} from "@chakra-ui/react";
import React from "react";
import {useRouter} from "next/router"
import {LastTransactionsCard} from "@/components/transaction/LastTransactionsCard"
import {ProtectedVault} from "@/components/vault/ProtectedVault"
import {AnalyticsSummaryCard} from "@/components/analytics/AnalyticsSummaryCard"
import {GetStaticPropsContext} from "next";
import {useTranslations} from "next-intl";
import {FlowsHistoryCard} from "@/components/analytics/flows/FlowsHistoryCard";
import { AnalyticsChart } from "@/components/analytics/AnalyticsChart";

export default function Dashboard(): ReactJSXElement {
  const router = useRouter()
  const publicId = router.query.publicId
  const t = useTranslations("Overview")

  return (
    <ProtectedVault publicId={publicId}>
      { (vault, vaultRole) =>
        <>
          <Head>
            <title>{t('title').replace("%vault_name%", vault.name)}</title>
          </Head>
          <Flex justifyContent="center"
                flexDirection={'column'}
                p={4}>
            <Grid
              templateColumns={{ base: '1fr' }}
              gap={4}
              width="full">
              <LastTransactionsCard vault={vault} permissions={vaultRole.permissions} />
            </Grid>
            <Grid
                templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
                gap={4}
                width="full">
              <AnalyticsSummaryCard vault={vault} permissions={vaultRole.permissions} statisticType={"BALANCE"} />
              <AnalyticsSummaryCard vault={vault} permissions={vaultRole.permissions} statisticType={"INCOME"} />
              <AnalyticsSummaryCard vault={vault} permissions={vaultRole.permissions} statisticType={"EXPENSES"} />
            </Grid>
            <Grid
                templateColumns={{ base: '1fr' }}
                gap={4}
                width="full">
              <AnalyticsChart vault={vault} permissions={vaultRole.permissions} />
            </Grid>
            <Grid
                templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
                gap={4}
                width="full">
              <FlowsHistoryCard vault={vault} transactionType={'INCOMING'} flowsRange={"DAY"} />
              <FlowsHistoryCard vault={vault} transactionType={'INCOMING'} flowsRange={"WEEK"} />
              <FlowsHistoryCard vault={vault} transactionType={'INCOMING'} flowsRange={"MONTH"} />
              <FlowsHistoryCard vault={vault} transactionType={'INCOMING'} flowsRange={"YEAR"} />
            </Grid>
            <Grid
                templateColumns={{ base: '1fr' }}
                gap={4}
                width="full">
              <AnalyticsChart vault={vault} permissions={vaultRole.permissions} transactionType={'INCOMING'} />
            </Grid>
            <Grid
                templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
                gap={4}
                width="full">
              <FlowsHistoryCard vault={vault} transactionType={'OUTGOING'} flowsRange={"DAY"} />
              <FlowsHistoryCard vault={vault} transactionType={'OUTGOING'} flowsRange={"WEEK"} />
              <FlowsHistoryCard vault={vault} transactionType={'OUTGOING'} flowsRange={"MONTH"} />
              <FlowsHistoryCard vault={vault} transactionType={'OUTGOING'} flowsRange={"YEAR"} />
            </Grid>
            <Grid
                templateColumns={{ base: '1fr' }}
                gap={4}
                width="full">
              <AnalyticsChart vault={vault} permissions={vaultRole.permissions} transactionType={'OUTGOING'} />
            </Grid>
          </Flex>
        </>
      }
    </ProtectedVault>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`../../../locales/${context.locale}.json`)).default
    }
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking'
  }
}