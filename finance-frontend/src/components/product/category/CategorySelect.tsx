import Select from "react-select"
import React, {useEffect, useState} from "react"
import {CategoryResponse, SelectProperties} from "@/components/api"
import {useApi} from "@/hooks/apiClient"

interface ProductCategorySelectProperties {
  vaultId: number
  onChange: (category: CategoryResponse) => void
}

export const CategorySelect = ({ vaultId, onChange }: ProductCategorySelectProperties) => {
  const api = useApi()
  const [categories, setCategories] = useState<CategoryResponse[]>()
  const [selectedCategory, setSelectedCategory] = useState<SelectProperties>({ value: '', label: '' })
  const [options, setOptions] = useState<[{ value: string, label: string }]>()

  useEffect(() => {
    api.get(`/categories/${vaultId}`)
      .then(response => {
        setCategories(response.data.categories)
        setOptions(response.data.categories.map((category: CategoryResponse) => ({
          value: category.id.toString(),
          label: category.name
        })))
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

    const category = categories.find(category => category.id.toString() === newValue.value)
    if (!category) {
      return
    }

    setSelectedCategory(newValue)
    onChange(category)
  }

  return (
    <Select onChange={handleCategoryChange}
            defaultValue={selectedCategory}
            required
            options={options} />
  )
}