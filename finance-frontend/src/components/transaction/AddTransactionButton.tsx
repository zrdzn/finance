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
import {TransactionCreateRequest, TransactionResponse, VaultResponse} from "@/components/api"
import {useRouter} from 'next/router'
import {PriceInput} from "@/components/shared/PriceInput"
import {TransactionMethodSelect} from "@/components/transaction/TransactionMethodSelect"
import {CurrencySelect} from "@/components/shared/CurrencySelect"
import toast from "react-hot-toast"

interface AddTransactionButtonProperties {
  vault: VaultResponse
  onCreate?: (transaction: TransactionResponse) => void
}

export const AddTransactionButton = ({ vault, onCreate }: AddTransactionButtonProperties) => {
  const theme = useTheme()
  const api = useApi()
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [transactionCreateForm, setTransactionCreateForm] = useState<TransactionCreateRequest>({
    vaultId: 0,
    transactionMethod: vault.transactionMethod,
    description: null,
    price: 0,
    currency: vault.currency
  })
  const initialRef = useRef(null)
  const finalRef = useRef(null)

  const handleTransactionMethodChange = (transactionMethod: string) => {
    setTransactionCreateForm((previous) => ({ ...previous, transactionMethod: transactionMethod }))
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
      description: transactionCreateForm.description,
      price: transactionCreateForm.price,
      currency: transactionCreateForm.currency
    })
      .then(response => {
        onClose()
        onCreate?.(response.data)
      })
      .then(() => {
        toast.success(`Transaction has been added`)
        setTimeout(() => router.reload(), 1000)
      })
      .catch(error => {
        console.error(error)
        toast.error(`Failed to add transaction`)
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
          <ModalHeader>Add a new transaction</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input onChange={handleDescriptionChange}
                     ref={initialRef}
                     placeholder='What did you pay for?' />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Transaction method</FormLabel>
              <TransactionMethodSelect onChange={handleTransactionMethodChange} defaultValue={transactionCreateForm.transactionMethod} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Price</FormLabel>
              <PriceInput onChange={handlePriceChange} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Currency</FormLabel>
              <CurrencySelect onChange={handleCurrencyChange} defaultValue={transactionCreateForm.currency} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleTransactionCreate}
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