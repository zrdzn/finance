import Select from "react-select"
import React, {useEffect, useState} from "react"
import {useApi} from "@/hooks/useApi"
import {Components} from "@/api/api";
import {SelectOptionProperties, SelectProperties} from "@/api/types";
import {ThemedSelect} from "@/components/shared/ThemedSelect";

type CategoryResponse = Components.Schemas.CategoryResponse;

interface ProductCategorySelectProperties {
  vaultId: number
  onChange: (category: CategoryResponse | null) => void
  defaultValue?: CategoryResponse
}

export const CategorySelect = ({ vaultId, onChange, defaultValue }: ProductCategorySelectProperties) => {
  const api = useApi()
  const [categories, setCategories] = useState<CategoryResponse[]>()
  const [selectedCategory, setSelectedCategory] = useState<SelectProperties>({
    value: defaultValue?.id.toString() ?? 'None',
    label: defaultValue?.name ?? 'None'
  })
  const [options, setOptions] = useState<SelectOptionProperties[]>([{ value: selectedCategory?.value ?? '', label: selectedCategory?.label ?? '' }])

  useEffect(() => {
    api
      .then(client => client.getCategoriesByVaultId(vaultId)
        .then(response => {
          setCategories(response.data.categories)

          const newOptions = response.data.categories
            .map((category: CategoryResponse) => ({
              value: category.id.toString(),
              label: category.name
            }))
            .concat({ value: 'None', label: 'None' });

          setOptions(newOptions)
        }))
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
    <ThemedSelect
      onChange={handleCategoryChange}
      defaultValue={selectedCategory}
      required
      options={options}
      isClearable
    />
  )
}