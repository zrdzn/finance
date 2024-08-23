import React, {useEffect, useState,} from "react"
import {VaultSidebar} from "@/components/vault/VaultSidebar"
import {Layout} from "@/components/Layout"
import {useAuthentication} from "@/hooks/authentication"
import {useRouter} from "next/router"
import {useVault} from "@/hooks/vaultAccessor"
import {VaultResponse} from "@/components/api"
import {useApi} from "@/hooks/apiClient"

interface ProtectedVaultProperties {
  publicId: string | string[] | undefined
  children: (vault: VaultResponse, permissions: string[]) => React.ReactNode
}

export const ProtectedVault = ({ children, publicId }: ProtectedVaultProperties) => {
  const router = useRouter()
  const api = useApi()
  const { authenticationDetails } = useAuthentication()
  const vault = useVault({ publicId })
  const [permissions, setPermissions] = useState<string[]>([])

  useEffect(() => {
    if (authenticationDetails === null) {
      router.push("/login")
        .catch((error) => console.error(error))
    }
  }, [authenticationDetails, router]);

  useEffect(() => {
    if (vault && authenticationDetails) {
      api.get(`/vaults/${vault.id}/permissions`)
        .then((response) => {
          setPermissions(response.data.vaultPermissions)
          console.info("Available permissions: ", response.data.vaultPermissions)
        })
        .catch((error) => console.error(error))
    }
  }, [api, authenticationDetails, vault]);

  if (vault === undefined) {
    return <>Loading vault...</>
  }

  if (vault === null) {
    return <>Vault not found</>
  }

  if (authenticationDetails === null || permissions === undefined) {
    return <>You must be authenticated</>
  }

  return (
    <Layout>
      <VaultSidebar vault={vault} />
      {children(vault, permissions)}
    </Layout>
  );
}