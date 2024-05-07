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
import {useApi} from "@/hooks/apiClient"
import {CategoryResponse, ProductCreateRequest, ProductPriceCreateRequest, SelectProperties} from "@/components/api"
import {CategorySelect} from "@/components/product/category/CategorySelect"
import Select from "react-select"

interface AddProductPriceButtonProperties {
  productId: number
}

export const AddProductPriceButton = ({ productId }: AddProductPriceButtonProperties) => {
  const theme = useTheme()
  const api = useApi()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedCurrency, setSelectedCurrency] = useState<SelectProperties>({
    value: 'PLN',
    label: 'PLN'
  })
  const [productPriceCreateRequest, setProductPriceCreateRequest] = useState<ProductPriceCreateRequest>({
    unitAmount: 0,
    currency: selectedCurrency?.value ?? '',
  })
  const initialRef = useRef(null)
  const finalRef = useRef(null)

  const options = [
    { value: 'PLN', label: 'PLN' },
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' }
  ]

  const handleCurrencyChange = (newValue: SelectProperties) => {
    if (!newValue) {
      return
    }

    setSelectedCurrency(newValue)
    setProductPriceCreateRequest((previous) => ({ ...previous, currency: newValue.value }))
  }

  const handleProductCreateRequestChange = (event: ChangeEvent<HTMLInputElement>) => {
    setProductPriceCreateRequest({ ...productPriceCreateRequest, [event.target.name]: event.target.value });
  }

  const handleProductCreate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api.post(`/products/${productId}/prices`, productPriceCreateRequest)
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
          <ModalHeader>Add a new price</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mt={4}>
              <FormLabel>Currency</FormLabel>
              <Select onChange={handleCurrencyChange}
                      defaultValue={selectedCurrency}
                      required
                      options={options} />
            </FormControl>

            <FormControl>
              <FormLabel>Unit amount</FormLabel>
              <Input name="unitAmount"
                     onChange={handleProductCreateRequestChange}
                     ref={initialRef}
                     placeholder='Amount for the unit' />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleProductCreate}
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