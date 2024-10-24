import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text
} from "@chakra-ui/react"
import React, {useState} from "react"
import {useTheme} from "@/hooks/useTheme"
import {useApi} from "@/hooks/useApi"
import {useRouter} from "next/router"
import {CurrencySelect} from "@/components/shared/CurrencySelect"
import {TransactionMethodSelect} from "@/components/transaction/TransactionMethodSelect"
import toast from "react-hot-toast"
import {useTranslations} from "next-intl";
import {Components} from "@/api/api";
import {TransactionMethod} from "@/api/types";

type VaultUpdateRequest = Components.Schemas.VaultUpdateRequest;
type VaultResponse = Components.Schemas.VaultResponse;

interface SettingsCardProperties {
  vault: VaultResponse
  permissions: string[]
}

export const SettingsCard = ({ vault, permissions }: SettingsCardProperties) => {
  const theme = useTheme()
  const api = useApi()
  const router = useRouter()
  const t = useTranslations("VaultSettings")
  const [vaultUpdateRequest, setVaultUpdateRequest] = useState<VaultUpdateRequest>({
    name: vault.name,
    currency: vault.currency,
    transactionMethod: vault.transactionMethod
  })

  const handleVaultFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVaultUpdateRequest((previous) => ({ ...previous, [event.target.name]: event.target.value }))
  }

  const handleDefaultCurrencyChange = (currency: string) => {
    setVaultUpdateRequest((previous) => ({ ...previous, currency: currency }))
  }

  const handleDefaultTransactionMethodChange = (transactionMethod: TransactionMethod) => {
    setVaultUpdateRequest((previous) => ({ ...previous, transactionMethod: transactionMethod }))
  }

  const handleVaultUpdate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (vaultUpdateRequest.name === '') {
      toast.error(t('form.validation.missing-name'))
      return
    }

    api
        .then(client => client.updateVault({ vaultId: vault.id }, vaultUpdateRequest))
        .then(() => {
            toast.success(t('vault-updated-success'))
            setTimeout(() => router.reload(), 1000)
        })
        .catch(error => {
            console.error(error)
            toast.error(t('vault-updated-error'))
        })
  }

  const handleVaultDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    const vaultDeleteResult = api
        .then(client => client.removeVault({ vaultId: vault.id }))
        .then(() => router.push('/'))
        .catch(error => {
          console.error(error)
          throw error
        })

    toast.promise(vaultDeleteResult, {
      loading: t('vault-deleted-loading'),
      success: t('vault-deleted-success'),
      error: t('vault-deleted-error')
    })
  }

  return (
    <Card margin={2}>
      <CardHeader backgroundColor={theme.secondaryColor}
                  color={theme.textColor}>
        <Flex alignItems={'center'}
              justifyContent={'space-between'}>
          <Text fontSize='md' fontWeight={'600'} textTransform={'uppercase'}>{t('card.title')}</Text>
        </Flex>
      </CardHeader>
      <CardBody>
        <Stack spacing='4'>
          <FormControl isRequired>
            <FormLabel>{t('form.name-label')}</FormLabel>
            <Input
              name={'name'}
              onChange={handleVaultFormChange}
              placeholder={t('form.name-placeholder')}
              value={vaultUpdateRequest.name}
              isDisabled={!permissions.includes("SETTINGS_UPDATE")}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>{t('form.default-currency-label')}</FormLabel>
            {
              vault.currency !== undefined &&
                <CurrencySelect onChange={handleDefaultCurrencyChange}
                                defaultValue={vaultUpdateRequest.currency}
                                isDisabled={!permissions.includes("SETTINGS_UPDATE")} />
            }
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>{t('form.default-transaction-method-label')}</FormLabel>
            {
              vault.transactionMethod !== undefined &&
                <TransactionMethodSelect onChange={handleDefaultTransactionMethodChange}
                                         defaultValue={vaultUpdateRequest.transactionMethod}
                                         isDisabled={!permissions.includes("SETTINGS_UPDATE")} />
            }
          </FormControl>

          <Flex mt={2} justifyContent={'space-between'} gap={3}>
            {
              permissions.includes("DELETE") &&
                <Button
                    backgroundColor={'red.300'}
                    onClick={handleVaultDelete}>
                  {t('vault-delete-button')}
                </Button>
            }
            {
              permissions.includes("SETTINGS_UPDATE") &&
                <Button
                    backgroundColor={theme.primaryColor}
                    onClick={handleVaultUpdate}>
                  {t('form.submit')}
                </Button>
            }
          </Flex>
        </Stack>
      </CardBody>
    </Card>
  )
}