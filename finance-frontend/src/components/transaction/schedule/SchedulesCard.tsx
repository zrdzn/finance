import {Accordion, Card, CardBody, CardHeader, Divider, Flex, Heading, Stack, Text} from "@chakra-ui/react"
import {AddTransactionButton} from "@/components/transaction/AddTransactionButton"
import React, {useEffect, useState} from "react"
import {useTheme} from "@/hooks/useTheme"
import {useApi} from "@/hooks/useApi"
import {TransactionsCardItem} from "@/components/transaction/TransactionsCardItem"
import {SearchBar} from "@/components/shared/SearchBar"
import {useTranslations} from "next-intl";
import {Components} from "@/api/api";
import {SchedulesCardItem} from "@/components/transaction/schedule/SchedulesCardItem";

type ScheduleResponse = Components.Schemas.ScheduleResponse;
type VaultResponse = Components.Schemas.VaultResponse;
type TransactionResponse = Components.Schemas.TransactionResponse;

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

  return (
    <Card margin={2}>
      <CardHeader backgroundColor={theme.secondaryColor}
                  color={theme.textColor}>
        <Flex alignItems={'center'}
              justifyContent={'space-between'}>
          <Text fontSize='md' fontWeight={'600'} textTransform={'uppercase'}>{t('schedules.card.title')}</Text>
        </Flex>
      </CardHeader>
      <CardBody>
        <Flex justifyContent={'space-between'}
              gap={4}>
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
        <Divider mt={4} />
        <Stack gap={0}>
            {
              queriedSchedules.length === 0 && <Text size={'sm'}>{t('schedules.card.no-schedules')}</Text>
            }
            {
              queriedSchedules &&
              queriedSchedules.sort((schedule, nextSchedule) => new Date(nextSchedule.nextExecution).getTime() - new Date(schedule.nextExecution).getTime())
                .map(schedule =>
                  <>
                    <SchedulesCardItem key={schedule.id}
                                       vaultId={vault.id}
                                       schedule={schedule}
                                       permissions={permissions} />
                    <Divider />
                  </>
                )
            }
        </Stack>
      </CardBody>
    </Card>
  )
}