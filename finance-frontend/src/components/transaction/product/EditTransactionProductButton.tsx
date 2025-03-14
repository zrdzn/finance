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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Stack,
  useDisclosure,
} from '@chakra-ui/react'
import React, {ChangeEvent, useRef, useState} from "react"
import {useTheme} from "@/hooks/useTheme"
import {useApi} from "@/hooks/useApi"
import {TransactionMethodSelect} from "@/components/transaction/TransactionMethodSelect"
import {PriceInput} from "@/components/shared/PriceInput"
import {CurrencySelect} from "@/components/shared/CurrencySelect"
import toast from "react-hot-toast"
import {useTranslations} from "next-intl";
import {Components} from "@/api/api";
import {EditButton} from "@/components/shared/EditButton";
import {ProductSelectWithAddButton} from "@/components/product/ProductSelectWithAddButton";
import {CategorySelect} from "@/components/product/category/CategorySelect";
import {useRouter} from "next/router";

type VaultResponse = Components.Schemas.VaultResponse;
type ProductResponse = Components.Schemas.ProductResponse;
type CategoryResponse = Components.Schemas.CategoryResponse;
type TransactionProductUpdateRequest = Components.Schemas.TransactionProductUpdateRequest;
type TransactionProductResponse = Components.Schemas.TransactionProductResponse;

interface EditTransactionProductButtonProperties {
  vault: VaultResponse
  transactionProduct: TransactionProductResponse
}

export const EditTransactionProductButton = ({ vault, transactionProduct }: EditTransactionProductButtonProperties) => {
  const theme = useTheme()
  const api = useApi()
  const router = useRouter()
  const t = useTranslations("Transactions.product")
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [transactionProductUpdateRequest, setTransactionProductUpdateRequest] = useState<TransactionProductUpdateRequest>({
    name: transactionProduct.name,
    categoryId: transactionProduct.category?.id,
    unitAmount: transactionProduct.unitAmount,
    quantity: transactionProduct.quantity,
  })
  const [category, setCategory] = useState<CategoryResponse | undefined>(undefined)
  const initialRef = useRef(null)
  const finalRef = useRef(null)

  const handlePresetChange = (product: ProductResponse | null) => {
    setTransactionProductUpdateRequest({
      name: product?.name ?? "",
      categoryId: product?.category?.id ?? undefined,
      unitAmount: product?.unitAmount ?? 0,
      quantity: 1
    })

    setCategory(product?.category)
  }

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTransactionProductUpdateRequest({
      ...transactionProductUpdateRequest,
      name: event.target.value
    })
  }

  const handleCategoryChange = (category: CategoryResponse | null) => {
    setTransactionProductUpdateRequest({
      ...transactionProductUpdateRequest,
      categoryId: category?.id
    })
  }

  const handleUnitAmountChange = (unitAmount: number) => {
    setTransactionProductUpdateRequest({
      ...transactionProductUpdateRequest,
      unitAmount: unitAmount
    })
  }

  const handleTransactionProductUpdate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api
        .then(client => client.updateTransactionProduct({
          transactionId: transactionProduct.transactionId,
          productId: transactionProduct.id
        }, transactionProductUpdateRequest))
        .then(() => onClose())
        .then(() => {
            toast.success(t('product-updated-success'))
            setTimeout(() => router.reload(), 1000)
        })
        .catch(error => {
            console.error(error)
            toast.error(t('product-updated-error'))
        })
  }

  return (
    <>
      <EditButton
        onClick={(event) => { event.preventDefault(); onOpen() } }
        hideText={true} />

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent backgroundColor={theme.background.secondary}
                      color={theme.text.primary}>
          <ModalHeader>{t('update-modal.title')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>{t('update-modal.preset-label')}</FormLabel>
              <ProductSelectWithAddButton vaultId={vault.id} onChange={handlePresetChange} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>{t('update-modal.product-label')}</FormLabel>
              <Input name={'name'}
                     onChange={handleNameChange}
                     ref={initialRef}
                     value={transactionProductUpdateRequest.name}
                     placeholder={t("update-modal.product-placeholder")} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>{t('update-modal.category-label')}</FormLabel>
              <CategorySelect vaultId={vault.id} onChange={handleCategoryChange} defaultValue={category} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>{t('update-modal.price-label')}</FormLabel>
              <PriceInput onChange={handleUnitAmountChange} defaultValue={transactionProductUpdateRequest.unitAmount} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>{t('update-modal.quantity-label')}</FormLabel>
              <NumberInput
                onChange={(valueString) => setTransactionProductUpdateRequest(
                  { ...transactionProductUpdateRequest, quantity: parseInt(valueString) }
                )}
                value={transactionProductUpdateRequest.quantity}
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
            <Button onClick={handleTransactionProductUpdate}
                    backgroundColor={theme.secondary}
                    color={'#f8f8f8'}
                    fontWeight={'400'}
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
