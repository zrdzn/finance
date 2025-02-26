import React, {useRef, useState} from 'react';

import {
    Button,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Table,
    Tbody,
    Td,
    Input, Checkbox,
    Tr,
    Thead,
    Th, Box, Flex, FormControl, FormLabel, HStack,
} from '@chakra-ui/react';
import {useTheme} from "@/hooks/useTheme";
import {useTranslations} from "next-intl";
import {FileUpload} from "@/components/shared/FileUpload";
import toast from "react-hot-toast";
import {useApi} from "@/hooks/useApi";
import {Components} from "@/api/api";
import axios from "axios";
import {useRouter} from "next/router";
import Image from "next/image";

export type VaultResponse = Components.Schemas.VaultResponse;
export type AnalysedTransactionResponse = Components.Schemas.AnalysedTransactionResponse;
export type AnalysedTransactionProductResponse = Components.Schemas.AnalysedTransactionProductResponse;
export type TransactionCreateRequest = Components.Schemas.TransactionCreateRequest
export type TransactionCreateProductRequest = Components.Schemas.TransactionProductCreateRequest

interface ModifiedProduct {
    id: number
    request: TransactionCreateProductRequest
    selected: boolean
}

interface ImageImportProperties {
    vault: VaultResponse
    isOpen: boolean
    onClose: () => void
    permissions: string[]
}

