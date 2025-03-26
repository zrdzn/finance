import {useApi} from "@/hooks/useApi"
import {useEffect, useState} from "react"
import {Components} from "@/api/api";

type VaultResponse = Components.Schemas.VaultResponse;

interface VaultAccessorProperties {
  publicId: string | string[] | undefined
}

export const useVault = ({ publicId }: VaultAccessorProperties) => {
  const { api } = useApi()
  const [vault, setVault] = useState<VaultResponse | undefined>(undefined)

  useEffect(() => {
    if (!publicId) {
      console.error("Public id was not provided")
      return;
    }

    api
        .then(client => client.getVaultByPublicId({ vaultPublicId: publicId as string })
            .then(response => setVault(response.data)))
        .catch(error => console.error(error))
  }, [api, publicId]);

  if (!vault) {
    return null;
  }

  return vault;
}