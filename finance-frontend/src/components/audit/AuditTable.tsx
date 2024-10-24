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
  HStack,
  Tag,
  TagLabel,
  Text
} from "@chakra-ui/react"
import {useDateFormatter} from "@/hooks/useDateFormatter"
import {FaClock, FaUser} from "react-icons/fa"
import {FaCircleCheck} from "react-icons/fa6"
import {useAuditActionFormatter} from "@/hooks/useAuditActionFormatter"
import {useTranslations} from "next-intl";
import {Components} from "@/api/api";

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
    <Card margin={2}>
      <CardHeader backgroundColor={theme.secondaryColor} color={theme.textColor}>
        <Flex alignItems={'center'} justifyContent={'space-between'}>
          <Text fontSize='md' fontWeight={'600'} textTransform={'uppercase'}>{t('card.title')}</Text>
        </Flex>
      </CardHeader>
      <CardBody>
        <Accordion allowToggle width={'full'}>
          {audits.length === 0 ? (
            <Text textAlign={'center'}>{t('card.no-audits')}</Text>
          ) : (
            audits.sort((audit, nextAudit) => new Date(nextAudit.createdAt).getTime() - new Date(audit.createdAt).getTime())
              .map((audit) => (
              <>
                <AccordionItem key={audit.id} paddingY={4} borderTop={'none'}>
                  <AccordionButton width="full">
                    <Box width="full">
                      <Flex
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <HStack
                          maxWidth="100%"
                          alignItems="center"
                          justifyContent="flex-start"
                          wrap="wrap"
                          spacing={2}
                        >
                          <Text fontSize={{ base: 'lg', md: 'xl' }} pr={2}>
                            <FaCircleCheck color="green" />
                          </Text>
                          <Text size="sm" fontWeight="600">
                            {formatAuditAction(audit.auditAction)}
                          </Text>

                          <HStack ml={2} spacing={1} wrap="wrap">
                            <Tag size="sm" colorScheme="orange">
                              <TagLabel>
                                <HStack>
                                  <FaUser />
                                  <Text fontSize={{ base: 'xs', md: 'sm' }}>{audit.user.username}</Text>
                                </HStack>
                              </TagLabel>
                            </Tag>
                            <Tag size="sm" colorScheme="gray">
                              <TagLabel>
                                <HStack>
                                  <FaClock />
                                  <Text fontSize={{ base: 'xs', md: 'sm' }}>{formatDate(audit.createdAt, true)}</Text>
                                </HStack>
                              </TagLabel>
                            </Tag>
                          </HStack>
                        </HStack>

                        <Text
                          fontSize={{ base: 'md', md: 'lg' }}
                          textAlign="center"
                          mt={{ base: 2, md: 0 }}
                        >
                          {audit.description}
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