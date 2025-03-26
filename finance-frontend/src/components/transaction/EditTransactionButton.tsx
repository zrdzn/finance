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
import {FaEdit} from "react-icons/fa"
import {useTheme} from "@/hooks/useTheme"
import {useApi} from "@/hooks/useApi"
import {useRouter} from 'next/router'
import {TransactionMethodSelect} from "@/components/transaction/TransactionMethodSelect"
import {PriceInput} from "@/components/shared/PriceInput"
import {CurrencySelect} from "@/components/shared/CurrencySelect"
import toast from "react-hot-toast"
import {useTranslations} from "next-intl";
import {TransactionMethod, TransactionType} from "@/api/types";
import {Components} from "@/api/api";
import {EditButton} from "@/components/shared/EditButton";

type TransactionUpdateRequest = Components.Schemas.TransactionUpdateRequest;
type TransactionResponse = Components.Schemas.TransactionResponse;

interface EditTransactionButtonProperties {
  transaction: TransactionResponse
}

export const EditTransactionButton = ({ transaction }: EditTransactionButtonProperties) => {
  const theme = useTheme()
  const { api } = useApi()
  const router = useRouter()
  const t = useTranslations("Transactions")
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [transactionUpdateRequest, setTransactionUpdateRequest] = useState<TransactionUpdateRequest>({
    transactionMethod: transaction.transactionMethod,
    transactionType: transaction.transactionType,
    description: transaction.description,
    total: transaction.total,
    currency: transaction.currency,
  })
  const initialRef = useRef(null)
  const finalRef = useRef(null)

  const handleTransactionMethodChange = (transactionMethod: TransactionMethod) => {
    setTransactionUpdateRequest((previous) => ({ ...previous, transactionMethod: transactionMethod }))
  }

  const handleTransactionTypeChange = (transactionType: TransactionType) => {
    setTransactionUpdateRequest((previous) => ({ ...previous, transactionType: transactionType }))
  }

  const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTransactionUpdateRequest((previous) => ({ ...previous, description: event.target.value }));
  }

  const handleTotalChange = (total: number) => {
    setTransactionUpdateRequest((previous) => ({ ...previous, total: total }));
  }

  const handleCurrencyChange = (currency: string) => {
    setTransactionUpdateRequest((previous) => ({ ...previous, currency: currency }))
  }

  const handleTransactionUpdate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api
        .then(client => client.updateTransaction({ transactionId: transaction.id }, transactionUpdateRequest))
        .then(() => onClose())
        .then(() => {
            toast.success(t('transaction-updated-success'))
            setTimeout(() => router.reload(), 1000)
        })
        .catch(error => {
            console.error(error)
            toast.error(t('transaction-updated-error'))
        })
  }

  return (
    <>
      <EditButton onClick={(event) => { event.preventDefault(); onOpen() } } />

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
            <FormControl mt={4}>
              <FormLabel>{t('update-modal.transaction-method-label')}</FormLabel>
              <TransactionMethodSelect onChange={handleTransactionMethodChange}
                                       defaultValue={transactionUpdateRequest.transactionMethod} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>{t('update-modal.transaction-type-label')}</FormLabel>
              <RadioGroup onChange={handleTransactionTypeChange} value={transactionUpdateRequest.transactionType}>
                <Stack direction='row'>
                  <Radio value='INCOMING'>{t('update-modal.transaction-type-incoming')}</Radio>
                  <Radio value='OUTGOING'>{t('update-modal.transaction-type-outgoing')}</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>{t('update-modal.description-label')}</FormLabel>
              <Input onChange={handleDescriptionChange}
                     ref={initialRef}
                     value={transactionUpdateRequest.description ?? ""}
                     placeholder={t('update-modal.description-placeholder')} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>{t('update-modal.price-label')}</FormLabel>
              <PriceInput onChange={handleTotalChange}
                          defaultValue={transactionUpdateRequest.total} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>{t('update-modal.currency-label')}</FormLabel>
              <CurrencySelect onChange={handleCurrencyChange}
                              defaultValue={transactionUpdateRequest.currency} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleTransactionUpdate}
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
