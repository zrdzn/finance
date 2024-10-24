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
import {CurrencySelect} from "@/components/shared/CurrencySelect"
import {TransactionMethodSelect} from "@/components/transaction/TransactionMethodSelect"
import toast from "react-hot-toast"
import {Layout} from "@/components/Layout"
import {GetStaticPropsContext} from "next";
import {useTranslations} from "next-intl";
import {Components} from "@/api/api";
import {TransactionMethod} from "@/api/types";

type VaultCreateRequest = Components.Schemas.VaultCreateRequest;

export default function SetupVault(): ReactJSXElement {
  const { authenticationDetails } = useAuthentication()
  const api = useApi()
  const router = useRouter()
  const t = useTranslations("VaultSetup")
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

  const handleDefaultTransactionMethodChange = (transactionMethod: TransactionMethod) => {
    setVaultCreateRequest((previous) => ({ ...previous, transactionMethod: transactionMethod }))
  }

  const handleVaultSetup = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (vaultCreateRequest.name === '') {
      toast.error(t("form.validation.missing-name"))
      return
    }

    const vaultCreateResult = api
        .then(client => client.createVault(null, vaultCreateRequest)
            .then(response => router.push(`/vault/${response.data.publicId}`)))
        .catch(error => {
            console.error(error)
            throw error
        })

    toast.promise(vaultCreateResult, {
      loading: t("form.submit-loading"),
      success: t("form.submit-success"),
      error: t("form.submit-error")
    })
  }

  return (
    <>
      <Layout>
        <Head>
          <title>{t('title')}</title>
        </Head>

        <Flex justifyContent="center" p={4}>
          <Card
            width={{ base: 'full', sm: '90%', md: '80%', lg: '60%' }}
            maxWidth="600px"
            margin={2}
          >
            <CardHeader backgroundColor={theme.secondaryColor}>
              <Flex alignItems={'center'} justifyContent={'space-between'}>
                <Text fontSize='md' fontWeight={'600'}>{t('form.title')}</Text>
              </Flex>
            </CardHeader>
            <CardBody>
              <Stack spacing='4'>
                <FormControl isRequired>
                  <FormLabel>{t('form.name-label')}</FormLabel>
                  <Input
                    name={'name'}
                    onChange={handleVaultFormChange}
                    placeholder={t('form.name-placeholder')}
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>{t('form.default-currency-label')}</FormLabel>
                  <CurrencySelect onChange={handleDefaultCurrencyChange} />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>{t('form.default-transaction-method-label')}</FormLabel>
                  <TransactionMethodSelect onChange={handleDefaultTransactionMethodChange} />
                </FormControl>

                <Flex mt={2} justifyContent={'space-between'} gap={3}>
                  <Button
                    backgroundColor={theme.primaryColor}
                    onClick={handleVaultSetup}
                  >
                    {t('form.submit')}
                  </Button>
                </Flex>
              </Stack>
            </CardBody>
          </Card>
        </Flex>
      </Layout>
    </>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`../../locales/${context.locale}.json`)).default
    }
  }
}