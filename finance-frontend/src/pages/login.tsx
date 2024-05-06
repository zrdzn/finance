import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import {Layout} from "@/components/Layout";
import Head from 'next/head';
import {
  Button, Card, CardBody, CardHeader, Flex,
  FormControl, FormLabel, Heading, Input, Stack
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

    login(loginForm.email, loginForm.password)
      .then(() => router.push("/"))
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
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input name={'email'}
                     onChange={handleLoginFormUpdate}
                     placeholder='Enter your e-mail address' />
            </FormControl>

            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input type={'password'}
                     name={'password'}
                     onChange={handleLoginFormUpdate}
                     placeholder='Enter your password' />
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