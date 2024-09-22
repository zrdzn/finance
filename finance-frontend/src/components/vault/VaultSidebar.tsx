import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
  useMediaQuery
} from "@chakra-ui/react";
import {ReactJSXElement} from "@emotion/react/types/jsx-namespace"
import {useTheme} from "@/hooks/useTheme"
import React from "react"
import {FaAngleLeft, FaAngleRight, FaBars, FaBook, FaHistory, FaTags, FaUser} from "react-icons/fa"
import {FaCalendarDays, FaChartSimple, FaGears, FaHouse, FaX} from "react-icons/fa6"
import {useAuthentication} from "@/hooks/useAuthentication"
import {useRouter} from "next/router"
import {VaultResponse} from "@/components/api"

interface VaultSidebarProperties {
  vault: VaultResponse;
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
      {isCollapsed && <Text>F</Text>}
      {!isCollapsed && <Text>Finance</Text>}
    </Link>
  </Flex>
);

const BaseView = ({ vault }: VaultSidebarProperties) => {
  const { authenticationDetails, logout } = useAuthentication();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const theme = useTheme();
  const router = useRouter();

  const handleLogout = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    logout().then(() => router.push("/"));
  };

  return (
    <>
      <Flex justifyContent={'space-between'}
            alignItems={'center'}
            width={'full'}
            backgroundColor={theme.secondaryColor}>
        <Flex padding={4}>
          <SidebarLogo vault={vault} />
        </Flex>
        <Flex padding={2}>
          <Button padding={3} variant={'unstyled'} onClick={onOpen} leftIcon={<FaBars />} />
        </Flex>
      </Flex>
      <Drawer placement={'left'} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent color={theme.textColor}>
          <DrawerHeader backgroundColor={theme.primaryColor}>
            <Flex justifyContent={'space-between'} width={'full'} alignItems={'center'}>
              <Flex>
                <SidebarLogo vault={vault} />
              </Flex>
              <Flex>
                <Button backgroundColor={theme.primaryColor}
                        padding={3.5}
                        variant={'unstyled'}
                        onClick={onClose}
                        leftIcon={<FaX />} />
              </Flex>
            </Flex>
          </DrawerHeader>
          <DrawerBody padding={0}>
            <Flex direction={'column'} mt={5}>
              {[
                { href: `/vault/${vault.publicId}`, icon: FaHouse, label: 'Overview' },
                { href: `/vault/${vault.publicId}/transactions`, icon: FaBook, label: 'Transactions' },
                { href: `/vault/${vault.publicId}/products`, icon: FaTags, label: 'Products' },
                { href: `/vault/${vault.publicId}/statistics`, icon: FaChartSimple, label: 'Statistics' },
                { href: `/vault/${vault.publicId}/schedules`, icon: FaCalendarDays, label: 'Schedules', isDisabled: true },
                { href: `/vault/${vault.publicId}/members`, icon: FaUser, label: 'Members' },
                { href: `/vault/${vault.publicId}/audits`, icon: FaHistory, label: 'Audit Logs' },
                { href: `/vault/${vault.publicId}/settings`, icon: FaGears, label: 'Settings' }
              ].map(({ href, icon: Icon, label, isDisabled }) => (
                <Flex key={href} width={'full'} marginY={3}>
                  <Link href={href} style={{ width: 'inherit' }}>
                    <Button backgroundColor={router.asPath === href ? theme.secondaryColor : theme.backgroundColor}
                            onClick={onClose}
                            width={'full'}
                            borderRadius={0}
                            isDisabled={isDisabled}>
                      <Flex alignItems={'center'} width={'full'} columnGap={2}>
                        <Icon />
                        <Box>{label}</Box>
                      </Flex>
                    </Button>
                  </Link>
                </Flex>
              ))}
              <Divider borderColor={theme.secondaryColor} />
              {authenticationDetails && (
                <Flex width={'full'} marginY={3}>
                  <Menu>
                    <MenuButton as={Button} width={'full'} backgroundColor={theme.backgroundColor}>
                      <Flex alignItems={'center'} width={'full'} columnGap={2}>
                        <FaUser />
                        <Box>{authenticationDetails.username}</Box>
                      </Flex>
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </MenuList>
                  </Menu>
                </Flex>
              )}
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

const DesktopView = (
  {
    vault, isCollapsed = false, toggleCollapse,
  }: VaultSidebarProperties
) => {
  const theme = useTheme();
  const router = useRouter()
  const { authenticationDetails, logout } = useAuthentication();

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
        {[
          { href: `/vault/${vault.publicId}`, icon: FaHouse, label: 'Overview' },
          { href: `/vault/${vault.publicId}/transactions`, icon: FaBook, label: 'Transactions' },
          { href: `/vault/${vault.publicId}/products`, icon: FaTags, label: 'Products' },
          { href: `/vault/${vault.publicId}/statistics`, icon: FaChartSimple, label: 'Statistics' },
          { href: `/vault/${vault.publicId}/schedules`, icon: FaCalendarDays, label: 'Schedules', isDisabled: true },
          { href: `/vault/${vault.publicId}/members`, icon: FaUser, label: 'Members' },
          { href: `/vault/${vault.publicId}/audits`, icon: FaHistory, label: 'Audit Logs' },
          { href: `/vault/${vault.publicId}/settings`, icon: FaGears, label: 'Settings' }
        ].map(({ href, icon: Icon, label, isDisabled }) => (
          <Link key={href} href={href} style={{ width: "100%" }} backgroundColor={isCollapsed && router.asPath === href ? theme.secondaryColor : 'white'}>
            <Button
              variant="ghost"
              width="100%"
              justifyContent={isCollapsed ? "center" : "flex-start"}
              leftIcon={<Icon />}
              backgroundColor={!isCollapsed && router.asPath === href ? theme.secondaryColor : 'white'}
              isDisabled={isDisabled}
            >
              {!isCollapsed && label}
            </Button>
          </Link>
        ))}
      </Flex>
      <Flex
        justifyContent={isCollapsed ? "center" : "flex-start"}
        padding="4"
        borderTop={`1px solid ${theme.secondaryColor}`}
      >
        {authenticationDetails && (
          <Menu>
            <MenuButton as={Button} width={'full'} backgroundColor={theme.backgroundColor}>
              <Flex alignItems={'center'} width={'full'} columnGap={2}>
                <FaUser />
                {!isCollapsed && <Box>{authenticationDetails.username}</Box>}
              </Flex>
            </MenuButton>
            <MenuList>
              <MenuItem onClick={logout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        )}
      </Flex>
    </Flex>
  );
};

export const VaultSidebar = (
  {
    vault, isCollapsed = false, toggleCollapse,
  }: VaultSidebarProperties
): ReactJSXElement => {
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  if (isMobile) {
    return <BaseView vault={vault} isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />;
  } else {
    return <DesktopView vault={vault} isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />;
  }
};