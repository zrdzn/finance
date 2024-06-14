import React, {useState} from "react"
import currencyCodes from 'currency-codes'
import Select from "react-select"

interface CurrencyOption {
  value: string
  label: string
}

interface CurrencySelectProperties {
  onChange: (currencyCode: string) => void
  defaultValue?: string
}

export const CurrencySelect = ({ onChange, defaultValue }: CurrencySelectProperties) => {
  const currencies = currencyCodes.codes().map(code => ({
    value: code,
    label: `${code} - ${currencyCodes.code(code)?.currency}`
  }))

  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyOption | null>({
    value: defaultValue ?? 'PLN',
    label: defaultValue ?? 'PLN'
  })

  const handleChange = (option: CurrencyOption | null) => {
    setSelectedCurrency(option)
    onChange(option ? option.value : '')
  }

  return (
    <Select defaultValue={selectedCurrency}
            onChange={handleChange}
            required
            options={currencies}
            isClearable />
  )
}