import React, { useEffect, } from "react"
import {VaultSidebar} from "@/components/vault/VaultSidebar"
import {Layout} from "@/components/Layout"
import {useAuthentication} from "@/hooks/authentication"
import {useRouter} from "next/router"
import {useVault} from "@/hooks/vaultAccessor"
import {VaultResponse} from "@/components/api"

interface ProtectedVaultProperties {
  publicId: string | string[] | undefined
  children: (vault: VaultResponse) => React.ReactNode
}

export const ProtectedVault = ({ children, publicId }: ProtectedVaultProperties) => {
  const router = useRouter()
  const { authenticationDetails } = useAuthentication()
  const vault = useVault({ publicId })

  useEffect(() => {
    if (authenticationDetails === null) {
      router.push("/login")
        .catch((error) => console.error(error))
    }
  }, [authenticationDetails, router]);

  if (vault === undefined) {
    return <>Loading vault...</>
  }

  if (vault === null) {
    return <>Vault not found</>
  }

  if (authenticationDetails === null) {
    return <>You must be authenticated</>
  }

  return (
    <Layout>
      <VaultSidebar vault={vault} />
      {children(vault)}
    </Layout>
  );
}