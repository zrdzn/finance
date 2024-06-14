import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper
} from "@chakra-ui/react"
import React, {useState} from "react"

interface PriceInputProperties {
  onChange: (price: number) => void
  defaultValue?: number
}

export const PriceInput = ({ onChange, defaultValue }: PriceInputProperties) => {
  const [value, setValue] = useState<string | null>(null)

  return (
    <NumberInput
      onChange={(valueString) => {
        setValue(valueString)
        onChange(parseFloat(valueString))
      }}
      value={value ?? defaultValue?.toFixed(2) ?? '0.00'}
      min={0}
    >
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  )
}