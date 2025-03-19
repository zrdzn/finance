import React, {useRef, useState} from 'react';

import {
    Box,
    Button,
    FormControl,
    FormLabel,
    VStack,
    HStack,
    Text,
    CardHeader,
    Flex,
    CardBody,
    RadioGroup,
    Radio,
    Card,
    Checkbox,
    Tabs,
    TabList,
    Tab,
    TabPanel,
    TabPanels,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Stack,
    Input,
    ModalFooter,
    useDisclosure,
    UseDisclosureProps
} from '@chakra-ui/react';
import {useTheme} from "@/hooks/useTheme";
import {useTranslations} from "next-intl";
import {FileUpload} from "@/components/shared/FileUpload";
import toast from "react-hot-toast";
import {useApi} from "@/hooks/useApi";
import {SelectProperties, TransactionMethod} from "@/api/types";
import {Components} from "@/api/api";
import {TransactionMethodSelect} from "@/components/transaction/TransactionMethodSelect";
import Select from "react-select";
import axios from "axios";
import {useRouter} from "next/router";
import {ThemedSelect} from "@/components/shared/ThemedSelect";

export type VaultResponse = Components.Schemas.VaultResponse;

interface CsvImportProperties {
    vault: VaultResponse
    isOpen: boolean
    onClose: () => void
    permissions: string[]
}

