import Select from "react-select"
import React, {useEffect, useState} from "react"
import {ProductResponse, SelectOptionProperties, SelectProperties} from "@/components/api"
import {useApi} from "@/hooks/apiClient"

interface ProductCategorySelectProperties {
  vaultId: number
  onChange: (category: ProductResponse | null) => void
}

const noneCategory = { value: 'none', label: 'None' }

export const CategorySelect = ({ vaultId, onChange }: ProductCategorySelectProperties) => {
  const api = useApi()
  const [categories, setCategories] = useState<ProductResponse[]>()
  const [selectedCategory, setSelectedCategory] = useState<SelectProperties>(noneCategory)
  const [options, setOptions] = useState<SelectOptionProperties[]>([{ value: selectedCategory?.value ?? '', label: selectedCategory?.label ?? '' }])

  useEffect(() => {
    api.get(`/categories/vault/${vaultId}`)
      .then(response => {
        setCategories(response.data.categories)

        const newOptions = response.data.categories
          .map((category: ProductResponse) => ({
            value: category.id.toString(),
            label: category.name
          }))
          .concat(noneCategory);

        setOptions(newOptions)
      })
      .catch(error => console.error(error))
  }, [api, vaultId]);

  const handleCategoryChange = (newValue: SelectProperties) => {
    if (!newValue) {
      return
    }

    if (!categories) {
      return
    }

    setSelectedCategory(newValue)

    const category = categories.find(category => category.id.toString() === newValue.value)
    if (!category) {
      onChange(null)
      return
    }

    onChange(category)
  }

  return (
    <Select onChange={handleCategoryChange}
            defaultValue={noneCategory}
            value={selectedCategory}
            required
            options={options} />
  )
}