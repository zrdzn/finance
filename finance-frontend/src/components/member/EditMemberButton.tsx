import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import React, {useRef, useState} from "react"
import {FaEdit} from "react-icons/fa"
import {useTheme} from "@/hooks/useTheme"
import {useApi} from "@/hooks/useApi"
import {useRouter} from 'next/router'
import toast from "react-hot-toast"
import {VaultRoleSelect} from "@/components/vault/VaultRoleSelect";
import {useTranslations} from "next-intl";
import {VaultRole} from "@/api/types";
import {Components} from "@/api/api";

type VaultMemberResponse = Components.Schemas.VaultMemberResponse;
type VaultMemberUpdateRequest = Components.Schemas.VaultMemberUpdateRequest;

interface EditMemberButtonProperties {
  member: VaultMemberResponse
}

export const EditMemberButton = ({ member }: EditMemberButtonProperties) => {
  const theme = useTheme()
  const api = useApi()
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const t = useTranslations("Members")
  const [vaultMemberUpdateRequest, setVaultMemberUpdateRequest] = useState<VaultMemberUpdateRequest>({
    vaultRole: member.vaultRole
  })
  const initialRef = useRef(null)
  const finalRef = useRef(null)

  const handleVaultRoleChange = (vaultRole: VaultRole) => {
    setVaultMemberUpdateRequest({ ...vaultMemberUpdateRequest, vaultRole: vaultRole ?? member.vaultRole });
  }

  const handleMemberUpdate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api
      .then(client => client.updateVaultMember({ vaultId: member.vaultId, userId: member.id }, vaultMemberUpdateRequest))
      .then(() => onClose())
      .then(() => {
        toast.success(t('member-updated-success'))
        setTimeout(() => router.reload(), 1000)
      })
      .catch(error => {
        console.error(error)
        toast.error(t('member-updated-error'))
      })
  }

  return (
    <>
      <Button backgroundColor={theme.primaryColor}
              color={'#f8f8f8'} fontWeight={'400'}
              onClick={(event) => { event.preventDefault(); onOpen() } }>
        <FaEdit />
      </Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('update-modal.title')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mt={4}>
              <FormLabel>{t('update-modal.role-label')}</FormLabel>
              <VaultRoleSelect onChange={handleVaultRoleChange}
                               defaultValue={member.vaultRole} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleMemberUpdate}
                    backgroundColor={theme.primaryColor}
                    color={'#f8f8f8'} fontWeight={'400'}
                    mr={3}>
              {t('update-modal.submit')}
            </Button>
            <Button onClick={onClose} fontWeight={'400'}>{t('update-modal.cancel')}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
