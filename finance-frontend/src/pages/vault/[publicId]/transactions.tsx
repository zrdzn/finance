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
      { (vault, vaultRole) =>
        <>
          <Head>
            <title>Finance - Transactions</title>
          </Head>
          <Flex justifyContent="center" p={4}>
            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
              gap={4}
              width="full">
              {vaultRole.permissions.includes("TRANSACTION_READ") && (
                <TransactionsCard vault={vault} permissions={vaultRole.permissions} />
              )}
              {vaultRole.permissions.includes("TRANSACTION_READ") && (
                <ExportCard vault={vault} permissions={vaultRole.permissions} />
              )}
            </Grid>
          </Flex>
        </>
      }
    </ProtectedVault>
  );
}