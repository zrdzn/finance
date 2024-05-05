import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import {Layout} from "@/components/Layout";
import Head from 'next/head';
import {
  Box,
  Card,
  CardBody, CardHeader,
  Flex, Heading,
  Stack, StackDivider,
  Text,
} from "@chakra-ui/react";
import {useTheme} from "@/hooks/theme";
import React, {useEffect} from "react";
import {useRouter} from "next/router"
import {useAuthentication} from "@/hooks/authentication"

export default function History(): ReactJSXElement {
  const theme = useTheme();
  const router = useRouter();
  const { authenticationDetails } = useAuthentication()

  useEffect(() => {
    if (authenticationDetails === null) {
      router.push("/login")
    }
  }, [authenticationDetails, router]);

  if (authenticationDetails === null) {
    return <></>
  }

  return (
    <Layout>
      <Head>
        <title>Finance - History</title>
      </Head>
      <Flex justifyContent={'center'}>
        <Flex direction={'column'} width={'full'} justifyContent={'center'}>
          <Card margin={2}>
            <CardHeader backgroundColor={theme.secondaryColor}>
              <Flex justifyContent={'space-between'}>
                <Heading size='md'>History of all transactions</Heading>
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
              </Stack>
            </CardBody>
          </Card>
        </Flex>
      </Flex>
    </Layout>
  );
}