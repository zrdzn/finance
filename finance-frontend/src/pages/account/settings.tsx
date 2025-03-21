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
import {AccountProfileUpdateForm} from "@/components/account/AccountProfileUpdateForm";

export default function AccountSettings() {
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
              margin={4}
              boxShadow="base"
              borderRadius="lg"
              overflow="hidden"
              backgroundColor={theme.background.secondary}
              color={theme.text.primary}
          >
            <CardHeader>
              <Text fontSize="sm" fontWeight="600">
                {t("profile-card.title")}
              </Text>
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
