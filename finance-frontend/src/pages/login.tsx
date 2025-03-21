import Head from 'next/head';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack, Text
} from "@chakra-ui/react";
import React, {ChangeEvent, useEffect, useState} from "react";
import {useRouter} from "next/router"
import {useTheme} from "@/hooks/useTheme"
import {useAuthentication} from "@/hooks/useAuthentication"
import toast from "react-hot-toast"
import {Layout} from "@/components/Layout"
import {GetStaticPropsContext} from "next";
import {useTranslations} from "next-intl";
import {Components} from "@/api/api";
import axios from "axios";

type AuthenticationLoginRequest = Components.Schemas.AuthenticationLoginRequest;

export default function Login() {
  const { details, login } = useAuthentication()
  const router = useRouter()
  const theme = useTheme()
  const t = useTranslations('Login')
  const [totpRequired, setTotpRequired] = useState(false)
  const [authenticationLoginRequest, setAuthenticationLoginRequest] = useState<AuthenticationLoginRequest>({
    email: '',
    password: '',
    oneTimePassword: undefined
  })

  useEffect(() => {
    if (details) {
      router.push("/")
    }
  }, [details, router]);

  if (details) {
    return <></>
  }

  const handleLoginFormUpdate = (event: ChangeEvent<HTMLInputElement>) => {
    setAuthenticationLoginRequest({ ...authenticationLoginRequest, [event.target.name]: event.target.value });
  };

  const handleLogin = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (authenticationLoginRequest.email === '') {
      toast.error(t('form.validation.missing-email'))
      return
    }

    if (authenticationLoginRequest.password === '') {
      toast.error(t('form.validation.missing-password'))
      return
    }

    if (totpRequired && !authenticationLoginRequest.oneTimePassword) {
      toast.error(t('form.validation.missing-totp'))
      return
    }

    login(authenticationLoginRequest.email, authenticationLoginRequest.password, authenticationLoginRequest.oneTimePassword)
      .then(() => router.push("/"))
      .catch(error => {
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.data.code === "AUTHENTICATION_TOTP_REQUIRED") {
            setTotpRequired(true)
          }
          const errorMessage = error.response.data.description || "An error occurred while logging in"
          toast.error(errorMessage)
        } else {
          toast.error("An unexpected error occurred")
        }
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
              width={{ base: 'full', sm: '80%', md: '60%', lg: '50%' }}
              maxWidth="500px"
              margin={2}
              boxShadow="base"
              borderRadius="lg"
              overflow="hidden"
              backgroundColor={theme.background.secondary}
              color={theme.text.primary}
          >
            <CardHeader>
              <Text fontSize="md" fontWeight="600">
                {t("form.title")}
              </Text>
            </CardHeader>
            <CardBody>
              <Stack spacing='4'>
                <FormControl isRequired>
                  <FormLabel>{t('form.email-label')}</FormLabel>
                  <Input
                    name={'email'}
                    onChange={handleLoginFormUpdate}
                    placeholder={t('form.email-placeholder')}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>{t('form.password-label')}</FormLabel>
                  <Input
                    type={'password'}
                    name={'password'}
                    onChange={handleLoginFormUpdate}
                    placeholder={t('form.password-placeholder')}
                  />
                </FormControl>
                {
                  totpRequired && (
                    <FormControl isRequired>
                      <FormLabel>{t('form.totp-label')}</FormLabel>
                      <Input
                        name={'oneTimePassword'}
                        onChange={handleLoginFormUpdate}
                        placeholder={t('form.totp-placeholder')}
                      />
                    </FormControl>
                  )
                }

                <Flex mt={2} justifyContent={'space-between'} gap={3}>
                  <Button color={theme.text} fontWeight={'400'} onClick={() => router.push("/register")}>{t('form.register-redirect')}</Button>
                  <Button color={'#f8f8f8'} fontWeight={'400'} backgroundColor={theme.secondary} onClick={handleLogin}>{t('form.submit')}</Button>
                </Flex>
              </Stack>
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
      messages: (await import(`../locales/${context.locale}.json`)).default
    }
  }
}
