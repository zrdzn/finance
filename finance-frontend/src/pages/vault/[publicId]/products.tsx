import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import Head from 'next/head';
import {
  Flex
} from "@chakra-ui/react";
import React from "react";
import {useRouter} from "next/router"
import {ProtectedVault} from "@/components/vault/ProtectedVault"
import {ProductsCard} from "@/components/product/ProductsCard"
import {CategoriesCard} from "@/components/product/category/CategoriesCard"
import {AddProductButton} from "@/components/product/AddProductButton"

export default function Products(): ReactJSXElement {
  const router = useRouter()
  const publicId = router.query.publicId

  return (
    <ProtectedVault publicId={publicId}>
      { (vault, permissions) =>
        <>
          <Head>
            <title>Finance - Products</title>
          </Head>
          <Flex justifyContent={'center'}>
            <Flex direction={'column'} width={'full'} justifyContent={'center'}>
              {
                permissions.includes("PRODUCT_READ") && <ProductsCard vault={vault} permissions={permissions} />
              }
              {
                permissions.includes("CATEGORY_READ") && <CategoriesCard vault={vault} permissions={permissions} />
              }
            </Flex>
          </Flex>
        </>
      }
    </ProtectedVault>
  );
}