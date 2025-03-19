import React, {useEffect, useState,} from "react"
import {VaultSidebar} from "@/components/vault/VaultSidebar"
import {Layout} from "@/components/Layout"
import {useAuthentication} from "@/hooks/useAuthentication"
import {useRouter} from "next/router"
import {useVault} from "@/hooks/useVault"
import {useApi} from "@/hooks/useApi"
import {Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Card, Flex} from "@chakra-ui/react"
import {useTranslations} from "next-intl";
import {Components} from "@/api/api";
import {useTheme} from "@/hooks/useTheme";
import {LoadingSpinner} from "@/components/shared/LoadingSpinner";

type VaultResponse = Components.Schemas.VaultResponse;
type VaultRoleResponse = Components.Schemas.VaultRoleResponse;

interface ProtectedVaultProperties {
  publicId: string | string[] | undefined
  children: (vault: VaultResponse, vaultRole: VaultRoleResponse) => React.ReactNode
}

export const ProtectedVault = ({ children, publicId }: ProtectedVaultProperties) => {
  const router = useRouter();
  const api = useApi();
  const theme = useTheme()
  const { details } = useAuthentication();
  const vault = useVault({ publicId });
  const tBreadcrumb = useTranslations("Breadcrumb")
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
    return <LoadingSpinner />;
  }

  if (vault === null) {
    return <LoadingSpinner />;
  }

  if (details === null || vaultRole === undefined) {
    return <LoadingSpinner />;
  }

  const breadcrumbMapping: Record<string, any> = {
    "/vault": { label: tBreadcrumb("home"), href: `/vault/${vault.publicId}` },
    "/vault/[publicId]/transactions": { label: tBreadcrumb("transactions") },
    "/vault/[publicId]/members": { label: tBreadcrumb("members") },
    "/vault/[publicId]/products": { label: tBreadcrumb("products") },
    "/vault/[publicId]/audits": { label: tBreadcrumb("audits") },
    "/vault/[publicId]/settings": { label: tBreadcrumb("settings") },
  }

  const pathSegments =  router.pathname
    .split("/")
    .filter(part => part !== "")

  const breadcrumbs = (
    <Breadcrumb>
      {pathSegments.map((_, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
        console.log(path)
        const breadcrumb = breadcrumbMapping[path];

        return breadcrumb ? (
          <BreadcrumbItem key={path} isCurrentPage={index === pathSegments.length - 1}>
            <BreadcrumbLink href={breadcrumb.href || "#"}>{breadcrumb.label}</BreadcrumbLink>
          </BreadcrumbItem>
        ) : null;
      })}
    </Breadcrumb>
  );

  return (
    <>
      <VaultSidebar vault={vault} vaultRole={vaultRole} isCollapsed={isCollapsed} toggleCollapse={() => setIsCollapsed(!isCollapsed)} />
      <Box
        ml={{ base: 0, md: isCollapsed ? '80px' : '250px' }}
        transition="margin-left 0.3s"
      >
        <Layout>
          {
            breadcrumbs && (
              <Card
                margin={4}
                boxShadow="base"
                borderRadius="lg"
                overflow="hidden"
                backgroundColor={theme.background.secondary}
                color={theme.text.primary}
                width={'fit-content'}
              >
                <Flex p={2}>
                  {breadcrumbs}
                </Flex>
              </Card>
            )
          }
          {children(vault, vaultRole)}
        </Layout>
      </Box>
    </>
  );
};