import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import Head from 'next/head';
import {
  Flex
} from "@chakra-ui/react";
import React from "react";
import {useRouter} from "next/router"
import {LastPaymentsCard} from "@/components/payment/LastPaymentsCard"
import {ProtectedVault} from "@/components/vault/ProtectedVault"
import {ExpensesCard} from "@/components/analytics/expenses/ExpensesCard"
import {AverageCard} from "@/components/analytics/expenses/average/AverageExpensesCard"

export default function Dashboard(): ReactJSXElement {
  const router = useRouter()
  const publicId = router.query.publicId

  return (
    <ProtectedVault publicId={publicId}>
      { vault =>
        <>
          <Head>
            <title>Finance - Overview ({vault.name})</title>
          </Head>
          <Flex justifyContent={'center'}>
            <Flex direction={'column'}
                  width={'full'}
                  justifyContent={'center'}>
              <LastPaymentsCard vault={vault} />
              <ExpensesCard vault={vault} />
              <AverageCard vault={vault} />
            </Flex>
          </Flex>
        </>
      }
    </ProtectedVault>
  );
}