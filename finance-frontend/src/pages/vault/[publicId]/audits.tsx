import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import Head from 'next/head';
import {
  Flex, Heading, Table, Tbody, Td, Th, Thead, Tr
} from "@chakra-ui/react";
import React, {useEffect} from "react";
import {ProtectedVault} from "@/components/vault/ProtectedVault"
import {PaymentsCard} from "@/components/payment/PaymentsCard"
import {SettingsCard} from "@/components/settings/SettingsCard"
import {useRouter} from "next/router"
import {useApi} from "@/hooks/useApi"
import {AuditTable} from "@/components/audit/AuditTable"

export default function Audits(): ReactJSXElement {
  const router = useRouter()
  const publicId = router.query.publicId

  return (
    <ProtectedVault publicId={publicId}>
      { (vault, permissions) =>
        <>
          <Head>
            <title>Finance - Audit Logs</title>
          </Head>
          <Flex justifyContent="center" p={4}>
            <Flex
              direction="column"
              width={{ base: 'full', md: '80%', lg: '60%' }}
              maxWidth={'1400px'}
              minWidth={{ xl: '1200px' }}
              justifyContent="center">
              {permissions.includes("AUDIT_READ") && (
                <AuditTable vault={vault} permissions={permissions} />
              )}
            </Flex>
          </Flex>
        </>
      }
    </ProtectedVault>
  );
}