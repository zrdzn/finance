import React, {useEffect, useState,} from "react"
import {VaultSidebar} from "@/components/vault/VaultSidebar"
import {Layout} from "@/components/Layout"
import {useAuthentication} from "@/hooks/useAuthentication"
import {useRouter} from "next/router"
import {useVault} from "@/hooks/useVault"
import {useApi} from "@/hooks/useApi"
import {Box} from "@chakra-ui/react"
import {useTranslations} from "next-intl";
import {Components} from "@/api/api";

type VaultResponse = Components.Schemas.VaultResponse;
type VaultRoleResponse = Components.Schemas.VaultRoleResponse;

interface ProtectedVaultProperties {
  publicId: string | string[] | undefined
  children: (vault: VaultResponse, vaultRole: VaultRoleResponse) => React.ReactNode
}

export const ProtectedVault = ({ children, publicId }: ProtectedVaultProperties) => {
  const router = useRouter();
  const api = useApi();
  const { details } = useAuthentication();
  const vault = useVault({ publicId });
  const t = useTranslations("Overview")
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
    if (details === null) {
      router.push("/login").catch((error) => console.error(error));
    }
  }, [details, router]);

  useEffect(() => {
    if (vault && details) {
      api
          .then(client => client.getVaultRole({ vaultId: vault.id })
              .then(response => setVaultRole(response.data)))
            .catch(error => console.error(error))
    }
  }, [api, details, vault]);

  useEffect(() => {
    if (typeof window !== 'undefined' && isCollapsed !== undefined) {
      localStorage.setItem('sidebar-collapsed', isCollapsed.toString());
    }
  }, [isCollapsed]);

  if (vault === undefined) {
    return <>{t('vault-loading')}</>;
  }

  if (vault === null) {
    return <>{t('vault-not-found')}</>;
  }

  if (details === null || vaultRole === undefined) {
    return <>{t('not-authenticated')}</>;
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