import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import React, {ChangeEvent, useRef, useState} from "react"
import {FaPlus} from "react-icons/fa"
import {useTheme} from "@/hooks/useTheme"
import {useApi} from "@/hooks/useApi"
import {VaultInvitationCreateRequest} from "@/components/api"
import {useRouter} from 'next/router'
import toast from "react-hot-toast"
import {useTranslations} from "next-intl";

interface InvitationCreateButtonProperties {
  vaultId: number
}

export const InvitationCreateButton = ({ vaultId }: InvitationCreateButtonProperties) => {
  const theme = useTheme()
  const api = useApi()
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [vaultInvitationCreateRequest, setVaultInvitationCreateRequest] = useState<VaultInvitationCreateRequest>({
    vaultId: 0,
    userEmail: '',
  })
  const t = useTranslations("Invitations")
  const initialRef = useRef(null)
  const finalRef = useRef(null)

  const handleUserEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setVaultInvitationCreateRequest((previous) => ({ ...previous, userEmail: event.target.value }));
  }

  const handleInvitationCreate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api.post(`/vaults/${vaultId}/invitations`, {
      userEmail: vaultInvitationCreateRequest.userEmail,
    })
      .then(() => onClose())
      .then(() => {
        toast.success(t('invitation-created-success').replace("%email%", vaultInvitationCreateRequest.userEmail))
        setTimeout(() => router.reload(), 1000)
      })
      .catch(error => {
        console.error(error)
        toast.error(t('invitation-created-error').replace("%email%", vaultInvitationCreateRequest.userEmail))
      })
  }

  return (
    <>
      <Button backgroundColor={theme.primaryColor}
              onClick={onOpen}>
        <FaPlus />
      </Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('create-modal.title')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>{t('create-modal.email-label')}</FormLabel>
              <Input onChange={handleUserEmailChange}
                     ref={initialRef}
                     placeholder={t('create-modal.email-placeholder')} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleInvitationCreate}
                    backgroundColor={theme.primaryColor}
                    mr={3}>
              {t('create-modal.submit')}
            </Button>
            <Button onClick={onClose}>{t('create-modal.cancel')}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}