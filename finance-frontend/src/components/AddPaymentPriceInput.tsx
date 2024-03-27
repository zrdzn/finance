import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper
} from "@chakra-ui/react"
import React from "react"

export const AddPaymentPriceButton = () => {
  const format = (value: string) => `$` + value
  const parse = (value: string) => value.replace(/^\$/, '')

  const [value, setValue] = React.useState('0.00')

  return (
    <NumberInput
      onChange={(valueString) => setValue(parse(valueString))}
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