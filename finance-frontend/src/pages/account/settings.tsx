import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import Head from 'next/head';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Stack,
  Text
} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {useApi} from "@/hooks/useApi"
import {useRouter} from "next/router"
import {useTheme} from "@/hooks/useTheme"
import {useAuthentication} from "@/hooks/useAuthentication"
import toast from "react-hot-toast"
import {Layout} from "@/components/Layout"
import {FaEdit, FaEnvelope, FaKey, FaLock, FaSave, FaShieldAlt} from "react-icons/fa"
import {FaPencil, FaShield} from "react-icons/fa6"
import {RequestAccountUpdateButton} from "@/components/account/RequestAccountUpdateButton"
import {RequestAccountVerificationButton} from "@/components/account/RequestAccountVerificationButton";
import {GetStaticPropsContext} from "next";
import {useTranslations} from "next-intl";
import {Components} from "@/api/api";

type UserProfileUpdateRequest = Components.Schemas.UserProfileUpdateRequest;

export default function AccountSettings(): ReactJSXElement {
  const { authenticationDetails } = useAuthentication()
  const api = useApi()
  const router = useRouter()
  const theme = useTheme()
  const t = useTranslations("AccountSettings")
  const [userProfileUpdateRequest, setUserProfileUpdateRequest] = useState<UserProfileUpdateRequest>({
    username: ''
  })
  const [isEditingUsername, setIsEditingUsername] = useState(false)

  useEffect(() => {
    if (authenticationDetails === null) {
      router.push("/login")
    }
  }, [authenticationDetails, router]);

  if (authenticationDetails === null) {
    return <></>
  }

  const handleUsernameChange = (username: string) => {
    setUserProfileUpdateRequest((previous) => ({ ...previous, username: username }))
  }

  const handleUserProfileUpdate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (!authenticationDetails) {
      return
    }

    if (userProfileUpdateRequest?.username === '') {
      setUserProfileUpdateRequest((previous) => ({ ...previous, username: authenticationDetails.username }))
      return
    }

    api
        .then(client => client.updateUserProfile(null, userProfileUpdateRequest)
            .then(() => {
                toast.success(t('profile-card.updated-success'))
                setTimeout(() => router.reload(), 1000)
            }))
        .catch(error => {
                console.error(error)
                toast.error(t('profile-card.updated-error'))
        })
  }

  return (
    <>
      <Layout>
        <Head>
          <title>{t('title')}</title>
        </Head>

        <Flex justifyContent="center" p={4}>
          <Card
            width={{ base: 'full', sm: '90%', md: '80%', lg: '60%' }}
            maxWidth="600px"
            margin={2}
          >
            <CardHeader backgroundColor={theme.secondaryColor}>
              <Flex alignItems={'center'} justifyContent={'space-between'}>
                <Text fontSize='md' fontWeight={'600'}>{t('profile-card.title')}</Text>
              </Flex>
            </CardHeader>
            <CardBody>
              {
                authenticationDetails &&
                  <Stack spacing='4'>
                    <FormControl isRequired>
                      <FormLabel>{t('profile-card.email-label')}</FormLabel>
                      <HStack>
                        <Input
                            name={'email'}
                            defaultValue={authenticationDetails.email}
                            isDisabled
                        />
                        <RequestAccountUpdateButton icon={<FaEdit />} accountUpdateType={'EMAIL'} />
                      </HStack>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>{t('profile-card.username-label')}</FormLabel>
                      <HStack>
                        <Input
                            name={'username'}
                            onChange={(event) => handleUsernameChange(event.target.value)}
                            placeholder={t('profile-card.username-placeholder')}
                            defaultValue={authenticationDetails.username}
                            isDisabled={!isEditingUsername}
                        />
                        <Button
                            backgroundColor={theme.primaryColor}
                            onClick={(event) => {
                              if (isEditingUsername) {
                                handleUserProfileUpdate(event)
                              }

                              setIsEditingUsername(!isEditingUsername)}
                        }
                            size={'md'}
                            color={'#f8f8f8'} fontWeight={'400'}
                        >
                          {
                            isEditingUsername ? <FaSave /> : <FaPencil />
                          }
                        </Button>
                      </HStack>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>{t('profile-card.password-label')}</FormLabel>
                      <HStack>
                        <RequestAccountUpdateButton icon={<FaKey />} text={t('profile-card.password-placeholder')} accountUpdateType={'PASSWORD'} />
                      </HStack>
                    </FormControl>
                    <FormControl>
                      <FormLabel>{t('profile-card.verify-label')}</FormLabel>
                      <HStack>
                        {authenticationDetails.verified && <Text fontSize={'sm'} color={'green'}>{t('profile-card.already-verified')}</Text>}
                        {!authenticationDetails.verified && (
                            <RequestAccountVerificationButton icon={<FaEnvelope />} text={t('profile-card.verify-link')} />
                        )}
                      </HStack>
                    </FormControl>
                      <FormControl>
                          <FormLabel>{t('profile-card.two-factor-setup-label')}</FormLabel>
                          <HStack>
                            {authenticationDetails.isTwoFactorEnabled && <Text fontSize={'sm'} color={'green'}>{t('profile-card.two-factor-already-enabled')}</Text>}
                            {!authenticationDetails.isTwoFactorEnabled && (
                              <RequestAccountUpdateButton icon={<FaLock />} text={t('profile-card.two-factor-setup-button-label')}  accountUpdateType={"TWO_FACTOR"}/>
                            )}
                          </HStack>
                      </FormControl>
                  </Stack>
              }
            </CardBody>
          </Card>
        </Flex>
      </Layout>
    </>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`../../locales/${context.locale}.json`)).default
    }
  }
}
