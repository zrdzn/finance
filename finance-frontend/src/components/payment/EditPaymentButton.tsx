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
import {FaEdit, FaPlus} from "react-icons/fa"
import {useTheme} from "@/hooks/theme"
import {useApi} from "@/hooks/apiClient"
import {
  PaymentResponse,
  PaymentUpdateRequest,
  ProductResponse,
  ProductUpdateRequest,
  SelectOptionProperties
} from "@/components/api"
import {CategorySelect} from "@/components/product/category/CategorySelect"
import { useRouter } from 'next/router'
import {PaymentMethodSelect} from "@/components/payment/PaymentMethodSelect"
import {PriceInput} from "@/components/shared/PriceInput"
import {CurrencySelect} from "@/components/shared/CurrencySelect"

interface EditPaymentButtonProperties {
  payment: PaymentResponse
}

export const EditPaymentButton = ({ payment }: EditPaymentButtonProperties) => {
  const theme = useTheme()
  const api = useApi()
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [paymentUpdateRequest, setPaymentUpdateRequest] = useState<PaymentUpdateRequest>({
    paymentMethod: payment.paymentMethod,
    description: payment.description,
    total: payment.total,
    currency: payment.currency,
  })
  const initialRef = useRef(null)
  const finalRef = useRef(null)

  const handlePaymentMethodChange = (paymentMethod: string) => {
    setPaymentUpdateRequest((previous) => ({ ...previous, paymentMethod: paymentMethod }))
  }

  const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPaymentUpdateRequest((previous) => ({ ...previous, description: event.target.value }));
  }

  const handleTotalChange = (total: number) => {
    setPaymentUpdateRequest((previous) => ({ ...previous, total: total }));
  }

  const handleCurrencyChange = (currency: string) => {
    setPaymentUpdateRequest((previous) => ({ ...previous, currency: currency }))
  }

  const handleProductUpdate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api.patch(`/payment/${payment.id}`, paymentUpdateRequest)
      .then(() => onClose())
      .then(() => router.reload())
      .catch(error => console.error(error))
  }

  return (
    <>
      <Button backgroundColor={theme.primaryColor}
              onClick={(event) => { event.preventDefault(); onOpen() } }>
        <FaEdit />
      </Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update payment</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mt={4}>
              <FormLabel>Method</FormLabel>
              <PaymentMethodSelect onChange={handlePaymentMethodChange}
                                   defaultValue={paymentUpdateRequest.paymentMethod} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Input onChange={handleDescriptionChange}
                     ref={initialRef}
                     value={paymentUpdateRequest.description ?? ""}
                     placeholder='What did you pay for?' />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Total</FormLabel>
              <PriceInput onChange={handleTotalChange}
                          defaultValue={paymentUpdateRequest.total} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Currency</FormLabel>
              <CurrencySelect onChange={handleCurrencyChange}
                              defaultValue={paymentUpdateRequest.currency} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleProductUpdate}
                    backgroundColor={theme.primaryColor}
                    mr={3}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}