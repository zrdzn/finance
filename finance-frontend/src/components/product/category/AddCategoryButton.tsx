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
import {CategoryCreateRequest} from "@/components/api"
import { useRouter } from 'next/router'
import toast from "react-hot-toast"

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
      .then(() => {
        toast.success(`Category ${categoryCreateRequest.name} has been created`)
        setTimeout(() => router.reload(), 1000)
      })
      .catch(error => {
        console.error(error)
        toast.error(`Failed to create a category`)
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