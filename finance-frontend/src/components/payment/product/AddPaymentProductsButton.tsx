import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  useDisclosure,
} from '@chakra-ui/react'
import React, {useRef, useState} from "react"
import {FaPlus} from "react-icons/fa"
import {useTheme} from "@/hooks/useTheme"
import {useApi} from "@/hooks/useApi"
import {PaymentProductCreateRequest, ProductResponse} from "@/components/api"
import {useRouter} from 'next/router'
import {PriceInput} from "@/components/shared/PriceInput"
import {ProductSelectWithAddButton} from "@/components/product/ProductSelectWithAddButton"
import toast from "react-hot-toast"

interface AddPaymentProductsButtonProperties {
  vaultId: number
  paymentId: number
}

export const AddPaymentProductsButton = ({ vaultId, paymentId }: AddPaymentProductsButtonProperties) => {
  const theme = useTheme()
  const api = useApi()
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [paymentProductCreateRequest, setPaymentProductCreateRequest] = useState<PaymentProductCreateRequest>({
    productId: 0,
    unitAmount: 0,
    quantity: 1
  })
  const initialRef = useRef(null)
  const finalRef = useRef(null)

  const handleProductChange = (product: ProductResponse) => {
    setPaymentProductCreateRequest({ ...paymentProductCreateRequest, productId: product.id });
  }

  const handlePriceChange = (price: number) => {
    setPaymentProductCreateRequest({ ...paymentProductCreateRequest, unitAmount: price });
  }

  const handlePaymentProductCreate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api.post(`/payment/${paymentId}/products/create`, paymentProductCreateRequest)
      .then(() => onClose())
      .then(() => {
        toast.success(`Product has been added to the payment`)
        setTimeout(() => router.reload(), 1000)
      })
      .catch(error => {
        console.error(error)
        toast.error(`Failed to add product to the payment`)
      })
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
          <ModalHeader>Add a product</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Product</FormLabel>
              <ProductSelectWithAddButton vaultId={vaultId} onChange={handleProductChange} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Price per unit</FormLabel>
              <PriceInput onChange={handlePriceChange} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Quantity</FormLabel>
              <NumberInput
                onChange={(valueString) => setPaymentProductCreateRequest(
                  { ...paymentProductCreateRequest, quantity: parseInt(valueString) }
                )}
                value={paymentProductCreateRequest.quantity}
                min={1}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handlePaymentProductCreate}
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