export const ImageImport = ({ vault, isOpen, onClose, permissions }: ImageImportProperties) => {
    const api = useApi()
    const [imageBlob, setImageBlob] = useState<Blob | undefined>(undefined);
    const initialRef = useRef(null)
    const finalRef = useRef(null)
    const theme = useTheme()
    const router = useRouter()
    const [analysedTransaction, setAnalysedTransaction] = useState<AnalysedTransactionResponse | undefined>(undefined)
    const [editedDescription, setEditedDescription] = useState<string | undefined>(undefined);
    const [modifiedProducts, setModifiedProducts] = useState<ModifiedProduct[]>([])
    const t = useTranslations("Transactions")

    const handleImageUpload = async (file: File) => {
        if (!file) return

        setImageBlob(file)
    }

    const handleProductChange = (
      id: number,
      field: "name" | "unitAmount" | "quantity",
      value: string | number
    ) => {
        setModifiedProducts(previous =>
            previous.map((product, index) =>
                id === index
                    ? { ...product, request: { ...product.request, [field]: value } }
                    : product
            )
        )
    };

    const toggleProductSelection = (id: number) => {
        setModifiedProducts(previous =>
            previous.map((product, index) =>
                id === index
                  ? { ...product, selected: !product.selected }
                  : product
            )
        )
    };

    const toggleSelectAll = () => {
        const allSelected = modifiedProducts.every(product => product.selected)
        setModifiedProducts(previous =>
            previous.map(product => ({ ...product, selected: !allSelected }))
        )
    };

    const handleImageAnalysis = async () => {
        if (!imageBlob) {
            toast.error(t('import.select-file'))
            return
        }

        const loadingToastId = toast.loading(t('import.analyzing'))

        const formData = new FormData()
        formData.append('file', imageBlob, 'file.png');

        api
          .then(client => client.api.client.post(`/api/transactions/image-analysis`, formData, {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
          }))
          .then(response => {
              toast.dismiss(loadingToastId)
              toast.success(t('import.analysed'))

              setAnalysedTransaction(response.data);

              setEditedDescription(response.data.description);

              setModifiedProducts(
                response.data.products.map((product: AnalysedTransactionProductResponse, index: number) => ({
                    id: index,
                    request: {
                        name: product.name,
                        unitAmount: product.unitAmount,
                        quantity: product.quantity
                    },
                    selected: true
                }))
              )
          })
          .catch(error => {
              toast.dismiss(loadingToastId)

              console.error(error)
              if (axios.isAxiosError(error) && error.response) {
                  const errorMessage = error.response.data.description || "An error occurred while importing transactions"
                  toast.error(errorMessage)
              } else {
                  toast.error("An unexpected error occurred")
              }
          })
    }

    const handleImageImport = () => {
        if (!analysedTransaction) {
            toast.error(t('import.analyze-first'))
            return
        }

        if (!editedDescription) {
            toast(t('import.enter-description'))
            return
        }

        const selectedProducts = modifiedProducts.filter(product => product.selected)
        if (selectedProducts.length === 0) {
            toast(t('import.select-products'))
            return
        }

        const request: TransactionCreateRequest = {
            vaultId: vault.id,
            transactionMethod: analysedTransaction.transactionMethod,
            transactionType: "OUTGOING",
            description: editedDescription,
            price: analysedTransaction.total,
            currency: analysedTransaction.currency,
            products: selectedProducts.map(product => product.request)
        }

        api
          .then(client => client.createTransaction(null, request))
          .then(() => {
              toast.success(t('import.imported'))
              setTimeout(() => router.reload(), 1000)
          })
          .catch(error => {
              console.error(error)
              if (axios.isAxiosError(error) && error.response) {
                  const errorMessage = error.response.data.description || "An error occurred while importing transactions"
                  toast.error(errorMessage)
              } else {
                  toast.error("An unexpected error occurred")
              }
          })
    }

    return (
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        size={'lg'}
      >
          <ModalOverlay />
          <ModalContent
            maxWidth={modifiedProducts.length > 0 ? "90%" : undefined}
            width="100%"
            overflow={'hidden'}>
              <ModalHeader>{t('import.image')}</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6} overflowX="scroll">
                  <FormControl mb={4}>
                      <FormLabel mb={2}>{t('import.select-image-label')}</FormLabel>
                      <FileUpload handleFile={handleImageUpload}>
                          <Button
                            size="md"
                            backgroundColor={theme.primaryColor}
                            color="#f8f8f8"
                            fontWeight="400"
                            textAlign="center"
                            width="full"
                            _hover={{ opacity: 0.9 }}
                          >
                              <Text>{t('import.select-image-button')}</Text>
                          </Button>
                      </FileUpload>
                  </FormControl>
                  {imageBlob && (
                    <FormControl mb={4}>
                        <FormLabel mb={2}>{t('import.image-preview')}</FormLabel>
                        <Box
                          borderWidth="1px"
                          borderRadius="md"
                          p={4}
                          display={'flex'}
                          overflow="hidden"
                          boxShadow="sm"
                          justifyContent={'center'}
                          alignItems={'center'}
                          bg="white"
                          _hover={{ boxShadow: "md" }}
                          transition="box-shadow 0.2s"
                        >
                            <Image src={URL.createObjectURL(imageBlob)} alt="Preview" width={300} height={300} style={{ maxWidth: "100%" }} />
                        </Box>
                    </FormControl>
                  )}
                  {
                    !analysedTransaction && (
                      <FormControl mb={4}>
                          <FormLabel mb={2}>{t('import.analyze-label')}</FormLabel>
                          <Button
                            onClick={handleImageAnalysis}
                            backgroundColor={theme.primaryColor}
                            color={'#f8f8f8'}
                            fontWeight={'400'}
                            width="full"
                            _hover={{ opacity: 0.9 }}
                          >
                              {t('import.analyze')}
                          </Button>
                      </FormControl>
                    )
                  }
                  {analysedTransaction && (
                    <>
                        <FormControl isRequired mb={4}>
                            <FormLabel>{t('import.description')}</FormLabel>
                            <Input
                              name={'description'}
                              value={editedDescription}
                              onChange={event => setEditedDescription(event.target.value)}
                              placeholder={t("import.edit-description")}
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>{t('import.products')}</FormLabel>
                            <Table variant="simple" mt={2}>
                                <Thead>
                                    <Tr>
                                        <Th>
                                            <Checkbox
                                              isChecked={modifiedProducts.every(product => product.selected)}
                                              onChange={toggleSelectAll}
                                              mb={2} />
                                        </Th>
                                        <Th>{t("import.product-name")}</Th>
                                        <Th>{t("import.price")}</Th>
                                        <Th>{t("import.quantity")}</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {modifiedProducts.map((product, index) => (
                                      <Tr key={index}>
                                          <Td>
                                              <Checkbox
                                                isChecked={product.selected}
                                                onChange={() => toggleProductSelection(index)}
                                              />
                                          </Td>
                                          <Td>
                                              <Box flex="1">
                                                  <Input
                                                    value={product.request.name}
                                                    onChange={event =>
                                                      handleProductChange(index, "name", event.target.value)
                                                    }
                                                    minWidth="120px"
                                                    maxWidth="250px"
                                                  />
                                              </Box>
                                          </Td>
                                          <Td>
                                              <Box flex="1">
                                                  <Input
                                                    type="number"
                                                    value={product.request.unitAmount}
                                                    onChange={event =>
                                                      handleProductChange(index, "unitAmount", parseFloat(event.target.value))
                                                    }
                                                    minWidth="120px"
                                                    maxWidth="250px"
                                                  />
                                              </Box>
                                          </Td>
                                          <Td>
                                              <Box flex="1">
                                                  <Input
                                                    type="number"
                                                    value={product.request.quantity}
                                                    onChange={event =>
                                                      handleProductChange(index, "quantity", parseInt(event.target.value))
                                                    }
                                                    minWidth="120px"
                                                    maxWidth="250px"
                                                  />
                                              </Box>
                                          </Td>
                                      </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </FormControl>
                    </>
                  )}
              </ModalBody>
              <ModalFooter>
                  {
                      analysedTransaction && (
                      <Button
                        mt={8}
                        onClick={handleImageImport}
                        backgroundColor={theme.primaryColor}
                        color={'#f8f8f8'}
                        fontWeight={'400'}
                      >
                          {t('import.submit')}
                      </Button>
                    )
                  }
              </ModalFooter>
          </ModalContent>
      </Modal>
    )
}