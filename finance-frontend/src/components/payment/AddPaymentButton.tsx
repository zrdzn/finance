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
import {PaymentCreateRequest, SelectOptionProperties, SelectProperties, VaultResponse} from "@/components/api"
import { useRouter } from 'next/router'
import {PriceInput} from "@/components/shared/PriceInput"
import {PaymentMethodSelect} from "@/components/payment/PaymentMethodSelect"
import {CurrencySelect} from "@/components/shared/CurrencySelect"

interface AddPaymentButtonProperties {
  vault: VaultResponse
}

export const AddPaymentButton = ({ vault }: AddPaymentButtonProperties) => {
  const theme = useTheme()
  const api = useApi()
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [paymentCreateForm, setPaymentCreateForm] = useState<PaymentCreateRequest>({
    vaultId: 0,
    paymentMethod: vault.paymentMethod,
    description: null,
    price: 0,
    currency: vault.currency
  })
  const initialRef = useRef(null)
  const finalRef = useRef(null)

  const handlePaymentMethodChange = (paymentMethod: string) => {
    setPaymentCreateForm((previous) => ({ ...previous, paymentMethod: paymentMethod }))
  }

  const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPaymentCreateForm((previous) => ({ ...previous, description: event.target.value }));
  }

  const handlePriceChange = (price: number) => {
    setPaymentCreateForm((previous) => ({ ...previous, price: price }));
  }

  const handleCurrencyChange = (currency: string) => {
    setPaymentCreateForm((previous) => ({ ...previous, currency: currency }))
  }

  const handlePaymentCreate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api.post("/payment/create", {
      vaultId: vault.id,
      paymentMethod: paymentCreateForm.paymentMethod,
      description: paymentCreateForm.description,
      price: paymentCreateForm.price,
      currency: paymentCreateForm.currency
    })
      .then(() => onClose())
      .then(() => router.reload())
      .catch(error => console.error(error))
  }

  return (
    <>
      <Button backgroundColor={theme.primaryColor}
              onClick={onOpen}>
        <FaPlus />
      </Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a new payment</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input onChange={handleDescriptionChange}
                     ref={initialRef}
                     placeholder='What did you pay for?' />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Payment method</FormLabel>
              <PaymentMethodSelect onChange={handlePaymentMethodChange} defaultValue={paymentCreateForm.paymentMethod} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Price</FormLabel>
              <PriceInput onChange={handlePriceChange} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Currency</FormLabel>
              <CurrencySelect onChange={handleCurrencyChange} defaultValue={paymentCreateForm.currency} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handlePaymentCreate}
                    backgroundColor={theme.primaryColor}
                    mr={3}>
              Add
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}