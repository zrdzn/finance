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
import {CategoryResponse, ProductResponse, ProductUpdateRequest} from "@/components/api"
import {CategorySelect} from "@/components/product/category/CategorySelect"
import { useRouter } from 'next/router'

interface EditProductButtonProperties {
  product: ProductResponse
}

export const EditProductButton = ({ product }: EditProductButtonProperties) => {
  const theme = useTheme()
  const api = useApi()
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [productUpdateRequest, setProductUpdateRequest] = useState<ProductUpdateRequest>({
    categoryId: product.categoryId
  })
  const initialRef = useRef(null)
  const finalRef = useRef(null)

  const handleCategoryChange = (category: CategoryResponse | null) => {
    setProductUpdateRequest({ ...productUpdateRequest, categoryId: category?.id ?? null });
  }

  const handleProductUpdate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api.patch(`/products/${product.id}`, productUpdateRequest)
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
          <ModalHeader>Update product</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mt={4}>
              <FormLabel>Category</FormLabel>
              <CategorySelect vaultId={product.vaultId}
                              onChange={handleCategoryChange}
                              defaultValue={{
                                id: product.categoryId ?? 0,
                                name: product.categoryName ?? 'None',
                                vaultId: product.vaultId
                              }} />
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