export const CsvImport = ({ vault, isOpen, onClose, permissions }: CsvImportProperties) => {
    const api = useApi()
    const [csvColumns, setCsvColumns] = useState<string[]>([]);
    const [mappedFields, setMappedFields] = useState<{[name: string]: string}>({});
    const [csvBlob, setCsvBlob] = useState<Blob | undefined>(undefined);
    const [separator, setSeparator] = useState<string | undefined>(undefined);
    const [appliedTransactionMethod, setAppliedTransactionMethod] = useState<TransactionMethod>('BLIK');
    const [applyTransactionMethod, setApplyTransactionMethod] = useState<boolean>(false);
    const initialRef = useRef(null)
    const finalRef = useRef(null)
    const theme = useTheme()
    const router = useRouter()
    const [hasCombinedPriceColumn, setHasCombinedPriceColumn] = useState<boolean>(false);
    const t = useTranslations("Transactions")

    const requiredFields = [
        { value: 'transactionMethod', label: 'Payment method' },
        { value: 'description', label: 'Description' },
        { value: 'total', label: 'Amount' },
        { value: 'currency', label: 'Currency' },
        { value: 'rawPrice', label: 'Price' }
    ]

    const handleCsvUpload = async (file: File) => {
        if (!separator) {
            toast.error(t('import.select-separator'))
            return
        }

        if (!file) return

        const text = await file.text()
        const lines = text.split('\n')

        if (lines.length > 0) {
            if (!lines[0].includes(separator)) {
                toast.error(t('import.invalid-separator'))
                return
            }

            const columns = lines[0].split(separator).map((column) => column.trim())
            setCsvColumns(columns)

            const data = lines.slice(1).map((line) => line.split(separator).map((value) => value.trim()))
            const csvContent = [lines.join('\n')]
            setCsvBlob(new Blob(csvContent, { type: 'text/csv' }))

            const priceRegex = /^(?:[A-Za-z]{3}\s?)?\d{1,3}(?:[ ,]\d{3})*(?:[.,]\d+)?\s?[A-Za-z]{3}?$/
            const hasCombinedColumn = columns.some((_, index) =>
                priceRegex.test(data[0][index])
            )

            setHasCombinedPriceColumn(hasCombinedColumn)
        }
    }

    const handleMappingChange = (field: string, column: string) => {
        setMappedFields((prev) => ({ ...prev, [field]: column }));
    }

    const handleCsvImport = async () => {
        if (!appliedTransactionMethod) {
            toast.error(t('import.select-transaction-method'))
            return
        }

        if (!separator) {
            toast.error(t('import.select-separator'))
            return
        }

        if (!csvBlob) {
            toast.error(t('import.select-file'))
            return
        }

        const formData = new FormData()

        const mappingsJson = JSON.stringify(mappedFields);

        formData.append("mappings", mappingsJson);
        formData.append('file', csvBlob, 'file.csv');
        formData.append('separator', separator!);
        formData.append('applyTransactionMethod', appliedTransactionMethod);

        api
            .then(client => client.api.client.post(`/v1/transactions/${vault.id}/import/csv`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }))
            .then(() => {
                toast.success(t('import.imported'))
                onClose()
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
    };

    return (
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
          <ModalOverlay />
          <ModalContent backgroundColor={theme.background.secondary}
                        color={theme.text.primary}>
              <ModalHeader>{t('import.csv')}</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                  <FormControl mb={6}>
                      <FormLabel fontSize="lg">{t('import.choose-file-and-separator')}</FormLabel>
                      <Flex
                        mt={4}
                        alignItems="center"
                        justifyContent={{ base: 'center', lg: 'space-between' }}
                        flexDirection={{ base: 'column', lg: 'row' }}
                        gap={4}
                      >
                          <FileUpload handleFile={handleCsvUpload}>
                              <Button
                                size="md"
                                backgroundColor={theme.secondary}
                                color={'#f8f8f8'}
                                fontWeight="400"
                                width={{ base: '100%', lg: 'auto' }}
                                textAlign="center"
                              >
                                  <Text>{t('import.select-file-button')}</Text>
                              </Button>
                          </FileUpload>
                          <RadioGroup value={separator} onChange={setSeparator}>
                              <Flex
                                wrap="wrap"
                                gap={2}
                                justifyContent="center"
                              >
                                  {[':', ';', ',', '|'].map((separator) => (
                                    <Box
                                      as="label"
                                      key={separator}
                                      display="flex"
                                      alignItems="center"
                                      p={3}
                                      border="1px solid"
                                      borderColor="gray.300"
                                      borderRadius="md"
                                      cursor="pointer"
                                      width={{ base: '100%', lg: 'auto' }}
                                      flex="0 1 auto"
                                    >
                                        <Radio value={separator} mr={3} />
                                        <Text fontWeight="medium">{separator}</Text>
                                    </Box>
                                  ))}
                              </Flex>
                          </RadioGroup>
                      </Flex>
                  </FormControl>
                  {csvColumns.length > 0 && (
                    <Box mt={6}>
                        <FormLabel fontSize={'lg'}>{t('import.configure-mappings')}</FormLabel>
                        <VStack spacing={6}
                                align="stretch"
                                backgroundColor={theme.background.primary}
                                p={4}
                                borderRadius="md">
                            {requiredFields
                              .filter(
                                (field) => {
                                    if (hasCombinedPriceColumn && (field.value === 'total' || field.value === 'currency')) {
                                        return false;
                                    }

                                    return !(!hasCombinedPriceColumn && field.value === 'rawPrice');
                                }
                              )
                              .map((field) => (
                                <HStack
                                  key={field.value}
                                  justifyContent="space-between"
                                  p={3}
                                  borderBottom="1px solid"
                                  borderColor="gray.200"
                                  _last={{ borderBottom: 'none' }}
                                  flexWrap="wrap"
                                >
                                    <Text fontWeight="400" mr={2} minW="120px">{field.label}:</Text>

                                    <Box flex="1" minW={{ base: '100%', md: '45%' }}>
                                        <ThemedSelect
                                          placeholder={t('import.select-column')}
                                          value={{
                                              value: mappedFields[field.value] || '',
                                              label: mappedFields[field.value] || ''
                                          }}
                                          onChange={(selectedOption: SelectProperties) => {
                                              if (selectedOption) {
                                                  handleMappingChange(field.value, selectedOption.value)
                                              }
                                          }}
                                          isClearable
                                          required
                                          options={csvColumns.map(column => ({
                                              value: column,
                                              label: column
                                          }))}
                                        />
                                    </Box>

                                    {field.value === 'transactionMethod' && (
                                      <Box display="flex" alignItems="center" mt={{ base: 2, md: 0 }} ml={2}>
                                          <Checkbox
                                            isChecked={applyTransactionMethod}
                                            onChange={(e) => setApplyTransactionMethod(e.target.checked)}
                                            size="md"
                                            colorScheme="teal"
                                            mr={2}
                                            borderColor="teal.500"
                                            _checked={{ bg: 'teal.500', borderColor: 'teal.500', color: 'white' }}
                                          />
                                          <Text fontSize={'md'} fontWeight="400">{t('import.apply-to-all')}</Text>
                                      </Box>
                                    )}

                                    {field.value === 'transactionMethod' && (
                                      <Box flex="1" maxW={{ base: '100%', lg: '40%' }} minW="150px">
                                          <TransactionMethodSelect onChange={setAppliedTransactionMethod} />
                                      </Box>
                                    )}
                                </HStack>
                              ))}
                        </VStack>
                    </Box>
                  )}
              </ModalBody>
              <ModalFooter>
                  <Button
                    mt={8}
                    onClick={handleCsvImport}
                    backgroundColor={theme.secondary}
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