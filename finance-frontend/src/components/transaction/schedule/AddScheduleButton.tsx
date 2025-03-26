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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import React, {ChangeEvent, useRef, useState} from "react"
import {FaCalendar} from "react-icons/fa"
import {useTheme} from "@/hooks/useTheme"
import {useApi} from "@/hooks/useApi"
import {useRouter} from 'next/router'
import toast from "react-hot-toast"
import {useTranslations} from "next-intl";
import {Components} from "@/api/api";
import {ScheduleInterval, TransactionType} from "@/api/types";
import {IntervalSelect} from "@/components/shared/IntervalSelect";
import {useIntervalFormatter} from "@/hooks/useIntervalFormatter";

type ScheduleCreateRequest = Components.Schemas.ScheduleCreateRequest;

interface AddScheduleButtonProperties {
  transactionId: number
}

export const AddScheduleButton = ({ transactionId }: AddScheduleButtonProperties) => {
  const theme = useTheme()
  const { api } = useApi()
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { formatInterval } = useIntervalFormatter()
  const t = useTranslations("Transactions")
  const [scheduleCreateRequest, setScheduleCreateRequest] = useState<ScheduleCreateRequest>({
    description: '',
    interval: "DAY",
    amount: 1,
  })
  const initialRef = useRef(null)
  const finalRef = useRef(null)

  const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setScheduleCreateRequest((previous) => ({ ...previous, description: event.target.value }));
  }

  const handleIntervalChange = (interval: ScheduleInterval) => {
    setScheduleCreateRequest((previous) => ({ ...previous, interval: interval }))
  }

  const handleAmountChange = (amount: number) => {
    setScheduleCreateRequest((previous) => ({ ...previous, amount: amount }))
  }

  const handleCreate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (scheduleCreateRequest.description === '') {
        toast.error(t('schedules.create-modal.validation.missing-description'))
        return
    }

    api
        .then(client => client.createSchedule(transactionId, {
            description: scheduleCreateRequest.description,
            interval: scheduleCreateRequest.interval,
            amount: scheduleCreateRequest.amount
        }))
        .then(() => onClose())
        .then(() => {
            toast.success(t('schedules.schedule-created-success'))
            setTimeout(() => router.reload(), 1000)
        })
        .catch(error => {
            console.error(error)
            toast.error(t('schedules.schedule-created-error'))
        })
  }

  return (
    <>
      <Button backgroundColor={'purple.500'}
              color={'#f8f8f8'}
              fontWeight={'400'}
              size={'sm'}
              gap={1}
              onClick={onOpen}>
        <FaCalendar />
        <Text>
            {t('schedules.create-button')}
        </Text>
      </Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent backgroundColor={theme.background.secondary}
                      color={theme.text.primary}>
          <ModalHeader>{t('schedules.create-modal.title')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired>
              <FormLabel>{t('schedules.create-modal.description-label')}</FormLabel>
              <Input onChange={handleDescriptionChange}
                     ref={initialRef}
                     placeholder={t('schedules.create-modal.description-placeholder')} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>{t('schedules.create-modal.interval-label')}</FormLabel>
              <IntervalSelect onChange={handleIntervalChange} defaultValue={scheduleCreateRequest.interval} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>{t('schedules.create-modal.amount-label')}</FormLabel>
              <NumberInput
                  onChange={(valueString) => handleAmountChange(parseInt(valueString))}
                  value={scheduleCreateRequest.amount}
                  min={1}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <Text mt={4}>
              {t('schedules.create-modal.preview').replace("%interval%", formatInterval(scheduleCreateRequest.amount, scheduleCreateRequest.interval))}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleCreate}
                    backgroundColor={theme.secondary}
                    color={'#f8f8f8'}
                    fontWeight={'400'}
                    mr={3}>
              {t('schedules.create-modal.submit')}
            </Button>
            <Button onClick={onClose}>{t('schedules.create-modal.cancel')}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
