import {
  Box,
  Button, Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex, IconButton,
  Link, Menu, MenuButton, MenuItem, MenuList, Text,
  useDisclosure,
  useMediaQuery
} from "@chakra-ui/react";
import {ReactJSXElement} from "@emotion/react/types/jsx-namespace"
import {useTheme} from "@/hooks/theme"
import React, {useState} from "react"
import {
  FaAngleLeft,
  FaAngleRight,
  FaBars,
  FaBook,
  FaChevronLeft,
  FaChevronRight,
  FaSignInAlt, FaSignOutAlt,
  FaTags,
  FaUser,
  FaUserPlus
} from "react-icons/fa"
import {FaCalendarDays, FaGears, FaHouse, FaX} from "react-icons/fa6"
import {useAuthentication} from "@/hooks/authentication"
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
                { href: `/vault/${vault.publicId}/payments`, icon: FaBook, label: 'Payments' },
                { href: `/vault/${vault.publicId}/products`, icon: FaTags, label: 'Products' },
                { href: `/vault/${vault.publicId}/schedules`, icon: FaCalendarDays, label: 'Schedules', isDisabled: true },
                { href: `/vault/${vault.publicId}/members`, icon: FaUser, label: 'Members' },
                { href: `/vault/${vault.publicId}/settings`, icon: FaGears, label: 'Settings', isDisabled: true }
              ].map(({ href, icon: Icon, label, isDisabled }) => (
                <Flex key={href} width={'full'} marginY={3}>
                  <Link href={href} style={{ width: 'inherit' }}>
                    <Button backgroundColor={theme.backgroundColor} onClick={onClose} width={'full'} isDisabled={isDisabled}>
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
                        <FaUserPlus />
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
  const { logout } = useAuthentication();

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
        <Link href={`/vault/${vault.publicId}`} style={{ width: "100%" }}>
          <Button
            variant="ghost"
            width="100%"
            justifyContent={isCollapsed ? "center" : "flex-start"}
            leftIcon={<FaHouse />}
          >
            {!isCollapsed && "Overview"}
          </Button>
        </Link>
        <Link href={`/vault/${vault.publicId}/payments`} style={{ width: "100%" }}>
          <Button
            variant="ghost"
            width="100%"
            justifyContent={isCollapsed ? "center" : "flex-start"}
            leftIcon={<FaBook />}
          >
            {!isCollapsed && "Payments"}
          </Button>
        </Link>
        <Link href={`/vault/${vault.publicId}/products`} style={{ width: "100%" }}>
          <Button
            variant="ghost"
            width="100%"
            justifyContent={isCollapsed ? "center" : "flex-start"}
            leftIcon={<FaTags />}
          >
            {!isCollapsed && "Products"}
          </Button>
        </Link>
        <Link href={`/vault/${vault.publicId}/schedules`} style={{ width: "100%" }}>
          <Button
            variant="ghost"
            width="100%"
            justifyContent={isCollapsed ? "center" : "flex-start"}
            leftIcon={<FaCalendarDays />}
            isDisabled
          >
            {!isCollapsed && "Schedules"}
          </Button>
        </Link>
        <Link href={`/vault/${vault.publicId}/members`} style={{ width: "100%" }}>
          <Button
            variant="ghost"
            width="100%"
            justifyContent={isCollapsed ? "center" : "flex-start"}
            leftIcon={<FaUser />}
          >
            {!isCollapsed && "Members"}
          </Button>
        </Link>
        <Link href={`/vault/${vault.publicId}/settings`} style={{ width: "100%" }}>
          <Button
            variant="ghost"
            width="100%"
            justifyContent={isCollapsed ? "center" : "flex-start"}
            leftIcon={<FaGears />}
          >
            {!isCollapsed && "Settings"}
          </Button>
        </Link>
      </Flex>
      <Flex
        justifyContent={isCollapsed ? "center" : "flex-start"}
        padding="4"
        borderTop={`1px solid ${theme.secondaryColor}`}
      >
        <Button variant="ghost" width="100%" onClick={logout}>
          <FaSignOutAlt />
          {!isCollapsed && <Box ml={2}>Logout</Box>}
        </Button>
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