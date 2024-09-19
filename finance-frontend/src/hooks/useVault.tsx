import {useApi} from "@/hooks/useApi"
import {useEffect, useState} from "react"
import {VaultResponse} from "@/components/api"

interface VaultAccessorProperties {
  publicId: string | string[] | undefined
}

export const useVault = ({ publicId }: VaultAccessorProperties) => {
  const api = useApi()
  const [vault, setVault] = useState<VaultResponse | undefined>(undefined)

  useEffect(() => {
    if (!publicId) {
      console.error("Public id was not provided")
      return;
    }

    api.get(`/vaults/${publicId}`)
      .then(response => setVault(response.data))
      .catch(error => console.error(error));
  }, [api, publicId]);

  if (!vault) {
    return null;
  }

  return vault;
}