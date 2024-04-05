import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import {Layout} from "@/components/Layout";
import Head from 'next/head';
import {
  Button, Card, CardBody, CardHeader, Flex,
  FormControl, FormLabel, Heading, Input, Stack
} from "@chakra-ui/react";
import React, {ChangeEvent, useState} from "react";
import {useApi} from "@/hooks/apiClient"
import {useRouter} from "next/router"
import {useTheme} from "@/hooks/theme"

interface RegistrationForm {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export default function Register(): ReactJSXElement {
  const api = useApi()
  const router = useRouter()
  const theme = useTheme()
  const [registrationForm, setRegistrationForm] = useState<RegistrationForm>({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  })

  const handleRegistrationFormUpdate = (event: ChangeEvent<HTMLInputElement>) => {
    setRegistrationForm({ ...registrationForm, [event.target.name]: event.target.value });
  };

  const handleRegistration = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (registrationForm.password !== registrationForm.confirmPassword) {
      // TODO add toast
      console.error("passwords dont match")
      return
    }

    api.post("/authentication/register", {
      email: registrationForm.email,
      username: registrationForm.username,
      password: registrationForm.password
    })
      .then(() => router.push("/"))
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
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input name={'email'}
                     onChange={handleRegistrationFormUpdate}
                     placeholder='What is your email address?' />
            </FormControl>

            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input name={'username'}
                     onChange={handleRegistrationFormUpdate}
                     placeholder='Pick your username' />
            </FormControl>

            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input type={'password'}
                     name={'password'}
                     onChange={handleRegistrationFormUpdate}
                     placeholder='Pick your password' />
            </FormControl>

            <FormControl>
              <FormLabel>Confirm Password</FormLabel>
              <Input type={'password'}
                     name={'confirmPassword'}
                     onChange={handleRegistrationFormUpdate}
                     placeholder='Confirm your password' />
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