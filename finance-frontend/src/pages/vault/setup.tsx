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
import {VaultCreateRequest} from "@/components/api"

export default function SetupVault(): ReactJSXElement {
  const { authenticationDetails } = useAuthentication()
  const api = useApi()
  const router = useRouter()
  const theme = useTheme()
  const [vaultCreateRequest, setVaultCreateRequest] = useState<VaultCreateRequest>({
    name: ''
  })
  const [nameError, setNameError] = useState<string | null>(null)

  useEffect(() => {
    if (authenticationDetails === null) {
      router.push("/login")
    }
  }, [authenticationDetails, router]);

  if (authenticationDetails === null) {
    return <></>
  }

  const handleVaultFormChange = (event: ChangeEvent<HTMLInputElement>) => {
    switch (event.target.name) {
      case 'name':
        setNameError(null);
        break;
    }

    setVaultCreateRequest({ ...vaultCreateRequest, [event.target.name]: event.target.value });
  };

  const handleVaultSetup = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (vaultCreateRequest.name === '') {
      setNameError('Name is required')
      return
    }

    api.post("/vaults/create", vaultCreateRequest)
      .then(response => router.push(`/vault/${response.data.publicId}`))
      .catch(error => console.error(error))
  }

  return (
    <Layout>
      <Head>
        <title>Finance - Vault Setup</title>
      </Head>

      <Flex justifyContent="center" p={4}>
        <Card
          width={{ base: 'full', sm: '90%', md: '80%', lg: '60%' }}
          maxWidth="600px"
          margin={2}
        >
          <CardHeader backgroundColor={theme.secondaryColor}>
            <Flex alignItems={'center'} justifyContent={'space-between'}>
              <Heading size='md'>Setup new vault</Heading>
            </Flex>
          </CardHeader>
          <CardBody>
            <Stack spacing='4'>
              <FormControl isRequired isInvalid={!!nameError}>
                <FormLabel>Name</FormLabel>
                <Input
                  name={'name'}
                  onChange={handleVaultFormChange}
                  placeholder='Choose name'
                />
                {nameError && <FormErrorMessage>{nameError}</FormErrorMessage>}
              </FormControl>

              <Flex mt={2} justifyContent={'space-between'} gap={3}>
                <Button
                  backgroundColor={theme.primaryColor}
                  onClick={handleVaultSetup}
                >
                  Setup
                </Button>
              </Flex>
            </Stack>
          </CardBody>
        </Card>
      </Flex>
    </Layout>
  );
}