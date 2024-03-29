import {
  Button, Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Link,
  useDisclosure
} from "@chakra-ui/react";
import {ReactJSXElement} from "@emotion/react/types/jsx-namespace"
import {useTheme} from "@/hooks/theme"
import {useRouter} from "next/router"
import React from "react"
import {FaBars, FaBolt, FaBook, FaUser} from "react-icons/fa"
import {FaCalendarDays, FaGears, FaHouse, FaX} from "react-icons/fa6"

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
  const {isOpen, onOpen, onClose} = useDisclosure();
  const theme = useTheme();
  const router = useRouter();

  const serverPublicId = router.query.serverPublicId

  return (
    <>
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
                <SidebarLogo />
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
                <Link href={`/`}
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
                <Link href={`/server/${serverPublicId}/electricity`}
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
                        History
                      </Flex>
                    </Flex>
                  </Button>
                </Link>
              </Flex>
              <Divider borderColor={theme.secondaryColor} />
              <Flex width={'full'}
                    marginY={3}>
                <Link href={`/server/${serverPublicId}/general`}
                      style={{width: "inherit"}}>
                  <Button backgroundColor={theme.backgroundColor}
                          onClick={onClose}
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
                <Link href={`/server/${serverPublicId}/electricity`}
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
                        Users
                      </Flex>
                    </Flex>
                  </Button>
                </Link>
              </Flex>
              <Divider borderColor={theme.secondaryColor} />
              <Flex width={'full'}
                    marginY={3}>
                <Link href={`/server/${serverPublicId}/production`}
                      style={{width: "inherit"}}>
                  <Button backgroundColor={theme.backgroundColor}
                          onClick={onClose}
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
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
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