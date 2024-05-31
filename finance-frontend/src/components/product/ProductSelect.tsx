import Select from "react-select"
import React, {useEffect, useState} from "react"
import {ProductResponse, SelectOptionProperties, SelectProperties} from "@/components/api"

interface ProductSelectProperties {
  vaultId: number
  products: ProductResponse[]
  onChange: (product: ProductResponse) => void
}

const noneProduct = { value: 'none', label: 'None' }

export const ProductSelect = ({ vaultId, products, onChange }: ProductSelectProperties) => {
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

    const product = products.find(product => product.id.toString() === newValue.value)
    if (!product) {
      console.error(`Product not found: ${newValue.label}`)
      return
    }

    onChange(product)
  }

  return (
    <Select onChange={handleProductChange}
            defaultValue={noneProduct}
            value={selectedProduct}
            required
            styles={{
              container: (provided) => ({ width: '100%', ...provided }),
            }}
            options={options} />
  )
}