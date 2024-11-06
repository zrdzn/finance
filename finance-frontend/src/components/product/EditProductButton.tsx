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
  useDisclosure,
} from '@chakra-ui/react'
import React, {useRef, useState} from "react"
import {FaEdit} from "react-icons/fa"
import {useTheme} from "@/hooks/useTheme"
import {useApi} from "@/hooks/useApi"
import {CategorySelect} from "@/components/product/category/CategorySelect"
import {useRouter} from 'next/router'
import toast from "react-hot-toast"
import {useTranslations} from "next-intl";
import {Components} from "@/api/api";

type ProductResponse = Components.Schemas.ProductResponse;
type ProductUpdateRequest = Components.Schemas.ProductUpdateRequest;
type CategoryResponse = Components.Schemas.CategoryResponse;

interface EditProductButtonProperties {
  product: ProductResponse
}

export const EditProductButton = ({ product }: EditProductButtonProperties) => {
  const theme = useTheme()
  const api = useApi()
  const router = useRouter()
  const t = useTranslations("Products")
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [productUpdateRequest, setProductUpdateRequest] = useState<ProductUpdateRequest>({
    categoryId: product.categoryId
  })
  const initialRef = useRef(null)
  const finalRef = useRef(null)

  const handleCategoryChange = (category: CategoryResponse | null) => {
    setProductUpdateRequest({ ...productUpdateRequest, categoryId: category?.id });
  }

  const handleProductUpdate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api
        .then(client => client.updateProduct({ productId: product.id }, productUpdateRequest))
        .then(() => onClose())
        .then(() => {
          toast.success(t('product-updated-success'))
          setTimeout(() => router.reload(), 1000)
        })
        .catch(error => console.error(error))
  }

  return (
    <>
      <Button backgroundColor={theme.primaryColor}
              color={'#f8f8f8'} fontWeight={'400'}
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
          <ModalHeader>{t('update-modal.title')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mt={4}>
              <FormLabel>{t('update-modal.category-label')}</FormLabel>
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
                    color={'#f8f8f8'} fontWeight={'400'}
                    mr={3}>
              {t('update-modal.submit')}
            </Button>
            <Button onClick={onClose}>{t('update-modal.cancel')}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
