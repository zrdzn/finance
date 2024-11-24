import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import Head from 'next/head';
import {Flex, Grid} from "@chakra-ui/react";
import React from "react";
import {useRouter} from "next/router"
import {ProtectedVault} from "@/components/vault/ProtectedVault"
import {TransactionsCard} from "@/components/transaction/TransactionsCard"
import {ExportCard} from "@/components/transaction/export/ExportCard"
import {GetStaticPropsContext} from "next";
import {useTranslations} from "next-intl";
import {SchedulesCard} from "@/components/transaction/schedule/SchedulesCard";

export default function Transactions(): ReactJSXElement {
  const router = useRouter()
  const publicId = router.query.publicId
  const t = useTranslations("Transactions")

  return (
    <ProtectedVault publicId={publicId}>
      { (vault, vaultRole) =>
        <>
          <Head>
            <title>{t('title')}</title>
          </Head>
          <Flex justifyContent="center" p={4}>
            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
              gap={4}
              width="full">
              {vaultRole.permissions.includes("SCHEDULE_READ") && (
                  <SchedulesCard vault={vault} permissions={vaultRole.permissions} />
              )}
              {vaultRole.permissions.includes("TRANSACTION_READ") && (
                  <ExportCard vault={vault} permissions={vaultRole.permissions} />
              )}
              {vaultRole.permissions.includes("TRANSACTION_READ") && (
                <TransactionsCard vault={vault} permissions={vaultRole.permissions} />
              )}
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