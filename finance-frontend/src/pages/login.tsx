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
import {useRouter} from "next/router"
import {useTheme} from "@/hooks/useTheme"
import {useAuthentication} from "@/hooks/useAuthentication"
import toast from "react-hot-toast"
import {Layout} from "@/components/Layout"
import {GetStaticPropsContext} from "next";
import {useTranslations} from "next-intl";

interface LoginForm {
  email: string;
  password: string;
}

export default function Login(): ReactJSXElement {
  const { authenticationDetails, login } = useAuthentication()
  const router = useRouter()
  const theme = useTheme()
  const t = useTranslations('Login')
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: ''
  })

  useEffect(() => {
    if (authenticationDetails) {
      router.push("/")
    }
  }, [authenticationDetails, router]);

  if (authenticationDetails) {
    return <></>
  }

  const handleLoginFormUpdate = (event: ChangeEvent<HTMLInputElement>) => {
    setLoginForm({ ...loginForm, [event.target.name]: event.target.value });
  };

  const handleLogin = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (loginForm.email === '') {
      toast.error(t('form.validation.missing-email'))
      return
    }

    if (loginForm.password === '') {
      toast.error(t('form.validation.missing-password'))
      return
    }

    login(loginForm.email, loginForm.password)
      .then(() => router.push("/"))
      .catch(error => console.error(error))
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

                <Flex mt={2} justifyContent={'space-between'} gap={3}>
                  <Button color={'#f8f8f8'} fontWeight={'400'} onClick={() => router.push("/register")}>{t('form.register-redirect')}</Button>
                  <Button color={'#f8f8f8'} fontWeight={'400'} backgroundColor={theme.primaryColor} onClick={handleLogin}>{t('form.submit')}</Button>
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
