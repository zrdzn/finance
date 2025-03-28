import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex, Heading, HStack, IconButton, Input,
  Link,
  Text,
  useDisclosure,
  useMediaQuery, VStack
} from "@chakra-ui/react";
import {useTheme} from "@/hooks/useTheme"
import React, {useEffect, useState} from "react"
import {FaAngleLeft, FaAngleRight, FaBars, FaBook, FaHistory, FaRobot, FaTags, FaUser} from "react-icons/fa"
import {FaGears, FaHouse, FaMessage, FaX} from "react-icons/fa6"
import {useRouter} from "next/router"
import {useTranslations} from "next-intl";
import {Components} from "@/api/api";
import {AccountAvatar} from "@/components/account/AccountAvatar";
import {useAuthentication} from "@/hooks/useAuthentication";
import {useApi} from "@/hooks/useApi";

type VaultResponse = Components.Schemas.VaultResponse;
type VaultRoleResponse = Components.Schemas.VaultRoleResponse;
type ConfigurationResponse = Components.Schemas.ConfigurationResponse;

interface VaultSidebarProperties {
  vault: VaultResponse;
  vaultRole: VaultRoleResponse;
  isCollapsed?: boolean;
  toggleCollapse?: () => void;
  configuration?: ConfigurationResponse;
}

const SidebarLogo = ({vault, isCollapsed}: { vault: VaultResponse, isCollapsed?: boolean }) => (
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
    {href: `/vault/${vault.publicId}`, icon: FaHouse, label: t('overview')},
    {
      href: `/vault/${vault.publicId}/transactions`,
      icon: FaBook,
      label: t('transactions'),
      requireAtLeast: ['TRANSACTION_READ', 'SCHEDULE_READ']
    },
    {
      href: `/vault/${vault.publicId}/products`,
      icon: FaTags,
      label: t('products'),
      requireAtLeast: ['PRODUCT_READ', 'PRODUCT_CREATE']
    },
    {
      href: `/vault/${vault.publicId}/members`,
      icon: FaUser,
      label: t('members'),
      requireAtLeast: ['MEMBER_READ', 'MEMBER_INVITE_READ']
    },
    {href: `/vault/${vault.publicId}/audits`, icon: FaHistory, label: t('audits'), requireAtLeast: ['AUDIT_READ']},
    {href: `/vault/${vault.publicId}/settings`, icon: FaGears, label: t('settings'), requireAtLeast: ['SETTINGS_READ']}
  ]

  return navItems.filter(({requireAtLeast}) => {
    return !requireAtLeast || requireAtLeast.some(permission => permissions.includes(permission));
  })
}

interface StyleProperties {
  bottom: string;
  right: string;
  width: number;
  height: number;
  fontSize: string;
}

interface ChatBoxProps {
  iconStyle: StyleProperties;
  boxStyle: StyleProperties;
}

