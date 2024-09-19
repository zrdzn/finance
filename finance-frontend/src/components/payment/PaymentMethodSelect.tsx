import React, {useState} from "react"
import Select from "react-select"
import {SelectProperties} from "@/components/api"

interface PaymentMethodSelectProperties {
  onChange: (paymentMethod: string) => void
  defaultValue?: string
  isDisabled?: boolean
}

export const PaymentMethodSelect = ({ onChange, defaultValue, isDisabled }: PaymentMethodSelectProperties) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<SelectProperties>({
    value: defaultValue ?? 'BLIK',
    label: defaultValue ?? 'BLIK'
  })

  const options = [
    { value: 'BLIK', label: 'BLIK' },
    { value: 'CARD', label: 'CARD' },
    { value: 'CASH', label: 'CASH' }
  ]

  const handlePaymentMethodChange = (newValue: SelectProperties) => {
    if (!newValue) {
      return
    }

    setSelectedPaymentMethod(newValue)
    onChange(newValue.value)
  }

  return (
    <Select onChange={handlePaymentMethodChange}
            defaultValue={selectedPaymentMethod}
            required
            isDisabled={isDisabled}
            isClearable
            options={options} />
  )
}