import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import Head from 'next/head';
import {Flex} from "@chakra-ui/react";
import React from "react";
import {ProtectedVault} from "@/components/vault/ProtectedVault"
import {useRouter} from "next/router"
import {AuditTable} from "@/components/audit/AuditTable"

export default function Audits(): ReactJSXElement {
  const router = useRouter()
  const publicId = router.query.publicId

  return (
    <ProtectedVault publicId={publicId}>
      { (vault, vaultRole) =>
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
              {vaultRole.permissions.includes("AUDIT_READ") && (
                <AuditTable vault={vault} permissions={vaultRole.permissions} />
              )}
            </Flex>
          </Flex>
        </>
      }
    </ProtectedVault>
  );
}