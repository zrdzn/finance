import React, {useEffect, useState,} from "react"
import {VaultSidebar} from "@/components/vault/VaultSidebar"
import {Layout} from "@/components/Layout"
import {useAuthentication} from "@/hooks/useAuthentication"
import {useRouter} from "next/router"
import {useVault} from "@/hooks/useVault"
import {VaultResponse, VaultRoleResponse} from "@/components/api"
import {useApi} from "@/hooks/useApi"
import {Box} from "@chakra-ui/react"

interface ProtectedVaultProperties {
  publicId: string | string[] | undefined
  children: (vault: VaultResponse, vaultRole: VaultRoleResponse) => React.ReactNode
}

export const ProtectedVault = ({ children, publicId }: ProtectedVaultProperties) => {
  const router = useRouter();
  const api = useApi();
  const { authenticationDetails } = useAuthentication();
  const vault = useVault({ publicId });
  const [vaultRole, setVaultRole] = useState<VaultRoleResponse>();
  const [isCollapsed, setIsCollapsed] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('sidebar-collapsed')
      if (savedState !== null) {
        setIsCollapsed(savedState === 'true')
      } else {
        setIsCollapsed(false)
      }
    }
  }, []);

  useEffect(() => {
    if (authenticationDetails === null) {
      router.push("/login").catch((error) => console.error(error));
    }
  }, [authenticationDetails, router]);

  useEffect(() => {
    if (vault && authenticationDetails) {
      api.get(`/vaults/${vault.id}/role`)
        .then((response) => {
          setVaultRole(response.data);
        })
        .catch((error) => console.error(error));
    }
  }, [api, authenticationDetails, vault]);

  useEffect(() => {
    if (typeof window !== 'undefined' && isCollapsed !== undefined) {
      localStorage.setItem('sidebar-collapsed', isCollapsed.toString());
    }
  }, [isCollapsed]);

  if (vault === undefined) {
    return <>Loading vault...</>;
  }

  if (vault === null) {
    return <>Vault not found</>;
  }

  if (authenticationDetails === null || vaultRole === undefined) {
    return <>You must be authenticated</>;
  }

  return (
    <>
      <VaultSidebar vault={vault} vaultRole={vaultRole} isCollapsed={isCollapsed} toggleCollapse={() => setIsCollapsed(!isCollapsed)} />
      <Box
        ml={{ base: 0, md: isCollapsed ? '80px' : '250px' }}
        transition="margin-left 0.3s"
      >
        <Layout>
          {children(vault, vaultRole)}
        </Layout>
      </Box>
    </>
  );
};