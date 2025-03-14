import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  Text
} from "@chakra-ui/react"
import React, {useRef, useState} from "react"
import {useTheme} from "@/hooks/useTheme"
import {useApi} from "@/hooks/useApi"
import {FaFileCsv} from "react-icons/fa"
import moment from "moment"
import toast from "react-hot-toast"
import {useTranslations} from "next-intl";
import {Components} from "@/api/api";

type VaultResponse = Components.Schemas.VaultResponse;

interface CsvExportProperties {
  vault: VaultResponse
  isOpen: boolean
  onClose: () => void
  permissions: string[]
}

export const CsvExport = ({ vault, isOpen, onClose, permissions }: CsvExportProperties) => {
  const theme = useTheme()
  const api = useApi()
  const [fileType, setFileType] = useState('CSV')
  const initialRef = useRef(null)
  const finalRef = useRef(null)
  const [startDate, setStartDate] = useState(new Date(Number(vault.createdAt) * 1000).toISOString().slice(0, 16))
  const [endDate, setEndDate] = useState(moment().local().format('YYYY-MM-DDTHH:mm'))
  const t = useTranslations("Transactions")

  const handleExport = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api
        .then(client => client.exportTransactions({
          vaultId: vault.id,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString()
        }, null, { responseType: 'blob' }))
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }))

          const link = document.createElement('a')
          link.href = url;
          link.setAttribute('download', 'transactions.csv')

          document.body.appendChild(link)
          link.click()

          link.parentNode?.removeChild(link)
          window.URL.revokeObjectURL(url)

          toast.success(t('export.requested-export-success'))
        })
        .catch(error => {
          console.error(error)
          toast.error(t('export.requested-export-error'))
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
        width="100%"
        overflow={'hidden'}>
          <ModalHeader>{t("export.title")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} overflowX={'scroll'}>
            <FormControl as="fieldset" mb={4}>
              <FormLabel fontSize={'lg'}>
                {t('export.export-type-label')}
              </FormLabel>
              <RadioGroup onChange={setFileType} value={fileType}>
                <Stack spacing={4} direction="column">
                  <Box
                    as="label"
                    display="flex"
                    alignItems="center"
                    p={4}
                    mt={2}
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    cursor="pointer"
                    _hover={{ borderColor: 'blue.300', bg: 'blue.50' }}
                  >
                    <Radio value="CSV" mr={4} />
                    <FaFileCsv size={24} color="#2a9d8f" />
                    <Text ml={4} fontWeight="medium">
                      {t('export.export-type-option-csv')}
                    </Text>
                  </Box>
                </Stack>
              </RadioGroup>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel fontSize={'lg'}>{t('export.export-range-label')}</FormLabel>
              <Flex direction={{ base: 'column', xl: 'row' }} gap={4} justifyContent={'space-between'}>
                <Box flex="1">
                  <Text fontWeight="medium" mb={2}>{t('export.export-range-start')}</Text>
                  <Input
                    type="datetime-local"
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                    width="100%"
                  />
                </Box>
                <Box flex="1">
                  <Text fontWeight="medium" mb={2}>{t('export.export-range-end')}</Text>
                  <Input
                    type="datetime-local"
                    value={endDate}
                    onChange={(event) => setEndDate(event.target.value)}
                    width="100%"
                  />
                </Box>
              </Flex>
            </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button mt={8}
                  onClick={handleExport}
                  backgroundColor={theme.secondary}
                  color={'#f8f8f8'}
                  width="full"
                  fontWeight={'400'}>
            {t('export.submit')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
