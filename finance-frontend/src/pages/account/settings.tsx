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
  HStack,
  Input,
  Stack,
  Text
} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {useApi} from "@/hooks/useApi"
import {useRouter} from "next/router"
import {useTheme} from "@/hooks/useTheme"
import {useAuthentication} from "@/hooks/useAuthentication"
import {AccountUpdateType, UserProfileUpdateRequest} from "@/components/api"
import toast from "react-hot-toast"
import {Layout} from "@/components/Layout"
import {FaEdit, FaEnvelope, FaKey, FaLock, FaSave, FaShieldAlt} from "react-icons/fa"
import {FaPencil} from "react-icons/fa6"
import {RequestAccountUpdateButton} from "@/components/account/RequestAccountUpdateButton"
import {RequestAccountVerificationButton} from "@/components/account/RequestAccountVerificationButton";

export default function AccountSettings(): ReactJSXElement {
  const { authenticationDetails } = useAuthentication()
  const api = useApi()
  const router = useRouter()
  const theme = useTheme()
  const [userProfileUpdateRequest, setUserProfileUpdateRequest] = useState<UserProfileUpdateRequest>({
    username: ''
  })
  const [isEditingUsername, setIsEditingUsername] = useState(false)

  useEffect(() => {
    if (authenticationDetails === null) {
      router.push("/login")
    }
  }, [authenticationDetails, router]);

  if (authenticationDetails === null) {
    return <></>
  }

  const handleUsernameChange = (username: string) => {
    setUserProfileUpdateRequest((previous) => ({ ...previous, username: username }))
  }

  const handleUserProfileUpdate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (!authenticationDetails) {
      return
    }

    if (userProfileUpdateRequest?.username === '') {
      setUserProfileUpdateRequest((previous) => ({ ...previous, username: authenticationDetails.username }))
      return
    }

    api.patch("/users/profile", userProfileUpdateRequest)
      .then(() => {
        toast.success(`Profile has been updated`)
        setTimeout(() => router.reload(), 1000)
      })
      .catch(error => {
        console.error(error)
        toast.error(`Failed to update user profile`)
      })
  }

  return (
    <>
      <Layout>
        <Head>
          <title>Finance - Account Settings</title>
        </Head>

        <Flex justifyContent="center" p={4}>
          <Card
            width={{ base: 'full', sm: '90%', md: '80%', lg: '60%' }}
            maxWidth="600px"
            margin={2}
          >
            <CardHeader backgroundColor={theme.secondaryColor}>
              <Flex alignItems={'center'} justifyContent={'space-between'}>
                <Text fontSize='md' fontWeight={'600'}>Your profile</Text>
              </Flex>
            </CardHeader>
            <CardBody>
              {
                authenticationDetails &&
                  <Stack spacing='4'>
                    <FormControl isRequired>
                      <FormLabel>Email</FormLabel>
                      <HStack>
                        <Input
                            name={'email'}
                            defaultValue={authenticationDetails.email}
                            isDisabled
                        />
                        <RequestAccountUpdateButton icon={<FaEdit />} accountUpdateType={AccountUpdateType.Email} />
                      </HStack>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Username</FormLabel>
                      <HStack>
                        <Input
                            name={'username'}
                            onChange={(event) => handleUsernameChange(event.target.value)}
                            placeholder='Enter your new username'
                            defaultValue={authenticationDetails.username}
                            isDisabled={!isEditingUsername}
                        />
                        <Button
                            backgroundColor={theme.primaryColor}
                            onClick={(event) => {
                              if (isEditingUsername) {
                                handleUserProfileUpdate(event)
                              }

                              setIsEditingUsername(!isEditingUsername)}
                        }
                            size={'md'}
                        >
                          {
                            isEditingUsername ? <FaSave /> : <FaPencil />
                          }
                        </Button>
                      </HStack>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Password</FormLabel>
                      <HStack>
                        <RequestAccountUpdateButton icon={<FaKey />} text={'Change password'} accountUpdateType={AccountUpdateType.Password} />
                      </HStack>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Verify Account</FormLabel>
                      <HStack>
                        {authenticationDetails.verified && <Text fontSize={'sm'} color={'green'}>Your account is verified</Text>}
                        {!authenticationDetails.verified && (
                            <RequestAccountVerificationButton icon={<FaEnvelope />} text={'Send link'} />
                        )}
                      </HStack>
                    </FormControl>
                  </Stack>
              }
            </CardBody>
          </Card>
        </Flex>
      </Layout>
    </>
  );
}