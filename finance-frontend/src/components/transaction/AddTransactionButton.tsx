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
import {useRouter} from 'next/router'
import {PriceInput} from "@/components/shared/PriceInput"
import {TransactionMethodSelect} from "@/components/transaction/TransactionMethodSelect"
import {CurrencySelect} from "@/components/shared/CurrencySelect"
import toast from "react-hot-toast"
import {useTranslations} from "next-intl";
import {Components} from "@/api/api";
import {TransactionMethod, TransactionType} from "@/api/types";
import {AddButton} from "@/components/shared/AddButton";

type VaultResponse = Components.Schemas.VaultResponse;
type TransactionCreateRequest = Components.Schemas.TransactionCreateRequest;

interface AddTransactionButtonProperties {
  vault: VaultResponse
}

export const AddTransactionButton = ({ vault }: AddTransactionButtonProperties) => {
  const theme = useTheme()
  const api = useApi()
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const t = useTranslations("Transactions")
  const [transactionCreateRequest, setTransactionCreateRequest] = useState<TransactionCreateRequest>({
    vaultId: 0,
    transactionMethod: vault.transactionMethod,
    transactionType: 'INCOMING',
    description: '',
    price: 0,
    currency: vault.currency,
    products: []
  })
  const initialRef = useRef(null)
  const finalRef = useRef(null)

  const handleTransactionMethodChange = (transactionMethod: TransactionMethod) => {
    setTransactionCreateRequest((previous) => ({ ...previous, transactionMethod: transactionMethod }))
  }

  const handleTransactionTypeChange = (transactionType: TransactionType) => {
    setTransactionCreateRequest((previous) => ({ ...previous, transactionType: transactionType }))
  }

  const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTransactionCreateRequest((previous) => ({ ...previous, description: event.target.value }));
  }

  const handlePriceChange = (price: number) => {
    setTransactionCreateRequest((previous) => ({ ...previous, price: price }));
  }

  const handleCurrencyChange = (currency: string) => {
    setTransactionCreateRequest((previous) => ({ ...previous, currency: currency }))
  }

  const handleTransactionCreate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (transactionCreateRequest.description === '') {
        toast.error(t('create-modal.validation.missing-description'))
        return
    }

    api
        .then(client => client.createTransaction(null, {
            vaultId: vault.id,
            transactionMethod: transactionCreateRequest.transactionMethod,
            transactionType: transactionCreateRequest.transactionType,
            description: transactionCreateRequest.description,
            price: transactionCreateRequest.price,
            currency: transactionCreateRequest.currency,
            products: []
        }))
        .then(() => onClose())
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
      <AddButton onClick={onOpen} />

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
            <FormControl isRequired>
              <FormLabel>{t('create-modal.description-label')}</FormLabel>
              <Input onChange={handleDescriptionChange}
                     ref={initialRef}
                     placeholder={t('create-modal.description-placeholder')} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>{t('create-modal.transaction-method-label')}</FormLabel>
              <TransactionMethodSelect onChange={handleTransactionMethodChange} defaultValue={transactionCreateRequest.transactionMethod} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>{t('create-modal.transaction-type-label')}</FormLabel>
              <RadioGroup onChange={handleTransactionTypeChange} value={transactionCreateRequest.transactionType}>
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
              <CurrencySelect onChange={handleCurrencyChange} defaultValue={transactionCreateRequest.currency} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleTransactionCreate}
                    backgroundColor={theme.primaryColor}
                    color={'#f8f8f8'} fontWeight={'400'}
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
