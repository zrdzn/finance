import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton, useDisclosure, Button, FormControl, FormLabel, Input,
} from '@chakra-ui/react'
import React, {ChangeEvent, useRef, useState} from "react"
import {FaPlus} from "react-icons/fa"
import {useTheme} from "@/hooks/theme"
import Select from "react-select"
import {useApi} from "@/hooks/apiClient"
import {PaymentCreateRequest, SelectOptionProperties, SelectProperties} from "@/components/api"
import { useRouter } from 'next/router'
import {PriceInput} from "@/components/shared/PriceInput"

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