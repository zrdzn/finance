import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import {Layout} from "@/components/Layout";
import Head from 'next/head';
import {
  Button, Card, CardBody, CardHeader, Flex,
  FormControl, FormLabel, Heading, Input, Stack
} from "@chakra-ui/react";
import React, {ChangeEvent, useEffect, useState} from "react";
import {useApi} from "@/hooks/apiClient"
import {useRouter} from "next/router"
import {useTheme} from "@/hooks/theme"
import {useAuthentication} from "@/hooks/authentication"

interface VaultForm {
  name: string
}

export default function SetupVault(): ReactJSXElement {
  const { authenticationDetails } = useAuthentication()
  const api = useApi()
  const router = useRouter()
  const theme = useTheme()
  const [vaultForm, setVaultForm] = useState<VaultForm>({
    name: ''
  })

  useEffect(() => {
    if (authenticationDetails === null) {
      router.push("/login")
    }
  }, [authenticationDetails, router]);

  if (authenticationDetails === null) {
    return <></>
  }

  const handleVaultFormChange = (event: ChangeEvent<HTMLInputElement>) => {
    setVaultForm({ ...vaultForm, [event.target.name]: event.target.value });
  };

  const handleVaultSetup = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api.post("/vaults/create", vaultForm)
      .then(response => router.push(`/vault/${response.data.publicId}`))
      .catch(error => console.error(error))
  }

  return (
    <Layout>
      <Head>
        <title>Finance - Vault Setup</title>
      </Head>

      <Card margin={2}>
        <CardHeader backgroundColor={theme.secondaryColor}>
          <Flex alignItems={'center'}
                justifyContent={'space-between'}>
            <Heading size='md'>Setup new vault</Heading>
          </Flex>
        </CardHeader>
        <CardBody>
          <Stack spacing='4'>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input name={'name'}
                     onChange={handleVaultFormChange}
                     placeholder='Choose name' />
            </FormControl>

            <Flex mt={2}
                  justifyContent={'space-between'}
                  gap={3}>
              <Button backgroundColor={theme.primaryColor}
                      onClick={handleVaultSetup}>Setup</Button>
            </Flex>
          </Stack>
        </CardBody>
      </Card>
    </Layout>
  );
}