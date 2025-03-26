import Head from 'next/head';
import {
  Button,
  Card,
  CardBody,
  CardHeader, Divider,
  Flex,
  FormControl, FormHelperText,
  FormLabel,
  Input, Link,
  Stack, Text
} from "@chakra-ui/react";
import React, {ChangeEvent, useEffect, useState} from "react";
import {useApi} from "@/hooks/useApi"
import {useRouter} from "next/router"
import {useTheme} from "@/hooks/useTheme"
import {useAuthentication} from "@/hooks/useAuthentication"
import toast from "react-hot-toast"
import { Layout } from "@/components/Layout";
import {GetStaticPropsContext} from "next";
import {useTranslations} from "next-intl";
import {FaGoogle} from "react-icons/fa";

interface RegistrationForm {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const { details, login } = useAuthentication()
  const { api, apiUrl } = useApi()
  const router = useRouter()
  const t = useTranslations("Register")
  const tValidation = useTranslations("Global.validation")
  const theme = useTheme()
  const [registrationForm, setRegistrationForm] = useState<RegistrationForm>({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (details) {
      router.push("/")
    }
  }, [details, router]);

  if (details) {
    return <></>
  }

  const handleRegistrationFormUpdate = (event: ChangeEvent<HTMLInputElement>) => {
    setRegistrationForm({ ...registrationForm, [event.target.name]: event.target.value });
  }

  const handleRegistration = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (registrationForm.email === '') {
      toast.error(t('form.validation.missing-email'))
      return
    }

    if (registrationForm.username === '') {
      toast.error(t('form.validation.missing-username'))
      return
    }

    if (registrationForm.password === '') {
      toast.error(t('form.validation.missing-password'))
      return
    }

    if (registrationForm.confirmPassword === '') {
      toast.error(t('form.validation.missing-confirm-password'))
      return
    }

    if (registrationForm.password !== registrationForm.confirmPassword) {
      toast.error(t('form.validation.passwords-not-match'))
      return
    }

    api
      .then(client => client.register(null, {
        email: registrationForm.email,
        username: registrationForm.username,
        password: registrationForm.password
      })
      .then(() => login(registrationForm.email, registrationForm.password, undefined)
          .then(() => {
            toast.success(t('form.submit-success'))
            router.push("/")
          })
          .catch(error => {
            console.error(error)
            throw error
          })
      ))
      .catch(error => {
        console.error(error)
        const errorMessage = error.response?.data?.description || t('form.submit-error')
        toast.error(errorMessage)
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
                    onChange={handleRegistrationFormUpdate}
                    placeholder={t('form.email-placeholder')}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>{t('form.username-label')}</FormLabel>
                  <Input
                    name={'username'}
                    onChange={handleRegistrationFormUpdate}
                    placeholder={t('form.username-placeholder')}
                  />
                  {
                    registrationForm.username !== '' && <FormHelperText
                      color={
                        registrationForm.username.length >= 3 && registrationForm.username.length <= 20 ?
                          theme.text.green :
                          theme.text.red
                      }
                    >
                      {tValidation('length')} (3-20)
                    </FormHelperText>
                  }
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>{t('form.password-label')}</FormLabel>
                  <Input
                    type={'password'}
                    name={'password'}
                    onChange={handleRegistrationFormUpdate}
                    placeholder={t('form.password-placeholder')}
                  />
                  {
                    registrationForm.password !== '' && <FormHelperText
                      color={
                        registrationForm.password.length >= 6 && registrationForm.password.length <= 100 ?
                          theme.text.green :
                          theme.text.red
                      }
                    >
                      {tValidation('length')} (6-100)
                    </FormHelperText>
                  }
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>{t('form.confirm-password-label')}</FormLabel>
                  <Input
                    type={'password'}
                    name={'confirmPassword'}
                    onChange={handleRegistrationFormUpdate}
                    placeholder={t('form.confirm-password-placeholder')}
                  />
                </FormControl>

                <Flex mt={2} justifyContent={'space-between'} gap={3}>
                  <Button color={theme.text} fontWeight={'400'} onClick={() => router.push("/login")}>{t('form.login-redirect')}</Button>
                  <Button color={'#f8f8f8'} fontWeight={'400'} backgroundColor={theme.secondary} onClick={handleRegistration}>{t('form.submit')}</Button>
                </Flex>
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  mt={4}
                >
                  <Divider w="40%" />
                  <Text mx={4}>{t('form.or')}</Text>
                  <Divider w="40%" />
                </Flex>
                <Link href={`${apiUrl}/v1/oauth/authorize/google`}>
                  <Button
                    w="full"
                    mt={4}
                    leftIcon={<FaGoogle />}
                    color={'#f8f8f8'}
                    backgroundColor={'#4285F4'}
                  >
                    <Text w="full" fontSize="sm">
                      {t('form.google')}
                    </Text>
                  </Button>
                </Link>
              </Stack>
            </CardBody>
          </Card>
        </Flex>
      </Layout>
    </>
  )
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`../locales/${context.locale}.json`)).default
    }
  }
}
