import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import {Layout} from "@/components/Layout";
import Head from 'next/head';
import {
  Box,
  Card,
  CardBody, CardHeader,
  Flex, Heading, Link,
  Stack, StackDivider,
  Text,
} from "@chakra-ui/react";
import {useTheme} from "@/hooks/theme";
import React, {useEffect, useState} from "react";
import {AddPaymentButton} from "@/components/payment/AddPaymentButton"
import {useRouter} from "next/router"
import {useAuthentication} from "@/hooks/authentication"
import {VaultResponse} from "@/components/api"
import {useApi} from "@/hooks/apiClient"

export default function Dashboard(): ReactJSXElement {
  const theme = useTheme();
  const router = useRouter();
  const api = useApi()
  const { authenticationDetails } = useAuthentication()
  const publicId = router.query.publicId
  const [vault, setVault] = useState<VaultResponse | undefined>(undefined)

  useEffect(() => {
    if (authenticationDetails === null) {
      router.push("/login")
    }
  }, [authenticationDetails, router]);

  useEffect(() => {
    if (publicId === undefined) {
      return
    }

    api.get(`/vaults/${publicId}`)
      .then(response => setVault(response.data))
      .catch(error => console.error(error))
  }, [api, publicId]);

  if (authenticationDetails === null) {
    return <></>
  }

  if (vault === undefined) {
    return <>Loading vault...</>
  }

  return (
    <Layout>
      <Head>
        <title>Finance - Overview ({vault.name})</title>
      </Head>
      <Flex justifyContent={'center'}>
        <Flex direction={'column'} width={'full'} justifyContent={'center'}>
          <Card margin={2}>
            <CardHeader backgroundColor={theme.secondaryColor}>
              <Flex alignItems={'center'}
                    justifyContent={'space-between'}>
                <Heading size='md'>Last transactions</Heading>
                <AddPaymentButton />
              </Flex>
            </CardHeader>
            <CardBody>
              <Stack divider={<StackDivider />} spacing='4'>
                <Box>
                  <Flex justifyContent={'space-between'}>
                    <Heading size='sm'
                             textTransform='uppercase'
                             isTruncated
                             maxWidth={'70%'}>
                      Za paliwo do autka lorem ipsum dolor sit amet long text very long text
                    </Heading>
                    <Heading size={'md'}>
                      25,40 PLN
                    </Heading>
                  </Flex>
                  <Flex justifyContent={'space-between'}>
                    <Text color={'dimgray'}
                          fontSize={'sm'}
                          letterSpacing={0.2}>
                      08.01.2024
                    </Text>
                    <Text color={'dimgray'}
                          fontSize={'sm'}
                          letterSpacing={0.5}>
                      CARD
                    </Text>
                  </Flex>
                </Box>
                <Box>
                  <Flex justifyContent={'space-between'}>
                    <Heading size='sm'
                             textTransform='uppercase'
                             isTruncated
                             maxWidth={'70%'}>
                      Fajurki malborasy drogie
                    </Heading>
                    <Heading size={'md'}>
                      30,48 PLN
                    </Heading>
                  </Flex>
                  <Flex justifyContent={'space-between'}>
                    <Text color={'dimgray'}
                          fontSize={'sm'}
                          letterSpacing={0.2}>
                      09.01.2024
                    </Text>
                    <Text color={'dimgray'}
                          fontSize={'sm'}
                          letterSpacing={0.5}>
                      BLIK
                    </Text>
                  </Flex>
                </Box>
                <Box>
                  <Flex justifyContent={'space-between'}>
                    <Heading size='sm'
                             textTransform='uppercase'
                             isTruncated
                             maxWidth={'50%'}>
                      Laptopik zajebisty za duzo siana
                    </Heading>
                    <Heading size={'md'}>
                      3.400.500,48 PLN
                    </Heading>
                  </Flex>
                  <Flex justifyContent={'space-between'}>
                    <Text color={'dimgray'}
                          fontSize={'sm'}
                          letterSpacing={0.2}>
                      04.01.2024
                    </Text>
                    <Text color={'dimgray'}
                          fontSize={'sm'}
                          letterSpacing={0.5}>
                      CASH
                    </Text>
                  </Flex>
                </Box>
                <Box>
                  <Flex justifyContent={'space-between'}>
                    <Box />
                    <Link color={'dimgray'}
                          fontSize={'sm'}
                          href={'history'}
                          letterSpacing={0.5}>
                      View All
                    </Link>
                  </Flex>
                </Box>
              </Stack>
            </CardBody>
          </Card>
        </Flex>
      </Flex>
    </Layout>
  );
}