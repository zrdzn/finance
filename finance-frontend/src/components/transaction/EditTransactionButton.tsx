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
import {FaEdit} from "react-icons/fa"
import {useTheme} from "@/hooks/useTheme"
import {useApi} from "@/hooks/useApi"
import {TransactionResponse, TransactionUpdateRequest} from "@/components/api"
import {useRouter} from 'next/router'
import {TransactionMethodSelect} from "@/components/transaction/TransactionMethodSelect"
import {PriceInput} from "@/components/shared/PriceInput"
import {CurrencySelect} from "@/components/shared/CurrencySelect"
import toast from "react-hot-toast"

interface EditTransactionButtonProperties {
  transaction: TransactionResponse
}

export const EditTransactionButton = ({ transaction }: EditTransactionButtonProperties) => {
  const theme = useTheme()
  const api = useApi()
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [transactionUpdateRequest, setTransactionUpdateRequest] = useState<TransactionUpdateRequest>({
    transactionMethod: transaction.transactionMethod,
    description: transaction.description,
    total: transaction.total,
    currency: transaction.currency,
  })
  const initialRef = useRef(null)
  const finalRef = useRef(null)

  const handleTransactionMethodChange = (transactionMethod: string) => {
    setTransactionUpdateRequest((previous) => ({ ...previous, transactionMethod: transactionMethod }))
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

  const handleProductUpdate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api.patch(`/transactions/${transaction.id}`, transactionUpdateRequest)
      .then(() => onClose())
      .then(() => {
        toast.success(`Transaction updated`)
        setTimeout(() => router.reload(), 1000)
      })
      .catch(error => {
        console.error(error)
        toast.error(`Failed to update transaction`)
      })
  }

  return (
    <>
      <Button backgroundColor={theme.primaryColor}
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
          <ModalHeader>Update transaction</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mt={4}>
              <FormLabel>Method</FormLabel>
              <TransactionMethodSelect onChange={handleTransactionMethodChange}
                                       defaultValue={transactionUpdateRequest.transactionMethod} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Input onChange={handleDescriptionChange}
                     ref={initialRef}
                     value={transactionUpdateRequest.description ?? ""}
                     placeholder='What did you pay for?' />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Total</FormLabel>
              <PriceInput onChange={handleTotalChange}
                          defaultValue={transactionUpdateRequest.total} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Currency</FormLabel>
              <CurrencySelect onChange={handleCurrencyChange}
                              defaultValue={transactionUpdateRequest.currency} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleProductUpdate}
                    backgroundColor={theme.primaryColor}
                    mr={3}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}