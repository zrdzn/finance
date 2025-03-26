import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex, HStack,
  Text
} from "@chakra-ui/react"
import React from "react"
import {useApi} from "@/hooks/useApi"
import {useRouter} from "next/router"
import {DeleteButton} from "@/components/shared/DeleteButton"
import toast from "react-hot-toast"
import {useDateFormatter} from "@/hooks/useDateFormatter"
import {useTranslations} from "next-intl";
import {useIntervalFormatter} from "@/hooks/useIntervalFormatter";
import {Components} from "@/api/api";
import {useTheme} from "@/hooks/useTheme";

type ScheduleResponse = Components.Schemas.ScheduleResponse;

interface SchedulesCardItemProperties {
  vaultId: number
  schedule: ScheduleResponse
  permissions: string[]
}

export const SchedulesCardItem = ({
  schedule,
  permissions
}: SchedulesCardItemProperties) => {
  const { api } = useApi()
  const router = useRouter()
  const { formatDate } = useDateFormatter()
  const { formatInterval } = useIntervalFormatter()
  const t = useTranslations("Transactions")
  const theme = useTheme()

  const handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api
        .then(client => client.deleteScheduleById({ scheduleId: schedule.id }))
        .then(() => {
            toast.success(t('schedules.schedule-deleted-success'))
            setTimeout(() => router.reload(), 1000)
        })
        .catch(error => {
            console.error(error)
            toast.error(t('schedules.schedule-deleted-error'))
        })
  }

  return (
    <Accordion allowToggle width={'full'} allowMultiple={false}>
      <AccordionItem width={'full'}
                     paddingY={4}
                     borderTop={'none'}>
          <AccordionButton width={'full'}>
            <Box width={'full'}>
              <Flex justifyContent={'space-between'}>
                <HStack width="70%">
                  <Text fontSize='md'
                        fontWeight={'600'}
                        maxWidth={'70%'}>
                    {schedule.description}
                  </Text>
                </HStack>
                <HStack>
                  <Text fontSize={'lg'} fontWeight={'600'}>
                    {t('schedules.card.interval-value').replace("%interval%", formatInterval(schedule.amount, schedule.interval))}
                  </Text>
                </HStack>
              </Flex>
              <Flex justifyContent={'space-between'}>
                <Text color={theme.text.secondary}
                      fontSize={'sm'}
                      letterSpacing={0.2}>
                  {t('schedules.card.next-execution').replace("%date%", formatDate(schedule.nextExecution, true))}
                </Text>
                <Text color={theme.text.secondary}
                      fontSize={'sm'}
                      letterSpacing={0.5}>
                  {t('schedules.card.interval')}
                </Text>
              </Flex>
            </Box>
          </AccordionButton>
        <AccordionPanel pb={4}>
          <Flex justifyContent={'end'} gap={2}>
            {
              permissions.includes("SCHEDULE_DELETE") && <DeleteButton onClick={handleDelete} />
            }
          </Flex>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}