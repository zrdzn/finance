import {
  Button, Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Link, Menu, MenuButton, MenuItem, MenuList,
  useDisclosure
} from "@chakra-ui/react";
import {ReactJSXElement} from "@emotion/react/types/jsx-namespace"
import {useTheme} from "@/hooks/theme"
import React from "react"
import {FaBars, FaBook, FaSignInAlt, FaUser, FaUserPlus} from "react-icons/fa"
import {FaCalendarDays, FaGears, FaHouse, FaX} from "react-icons/fa6"
import {useAuthentication} from "@/hooks/authentication"
import {useRouter} from "next/router"

const SidebarLogo = (): ReactJSXElement => {
  return (
    <Flex textTransform={'uppercase'}
          fontWeight={'semibold'}
          letterSpacing={'wider'}
          fontSize={'xl'}
          textAlign={'center'}>
      Finance
    </Flex>
  )
}

const BaseView = (): ReactJSXElement => {
  const { authenticationDetails, logout } = useAuthentication()
  const {isOpen, onOpen, onClose} = useDisclosure();
  const theme = useTheme();
  const router = useRouter()

  const handleLogout = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    logout()
      .then(() => router.push("/"))
  }

  return (
    <Flex justifyContent={'space-between'}
          alignItems={'center'}
          width={'full'}>
      <Flex padding={4}>
        <SidebarLogo />
      </Flex>
      <Flex padding={2}>
        <Button backgroundColor={theme.primaryColor}
                padding={3}
                variant={'unstyled'}
                onClick={onOpen}>
          <FaBars />
        </Button>
      </Flex>
    </Flex>
  );
};

export const Sidebar = (): ReactJSXElement => {
  const theme = useTheme();

  return (
    <>
      <Flex backgroundColor={theme.primaryColor}
            color={theme.textColor}>
        <BaseView/>
      </Flex>
    </>
  );
};