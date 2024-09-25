import {useAuthentication} from "@/hooks/useAuthentication"
import {useRouter} from "next/router"
import {
  Box,
  Flex,
  HStack,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useMediaQuery
} from "@chakra-ui/react"
import {FaLayerGroup, FaUser, FaUserPlus} from "react-icons/fa"
import {useTheme} from "@/hooks/useTheme"
import React from "react"
import {FaArrowRightToBracket} from "react-icons/fa6"

export const Navbar = () => {
  const { authenticationDetails, logout } = useAuthentication();
  const theme = useTheme();
  const router = useRouter();
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  const handleLogout = () => {
    logout().then(() => router.push("/"));
  };

  return (
    <Flex
      as="nav"
      justifyContent="space-between"
      alignItems="center"
      width="100%"
      paddingY={3.5}
      paddingX={8}
      backgroundColor={theme.secondaryColor}
      color={theme.textColor}
      boxShadow={'lg'}
    >
      <Flex alignItems="center">
        <Link href="/">
          <Text fontSize="2xl" fontWeight="600">
            Finance
          </Text>
        </Link>
      </Flex>
      <Flex alignItems="center" gap={8}>
        <Link href="/">
          <HStack alignItems={'center'} width={'full'} gap={2}>
            <FaLayerGroup />
            <Box>Vaults</Box>
          </HStack>
        </Link>
        {authenticationDetails && (
          <Menu>
            <MenuButton>
              <HStack alignItems={'center'} width={'full'} gap={2}>
                <FaUser />
                <Box>{isMobile ? null : <Text>{authenticationDetails.username}</Text>}</Box>
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem as={Link} href={'/account/settings'}>Settings</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        )}
        {
          !authenticationDetails &&
            <HStack gap={'10'}>
                <Link href="/login">
                    <HStack alignItems={'center'} width={'full'} gap={2}>
                        <FaArrowRightToBracket />
                        <Box>Sign in</Box>
                    </HStack>
                </Link>
                <Link href="/register">
                    <HStack alignItems={'center'} width={'full'} gap={2}>
                        <FaUserPlus />
                        <Box>Sign up</Box>
                    </HStack>
                </Link>
            </HStack>
        }
      </Flex>
    </Flex>
  )
}