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
import {useTheme} from "@/hooks/useTheme"
import {useApi} from "@/hooks/useApi"
import {CategorySelect} from "@/components/product/category/CategorySelect"
import toast from "react-hot-toast"
import {useTranslations} from "next-intl";
import {Components} from "@/api/api";
import {AddButton} from "@/components/shared/AddButton";
import {PriceInput} from "@/components/shared/PriceInput";

type ProductCreateRequest = Components.Schemas.ProductCreateRequest;
type CategoryResponse = Components.Schemas.CategoryResponse;
type ProductResponse = Components.Schemas.ProductResponse;

interface AddProductButtonProperties {
  vaultId: number
  onCreate?: (product: ProductResponse) => void
}

export const AddProductButton = ({ vaultId, onCreate }: AddProductButtonProperties) => {
  const theme = useTheme()
  const { api } = useApi()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const t = useTranslations("Products")
  const [productCreateRequest, setProductCreateRequest] = useState<ProductCreateRequest>({
    name: '',
    vaultId: vaultId,
    categoryId: undefined,
    unitAmount: 0
  })
  const initialRef = useRef(null)
  const finalRef = useRef(null)

  const handleCategoryChange = (category: CategoryResponse | null) => {
    setProductCreateRequest({ ...productCreateRequest, categoryId: category?.id });
  }

  const handleProductCreateRequestChange = (event: ChangeEvent<HTMLInputElement>) => {
    setProductCreateRequest({ ...productCreateRequest, [event.target.name]: event.target.value });
  }

  const handlePriceChange = (price: number) => {
    setProductCreateRequest({ ...productCreateRequest, unitAmount: price });
  }

  const handleProductCreate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api
        .then(client => client.createProduct(null, productCreateRequest)
            .then(response => {
                toast.success(t('product-created-success').replace("%name%", productCreateRequest.name))
                setTimeout(() => {
                    onClose()
                    onCreate?.(response.data)
                }, 1000)
            }))
        .catch(error => console.error(error))
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
              <Input name="name"
                     onChange={handleProductCreateRequestChange}
                     ref={initialRef}
                     placeholder={t('create-modal.name-placeholder')} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>{t('create-modal.category-label')}</FormLabel>
              <CategorySelect vaultId={vaultId} onChange={handleCategoryChange} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>{t('create-modal.price-label')}</FormLabel>
              <PriceInput onChange={handlePriceChange} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleProductCreate}
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
