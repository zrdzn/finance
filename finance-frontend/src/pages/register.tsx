import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import {Layout} from "@/components/Layout";
import Head from 'next/head';
import {
  Button, Card, CardBody, CardHeader, Flex,
  FormControl, FormErrorMessage, FormLabel, Heading, Input, Stack
} from "@chakra-ui/react";
import React, {ChangeEvent, useEffect, useState} from "react";
import {useApi} from "@/hooks/apiClient"
import {useRouter} from "next/router"
import {useTheme} from "@/hooks/theme"
import {useAuthentication} from "@/hooks/authentication"

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
  const theme = useTheme()
  const [registrationForm, setRegistrationForm] = useState<RegistrationForm>({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [emailError, setEmailError] = useState<string | null>(null)
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null)

  useEffect(() => {
    if (authenticationDetails) {
      router.push("/")
    }
  }, [authenticationDetails, router]);

  if (authenticationDetails) {
    return <></>
  }

  const handleRegistrationFormUpdate = (event: ChangeEvent<HTMLInputElement>) => {
    switch (event.target.name) {
      case 'email':
        setEmailError(null);
        break;
      case 'username':
        setUsernameError(null);
        break;
      case 'password':
        setPasswordError(null);
        break;
      case 'confirmPassword':
        setConfirmPasswordError(null);
        break;
    }

    setRegistrationForm({ ...registrationForm, [event.target.name]: event.target.value });
  };

  const handleRegistration = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (registrationForm.email === '') {
      setEmailError("Email is required")
      return
    }

    if (registrationForm.username === '') {
      setUsernameError("Username is required")
      return
    }

    if (registrationForm.password === '') {
      setPasswordError("Password is required")
      return
    }

    if (registrationForm.confirmPassword === '') {
      setConfirmPasswordError("Confirm password is required")
      return
    }

    if (registrationForm.password !== registrationForm.confirmPassword) {
      setConfirmPasswordError("Passwords do not match")
      return
    }

    api.post("/authentication/register", {
      email: registrationForm.email,
      username: registrationForm.username,
      password: registrationForm.password
    })
      .then(() => login(registrationForm.email, registrationForm.password)
        .then(() => router.push("/"))
      )
      .catch(error => console.error(error))
  }

  return (
    <Layout>
      <Head>
        <title>Finance - Register</title>
      </Head>

      <Card margin={2}>
        <CardHeader backgroundColor={theme.secondaryColor}>
          <Flex alignItems={'center'}
                justifyContent={'space-between'}>
            <Heading size='md'>Register your account</Heading>
          </Flex>
        </CardHeader>
        <CardBody>
          <Stack spacing='4'>
            <FormControl isRequired isInvalid={!!emailError}>
              <FormLabel>Email</FormLabel>
              <Input name={'email'}
                     onChange={handleRegistrationFormUpdate}
                     placeholder='What is your email address?' />
              {
                emailError && <FormErrorMessage>{emailError}</FormErrorMessage>
              }
            </FormControl>

            <FormControl isRequired isInvalid={!!usernameError}>
              <FormLabel>Username</FormLabel>
              <Input name={'username'}
                     onChange={handleRegistrationFormUpdate}
                     placeholder='Pick your username' />
              {
                usernameError && <FormErrorMessage>{usernameError}</FormErrorMessage>
              }
            </FormControl>

            <FormControl isRequired isInvalid={!!passwordError}>
              <FormLabel>Password</FormLabel>
              <Input type={'password'}
                     name={'password'}
                     onChange={handleRegistrationFormUpdate}
                     placeholder='Pick your password' />
              {
                passwordError && <FormErrorMessage>{passwordError}</FormErrorMessage>
              }
            </FormControl>

            <FormControl isRequired isInvalid={!!confirmPasswordError}>
              <FormLabel>Confirm Password</FormLabel>
              <Input type={'password'}
                     name={'confirmPassword'}
                     onChange={handleRegistrationFormUpdate}
                     placeholder='Confirm your password' />
              {
                confirmPasswordError && <FormErrorMessage>{confirmPasswordError}</FormErrorMessage>
              }
            </FormControl>

            <Flex mt={2}
                  justifyContent={'space-between'}
                  gap={3}>
              <Button onClick={() => router.push("/login")}>Already have an account?</Button>
              <Button backgroundColor={theme.primaryColor}
                      onClick={handleRegistration}>Sign up</Button>
            </Flex>
          </Stack>
        </CardBody>
      </Card>
    </Layout>
  );
}