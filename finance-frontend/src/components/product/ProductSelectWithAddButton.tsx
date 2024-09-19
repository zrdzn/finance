import {Flex,} from '@chakra-ui/react'
import React, {useEffect, useState} from "react"
import {useApi} from "@/hooks/useApi"
import {ProductResponse} from "@/components/api"
import {ProductSelect} from "@/components/product/ProductSelect"
import {AddProductButton} from "@/components/product/AddProductButton"
import {Axios} from "axios"

interface ProductSelectWithAddButtonProperties {
  vaultId: number
  onChange: (product: ProductResponse) => void
}

export const ProductSelectWithAddButton = ({ vaultId, onChange }: ProductSelectWithAddButtonProperties) => {
  const api = useApi()
  const [products, setProducts] = useState<ProductResponse[] | undefined>(undefined)

  useEffect(() => {
    updateProducts(api, vaultId)
  }, [vaultId, api]);

  const updateProducts = (api: Axios, vaultId: number) => {
    api.get(`/products/${vaultId}`)
      .then(response => setProducts(response.data.products))
      .catch(error => console.error(error))
  }

  return (
    <Flex gap={2}>
      <Flex width={'full'}>
        {
          products &&
          <ProductSelect vaultId={vaultId} products={products} onChange={onChange} />
        }
      </Flex>
      <AddProductButton vaultId={vaultId} onCreate={() => updateProducts(api, vaultId)} />
    </Flex>
  )
}