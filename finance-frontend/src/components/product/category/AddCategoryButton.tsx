import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import React, {ChangeEvent, useRef, useState} from "react"
import {FaPlus} from "react-icons/fa"
import {useTheme} from "@/hooks/useTheme"
import {useApi} from "@/hooks/useApi"
import {useRouter} from 'next/router'
import toast from "react-hot-toast"
import {useTranslations} from "next-intl";
import {Components} from "@/api/api";
import {AddButton} from "@/components/shared/AddButton";

type CategoryCreateRequest = Components.Schemas.CategoryCreateRequest;

interface AddCategoryButtonProperties {
  vaultId: number
}

export const AddCategoryButton = ({ vaultId }: AddCategoryButtonProperties) => {
  const theme = useTheme()
  const { api } = useApi()
  const router = useRouter()
  const t = useTranslations("Categories")
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

    api
      .then(client => client.createCategory(null, categoryCreateRequest))
      .then(() => onClose())
      .then(() => {
        toast.success(t('category-created-success').replace("%name%", categoryCreateRequest.name))
        setTimeout(() => router.reload(), 1000)
      })
      .catch(error => {
        console.error(error)
        toast.error(t('category-created-error'))
      })
  }

  return (
    <>
      <AddButton onClick={onOpen} />

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent backgroundColor={theme.background.secondary}
                      color={theme.text.primary}>
          <ModalHeader>{t('create-modal.title')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>{t('create-modal.name-label')}</FormLabel>
              <Input name={'name'}
                     onChange={handleCategoryCreateRequestChange}
                     ref={initialRef}
                     placeholder={t("create-modal.name-placeholder")} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleCategoryCreate}
                    backgroundColor={theme.secondary}
                    color={'#f8f8f8'}
                    fontWeight={'400'}
                    mr={3}>
              {t('create-modal.submit')}
            </Button>
            <Button onClick={onClose}>{t('create-modal.cancel')}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
