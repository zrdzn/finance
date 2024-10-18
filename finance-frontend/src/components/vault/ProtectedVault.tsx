import React, {useEffect, useState,} from "react"
import {VaultSidebar} from "@/components/vault/VaultSidebar"
import {Layout} from "@/components/Layout"
import {useAuthentication} from "@/hooks/useAuthentication"
import {useRouter} from "next/router"
import {useVault} from "@/hooks/useVault"
import {VaultResponse} from "@/components/api"
import {useApi} from "@/hooks/useApi"
import {Box} from "@chakra-ui/react"

interface ProtectedVaultProperties {
  publicId: string | string[] | undefined
  children: (vault: VaultResponse, permissions: string[]) => React.ReactNode
}

export const ProtectedVault = ({ children, publicId }: ProtectedVaultProperties) => {
  const router = useRouter();
  const api = useApi();
  const { authenticationDetails } = useAuthentication();
  const vault = useVault({ publicId });
  const [permissions, setPermissions] = useState<string[]>([]);
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
      api.get(`/vaults/${vault.id}/permissions`)
        .then((response) => {
          setPermissions(response.data.vaultPermissions);
          console.info("Available permissions: ", response.data.vaultPermissions);
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

  if (authenticationDetails === null || permissions === undefined) {
    return <>You must be authenticated</>;
  }

  return (
    <>
      <VaultSidebar vault={vault} permissions={permissions} isCollapsed={isCollapsed} toggleCollapse={() => setIsCollapsed(!isCollapsed)} />
      <Box
        ml={{ base: 0, md: isCollapsed ? '80px' : '250px' }}
        transition="margin-left 0.3s"
      >
        <Layout>
          {children(vault, permissions)}
        </Layout>
      </Box>
    </>
  );
};