const ChatBox = ({iconStyle, boxStyle}: ChatBoxProps) => {
  const theme = useTheme()
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("VaultSidebar");
  const {details} = useAuthentication()
  const [messages, setMessages] = useState([
    {text: t('chat.initial-message'), isUser: false},
    {text: 'How much did I spent last year? Also, provide me a full report for this month.', isUser: true},
    {text: 'Sure, let me check that for you.', isUser: false},
    {text: 'I have found the information you requested. Here is the report.', isUser: false},
    {text: 'Thank you!', isUser: true}
  ]);
  const [input, setInput] = useState("");

  return (
    <>
      <Button
        position="fixed"
        bottom={iconStyle.bottom}
        right={iconStyle.right}
        zIndex={1}
        variant="unstyled"
        aria-label="Open Chatbot"
        width={iconStyle.width}
        height={iconStyle.height}
        fontSize={iconStyle.fontSize}
        backgroundColor={theme.secondary}
        color={'#f8f8f8'}
        fontWeight={'400'}
        borderRadius="full"
        display="flex"
        onClick={() => setIsOpen(!isOpen)}
        alignItems="center"
        justifyContent="center"
      >
        <FaMessage/>
      </Button>
      <Box
        position="fixed"
        bottom={boxStyle.bottom}
        right={boxStyle.right}
        zIndex="1000">
        <Box
          width={boxStyle.width}
          height={boxStyle.height}
          bg="white"
          boxShadow="xl"
          borderRadius="lg"
          overflow="hidden"
          maxHeight={isOpen ? boxStyle.height : 0}
          maxW={isOpen ? boxStyle.width : 0}
          opacity={isOpen ? 1 : 0}
          transition={"max-height 0.3s ease-in-out, opacity 0.3s ease-in-out, max-width 0.3s ease-in-out"}
          border={'1px rgba(0, 0, 0, 0.1) solid'}
          display="flex"
          flexDirection="column"
        >
          <VStack
            flex="1"
            overflowY="auto"
            p={3}
            spacing={2}
            align="stretch"
          >
            <Box>
              <Heading size="md">{t('chat.title')}</Heading>
            </Box>
            {messages.map((msg, idx) =>
              !msg.isUser ? (
                <Box
                  key={idx}
                  p={2}
                  borderRadius="md"
                  alignSelf="flex-start"
                  textAlign="left"
                  bg="gray.100"
                  maxW="80%"
                >
                  <HStack>
                    <Box fontSize={'3xl'}>
                      <FaRobot/>
                    </Box>
                    <Text fontWeight="bold">{t('chat.assistant')}</Text>
                  </HStack>
                  <Text>{msg.text}</Text>
                </Box>
              ) : (
                <Box
                  key={idx}
                  p={2}
                  borderRadius="md"
                  alignSelf="flex-end"
                  textAlign="right"
                  bg="blue.100"
                  maxW="80%"
                >
                  {
                    details && (
                      <HStack justify="flex-end">
                        <Text fontWeight="bold">
                          {
                            details?.username
                          }
                        </Text>
                        <AccountAvatar size="sm" userId={details?.id} />
                      </HStack>
                    )
                  }
                  <Text>{msg.text}</Text>
                </Box>
              )
            )}
          </VStack>
          <Box p={3} borderTop="1px solid #ddd" display="flex">
            <Input
              flex="1"
              placeholder={t('chat.placeholder')}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => event.key === "Enter"}
            />
            <Button colorScheme="teal" ml={2} onClick={event => console.log(messages)}>{t('chat.send')}</Button>
          </Box>
        </Box>
      </Box>
    </>
  )
}

