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
  Heading,
  Input,
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

interface RegistrationForm {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export default function Register(): ReactJSXElement {
  const { authenticationDetails, login } = useAuthentication()
  const api = useApi()
  const router = useRouter()
  const t = useTranslations("Register")
  const theme = useTheme()
  const [registrationForm, setRegistrationForm] = useState<RegistrationForm>({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (authenticationDetails) {
      router.push("/")
    }
  }, [authenticationDetails, router]);

  if (authenticationDetails) {
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

    const registerResult = api
        .then(client => client.register(null, {
          email: registrationForm.email,
          username: registrationForm.username,
          password: registrationForm.password
        })
        .then(() => login(registrationForm.email, registrationForm.password)
            .then(() => router.push("/")).catch(error => {
                console.error(error)
                throw error
            })
    ))

    toast.promise(registerResult, {
      loading: t('form.submit-loading'),
      success: t('form.submit-success'),
      error: t('form.submit-error'),
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
          >
            <CardHeader backgroundColor={theme.secondaryColor}>
              <Flex alignItems={'center'} justifyContent={'space-between'}>
                <Text fontSize='md' fontWeight={'600'}>{t('form.title')}</Text>
              </Flex>
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
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>{t('form.password-label')}</FormLabel>
                  <Input
                    type={'password'}
                    name={'password'}
                    onChange={handleRegistrationFormUpdate}
                    placeholder={t('form.password-placeholder')}
                  />
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
                  <Button onClick={() => router.push("/login")}>{t('form.login-redirect')}</Button>
                  <Button backgroundColor={theme.primaryColor} onClick={handleRegistration}>{t('form.submit')}</Button>
                </Flex>
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