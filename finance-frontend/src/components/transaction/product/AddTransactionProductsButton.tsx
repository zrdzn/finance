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
import {useRouter} from 'next/router'
import {PriceInput} from "@/components/shared/PriceInput"
import {ProductSelectWithAddButton} from "@/components/product/ProductSelectWithAddButton"
import toast from "react-hot-toast"
import {useTranslations} from "next-intl";
import {Components} from "@/api/api";
import {AddButton} from "@/components/shared/AddButton";

type TransactionProductCreateRequest = Components.Schemas.TransactionProductCreateRequest;
type ProductResponse = Components.Schemas.ProductResponse;

interface AddTransactionProductsButtonProperties {
  vaultId: number
  transactionId: number
}

export const AddTransactionProductsButton = ({ vaultId, transactionId }: AddTransactionProductsButtonProperties) => {
  const theme = useTheme()
  const api = useApi()
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const t = useTranslations("Transactions")
  const [transactionProductCreateRequest, setTransactionProductCreateRequest] = useState<TransactionProductCreateRequest>({
    productId: 0,
    unitAmount: 0,
    quantity: 1
  })
  const initialRef = useRef(null)
  const finalRef = useRef(null)

  const handleProductChange = (product: ProductResponse) => {
    setTransactionProductCreateRequest({ ...transactionProductCreateRequest, productId: product.id });
  }

  const handlePriceChange = (price: number) => {
    setTransactionProductCreateRequest({ ...transactionProductCreateRequest, unitAmount: price });
  }

  const handleTransactionProductCreate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api
        .then(client => client.createTransactionProduct({ transactionId: transactionId }, transactionProductCreateRequest))
        .then(() => onClose())
        .then(() => {
          toast.success(t('product.product-added-success'))
          setTimeout(() => router.reload(), 1000)
        })
        .catch(error => {
            console.error(error)
            toast.error(t('product.product-added-error'))
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
        <ModalContent>
          <ModalHeader>{t('product.create-modal.title')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>{t('product.create-modal.product-label')}</FormLabel>
              <ProductSelectWithAddButton vaultId={vaultId} onChange={handleProductChange} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>{t('product.create-modal.price-label')}</FormLabel>
              <PriceInput onChange={handlePriceChange} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>{t('product.create-modal.quantity-label')}</FormLabel>
              <NumberInput
                onChange={(valueString) => setTransactionProductCreateRequest(
                  { ...transactionProductCreateRequest, quantity: parseInt(valueString) }
                )}
                value={transactionProductCreateRequest.quantity}
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
            <Button onClick={handleTransactionProductCreate}
                    backgroundColor={theme.primaryColor}
                    color={'#f8f8f8'} fontWeight={'400'}
                    mr={3}>
              {t('product.create-modal.submit')}
            </Button>
            <Button onClick={onClose}>{t('product.create-modal.cancel')}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
