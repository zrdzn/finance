import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  Text,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure, useSteps, Stepper, Step, StepStatus, StepIcon, StepIndicator, StepSeparator,
  Stack, Box, Tooltip, useClipboard,
} from '@chakra-ui/react'
import React, {ChangeEvent, useRef, useState} from "react"
import {useTheme} from "@/hooks/useTheme"
import {useApi} from "@/hooks/useApi"
import toast from "react-hot-toast"
import {FaPencil} from "react-icons/fa6"
import {useAuthentication} from "@/hooks/useAuthentication"
import {useRouter} from "next/router"
import {useTranslations} from "next-intl";
import {AccountUpdateType} from "@/api/types";
import {Components} from "@/api/api";
import Image from "next/image";

type UserEmailUpdateRequest = Components.Schemas.UserEmailUpdateRequest;
type UserPasswordUpdateRequest = Components.Schemas.UserPasswordUpdateRequest;
type TwoFactorSetupResponse = Components.Schemas.TwoFactorSetupResponse;

interface RequestAccountUpdateButtonProperties {
  icon?: React.ReactNode;
  text?: string;
  accountUpdateType: AccountUpdateType;
}

export const RequestAccountUpdateButton = ({ icon, text, accountUpdateType }: RequestAccountUpdateButtonProperties) => {
  const theme = useTheme();
  const api = useApi();
  const router = useRouter();
  const { details } = useAuthentication();
  const { isOpen: requestIsOpen, onOpen: requestOnOpen, onClose: requestOnClose } = useDisclosure();
  const { isOpen: verificationIsOpen, onOpen: verificationOnOpen, onClose: verificationOnClose } = useDisclosure();
  const { isOpen: twoFactorSetupIsOpen, onOpen: twoFactorSetupOnOpen, onClose: twoFactorSetupOnClose } = useDisclosure();
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const t = useTranslations("AccountSettings")
  const [securityCode, setSecurityCode] = useState("")
  const [oneTimePassword, setOneTimePassword] = useState("")
  const [isHovered, setIsHovered] = useState(false)
  const [tooltipLabel, setTooltipLabel] = useState(t('profile-modal.steps.two-factor.code-copy-tooltip'));
  const [userEmailUpdateRequest, setUserEmailUpdateRequest] = useState<UserEmailUpdateRequest>({
    securityCode: "",
    email: ""
  })
  const [userPasswordUpdateRequest, setUserPasswordUpdateRequest] = useState<UserPasswordUpdateRequest>({
    securityCode: "",
    oldPassword: "",
    newPassword: ""
  })
  const [twoFactorSetupResponse, setTwoFactorSetupResponse] = useState<TwoFactorSetupResponse>({
    qrCodeImage: "",
    secret: ""
  })
  const steps = [
    {
      title: t('profile-modal.steps.security.title'),
      description: t('profile-modal.steps.security.description')
    },
    (function() {
      switch (accountUpdateType) {
        case 'EMAIL':
          return {
            title: t('profile-modal.steps.email.title'),
            description: t('profile-modal.steps.email.description')
          }
        case 'PASSWORD':
          return {
            title: t('profile-modal.steps.password.title'),
            description: t('profile-modal.steps.password.description')
          }
        case 'TWO_FACTOR':
          return {
            title: t('profile-modal.steps.two-factor.title'),
            description: t('profile-modal.steps.two-factor.description')
          }
      }
    })()
  ]

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const handleNextStep = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSecurityCodeSend = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api
        .then(client => client.requestUserUpdate())
        .then(() => {
          toast.success(t('profile-card.security-code-sent'))
          setTimeout(() => {
            requestOnClose()
            verificationOnOpen()
          }, 1000)
        })
        .catch(error => console.error(error))
  }

  const handleSecurityCodeUpdate = (securityCode: string) => {
    setSecurityCode(securityCode)
    setUserEmailUpdateRequest((previous) => ({ ...previous, securityCode: securityCode }));
    setUserPasswordUpdateRequest((previous) => ({ ...previous, securityCode: securityCode }));
  }

  const handleUserEmailUpdate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api
        .then(client => client.updateUserEmail(null, userEmailUpdateRequest))
        .then(() => {
          toast.success(t('profile-modal.email-updated-success'))
          setTimeout(() => router.reload(), 1000)
        })
        .catch(error => {
          console.error(error)
          toast.error(t('profile-modal.email-updated-error'))
        })
  }

  const handleUserPasswordUpdate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api
        .then(client => client.updateUserPassword(null, userPasswordUpdateRequest))
        .then(() => {
          toast.success(t('profile-modal.password-updated-success'))
          setTimeout(() => router.reload(), 1000)
        })
        .catch(error => {
          console.error(error)
          toast.error(t('profile-modal.password-updated-error'))
        })
  }

  const handleTwoFactorSetupRequest = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api
      .then(client => client.requestUserTwoFactorSetup(null, {
        securityCode: securityCode
      })
        .then(response => setTwoFactorSetupResponse(response.data)))
      .then(() => twoFactorSetupOnOpen())
      .catch(error => {
        console.error(error)
        toast.error(t('profile-modal.two-factor-setup-error'))
      })
  }

  const handleTwoFactorCodeVerify = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api
      .then(client => client.verifyUserTwoFactorSetup(null, {
        secret: twoFactorSetupResponse.secret,
        oneTimePassword: oneTimePassword
      }))
      .then(() => {
        toast.success(t('profile-modal.two-factor-verify-success'))
        setTimeout(() => router.reload(), 1000)
      })
      .catch(error => {
        console.error(error)
        toast.error(t('profile-modal.two-factor-verify-error'))
      })
  }

  const handleCopy = async (secret: string) => {
    await navigator.clipboard.writeText(secret)

    setTooltipLabel(t('profile-modal.steps.two-factor.code-copied-tooltip'))
    setTimeout(() => setTooltipLabel(t('profile-modal.steps.two-factor.code-copy-tooltip')), 1500)
  }

  return details && (
    <>
      <Button backgroundColor={theme.primaryColor} onClick={requestOnOpen} gap={1} color={'#f8f8f8'} fontWeight={'400'}>
        {icon && icon}
        {text && text}
      </Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={requestIsOpen}
        onClose={requestOnClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('profile-modal.steps.verify.title')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text>
              {t('profile-modal.steps.verify.description').replace("%email%", details.email)}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={handleSecurityCodeSend}
              backgroundColor={theme.primaryColor}
              mr={3}
              color={'#f8f8f8'} fontWeight={'400'}
            >
              {t('profile-modal.steps.verify.submit')}
            </Button>
            <Button onClick={requestOnClose} fontWeight={'400'}>{t('profile-modal.steps.verify.cancel')}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={verificationIsOpen}
        onClose={verificationOnClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {steps[activeStep].title}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Stack gap={4}>
              <Stepper size='sm' index={activeStep}>
                {steps.map((step, index) => (
                  <Step key={index}>
                    <StepIndicator>
                      <StepStatus complete={<StepIcon />} />
                    </StepIndicator>
                    <StepSeparator />
                  </Step>
                ))}
              </Stepper>

              {activeStep === 0 && (
                <FormControl isRequired>
                  <Input
                    ref={initialRef}
                    placeholder={t('profile-modal.steps.security.enter-code-placeholder')}
                    value={securityCode}
                    onChange={(event) => handleSecurityCodeUpdate(event.target.value)}
                  />
                </FormControl>
              )}

              {activeStep === 1 && accountUpdateType === 'EMAIL' && (
                <FormControl isRequired>
                  <FormLabel>{t('profile-modal.steps.email.new-email-label')}</FormLabel>
                  <Input
                    placeholder={t('profile-modal.steps.email.new-email-placeholder')}
                    value={userEmailUpdateRequest.email}
                    onChange={(event) => setUserEmailUpdateRequest({
                      ...userEmailUpdateRequest,
                      email: event.target.value,
                    })}
                  />
                </FormControl>
              )}

              {activeStep === 1 && accountUpdateType === 'PASSWORD' && (
                <>
                  <FormControl isRequired>
                    <FormLabel>{t('profile-modal.steps.password.old-password-label')}</FormLabel>
                    <Input
                      type="password"
                      placeholder={t('profile-modal.steps.password.old-password-placeholder')}
                      value={userPasswordUpdateRequest.oldPassword}
                      onChange={(event) => setUserPasswordUpdateRequest({
                        ...userPasswordUpdateRequest,
                        oldPassword: event.target.value,
                      })}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>{t('profile-modal.steps.password.new-password-label')}</FormLabel>
                    <Input
                      type="password"
                      placeholder={t('profile-modal.steps.password.new-password-placeholder')}
                      value={userPasswordUpdateRequest.newPassword}
                      onChange={(event) => setUserPasswordUpdateRequest({
                        ...userPasswordUpdateRequest,
                        newPassword: event.target.value,
                      })}
                    />
                  </FormControl>
                </>
              )}

              {activeStep === 1 && accountUpdateType === 'TWO_FACTOR' && (
                <>
                  <Text>{t('profile-modal.steps.two-factor.description')}</Text>
                </>
              )}
            </Stack>
          </ModalBody>
          <ModalFooter>
            {activeStep > 0 && (
              <Button
                variant="outline"
                onClick={handlePreviousStep}
                mr={3}
                fontWeight={'400'}
              >
                {t('profile-modal.steps.back-button')}
              </Button>
            )}
            {activeStep < steps.length - 1 ? (
              <Button
                backgroundColor={theme.primaryColor}
                onClick={handleNextStep}
                mr={3}
                color={'#f8f8f8'} fontWeight={'400'}
              >
                {t('profile-modal.steps.next-button')}
              </Button>
            ) : (
              <Button
                backgroundColor={theme.primaryColor}
                onClick={event => {
                  switch (accountUpdateType) {
                    case 'EMAIL':
                      handleUserEmailUpdate(event)
                      break
                    case 'PASSWORD':
                      handleUserPasswordUpdate(event)
                      break
                    case 'TWO_FACTOR':
                      handleTwoFactorSetupRequest(event)
                      break
                  }
                }}
                mr={3}
                color={'#f8f8f8'} fontWeight={'400'}
              >
                {t('profile-modal.steps.submit-button')}
              </Button>
            )}
            <Button onClick={verificationOnClose} fontWeight={'400'}>{t('profile-modal.steps.cancel-button')}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal initialFocusRef={initialRef}
             finalFocusRef={finalRef}
             isOpen={twoFactorSetupIsOpen}
             onClose={twoFactorSetupOnClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('profile-modal.steps.two-factor.code-title')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Text textAlign="center">
                {t('profile-modal.steps.two-factor.code-image-label')}
              </Text>
              <Image
                src={twoFactorSetupResponse.qrCodeImage}
                alt={twoFactorSetupResponse.secret}
                width="200"
                height="200"
              />
              <Text mt={4} textAlign="center">
                {t('profile-modal.steps.two-factor.code-manual-label')}
              </Text>
              <Tooltip
                label={tooltipLabel}
                isOpen={isHovered}
                placement="top"
              >
                <Text
                  textAlign="center"
                  fontSize="xl"
                  fontWeight="700"
                  onClick={() => {
                    handleCopy(twoFactorSetupResponse.secret)
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  cursor="pointer"
                >
                  {
                    twoFactorSetupResponse.secret && twoFactorSetupResponse.secret.length > 0 &&
                    (twoFactorSetupResponse.secret.match(/.{1,4}/g)?.join(' ') || '')
                  }
                </Text>
              </Tooltip>
            </Box>
            <FormControl isRequired mt={5}>
              <FormLabel>{t('profile-modal.steps.two-factor.code-generated-label')}</FormLabel>
              <Input
                type="text"
                placeholder={t('profile-modal.steps.two-factor.code-generated-placeholder')}
                value={oneTimePassword}
                onChange={(event) => setOneTimePassword(event.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              backgroundColor={theme.primaryColor}
              onClick={handleTwoFactorCodeVerify}
              mr={3}
              color={'#f8f8f8'} fontWeight={'400'}
            >
              {t('profile-modal.steps.submit-button')}
            </Button>
            <Button onClick={twoFactorSetupOnClose} fontWeight={'400'}>{t('profile-modal.steps.verify.cancel')}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
