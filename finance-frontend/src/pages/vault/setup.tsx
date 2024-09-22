import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import Head from 'next/head';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FormControl,
  FormErrorMessage,
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
import {VaultCreateRequest} from "@/components/api"
import {CurrencySelect} from "@/components/shared/CurrencySelect"
import {TransactionMethodSelect} from "@/components/transaction/TransactionMethodSelect"
import toast from "react-hot-toast"

export default function SetupVault(): ReactJSXElement {
  const { authenticationDetails } = useAuthentication()
  const api = useApi()
  const router = useRouter()
  const theme = useTheme()
  const [vaultCreateRequest, setVaultCreateRequest] = useState<VaultCreateRequest>({
    name: '',
    currency: 'PLN',
    transactionMethod: 'BLIK'
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
    setVaultCreateRequest({ ...vaultCreateRequest, [event.target.name]: event.target.value });
  }

  const handleDefaultCurrencyChange = (currency: string) => {
    setVaultCreateRequest((previous) => ({ ...previous, currency: currency }))
  }

  const handleDefaultTransactionMethodChange = (transactionMethod: string) => {
    setVaultCreateRequest((previous) => ({ ...previous, transactionMethod: transactionMethod }))
  }

  const handleVaultSetup = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (vaultCreateRequest.name === '') {
      toast.error('You need to provide a name')
      return
    }

    const vaultCreateResult = api.post("/vaults/create", vaultCreateRequest)
      .then(response => router.push(`/vault/${response.data.publicId}`))
      .catch(error => {
        console.error(error)
        throw error
      })

    toast.promise(vaultCreateResult, {
      loading: 'Creating vault',
      success: 'Vault has been created',
      error: 'An error occurred while creating vault'
    })
  }

  return (
    <>
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
              <Text fontSize='md' fontWeight={'600'}>Setup new vault</Text>
            </Flex>
          </CardHeader>
          <CardBody>
            <Stack spacing='4'>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  name={'name'}
                  onChange={handleVaultFormChange}
                  placeholder='Choose name'
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Default currency</FormLabel>
                <CurrencySelect onChange={handleDefaultCurrencyChange} />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Default transaction method</FormLabel>
                <TransactionMethodSelect onChange={handleDefaultTransactionMethodChange} />
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
    </>
  );
}