const BaseView = ({vault, vaultRole, configuration}: VaultSidebarProperties) => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const theme = useTheme();
  const router = useRouter();

  return (
    <>
      {
        /* TODO: Implement actual ai messages in chatbox
        aiEnabled && (
          <ChatBox
            iconStyle={{
              bottom: '80px',
              right: '20px',
              width: 12,
              height: 12,
              fontSize: 'md'
            }}
            boxStyle={{
              bottom: '130px',
              right: '20px',
              width: 300,
              height: 400,
              fontSize: 'md'
            }}
          />
        )
         */
      }
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
        backgroundColor={theme.secondary}
        color={'#f8f8f8'}
        fontWeight={'400'}
        borderRadius="full"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <FaBars/>
      </Button>

      <Drawer placement={'left'} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay/>
        <DrawerContent color={theme.text}>
          <DrawerHeader backgroundColor={theme.primary}>
            <Flex justifyContent={'space-between'} width={'full'} alignItems={'center'}>
              <SidebarLogo vault={vault} isCollapsed={false}/>
              <Button backgroundColor={theme.secondary}
                      color={'#f8f8f8'}
                      padding={3.5}
                      variant={'unstyled'}
                      onClick={onClose}
                      leftIcon={<FaX/>}
                      fontWeight={'400'} />
            </Flex>
          </DrawerHeader>
          <DrawerBody padding={0} backgroundColor={theme.background.primary}>
            <Flex direction={'column'} mt={5}>
              {GetAvailableEndpoints(vault, vaultRole.permissions).map(({href, icon: Icon, label}) => (
                <Flex key={href} width={'full'} marginY={3}>
                  <Link href={href}
                        color={router.asPath === href ? theme.primary : theme.text.primary}
                        borderLeft={router.asPath === href ? `4px solid ${theme.primary}` : "none"}
                        paddingLeft={router.asPath === href ? "0" : "4px"}
                        style={{width: 'inherit'}}>
                    <Button
                      backgroundColor={theme.background.primary}
                      onClick={() => router.push(href)}
                      width={'full'}
                      color={router.asPath === href ? theme.secondary : theme.text.primary}
                      borderRadius={0}
                    >
                      <Flex alignItems={'center'} width={'full'} columnGap={2}>
                        <Icon/>
                        <Box>{label}</Box>
                      </Flex>
                    </Button>
                  </Link>
                </Flex>
              ))}
            </Flex>
            <Flex position={'absolute'} bottom={'2'} left={'2'}>
              <Text color={theme.text.primary} fontSize={'sm'}>
                Finance v{configuration?.applicationVersion}
              </Text>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

const DesktopView = (
  {
    vault, vaultRole, isCollapsed = false, toggleCollapse, configuration
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
      color={theme.text}
      backgroundColor={theme.background.primary}
      transition="width 0.3s"
      zIndex="1000"
      boxShadow="4px 0 8px rgba(0, 0, 0, 0.1)"
    >
      {
        /* TODO: Implement actual ai messages in chatbox
        aiEnabled && (
          <ChatBox
            iconStyle={{
              bottom: '40px',
              right: '40px',
              width: 16,
              height: 16,
              fontSize: 'lg'
            }}
            boxStyle={{
              bottom: '110px',
              right: '40px',
              width: 500,
              height: 500,
              fontSize: 'md'
            }}
          />
        )
 */
      }
      <Flex
        justifyContent="center"
        alignItems="center"
        padding="4"
        height="68px"
        backgroundColor={theme.secondary}
        color={theme.text}
      >
        {isCollapsed && <Button variant="unstyled" onClick={toggleCollapse} leftIcon={<FaAngleRight/>}/>}
        {!isCollapsed && <Button variant="unstyled" onClick={toggleCollapse} leftIcon={<FaAngleLeft/>}/>}
        {!isCollapsed && <SidebarLogo vault={vault} isCollapsed={isCollapsed}/>}
      </Flex>
      <Flex
        direction="column"
        mt={5}
        paddingX={isCollapsed ? 0 : 4}
        rowGap={5}
        backgroundColor={theme.background.primary}
        alignItems={isCollapsed ? "center" : "flex-start"}
        flexGrow={1}
      >
        {GetAvailableEndpoints(vault, vaultRole.permissions).map(({href, icon: Icon, label}) => (
          <Link
            key={href}
            href={href}
            style={{width: "100%"}}
            backgroundColor={theme.background.primary}
            color={router.asPath === href ? theme.primary : theme.text.primary}
            borderLeft={!isCollapsed && router.asPath === href ? `4px solid ${theme.primary}` : "none"}
            paddingLeft={!isCollapsed && router.asPath === href ? "0" : "4px"}
          >
            <Button
              variant="ghost"
              width="100%"
              justifyContent={isCollapsed ? "center" : "flex-start"}
              leftIcon={<Icon color={router.asPath === href ? theme.primary : theme.text.primary} />}
              backgroundColor={theme.background.primary}
              color={router.asPath === href ? theme.secondary : theme.text.primary}
              fontWeight={router.asPath === href ? "600" : "400"}
            >
              {!isCollapsed && label}
            </Button>
          </Link>
        ))}
      </Flex>
      <Flex position={'absolute'} bottom={'2'} left={'2'}>
        <Text color={theme.text.primary} fontSize={'sm'}>
          Finance v{configuration?.applicationVersion}
        </Text>
      </Flex>
    </Flex>
  );
};

export const VaultSidebar = (
  {
    vault, vaultRole, isCollapsed = false, toggleCollapse,
  }: VaultSidebarProperties
) => {
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const { api } = useApi()
  const [configuration, setConfiguration] = useState<ConfigurationResponse>()

  useEffect(() => {
    api
      .then(client => client.getConfiguration())
      .then(response => setConfiguration(response.data))
      .catch(console.error)
  }, [api])

  if (isMobile) {
    return <BaseView vault={vault} vaultRole={vaultRole} isCollapsed={isCollapsed} toggleCollapse={toggleCollapse}
                     configuration={configuration}/>;
  } else {
    return <DesktopView vault={vault} vaultRole={vaultRole} isCollapsed={isCollapsed} toggleCollapse={toggleCollapse}
                        configuration={configuration}/>;
  }
};
