import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import Head from 'next/head';
import {Flex, Grid} from "@chakra-ui/react";
import React from "react";
import {ProtectedVault} from "@/components/vault/ProtectedVault"
import {useRouter} from "next/router"
import {AnalyticsSummaryCard} from "@/components/analytics/AnalyticsSummaryCard"
import {FlowsHistoryCard} from "@/components/analytics/flows/FlowsHistoryCard"
import {GetStaticPropsContext} from "next";
import {useTranslations} from "next-intl";

export default function Statistics(): ReactJSXElement {
  const router = useRouter()
  const publicId = router.query.publicId
  const t = useTranslations("Statistics")

  return (
    <ProtectedVault publicId={publicId}>
      { (vault, vaultRole) =>
        <>
          <Head>
            <title>{t('title')}</title>
          </Head>
          <Flex justifyContent="center" p={4}>
            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
              gap={4}
              width="full">
              <AnalyticsSummaryCard vault={vault} permissions={vaultRole.permissions} />
              <FlowsHistoryCard vault={vault} transactionType={'INCOMING'} flowsRange={"DAY"} />
              <FlowsHistoryCard vault={vault} transactionType={'INCOMING'} flowsRange={"WEEK"} />
              <FlowsHistoryCard vault={vault} transactionType={'INCOMING'} flowsRange={"MONTH"} />
              <FlowsHistoryCard vault={vault} transactionType={'INCOMING'} flowsRange={"YEAR"} />
              <FlowsHistoryCard vault={vault} transactionType={'OUTGOING'} flowsRange={"DAY"} />
              <FlowsHistoryCard vault={vault} transactionType={'OUTGOING'} flowsRange={"WEEK"} />
              <FlowsHistoryCard vault={vault} transactionType={'OUTGOING'} flowsRange={"MONTH"} />
              <FlowsHistoryCard vault={vault} transactionType={'OUTGOING'} flowsRange={"YEAR"} />
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