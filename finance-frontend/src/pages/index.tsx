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
import React from "react";
import {AddPaymentButton} from "@/components/AddPaymentButton"

export default function Dashboard(): ReactJSXElement {
  const theme = useTheme();

  return (
    <Layout>
      <Head>
        <title>Finance - Overview</title>
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