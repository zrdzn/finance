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
  ModalOverlay, Radio, RadioGroup, Stack,
  useDisclosure,
} from '@chakra-ui/react'
import React, {ChangeEvent, useRef, useState} from "react"
import {FaPlus} from "react-icons/fa"
import {useTheme} from "@/hooks/useTheme"
import {useApi} from "@/hooks/useApi"
import {TransactionCreateRequest, TransactionResponse, VaultResponse} from "@/components/api"
import {useRouter} from 'next/router'
import {PriceInput} from "@/components/shared/PriceInput"
import {TransactionMethodSelect} from "@/components/transaction/TransactionMethodSelect"
import {CurrencySelect} from "@/components/shared/CurrencySelect"
import toast from "react-hot-toast"
import {useTranslations} from "next-intl";

interface AddTransactionButtonProperties {
  vault: VaultResponse
  onCreate?: (transaction: TransactionResponse) => void
}

export const AddTransactionButton = ({ vault, onCreate }: AddTransactionButtonProperties) => {
  const theme = useTheme()
  const api = useApi()
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const t = useTranslations("Transactions")
  const [transactionCreateForm, setTransactionCreateForm] = useState<TransactionCreateRequest>({
    vaultId: 0,
    transactionMethod: vault.transactionMethod,
    transactionType: "",
    description: null,
    price: 0,
    currency: vault.currency
  })
  const initialRef = useRef(null)
  const finalRef = useRef(null)

  const handleTransactionMethodChange = (transactionMethod: string) => {
    setTransactionCreateForm((previous) => ({ ...previous, transactionMethod: transactionMethod }))
  }

  const handleTransactionTypeChange = (transactionType: string) => {
    setTransactionCreateForm((previous) => ({ ...previous, transactionType: transactionType }))
  }

  const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTransactionCreateForm((previous) => ({ ...previous, description: event.target.value }));
  }

  const handlePriceChange = (price: number) => {
    setTransactionCreateForm((previous) => ({ ...previous, price: price }));
  }

  const handleCurrencyChange = (currency: string) => {
    setTransactionCreateForm((previous) => ({ ...previous, currency: currency }))
  }

  const handleTransactionCreate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api.post("/transactions/create", {
      vaultId: vault.id,
      transactionMethod: transactionCreateForm.transactionMethod,
      transactionType: transactionCreateForm.transactionType,
      description: transactionCreateForm.description,
      price: transactionCreateForm.price,
      currency: transactionCreateForm.currency
    })
      .then(response => {
        onClose()
        onCreate?.(response.data)
      })
      .then(() => {
        toast.success(t('transaction-created-success'))
        setTimeout(() => router.reload(), 1000)
      })
      .catch(error => {
        console.error(error)
        toast.error(t('transaction-created-error'))
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
          <ModalHeader>{t('create-modal.title')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>{t('create-modal.description-label')}</FormLabel>
              <Input onChange={handleDescriptionChange}
                     ref={initialRef}
                     placeholder={t('create-modal.description-placeholder')} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>{t('create-modal.transaction-method-label')}</FormLabel>
              <TransactionMethodSelect onChange={handleTransactionMethodChange} defaultValue={transactionCreateForm.transactionMethod} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>{t('create-modal.transaction-type-label')}</FormLabel>
              <RadioGroup onChange={handleTransactionTypeChange} value={transactionCreateForm.transactionType}>
                <Stack direction='row'>
                  <Radio value='INCOMING'>{t('create-modal.transaction-type-incoming')}</Radio>
                  <Radio value='OUTGOING'>{t('create-modal.transaction-type-outgoing')}</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>{t('create-modal.price-label')}</FormLabel>
              <PriceInput onChange={handlePriceChange} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>{t('create-modal.currency-label')}</FormLabel>
              <CurrencySelect onChange={handleCurrencyChange} defaultValue={transactionCreateForm.currency} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleTransactionCreate}
                    backgroundColor={theme.primaryColor}
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