import {
    Box,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Flex,
    HStack,
    Stack,
    Table, Tag, TagLabel,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr
} from "@chakra-ui/react"
import React, {useEffect, useState} from "react"
import {useTheme} from "@/hooks/useTheme"
import {useApi} from "@/hooks/useApi"
import {SearchBar} from "@/components/shared/SearchBar"
import {useTranslations} from "next-intl";
import {Components} from "@/api/api";
import {SchedulesCardItem} from "@/components/transaction/schedule/SchedulesCardItem";
import {AccountAvatar} from "@/components/account/AccountAvatar";
import {FaCaretDown, FaCaretUp, FaClock} from "react-icons/fa";
import {EditTransactionButton} from "@/components/transaction/EditTransactionButton";
import {AddScheduleButton} from "@/components/transaction/schedule/AddScheduleButton";
import {DeleteButton} from "@/components/shared/DeleteButton";
import {useRouter} from "next/router";
import {useDateFormatter} from "@/hooks/useDateFormatter";
import {useIntervalFormatter} from "@/hooks/useIntervalFormatter";
import toast from "react-hot-toast";

type ScheduleResponse = Components.Schemas.ScheduleResponse;
type VaultResponse = Components.Schemas.VaultResponse;

interface SchedulesCardProperties {
  vault: VaultResponse
  permissions: string[]
}

export const SchedulesCard = ({ vault, permissions }: SchedulesCardProperties) => {
  const theme = useTheme()
  const api = useApi()
  const t = useTranslations("Transactions")
  const [schedules, setSchedules] = useState<ScheduleResponse[]>([])
  const [queriedSchedules, setQueriedSchedules] = useState<ScheduleResponse[]>([])
  const { formatInterval } = useIntervalFormatter()
  const router = useRouter()
  const { formatDate } = useDateFormatter()

  useEffect(() => {
      api
          .then(client => client.getSchedulesByVaultId({ vaultId: vault.id })
            .then(response => {
                setSchedules(response.data.schedules)
                setQueriedSchedules(response.data.schedules)
            }))
          .catch(error => console.error(error))
  }, [api, vault.id]);

  const handleSearchResults = (results: ScheduleResponse[]) => {
    setQueriedSchedules(results)
  }

    const handleScheduleDelete = (event: React.MouseEvent<HTMLButtonElement>, scheduleId: number) => {
        event.preventDefault()

        api
            .then(client => client.deleteScheduleById({ scheduleId: scheduleId }))
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
      <Card
          margin={4}
          boxShadow="base"
          width={'full'}
          borderRadius="lg"
          overflow="hidden"
          backgroundColor="whiteAlpha.900"
          border="1px solid"
          borderColor="gray.200"
      >
          <CardHeader>
              <Text fontSize="sm" fontWeight={"600"}>
                  {t("schedules.card.title")}
              </Text>
          </CardHeader>
      <CardBody>
        <Flex justifyContent={'space-between'} gap={4} mb={4}>
          <SearchBar
            placeholder={t('schedules.card.search-placeholder')}
            content={schedules}
            onSearch={handleSearchResults}
            filter={(schedule, query) => {
              if (schedule.description === undefined) {
                return false
              }

              return schedule.description.toLowerCase().includes(query.toLowerCase())}
            }
          />
        </Flex>
          <Box overflowX="auto">
              <Table variant={"simple"}>
                  <Thead>
                      <Tr>
                          <Th>{t("schedules.table.description")}</Th>
                          <Th>{t("schedules.table.next-execution")}</Th>
                          <Th>{t("schedules.table.interval")}</Th>
                          <Th>{t("schedules.table.actions")}</Th>
                      </Tr>
                  </Thead>
                  <Tbody>
                      {queriedSchedules.length === 0 ? (
                          <Tr>
                              <Td colSpan={4}>
                                  <Text textAlign="center" size="sm">
                                      {t("schedules.card.no-schedules")}
                                  </Text>
                              </Td>
                          </Tr>
                      ) : (
                          queriedSchedules.sort((schedule, nextSchedule) => new Date(nextSchedule.nextExecution).getTime() - new Date(schedule.nextExecution).getTime())
                              .map((schedule) => (
                                  <Tr key={schedule.id}>
                                      <Td>{schedule.description}</Td>
                                      <Td>
                                          <Tag size="sm" colorScheme="gray">
                                              <TagLabel>
                                                  <HStack>
                                                      <FaClock />
                                                      <Text fontSize={{ base: 'xs', md: 'sm' }}>{formatDate(schedule.nextExecution, true)}</Text>
                                                  </HStack>
                                              </TagLabel>
                                          </Tag>
                                      </Td>
                                      <Td>{t('schedules.card.interval-value').replace("%interval%", formatInterval(schedule.amount, schedule.interval))}</Td>
                                      <Td>
                                          <HStack spacing={2}>
                                              {
                                                  permissions.includes("SCHEDULE_DELETE") && <DeleteButton onClick={(event) => handleScheduleDelete(event, schedule.id)} />
                                              }
                                          </HStack>
                                      </Td>
                                  </Tr>
                              ))
                      )}
                  </Tbody>
              </Table>
          </Box>
      </CardBody>
    </Card>
  )
}