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
    Th, Box,
} from '@chakra-ui/react';
import {useTheme} from "@/hooks/useTheme";
import {useTranslations} from "next-intl";
import {FileUpload} from "@/components/shared/FileUpload";
import toast from "react-hot-toast";
import {useApi} from "@/hooks/useApi";
import {Components} from "@/api/api";
import axios from "axios";

export type VaultResponse = Components.Schemas.VaultResponse;
export type AnalysedTransactionResponse = Components.Schemas.AnalysedTransactionResponse;
export type AnalysedTransactionProductResponse = Components.Schemas.AnalysedTransactionProductResponse;

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
    const [selectedProducts, setSelectedProducts] = useState<Record<string, boolean>>({});
    const [editedProducts, setEditedProducts] = useState<Record<string, Partial<AnalysedTransactionProductResponse>>>({});
    const [editedDescription, setEditedDescription] = useState<string | undefined>(undefined);
    const [selectAll, setSelectAll] = useState<boolean>(true);
    const t = useTranslations("Transactions")

    const handleImageUpload = async (file: File) => {
        if (!file) return

        setImageBlob(file)
    }

    const handleImageImport = async () => {
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
              const productSelection = Object.fromEntries(response.data.products.map((p: AnalysedTransactionProductResponse) => [p.productName, true]));
              setSelectedProducts(productSelection);
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

    const handleProductChange = (productName: string, field: keyof AnalysedTransactionProductResponse, value: any) => {
        setEditedProducts((prev) => ({
            ...prev,
            [productName]: {
                ...prev[productName],
                [field]: value,
            },
        }));
    };

    const toggleProductSelection = (productName: string) => {
        setSelectedProducts((prev) => ({
            ...prev,
            [productName]: !prev[productName],
        }));
    };

    const toggleSelectAll = () => {
        const newState = !selectAll;
        setSelectAll(newState);
        setSelectedProducts(
          Object.fromEntries((analysedTransaction?.products ?? []).map((p) => [p.productName, newState]))
        );
    };

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
                        width={'full'}
                        textAlign="center"
                      >
                          <Text>{t('import.select-image-button')}</Text>
                      </Button>
                  </FileUpload>
                  {analysedTransaction && (
                    <>
                        <Text fontSize="lg" fontWeight="bold" mt={4}>
                            {t("import.description")}
                        </Text>
                        <Input
                          value={editedDescription}
                          onChange={(e) => setEditedDescription(e.target.value)}
                          placeholder={t("import.edit-description")}
                          mb={4}
                        />

                        <Checkbox isChecked={selectAll} onChange={toggleSelectAll} mb={2}>
                            {selectAll ? t("import.unselect-all") : t("import.select-all")}
                        </Checkbox>

                        <Table variant="simple" mt={2}>
                            <Thead>
                                <Tr>
                                    <Th>{t("import.select")}</Th>
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
                    </>
                  )}
              </ModalBody>
              <ModalFooter>
                  <Button
                    mt={8}
                    onClick={handleImageImport}
                    backgroundColor={theme.primaryColor}
                    color={'#f8f8f8'}
                    fontWeight={'400'}
                  >
                      {t('import.submit')}
                  </Button>
              </ModalFooter>
          </ModalContent>
      </Modal>
    )
}