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
import {useTranslations} from "next-intl";
import {AccountAvatar} from "@/components/account/AccountAvatar";

export const Navbar = () => {
  const { details, logout } = useAuthentication();
  const theme = useTheme();
  const router = useRouter();
  const t = useTranslations("Navbar")
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
            {t('logo')}
          </Text>
        </Link>
      </Flex>
      <Flex alignItems="center" gap={8}>
        {details && (
          <>
            <Link href="/">
              <HStack alignItems={'center'} width={'full'} gap={2}>
                <FaLayerGroup />
                <Box>{isMobile ? null : <Text>{t('vaults')}</Text>}</Box>
              </HStack>
            </Link>
            <Menu>
              <MenuButton>
                <HStack alignItems={'center'} width={'full'} gap={2}>
                  <AccountAvatar size={'xs'} />
                  <Box>{isMobile ? null : <Text>{details.username}</Text>}</Box>
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem as={Link} href={'/account/settings'}>{t('settings')}</MenuItem>
                <MenuItem onClick={handleLogout}>{t('logout')}</MenuItem>
              </MenuList>
            </Menu>
          </>
        )}
        {
          !details &&
            <HStack gap={'10'}>
                <Link href="/login">
                    <HStack alignItems={'center'} width={'full'} gap={2}>
                        <FaArrowRightToBracket />
                        <Box>{isMobile ? null : <Text>{t('login')}</Text>}</Box>
                    </HStack>
                </Link>
                <Link href="/register">
                    <HStack alignItems={'center'} width={'full'} gap={2}>
                        <FaUserPlus />
                        <Box>{isMobile ? null : <Text>{t('register')}</Text>}</Box>
                    </HStack>
                </Link>
            </HStack>
        }
      </Flex>
    </Flex>
  )
}