import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Stack,
  Text,
  HStack, Flex,
  Box,
} from '@chakra-ui/react'
import React, {ChangeEvent, useEffect, useRef, useState} from "react"
import {FaPlus} from "react-icons/fa"
import {useTheme} from "@/hooks/useTheme"
import {useApi} from "@/hooks/useApi"
import {CategoryCreateRequest, PaymentProductCreateRequest, ProductResponse} from "@/components/api"
import { useRouter } from 'next/router'
import {ProductSelect} from "@/components/product/ProductSelect"
import {PriceInput} from "@/components/shared/PriceInput"
import {AddProductButton} from "@/components/product/AddProductButton"
import {Axios} from "axios"

interface ProductSelectWithAddButtonProperties {
  vaultId: number
  onChange: (product: ProductResponse) => void
}

export const ProductSelectWithAddButton = ({ vaultId, onChange }: ProductSelectWithAddButtonProperties) => {
  const api = useApi()
  const [products, setProducts] = useState<ProductResponse[] | undefined>(undefined)

  useEffect(() => {
    updateProducts(api, vaultId)
  }, [vaultId, api]);

  const updateProducts = (api: Axios, vaultId: number) => {
    api.get(`/products/${vaultId}`)
      .then(response => setProducts(response.data.products))
      .catch(error => console.error(error))
  }

  return (
    <Flex gap={2}>
      <Flex width={'full'}>
        {
          products &&
          <ProductSelect vaultId={vaultId} products={products} onChange={onChange} />
        }
      </Flex>
      <AddProductButton vaultId={vaultId} onCreate={() => updateProducts(api, vaultId)} />
    </Flex>
  )
}