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
import {AddPaymentPriceButton} from "@/components/payment/AddPaymentPriceInput"
import Select from "react-select"
import {useApi} from "@/hooks/apiClient"
import {PaymentCreateRequest, SelectProperties} from "@/components/api"

interface AddPaymentButtonProperties {
  vaultId: number
}

export const AddPaymentButton = ({ vaultId }: AddPaymentButtonProperties) => {
  const theme = useTheme()
  const api = useApi()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<SelectProperties>({
    value: 'BLIK',
    label: 'BLIK'
  })
  const [paymentCreateForm, setPaymentCreateForm] = useState<PaymentCreateRequest>({
    vaultId: 0,
    paymentMethod: selectedPaymentMethod?.value ?? '',
    description: null,
    price: 0,
    currency: 'PLN'
  })
  const initialRef = useRef(null)
  const finalRef = useRef(null)

  const options = [
    { value: 'BLIK', label: 'BLIK' },
    { value: 'CARD', label: 'Card' },
    { value: 'CASH', label: 'Cash' }
  ]

  const handlePaymentMethodChange = (newValue: SelectProperties) => {
    if (!newValue) {
      return
    }

    setSelectedPaymentMethod(newValue)
    setPaymentCreateForm((previous) => ({ ...previous, paymentMethod: newValue.value }))
  }

  const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPaymentCreateForm((previous) => ({ ...previous, description: event.target.value }));
  }

  const handlePriceChange = (price: number) => {
    setPaymentCreateForm((previous) => ({ ...previous, price: price }));
  }

  const handlePaymentCreate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api.post("/payment/create", {
      vaultId: vaultId,
      paymentMethod: paymentCreateForm.paymentMethod,
      description: paymentCreateForm.description,
      price: paymentCreateForm.price,
      currency: paymentCreateForm.currency
    })
      .then(() => onClose())
      .catch(error => console.error(error))
  }

  return (
    <>
      <Button backgroundColor={theme.primaryColor}
              onClick={onOpen}>
        Add
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
              <Select onChange={handlePaymentMethodChange}
                      defaultValue={selectedPaymentMethod}
                      required
                      options={options} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Price</FormLabel>
              <AddPaymentPriceButton handlePrice={handlePriceChange} />
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