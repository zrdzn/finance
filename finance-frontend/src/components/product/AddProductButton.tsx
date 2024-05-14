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
import {CategoryResponse, ProductCreateRequest} from "@/components/api"
import {CategorySelect} from "@/components/product/category/CategorySelect"
import { useRouter } from 'next/router'

interface AddProductButtonProperties {
  vaultId: number
}

export const AddProductButton = ({ vaultId }: AddProductButtonProperties) => {
  const theme = useTheme()
  const api = useApi()
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [productCreateRequest, setProductCreateRequest] = useState<ProductCreateRequest>({
    name: '',
    vaultId: vaultId,
    categoryId: null
  })
  const initialRef = useRef(null)
  const finalRef = useRef(null)

  const handleCategoryChange = (category: CategoryResponse | null) => {
    setProductCreateRequest({ ...productCreateRequest, categoryId: category?.id ?? null });
  }

  const handleProductCreateRequestChange = (event: ChangeEvent<HTMLInputElement>) => {
    setProductCreateRequest({ ...productCreateRequest, [event.target.name]: event.target.value });
  }

  const handleProductCreate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api.post("/products/create", productCreateRequest)
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
          <ModalHeader>Add a new product</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input name="name"
                     onChange={handleProductCreateRequestChange}
                     ref={initialRef}
                     placeholder='Name of the product' />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Category</FormLabel>
              <CategorySelect vaultId={vaultId} onChange={handleCategoryChange} />
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