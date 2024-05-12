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
import {CategoryCreateRequest} from "@/components/api"
import { useRouter } from 'next/router'

interface AddCategoryButtonProperties {
  vaultId: number
}

export const AddCategoryButton = ({ vaultId }: AddCategoryButtonProperties) => {
  const theme = useTheme()
  const api = useApi()
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [categoryCreateRequest, setCategoryCreateRequest] = useState<CategoryCreateRequest>({
    name: '',
    vaultId: vaultId
  })
  const initialRef = useRef(null)
  const finalRef = useRef(null)

  const handleCategoryCreateRequestChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCategoryCreateRequest({ ...categoryCreateRequest, [event.target.name]: event.target.value });
  };

  const handleCategoryCreate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api.post("/categories/create", categoryCreateRequest)
      .then(() => onClose())
      .then(() => router.reload())
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
          <ModalHeader>Add a new category</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input name={'name'}
                     onChange={handleCategoryCreateRequestChange}
                     ref={initialRef}
                     placeholder='Name of the category' />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleCategoryCreate}
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