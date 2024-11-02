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
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text
} from "@chakra-ui/react"
import React, {useState} from "react"
import {useTheme} from "@/hooks/useTheme"
import {useApi} from "@/hooks/useApi"
import {FaFileCsv} from "react-icons/fa"
import moment from "moment"
import toast from "react-hot-toast"
import {useTranslations} from "next-intl";
import {Components} from "@/api/api";

type VaultResponse = Components.Schemas.VaultResponse;

interface ExportCardProperties {
  vault: VaultResponse
  permissions: string[]
}

export const ExportCard = ({ vault, permissions }: ExportCardProperties) => {
  const theme = useTheme()
  const api = useApi()
  const [fileType, setFileType] = useState('CSV')
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
    <Card margin={2}>
      <CardHeader backgroundColor={theme.secondaryColor}
                  color={theme.textColor}>
        <Flex alignItems={'center'}
              justifyContent={'space-between'}>
          <Text fontSize='md' fontWeight={'600'} textTransform={'uppercase'}>{t('export.card.title')}</Text>
        </Flex>
      </CardHeader>
      <CardBody>
        <Stack gap={0}>
          <FormControl as="fieldset">
            <FormLabel fontSize={'lg'}>
              {t('export.card.export-type-label')}
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
                    {t('export.card.export-type-option-csv')}
                  </Text>
                </Box>
              </Stack>
            </RadioGroup>
          </FormControl>
          <FormControl mt={6} mb={4}>
            <FormLabel fontSize={'lg'}>{t('export.card.export-range-label')}</FormLabel>
            <Flex direction={{ base: 'column', xl: 'row' }} gap={4} justifyContent={'space-between'}>
              <Box flex="1">
                <Text fontWeight="medium" mb={2}>{t('export.card.export-range-start')}</Text>
                <Input
                  type="datetime-local"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  width="100%"
                />
              </Box>
              <Box flex="1">
                <Text fontWeight="medium" mb={2}>{t('export.card.export-range-end')}</Text>
                <Input
                  type="datetime-local"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                  width="100%"
                />
              </Box>
            </Flex>
            <Button mt={8} onClick={handleExport} backgroundColor={theme.primaryColor} width="100%" color={'#f8f8f8'} fontWeight={'400'}>
              {t('export.card.submit')}
            </Button>
          </FormControl>
        </Stack>
      </CardBody>
    </Card>
  )
}
