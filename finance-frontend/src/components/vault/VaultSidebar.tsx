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
import {FaBars, FaBook, FaSignInAlt, FaTags, FaUser, FaUserPlus} from "react-icons/fa"
import {FaCalendarDays, FaGears, FaHouse, FaX} from "react-icons/fa6"
import {useAuthentication} from "@/hooks/authentication"
import {useRouter} from "next/router"
import {VaultResponse} from "@/components/api"

interface VaultSidebarProperties {
  vault: VaultResponse
}

const SidebarLogo = ({ vault }: { vault: VaultResponse }): ReactJSXElement => {
  return (
    <Flex textTransform={'uppercase'}
          fontWeight={'semibold'}
          letterSpacing={'wider'}
          fontSize={'xl'}
          textAlign={'center'}>
      <Link href={`/vault/${vault.publicId}`}>
        Finance
      </Link>
    </Flex>
  )
}

const BaseView = ({ vault }: VaultSidebarProperties): ReactJSXElement => {
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
    <>
      <Flex justifyContent={'space-between'}
            alignItems={'center'}
            width={'full'}>
        <Flex padding={4}>
          <SidebarLogo vault={vault} />
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
      <Drawer placement={'left'}
              onClose={onClose}
              isOpen={isOpen}>
        <DrawerOverlay/>
        <DrawerContent color={theme.textColor}>
          <DrawerHeader backgroundColor={theme.primaryColor}>
            <Flex justifyContent={'space-between'}
                  width={'full'}
                  alignItems={'center'}>
              <Flex>
                <SidebarLogo vault={vault} />
              </Flex>
              <Flex>
                <Button backgroundColor={theme.primaryColor}
                        padding={3.5}
                        variant={'unstyled'}
                        onClick={onClose}>
                  <FaX />
                </Button>
              </Flex>
            </Flex>
          </DrawerHeader>
          <DrawerBody padding={0}>
            <Flex direction={'column'}
                  mt={5}>
              <Flex width={'full'}
                    marginY={3}>
                <Link href={`/vault/${vault.publicId}`}
                      style={{width: "inherit"}}>
                  <Button backgroundColor={theme.backgroundColor}
                          onClick={onClose}
                          width={'full'}>
                    <Flex alignItems={'center'}
                          width={'full'}
                          columnGap={2}>
                      <Flex>
                        <FaHouse />
                      </Flex>
                      <Flex>
                        Overview
                      </Flex>
                    </Flex>
                  </Button>
                </Link>
              </Flex>
              <Divider borderColor={theme.secondaryColor} />
              <Flex width={'full'}
                    marginY={3}>
                <Link href={`/vault/${vault.publicId}/payments`}
                      style={{width: "inherit"}}>
                  <Button backgroundColor={theme.backgroundColor}
                          onClick={onClose}
                          width={'full'}>
                    <Flex alignItems={'center'}
                          width={'full'}
                          columnGap={2}>
                      <Flex>
                        <FaBook />
                      </Flex>
                      <Flex>
                        Payments
                      </Flex>
                    </Flex>
                  </Button>
                </Link>
              </Flex>
              <Divider borderColor={theme.secondaryColor} />
              <Flex width={'full'}
                    marginY={3}>
                <Link href={`/vault/${vault.publicId}/products`}
                      style={{width: "inherit"}}>
                  <Button backgroundColor={theme.backgroundColor}
                          onClick={onClose}
                          width={'full'}>
                    <Flex alignItems={'center'}
                          width={'full'}
                          columnGap={2}>
                      <Flex>
                        <FaTags />
                      </Flex>
                      <Flex>
                        Products
                      </Flex>
                    </Flex>
                  </Button>
                </Link>
              </Flex>
              <Divider borderColor={theme.secondaryColor} />
              <Flex width={'full'}
                    marginY={3}>
                <Link href={`/vault/${vault.publicId}/schedules`}
                      style={{width: "inherit"}}>
                  <Button backgroundColor={theme.backgroundColor}
                          onClick={onClose}
                          isDisabled
                          width={'full'}>
                    <Flex alignItems={'center'}
                          width={'full'}
                          columnGap={2}>
                      <Flex>
                        <FaCalendarDays />
                      </Flex>
                      <Flex>
                        Schedules
                      </Flex>
                    </Flex>
                  </Button>
                </Link>
              </Flex>
              <Divider borderColor={theme.secondaryColor} />
              <Flex width={'full'}
                    marginY={3}>
                <Link href={`/vault/${vault.publicId}/members`}
                      style={{width: "inherit"}}>
                  <Button backgroundColor={theme.backgroundColor}
                          onClick={onClose}
                          width={'full'}>
                    <Flex alignItems={'center'}
                          width={'full'}
                          columnGap={2}>
                      <Flex>
                        <FaUser />
                      </Flex>
                      <Flex>
                        Members
                      </Flex>
                    </Flex>
                  </Button>
                </Link>
              </Flex>
              <Divider borderColor={theme.secondaryColor} />
              <Flex width={'full'}
                    marginY={3}>
                <Link href={`/vault/${vault.publicId}/settings`}
                      style={{width: "inherit"}}>
                  <Button backgroundColor={theme.backgroundColor}
                          onClick={onClose}
                          isDisabled
                          width={'full'}>
                    <Flex alignItems={'center'}
                          width={'full'}
                          columnGap={2}>
                      <Flex>
                        <FaGears />
                      </Flex>
                      <Flex>
                        Settings
                      </Flex>
                    </Flex>
                  </Button>
                </Link>
              </Flex>
              <Divider borderColor={theme.secondaryColor} />
              {
                authenticationDetails &&
                  <Flex width={'full'}
                        marginY={3}>
                    <Menu>
                        <MenuButton as={Link}
                                    style={{width: "inherit"}}>
                            <Button backgroundColor={theme.backgroundColor}
                                    onClick={onClose}
                                    width={'full'}>
                                <Flex alignItems={'center'}
                                      width={'full'}
                                      columnGap={2}>
                                    <Flex>
                                        <FaUserPlus />
                                    </Flex>
                                    <Flex>
                                      {authenticationDetails.username}
                                    </Flex>
                                </Flex>
                            </Button>
                        </MenuButton>
                        <MenuList>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                  </Flex>
              }
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export const VaultSidebar = ({ vault }: VaultSidebarProperties): ReactJSXElement => {
  const theme = useTheme();

  return (
    <>
      <Flex backgroundColor={theme.primaryColor}
            color={theme.textColor}>
        <BaseView vault={vault} />
      </Flex>
    </>
  );
};