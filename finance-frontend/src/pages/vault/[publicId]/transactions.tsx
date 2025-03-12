import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import Head from 'next/head';
import {Flex, Grid} from "@chakra-ui/react";
import React from "react";
import {useRouter} from "next/router"
import {ProtectedVault} from "@/components/vault/ProtectedVault"
import {TransactionsCard} from "@/components/transaction/TransactionsCard"
import {CsvExport} from "@/components/transaction/export/CsvExport"
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
          <Flex justifyContent="center" alignItems={'center'} p={4} direction={'column'}>
            <Flex width={'full'}>
              {vaultRole.permissions.includes("TRANSACTION_READ") && (
                  <TransactionsCard vault={vault} permissions={vaultRole.permissions} />
              )}
            </Flex>
            <Flex width={'full'}>
              {vaultRole.permissions.includes("SCHEDULE_READ") && (
                  <SchedulesCard vault={vault} permissions={vaultRole.permissions} />
              )}
            </Flex>
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