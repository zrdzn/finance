import React, {useEffect, useState} from "react"
import {Components} from "@/api/api";
import {SelectOptionProperties, SelectProperties} from "@/api/types";
import {ThemedSelect} from "@/components/shared/ThemedSelect";

type ProductResponse = Components.Schemas.ProductResponse;

interface ProductSelectProperties {
  vaultId: number
  products: ProductResponse[]
  onChange: (product: ProductResponse | null) => void
}

const noneProduct = { value: 'none', label: 'None' }

export const ProductSelect = ({products, onChange }: ProductSelectProperties) => {
  const [selectedProduct, setSelectedProduct] = useState<SelectProperties>(noneProduct)
  const [options, setOptions] = useState<SelectOptionProperties[]>([{ value: selectedProduct?.value ?? '', label: selectedProduct?.label ?? '' }])

  useEffect(() => {
    const newOptions = products
      .map((product: ProductResponse) => ({
        value: product.id.toString(),
        label: product.name
      }))
      .concat(noneProduct);

    setOptions(newOptions)
  }, [products]);

  const handleProductChange = (newValue: SelectProperties) => {
    if (!newValue) {
      return
    }

    if (!products) {
      return
    }

    setSelectedProduct(newValue)

    if (newValue.label === "None") {
      onChange(null)
      return
    }

    const product = products.find(product => product.id.toString() === newValue.value)
    if (!product) {
      console.error(`Product not found: ${newValue.label}`)
      return
    }

    onChange(product)
  }

  return (
    <ThemedSelect
      onChange={handleProductChange}
      defaultValue={noneProduct}
      value={selectedProduct}
      required
      styles={{
        container: (provided: any) => ({ width: '100%', ...provided }),
      }}
      options={options}
      isClearable
    />
  )
}