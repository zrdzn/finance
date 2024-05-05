import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper
} from "@chakra-ui/react"
import React from "react"

interface AddPaymentPriceButtonProperties {
  handlePrice: (price: number) => void
}

export const AddPaymentPriceButton = ({ handlePrice }: AddPaymentPriceButtonProperties) => {
  const format = (value: string) => `$` + value
  const parse = (value: string) => value.replace(/^\$/, '')

  const [value, setValue] = React.useState('0.00')

  return (
    <NumberInput
      onChange={(valueString) => {
        setValue(parse(valueString))
        handlePrice(parseFloat(value))
      }}
      value={format(value)}
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