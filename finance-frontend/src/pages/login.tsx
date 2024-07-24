import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import {Layout} from "@/components/Layout";
import Head from 'next/head';
import {
  Button, Card, CardBody, CardHeader, Flex,
  FormControl, FormErrorMessage, FormLabel, Heading, Input, Stack
} from "@chakra-ui/react";
import React, {ChangeEvent, useEffect, useState} from "react";
import {useRouter} from "next/router"
import {useTheme} from "@/hooks/theme"
import {useAuthentication} from "@/hooks/authentication"

interface LoginForm {
  email: string;
  password: string;
}

export default function Login(): ReactJSXElement {
  const { authenticationDetails, login } = useAuthentication()
  const router = useRouter()
  const theme = useTheme()
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: ''
  })
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  useEffect(() => {
    if (authenticationDetails) {
      router.push("/")
    }
  }, [authenticationDetails, router]);

  if (authenticationDetails) {
    return <></>
  }

  const handleLoginFormUpdate = (event: ChangeEvent<HTMLInputElement>) => {
    switch (event.target.name) {
      case 'email':
        setEmailError(null);
        break;
      case 'password':
        setPasswordError(null);
        break;
    }

    setLoginForm({ ...loginForm, [event.target.name]: event.target.value });
  };

  const handleLogin = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (loginForm.email === '') {
      setEmailError('Email is required')
      return
    }

    if (loginForm.password === '') {
      setPasswordError('Password is required')
      return
    }

    login(loginForm.email, loginForm.password)
      .then(() => router.push("/"))
      .catch(error => console.error(error))
  }

  return (
    <Layout>
      <Head>
        <title>Finance - Login</title>
      </Head>

      <Card margin={2}>
        <CardHeader backgroundColor={theme.secondaryColor}>
          <Flex alignItems={'center'}
                justifyContent={'space-between'}>
            <Heading size='md'>Sign in</Heading>
          </Flex>
        </CardHeader>
        <CardBody>
          <Stack spacing='4'>
            <FormControl isRequired isInvalid={!!emailError}>
              <FormLabel>Email</FormLabel>
              <Input name={'email'}
                     onChange={handleLoginFormUpdate}
                     placeholder='Enter your email address' />
              {
                emailError && <FormErrorMessage>{emailError}</FormErrorMessage>
              }
            </FormControl>

            <FormControl isRequired isInvalid={!!passwordError}>
              <FormLabel>Password</FormLabel>
              <Input type={'password'}
                     name={'password'}
                     onChange={handleLoginFormUpdate}
                     placeholder='Enter your password' />
              {
                passwordError && <FormErrorMessage>{passwordError}</FormErrorMessage>
              }
            </FormControl>

            <Flex mt={2}
                  justifyContent={'space-between'}
                  gap={3}>
              <Button onClick={() => router.push("/register")}>Do not have an account?</Button>
              <Button backgroundColor={theme.primaryColor}
                      onClick={handleLogin}>Sign in</Button>
            </Flex>
          </Stack>
        </CardBody>
      </Card>
    </Layout>
  );
}