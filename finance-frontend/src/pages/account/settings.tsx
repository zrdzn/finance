import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import Head from 'next/head';
import {
  Card,
  CardBody,
  CardHeader,
  Flex,
  Text
} from "@chakra-ui/react";
import React, {useEffect} from "react";
import {useRouter} from "next/router"
import {useTheme} from "@/hooks/useTheme"
import {useAuthentication} from "@/hooks/useAuthentication"
import {Layout} from "@/components/Layout"
import {GetStaticPropsContext} from "next";
import {useTranslations} from "next-intl";
import {Components} from "@/api/api"
import {AccountProfileUpdateForm} from "@/components/account/AccountProfileUpdateForm";

export default function AccountSettings(): ReactJSXElement {
  const { details } = useAuthentication()
  const router = useRouter()
  const theme = useTheme()
  const t = useTranslations("AccountSettings")

  useEffect(() => {
    if (details === null) {
      router.push("/login")
    }
  }, [details, router]);

  if (details === null) {
    return <></>
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
                <Text fontSize='md' fontWeight={'600'}>{t('profile-card.title')}</Text>
              </Flex>
            </CardHeader>
            <CardBody>
              {
                details && <AccountProfileUpdateForm user={details} />
              }
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
