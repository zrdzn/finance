import {Button, Card, CardBody, CardHeader, Flex, FormControl, FormLabel, Heading, Input, Stack} from "@chakra-ui/react"
import React, {useState} from "react"
import {useTheme} from "@/hooks/useTheme"
import {VaultResponse, VaultUpdateRequest} from "@/components/api"
import {useApi} from "@/hooks/useApi"
import {useRouter} from "next/router"
import {CurrencySelect} from "@/components/shared/CurrencySelect"
import {TransactionMethodSelect} from "@/components/transaction/TransactionMethodSelect"
import toast from "react-hot-toast"

interface SettingsCardProperties {
  vault: VaultResponse
  permissions: string[]
}

export const SettingsCard = ({ vault, permissions }: SettingsCardProperties) => {
  const theme = useTheme()
  const api = useApi()
  const router = useRouter()
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

  const handleDefaultTransactionMethodChange = (transactionMethod: string) => {
    setVaultUpdateRequest((previous) => ({ ...previous, transactionMethod: transactionMethod }))
  }

  const handleVaultUpdate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (vaultUpdateRequest.name === '') {
      toast.error('You need to provide a name')
      return
    }

    api.patch(`/vaults/${vault.id}`, vaultUpdateRequest)
      .then(() => {
        toast.success('Vault updated')
        setTimeout(() => router.reload(), 1000)
      })
      .catch(error => {
        console.error(error)
        toast.error('Failed to update vault')
      })
  }

  const handleVaultDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    const vaultDeleteResult = api.delete(`/vaults/${vault.id}`)
      .then(() => router.push('/'))
      .catch(error => {
        console.error(error)
        throw error
      })

    toast.promise(vaultDeleteResult, {
      loading: 'Deleting vault',
      success: 'Vault deleted',
      error: 'Failed to delete vault'
    })
  }

  return (
    <Card margin={2}>
      <CardHeader backgroundColor={theme.secondaryColor}
                  color={theme.textColor}>
        <Flex alignItems={'center'}
              justifyContent={'space-between'}>
          <Heading size='sm' textTransform={'uppercase'}>General</Heading>
        </Flex>
      </CardHeader>
      <CardBody>
        <Stack spacing='4'>
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              name={'name'}
              onChange={handleVaultFormChange}
              placeholder='Change vault name'
              value={vaultUpdateRequest.name}
              isDisabled={!permissions.includes("SETTINGS_UPDATE")}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Default currency</FormLabel>
            {
              vault.currency !== undefined &&
                <CurrencySelect onChange={handleDefaultCurrencyChange}
                                defaultValue={vaultUpdateRequest.currency}
                                isDisabled={!permissions.includes("SETTINGS_UPDATE")} />
            }
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Default transaction method</FormLabel>
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
                    Delete vault
                </Button>
            }
            {
              permissions.includes("SETTINGS_UPDATE") &&
                <Button
                    backgroundColor={theme.primaryColor}
                    onClick={handleVaultUpdate}>
                    Save
                </Button>
            }
          </Flex>
        </Stack>
      </CardBody>
    </Card>
  )
}