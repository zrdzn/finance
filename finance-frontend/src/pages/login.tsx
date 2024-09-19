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
  Stack
} from "@chakra-ui/react";
import React, {ChangeEvent, useEffect, useState} from "react";
import {useRouter} from "next/router"
import {useTheme} from "@/hooks/useTheme"
import {useAuthentication} from "@/hooks/useAuthentication"
import toast from "react-hot-toast"

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

    if (loginForm.email === '') {
      toast.error('You need to provide an email')
      return
    }

    if (loginForm.password === '') {
      toast.error('You need to provide a password')
      return
    }

    login(loginForm.email, loginForm.password)
      .then(() => router.push("/"))
      .catch(error => console.error(error))
  }

  return (
    <>
      <Head>
        <title>Finance - Login</title>
      </Head>

      <Flex justifyContent="center" p={4}>
        <Card
          width={{ base: 'full', sm: '80%', md: '60%', lg: '50%' }}
          maxWidth="500px"
          margin={2}
        >
          <CardHeader backgroundColor={theme.secondaryColor}>
            <Flex alignItems={'center'} justifyContent={'space-between'}>
              <Heading size='md'>Sign in</Heading>
            </Flex>
          </CardHeader>
          <CardBody>
            <Stack spacing='4'>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  name={'email'}
                  onChange={handleLoginFormUpdate}
                  placeholder='Enter your email address'
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type={'password'}
                  name={'password'}
                  onChange={handleLoginFormUpdate}
                  placeholder='Enter your password'
                />
              </FormControl>

              <Flex mt={2} justifyContent={'space-between'} gap={3}>
                <Button onClick={() => router.push("/register")}>Do not have an account?</Button>
                <Button backgroundColor={theme.primaryColor} onClick={handleLogin}>Sign in</Button>
              </Flex>
            </Stack>
          </CardBody>
        </Card>
      </Flex>
    </>
  );
}