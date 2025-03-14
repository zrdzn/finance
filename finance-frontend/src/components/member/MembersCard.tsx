import {Box, Card, CardBody, CardHeader, Divider, Flex, Stack, Table, Tag, TagLabel, Text, Thead, Tbody, Tr, Th, Td, HStack} from "@chakra-ui/react"
import React, {useEffect, useState} from "react"
import {useTheme} from "@/hooks/useTheme"
import {useApi} from "@/hooks/useApi"
import {SearchBar} from "@/components/shared/SearchBar"
import {useTranslations} from "next-intl";
import {Components} from "@/api/api";
import toast from "react-hot-toast";
import { AccountAvatar } from "../account/AccountAvatar"
import { EditMemberButton } from "./EditMemberButton"
import {DeleteButton} from "@/components/shared/DeleteButton";

type VaultResponse = Components.Schemas.VaultResponse;
type VaultRoleResponse = Components.Schemas.VaultRoleResponse;
type VaultMemberResponse = Components.Schemas.VaultMemberResponse;

interface MembersCardProperties {
  vault: VaultResponse
  vaultRole: VaultRoleResponse
}

export const MembersCard = ({ vault, vaultRole }: MembersCardProperties) => {
    const api = useApi();
    const t = useTranslations("Members");
    const theme = useTheme()
    const [members, setMembers] = useState<VaultMemberResponse[]>([])
    const [queriedMembers, setQueriedMembers] = useState<VaultMemberResponse[]>([])

    useEffect(() => {
        api
            .then((client) =>
                client
                    .getVaultMembers({ vaultId: vault.id })
                    .then((response) => {
                        setMembers(response.data.vaultMembers);
                        setQueriedMembers(response.data.vaultMembers);
                    })
            )
            .catch((error) => console.error(error));
    }, [api, vault.id]);

    const handleSearchResults = (results: VaultMemberResponse[]) => {
        setQueriedMembers(results);
    };

    const handleMemberDelete = (member: VaultMemberResponse) => {
        api
            .then((client) => client.removeVaultMember({ vaultId: member.vaultId, userId: member.id }))
            .then(() => {
                toast.success(t("member-deleted-success").replace("%username%", member.user.username));
                setTimeout(() => window.location.reload(), 1000);
            })
            .catch((error) => {
                console.error(error);
                toast.error(t("member-deleted-error").replace("%username%", member.user.username));
            });
    };

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
                <Text fontSize="sm" fontWeight="600">
                    {t("card.title")}
                </Text>
            </CardHeader>
            <CardBody>
                <Flex justifyContent={"space-between"} gap={4} mb={4}>
                    <SearchBar
                        placeholder={t("card.search-placeholder")}
                        content={members}
                        onSearch={handleSearchResults}
                        filter={(member, query) =>
                            member.user.username.toLowerCase().includes(query.toLowerCase()) ||
                            member.user.email.toLowerCase().includes(query.toLowerCase())
                        }
                    />
                </Flex>
                <Divider mb={4} />
                <Box overflowX="auto">
                    <Table variant={"simple"}>
                        <Thead>
                            <Tr>
                                <Th>{t('table.avatar')}</Th>
                                <Th>{t("table.name")}</Th>
                                <Th>{t("table.email")}</Th>
                                <Th>{t("table.role")}</Th>
                                <Th>{t("table.actions")}</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {queriedMembers.length === 0 ? (
                                <Tr>
                                    <Td colSpan={4}>
                                        <Text textAlign="center" size="sm">
                                            {t("card.no-members")}
                                        </Text>
                                    </Td>
                                </Tr>
                            ) : (
                                queriedMembers.map((member) => (
                                    <Tr key={member.id}>
                                        <Td><AccountAvatar size={"sm"} userId={member.user.id} /></Td>
                                        <Td>{member.user.username}</Td>
                                        <Td>{member.user.email}</Td>
                                        <Td>
                                            {member.vaultRole === "OWNER" && (
                                                <Tag size={"sm"} colorScheme="red">
                                                    <TagLabel>{t("card.roles.owner")}</TagLabel>
                                                </Tag>
                                            )}
                                            {member.vaultRole === "MANAGER" && (
                                                <Tag size={"sm"} colorScheme="purple">
                                                    <TagLabel>{t("card.roles.manager")}</TagLabel>
                                                </Tag>
                                            )}
                                            {member.vaultRole === "MEMBER" && (
                                                <Tag size={"sm"} colorScheme="green">
                                                    <TagLabel>{t("card.roles.member")}</TagLabel>
                                                </Tag>
                                            )}
                                        </Td>
                                        <Td>
                                            <HStack spacing={2}>
                                                {vaultRole.permissions.includes("MEMBER_UPDATE") && <EditMemberButton member={member} />}
                                                {vaultRole.permissions.includes("MEMBER_REMOVE") && (
                                                    <DeleteButton onClick={() => handleMemberDelete(member)} />
                                                )}
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
    );
}