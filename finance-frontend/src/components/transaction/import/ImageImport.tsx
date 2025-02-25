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
    Th, Box, Flex, FormControl, FormLabel,
} from '@chakra-ui/react';
import {useTheme} from "@/hooks/useTheme";
import {useTranslations} from "next-intl";
import {FileUpload} from "@/components/shared/FileUpload";
import toast from "react-hot-toast";
import {useApi} from "@/hooks/useApi";
import {Components} from "@/api/api";
import axios from "axios";
import TransactionCreateRequest = Components.Schemas.TransactionCreateRequest;

export type VaultResponse = Components.Schemas.VaultResponse;
export type AnalysedTransactionResponse = Components.Schemas.AnalysedTransactionResponse;
export type AnalysedTransactionProductResponse = Components.Schemas.AnalysedTransactionProductResponse;
export type TransactionCreateProductRequest = Components.Schemas.TransactionProductCreateRequest

interface ModifiedProduct {
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
    const [analysedTransaction, setAnalysedTransaction] = useState<AnalysedTransactionResponse | undefined>(undefined)
    const [editedDescription, setEditedDescription] = useState<string | undefined>(undefined);
    const [modifiedProducts, setModifiedProducts] = useState<ModifiedProduct[]>([])
    const t = useTranslations("Transactions")

    const handleImageUpload = async (file: File) => {
        if (!file) return

        setImageBlob(file)
    }

    const handleProductChange = (
      name: string,
      field: "name" | "unitAmount" | "quantity",
      value: string | number
    ) => {
        setModifiedProducts(previous =>
            previous.map(product =>
                product.request.name === name ? { ...product, [field]: value } : product
            )
        )
    };

    const toggleProductSelection = (name: string) => {
        setModifiedProducts(previous =>
            previous.map(product =>
                product.request.name === name ? { ...product, selected: !product.selected } : product
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

        const formData = new FormData()
        formData.append('file', imageBlob, 'file.png');

        api
          .then(client => client.api.client.post(`/api/transactions/image-analysis`, formData, {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
          }))
          .then(response => {
              toast.success(t('import.analysed'))

              setAnalysedTransaction(response.data);

              setEditedDescription(response.data.description);

              setModifiedProducts(
                response.data.products.map((product: AnalysedTransactionProductResponse) => ({
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
            pr
        }
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
          <ModalContent maxWidth={["100%", "90%", "80%"]} width="100%" overflow={'hidden'}>
              <ModalHeader>{t('import.image')}</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6} overflowX="scroll">
                  <FileUpload handleFile={handleImageUpload}>
                      <Button
                        size="md"
                        backgroundColor={theme.primaryColor}
                        color="#f8f8f8"
                        fontWeight="400"
                        textAlign="center"
                        mb={4}
                      >
                          <Text>{t('import.select-image-button')}</Text>
                      </Button>
                  </FileUpload>
                  {analysedTransaction && (
                    <>
                        <FormControl isRequired mb={4}>
                            <FormLabel>{t('import.description')}</FormLabel>
                            <Input
                              name={'description'}
                              value={editedDescription}
                              onChange={(e) => setEditedDescription(e.target.value)}
                              placeholder={t("import.edit-description")}
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>{t('import.products')}</FormLabel>
                            <Table variant="simple" mt={2}>
                                <Thead>
                                    <Tr>
                                        <Th>
                                            <Checkbox isChecked={selectAll} onChange={toggleSelectAll} mb={2}>
                                            </Checkbox>
                                        </Th>
                                        <Th>{t("import.product-name")}</Th>
                                        <Th>{t("import.price")}</Th>
                                        <Th>{t("import.quantity")}</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {analysedTransaction.products.map((product) => (
                                      <Tr key={product.productName}>
                                          <Td>
                                              <Checkbox
                                                isChecked={selectedProducts[product.productName]}
                                                onChange={() => toggleProductSelection(product.productName)}
                                              />
                                          </Td>
                                          <Td>
                                              <Box flex="1">
                                                  <Input
                                                    value={editedProducts[product.productName]?.productName ?? product.productName}
                                                    onChange={(e) =>
                                                      handleProductChange(product.productName, "productName", e.target.value)
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
                                                    value={editedProducts[product.productName]?.unitAmount ?? product.unitAmount}
                                                    onChange={(e) =>
                                                      handleProductChange(product.productName, "unitAmount", parseFloat(e.target.value))
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
                                                    value={editedProducts[product.productName]?.quantity ?? product.quantity}
                                                    onChange={(e) =>
                                                      handleProductChange(product.productName, "quantity", parseInt(e.target.value))
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
                  <Button
                    mt={8}
                    onClick={handleImageAnalysis}
                    backgroundColor={theme.primaryColor}
                    color={'#f8f8f8'}
                    fontWeight={'400'}
                  >
                      {t('import.analyze')}
                  </Button>
              </ModalFooter>
          </ModalContent>
      </Modal>
    )
}