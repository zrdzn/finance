import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import Head from 'next/head';
import {Flex, Grid} from "@chakra-ui/react";
import React from "react";
import {useRouter} from "next/router"
import {ProtectedVault} from "@/components/vault/ProtectedVault"
import {TransactionsCard} from "@/components/transaction/TransactionsCard"
import {ExportCard} from "@/components/transaction/export/ExportCard"

export default function Transactions(): ReactJSXElement {
  const router = useRouter()
  const publicId = router.query.publicId

  return (
    <ProtectedVault publicId={publicId}>
      { (vault, permissions) =>
        <>
          <Head>
            <title>Finance - Transactions</title>
          </Head>
          <Flex justifyContent="center" p={4}>
            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
              gap={4}
              width="full">
              {permissions.includes("TRANSACTION_READ") && (
                <TransactionsCard vault={vault} permissions={permissions} />
              )}
              {permissions.includes("TRANSACTION_READ") && (
                <ExportCard vault={vault} permissions={permissions} />
              )}
            </Grid>
          </Flex>
        </>
      }
    </ProtectedVault>
  );
}