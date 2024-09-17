import {AnalyticsOverviewStatisticType, AuditResponse, VaultResponse} from "@/components/api"
import {useApi} from "@/hooks/apiClient"
import {useEffect, useState} from "react"
import {useTheme} from "@/hooks/theme"
import {
  Card,
  CardBody,
  CardHeader,
  Flex,
  Text,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Box,
  Stack, AccordionItem, AccordionButton, Accordion, Divider
} from "@chakra-ui/react"

interface AuditTableProperties {
  vault: VaultResponse
  permissions: string[]
}

export const AuditTable = ({ vault, permissions }: AuditTableProperties) => {
  const theme = useTheme()
  const api = useApi()
  const [audits, setAudits] = useState<AuditResponse[]>([])

  useEffect(() => {
    api.get(`/audits/${vault.id}`)
      .then(response => {
        setAudits(response.data.audits)
      })
      .catch(error => console.error(error))
  }, [api, vault.id]);

  return (
    <Card margin={2}>
      <CardHeader backgroundColor={theme.secondaryColor} color={theme.textColor}>
        <Flex alignItems={'center'} justifyContent={'space-between'}>
          <Heading size='sm' textTransform={'uppercase'}>Audit Logs</Heading>
        </Flex>
      </CardHeader>
      <CardBody>
        <Accordion allowToggle width={'full'}>
          {audits.length === 0 ? (
            <Text textAlign={'center'}>No audit logs available</Text>
          ) : (
            audits.map((audit) => (
              <>
              <AccordionItem key={audit.id} paddingY={4} borderTop={'none'}>
                <AccordionButton width={'full'}>
                  <Box width={'full'}>
                    <Flex justifyContent={'space-between'}>
                      <Heading size='sm' isTruncated maxWidth={'70%'}>
                        {new Date(audit.createdAt * 1000).toLocaleString()}
                      </Heading>
                      <Heading fontSize={'md'} letterSpacing={0.2}>
                        {audit.description}
                      </Heading>
                    </Flex>
                    <Flex justifyContent={'space-between'}>
                      <Text color={'dimgray'} fontSize={'sm'} letterSpacing={0.2}>
                        {audit.vaultMember.user.username}
                      </Text>
                    </Flex>
                  </Box>
                </AccordionButton>
              </AccordionItem>
              <Divider />
              </>
            )))
          }
        </Accordion>
      </CardBody>
    </Card>
  );
}