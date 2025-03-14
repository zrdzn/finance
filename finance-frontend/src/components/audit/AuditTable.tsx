import {useApi} from "@/hooks/useApi"
import React, {useEffect, useState} from "react"
import {useTheme} from "@/hooks/useTheme"
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  Box,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  HStack, Table,
  Tag,
  TagLabel, Tbody, Td,
  Text, Th, Thead, Tr
} from "@chakra-ui/react"
import {useDateFormatter} from "@/hooks/useDateFormatter"
import {FaClock, FaUser} from "react-icons/fa"
import {FaCircleCheck} from "react-icons/fa6"
import {useAuditActionFormatter} from "@/hooks/useAuditActionFormatter"
import {useTranslations} from "next-intl";
import {Components} from "@/api/api";
import {DeleteButton} from "@/components/shared/DeleteButton";

type VaultResponse = Components.Schemas.VaultResponse;
type AuditResponse = Components.Schemas.AuditResponse;

interface AuditTableProperties {
  vault: VaultResponse
  permissions: string[]
}

export const AuditTable = ({ vault, permissions }: AuditTableProperties) => {
  const theme = useTheme()
  const api = useApi()
  const [audits, setAudits] = useState<AuditResponse[]>([])
  const { formatDate } = useDateFormatter()
  const t = useTranslations("Audits")
  const { formatAuditAction } = useAuditActionFormatter()

  useEffect(() => {
    api
      .then(client => client.getAudits({ vaultId: vault.id })
        .then(response => setAudits(response.data.audits)))
      .catch(error => console.error(error))
  }, [api, vault.id]);

  return (
      <Card
          margin={4}
          boxShadow="base"
          borderRadius="lg"
          overflow="hidden"
          backgroundColor={theme.background.secondary}
          color={theme.text.primary}
      >
        <CardHeader>
          <Text fontSize="sm" fontWeight={"600"}>
            {t("card.title")}
          </Text>
        </CardHeader>
      <CardBody>
        <Box overflowX="auto">
          <Table variant={"simple"}>
            <Thead>
              <Tr>
                <Th>{t("table.action")}</Th>
                <Th>{t("table.user")}</Th>
                <Th>{t('table.created')}</Th>
                <Th>{t('table.description')}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {audits.length === 0 ? (
                  <Tr>
                    <Td colSpan={4}>
                      <Text textAlign="center" size="sm">
                        {t("card.no-audits")}
                      </Text>
                    </Td>
                  </Tr>
              ) : (
                  audits.sort((audit, nextAudit) => new Date(nextAudit.createdAt).getTime() - new Date(audit.createdAt).getTime())
                      .map((audit) => (
                      <Tr key={audit.id}>
                        <Td>
                          <HStack>
                            <Text fontSize={{ base: 'lg', md: 'xl' }} pr={2}>
                              <FaCircleCheck color={theme.text.green} />
                            </Text>
                            <Text size="sm">
                              {formatAuditAction(audit.auditAction)}
                            </Text>
                          </HStack>
                        </Td>
                        <Td>{audit.user.username}</Td>
                        <Td>{formatDate(audit.createdAt, true)}</Td>
                        <Td>{audit.description}</Td>
                      </Tr>
                  ))
              )}
            </Tbody>
          </Table>
        </Box>
      </CardBody>
    </Card>
  );
}