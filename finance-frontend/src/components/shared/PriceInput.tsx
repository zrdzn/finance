import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper
} from "@chakra-ui/react"
import React, {useState} from "react"

interface PriceInputProperties {
  handlePrice: (price: number) => void
}

export const PriceInput = ({ handlePrice }: PriceInputProperties) => {
  const [value, setValue] = useState('0.00')

  return (
    <NumberInput
      onChange={(valueString) => {
        setValue(valueString)
        handlePrice(parseFloat(value))
      }}
      value={value}
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