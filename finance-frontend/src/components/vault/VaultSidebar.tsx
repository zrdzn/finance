import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Link,
  Text,
  useDisclosure,
  useMediaQuery
} from "@chakra-ui/react";
import {ReactJSXElement} from "@emotion/react/types/jsx-namespace"
import {useTheme} from "@/hooks/useTheme"
import React from "react"
import {FaAngleLeft, FaAngleRight, FaBars, FaBook, FaHistory, FaTags, FaUser} from "react-icons/fa"
import {FaCalendarDays, FaChartSimple, FaGears, FaHouse, FaX} from "react-icons/fa6"
import {useRouter} from "next/router"
import {useTranslations} from "next-intl";
import {Components} from "@/api/api";

type VaultResponse = Components.Schemas.VaultResponse;
type VaultRoleResponse = Components.Schemas.VaultRoleResponse;

interface VaultSidebarProperties {
  vault: VaultResponse;
  vaultRole: VaultRoleResponse;
  isCollapsed?: boolean;
  toggleCollapse?: () => void;
}

const SidebarLogo = ({ vault, isCollapsed }: { vault: VaultResponse, isCollapsed?: boolean }) => (
  <Flex
    textTransform="uppercase"
    fontWeight="semibold"
    letterSpacing="wider"
    fontSize="xl"
    textAlign="center"
    justifyContent={isCollapsed ? 'center' : 'flex-start'}
  >

    <Link href={`/vault/${vault.publicId}`}>
      {!isCollapsed && <Text>{vault.name}</Text>}
    </Link>
  </Flex>
);

const GetAvailableEndpoints = (vault: VaultResponse, permissions: string[]) => {
  const t = useTranslations("VaultSidebar")

  const navItems = [
    { href: `/vault/${vault.publicId}`, icon: FaHouse, label: t('overview') },
    { href: `/vault/${vault.publicId}/transactions`, icon: FaBook, label: t('transactions'), requireAtLeast: ['TRANSACTION_READ', 'SCHEDULE_READ'] },
    { href: `/vault/${vault.publicId}/products`, icon: FaTags, label: t('products'), requireAtLeast: ['PRODUCT_READ', 'CATEGORY_READ'] },
    { href: `/vault/${vault.publicId}/statistics`, icon: FaChartSimple, label: t('statistics') },
    { href: `/vault/${vault.publicId}/members`, icon: FaUser, label: t('members'), requireAtLeast: ['MEMBER_READ', 'MEMBER_INVITE_READ'] },
    { href: `/vault/${vault.publicId}/audits`, icon: FaHistory, label: t('audits'), requireAtLeast: ['AUDIT_READ'] },
    { href: `/vault/${vault.publicId}/settings`, icon: FaGears, label: t('settings'), requireAtLeast: ['SETTINGS_READ'] }
  ]

  return navItems.filter(({ requireAtLeast }) => {
    return !requireAtLeast || requireAtLeast.some(permission => permissions.includes(permission));
  })
}

const BaseView = ({ vault, vaultRole }: VaultSidebarProperties) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const theme = useTheme();
  const router = useRouter();

  return (
    <>
      <Button
        position="fixed"
        bottom="20px"
        right="20px"
        zIndex={1}
        onClick={onOpen}
        variant="unstyled"
        aria-label="Open Menu"
        width={12}
        height={12}
        backgroundColor={theme.primaryColor}
        color={'#f8f8f8'} fontWeight={'400'}
        borderRadius="full"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <FaBars />
      </Button>

      <Drawer placement={'left'} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent color={theme.textColor}>
          <DrawerHeader backgroundColor={theme.primaryColor}>
            <Flex justifyContent={'space-between'} width={'full'} alignItems={'center'}>
              <SidebarLogo vault={vault} isCollapsed={false} />
              <Button backgroundColor={theme.primaryColor} padding={3.5} variant={'unstyled'} onClick={onClose} leftIcon={<FaX />} color={'#f8f8f8'} fontWeight={'400'} />
            </Flex>
          </DrawerHeader>
          <DrawerBody padding={0}>
            <Flex direction={'column'} mt={5}>
              {GetAvailableEndpoints(vault, vaultRole.permissions).map(({ href, icon: Icon, label }) => (
                  <Flex key={href} width={'full'} marginY={3}>
                    <Link href={href} style={{ width: 'inherit' }}>
                      <Button
                          backgroundColor={router.asPath === href ? theme.secondaryColor : theme.backgroundColor}
                          onClick={() => router.push(href)}
                          width={'full'}
                          borderRadius={0}
                      >
                        <Flex alignItems={'center'} width={'full'} columnGap={2}>
                          <Icon />
                          <Box>{label}</Box>
                        </Flex>
                      </Button>
                    </Link>
                  </Flex>
              ))}
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

const DesktopView = (
  {
    vault, vaultRole, isCollapsed = false, toggleCollapse,
  }: VaultSidebarProperties
) => {
  const theme = useTheme();
  const router = useRouter()

  return (
    <Flex
      direction="column"
      position="fixed"
      top="0"
      left="0"
      height="100vh"
      width={isCollapsed ? "80px" : "250px"}
      color={theme.textColor}
      transition="width 0.3s"
      zIndex="1000"
      boxShadow="4px 0 8px rgba(0, 0, 0, 0.1)"
    >
      <Flex
        justifyContent="center"
        alignItems="center"
        padding="4"
        height="64px"
        backgroundColor={theme.primaryColor}
        borderBottom={`1px solid ${theme.secondaryColor}`}
      >
        { isCollapsed && <Button variant="unstyled" onClick={toggleCollapse} leftIcon={<FaAngleRight />} /> }
        { !isCollapsed && <Button variant="unstyled" onClick={toggleCollapse} leftIcon={<FaAngleLeft />} />}
        { !isCollapsed && <SidebarLogo vault={vault} isCollapsed={isCollapsed} /> }
      </Flex>
      <Flex
        direction="column"
        mt={5}
        paddingX={isCollapsed ? 0 : 4}
        rowGap={5}
        alignItems={isCollapsed ? "center" : "flex-start"}
        flexGrow={1}
      >
        {GetAvailableEndpoints(vault, vaultRole.permissions).map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href} style={{ width: "100%" }} backgroundColor={isCollapsed && router.asPath === href ? theme.secondaryColor : 'white'}>
              <Button
                  variant="ghost"
                  width="100%"
                  justifyContent={isCollapsed ? "center" : "flex-start"}
                  leftIcon={<Icon />}
                  backgroundColor={!isCollapsed && router.asPath === href ? theme.secondaryColor : 'white'}
              >
                {!isCollapsed && label}
              </Button>
            </Link>
        ))}
      </Flex>
    </Flex>
  );
};

export const VaultSidebar = (
  {
    vault, vaultRole, isCollapsed = false, toggleCollapse,
  }: VaultSidebarProperties
): ReactJSXElement => {
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  if (isMobile) {
    return <BaseView vault={vault} vaultRole={vaultRole} isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />;
  } else {
    return <DesktopView vault={vault} vaultRole={vaultRole} isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />;
  }
};
