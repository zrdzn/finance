import Head from 'next/head';
import {Flex, Grid} from "@chakra-ui/react";
import React from "react";
import {useRouter} from "next/router"
import {ProtectedVault} from "@/components/vault/ProtectedVault"
import {ProductsTable} from "@/components/product/ProductsTable"
import {CategoriesCard} from "@/components/product/category/CategoriesCard"
import {GetStaticPropsContext} from "next";
import {useTranslations} from "next-intl";

export default function Products() {
  const router = useRouter()
  const publicId = router.query.publicId
  const t = useTranslations("Products")

  return (
    <ProtectedVault publicId={publicId}>
      { (vault, vaultRole) =>
        <>
          <Head>
            <title>{t('title')}</title>
          </Head>
          <Flex justifyContent="center" p={4}>
            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
              gap={4}
              width="full">
              {vaultRole.permissions.includes("PRODUCT_READ") && (
                <ProductsTable vault={vault} permissions={vaultRole.permissions} />
              )}
              {vaultRole.permissions.includes("CATEGORY_READ") && (
                <CategoriesCard vault={vault} permissions={vaultRole.permissions} />
              )}
            </Grid>
          </Flex>
        </>
      }
    </ProtectedVault>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`../../../locales/${context.locale}.json`)).default
    }
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking'
  }
}