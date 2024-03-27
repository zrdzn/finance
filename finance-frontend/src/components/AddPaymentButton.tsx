import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton, useDisclosure, Button, FormControl, FormLabel, Input,
} from '@chakra-ui/react'
import React, {useRef, useState} from "react"
import {FaPlus} from "react-icons/fa"
import {useTheme} from "@/hooks/theme"
import {AddPaymentPriceButton} from "@/components/AddPaymentPriceInput"
import Select from "react-select"
import {PropsValue} from "react-select"

interface PaymentCreateRequest {
  customerId: number;
  paymentMethod: string;
  description: string;
  price: number;
  currency: string;
}

export const AddPaymentButton = () => {
  const theme = useTheme()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PropsValue<{
      value: string;
      label: string;
  }>>({
    value: 'blik',
    label: 'BLIK'
  })
  const initialRef = useRef(null)
  const finalRef = useRef(null)

  const options = [
    { value: 'blik', label: 'BLIK' },
    { value: 'card', label: 'Card' },
    { value: 'cash', label: 'Cash' }
  ]

  return (
    <>
      <Button backgroundColor={theme.primaryColor}
              onClick={onOpen}
              leftIcon={<FaPlus />}>
        Add Payment
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
              <Input ref={initialRef} placeholder='What did you pay for?' />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Payment method</FormLabel>
              <Select onChange={setSelectedPaymentMethod}
                      defaultValue={selectedPaymentMethod}
                      required
                      options={options} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Price</FormLabel>
              <AddPaymentPriceButton />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button backgroundColor={theme.primaryColor} mr={3}>
              Add
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}