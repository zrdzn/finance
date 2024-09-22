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
      toast.error('You need to provide an email')
      return
    }

    if (registrationForm.username === '') {
      toast.error('You need to provide a username')
      return
    }

    if (registrationForm.password === '') {
      toast.error('You need to provide a password')
      return
    }

    if (registrationForm.confirmPassword === '') {
      toast.error('You need to confirm your password')
      return
    }

    if (registrationForm.password !== registrationForm.confirmPassword) {
      toast.error("Passwords don't match")
      return
    }

    const registerResult = api.post("/authentication/register", {
      email: registrationForm.email,
      username: registrationForm.username,
      password: registrationForm.password
    })
      .then(() => login(registrationForm.email, registrationForm.password)
        .then(() => router.push("/"))
      )
      .catch(error => {
        console.error(error)
        throw error
      })

    toast.promise(registerResult, {
      loading: 'Signing up',
      success: "You\'ve successfully signed up",
      error: "An error occurred while signing up",
    })
  }

  return (
    <>
      <Head>
        <title>Finance - Register</title>
      </Head>

      <Flex justifyContent="center" p={4}>
        <Card
          width={{ base: 'full', sm: '80%', md: '60%', lg: '50%' }}
          maxWidth="500px"
          margin={2}
        >
          <CardHeader backgroundColor={theme.secondaryColor}>
            <Flex alignItems={'center'} justifyContent={'space-between'}>
              <Text fontSize='md' fontWeight={'600'}>Register your account</Text>
            </Flex>
          </CardHeader>
          <CardBody>
            <Stack spacing='4'>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  name={'email'}
                  onChange={handleRegistrationFormUpdate}
                  placeholder='What is your email address?'
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  name={'username'}
                  onChange={handleRegistrationFormUpdate}
                  placeholder='Pick your username'
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type={'password'}
                  name={'password'}
                  onChange={handleRegistrationFormUpdate}
                  placeholder='Pick your password'
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type={'password'}
                  name={'confirmPassword'}
                  onChange={handleRegistrationFormUpdate}
                  placeholder='Confirm your password'
                />
              </FormControl>

              <Flex mt={2} justifyContent={'space-between'} gap={3}>
                <Button onClick={() => router.push("/login")}>Already have an account?</Button>
                <Button backgroundColor={theme.primaryColor} onClick={handleRegistration}>Sign up</Button>
              </Flex>
            </Stack>
          </CardBody>
        </Card>
      </Flex>
    </>
  )
}