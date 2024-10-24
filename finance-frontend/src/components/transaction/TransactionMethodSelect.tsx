import React, {useState} from "react"
import Select from "react-select"
import {SelectProperties, TransactionMethod} from "@/api/types";

interface TransactionMethodSelectProperties {
  onChange: (transactionMethod: TransactionMethod) => void
  defaultValue?: string
  isDisabled?: boolean
}

export const TransactionMethodSelect = ({ onChange, defaultValue, isDisabled }: TransactionMethodSelectProperties) => {
  const [selectedTransactionMethod, setSelectedTransactionMethod] = useState<SelectProperties>({
    value: defaultValue ?? 'BLIK',
    label: defaultValue ?? 'BLIK'
  })

  const options = [
    { value: 'BLIK', label: 'BLIK' },
    { value: 'CARD', label: 'CARD' },
    { value: 'CASH', label: 'CASH' }
  ]

  const handleTransactionMethodChange = (newValue: SelectProperties) => {
    if (!newValue) {
      return
    }

    setSelectedTransactionMethod(newValue)
    onChange(newValue.value)
  }

  return (
    <Select onChange={handleTransactionMethodChange}
            defaultValue={selectedTransactionMethod}
            required
            isDisabled={isDisabled}
            isClearable
            options={options} />
  )
}