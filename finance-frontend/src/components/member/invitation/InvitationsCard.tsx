import {
    Card,
    CardBody,
    CardHeader,
    Divider,
    Flex,
    Stack,
    Text,
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    HStack,
    Tag,
    TagLabel,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { SearchBar } from "@/components/shared/SearchBar";
import { InvitationCreateButton } from "@/components/member/invitation/InvitationCreateButton";
import { DeleteButton } from "@/components/shared/DeleteButton";
import { useTranslations } from "next-intl";
import { useDateFormatter } from "@/hooks/useDateFormatter";
import toast from "react-hot-toast";
import { Components } from "@/api/api";
import {FaClock} from "react-icons/fa";

type VaultResponse = Components.Schemas.VaultResponse;
type VaultInvitationResponse = Components.Schemas.VaultInvitationResponse;

interface InvitationsCardProperties {
    vault: VaultResponse;
    permissions: string[];
}

export const InvitationsCard = ({ vault, permissions }: InvitationsCardProperties) => {
    const api = useApi();
    const t = useTranslations("Invitations");
    const { formatDate } = useDateFormatter();
    const [invitations, setInvitations] = useState<VaultInvitationResponse[]>([]);
    const [queriedInvitations, setQueriedInvitations] = useState<VaultInvitationResponse[]>([]);

    useEffect(() => {
        api
            .then((client) => client.getVaultInvitations({ vaultId: vault.id }))
            .then((response) => {
                setInvitations(response.data.vaultInvitations);
                setQueriedInvitations(response.data.vaultInvitations);
            })
            .catch((error) => console.error(error));
    }, [api, vault.id]);

    const handleSearchResults = (results: VaultInvitationResponse[]) => {
        setQueriedInvitations(results);
    };

    const handleInvitationDelete = (invitation: VaultInvitationResponse) => {
        api
            .then((client) => client.removeVaultInvitation({ vaultId: vault.id, userEmail: invitation.userEmail }))
            .then(() => {
                toast.success(
                    t("invitation-deleted-success").replace("%email%", invitation.userEmail)
                );
                setInvitations((prev) => prev.filter((i) => i.id !== invitation.id));
                setQueriedInvitations((prev) => prev.filter((i) => i.id !== invitation.id));
            })
            .catch((error) => {
                console.error(error);
                toast.error(
                    t("invitation-deleted-error").replace("%email%", invitation.userEmail)
                );
            });
    };

    return (
        <Card
            margin={4}
            boxShadow="base"
            borderRadius="lg"
            overflow="hidden"
            backgroundColor="whiteAlpha.900"
            border="1px solid"
            borderColor="gray.200"
        >
            <CardHeader>
                <Text fontSize="sm" fontWeight="600">
                    {t("card.title")}
                </Text>
            </CardHeader>
            <CardBody>
                <Flex justifyContent="space-between" gap={4} mb={4}>
                    <SearchBar
                        placeholder={t("card.search-placeholder")}
                        content={invitations}
                        onSearch={handleSearchResults}
                        filter={(invitation, query) =>
                            invitation.userEmail.toLowerCase().includes(query.toLowerCase())
                        }
                    />
                    {permissions.includes("MEMBER_INVITE_CREATE") && (
                        <InvitationCreateButton vaultId={vault.id} />
                    )}
                </Flex>
                <Box overflowX="auto">
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>{t("table.email")}</Th>
                                <Th>{t("table.expires")}</Th>
                                <Th>{t("table.actions")}</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {queriedInvitations.length === 0 ? (
                                <Tr>
                                    <Td colSpan={3}>
                                        <Text textAlign="center" size="sm">
                                            {t("card.no-invitations")}
                                        </Text>
                                    </Td>
                                </Tr>
                            ) : (
                                queriedInvitations.map((invitation) => (
                                    <Tr key={invitation.id}>
                                        <Td>{invitation.userEmail}</Td>
                                        <Td>{formatDate(invitation.expiresAt, true)}</Td>
                                        <Td>
                                            <HStack spacing={2}>
                                                {permissions.includes("MEMBER_INVITE_DELETE") && (
                                                    <DeleteButton
                                                        onClick={() => handleInvitationDelete(invitation)}
                                                    />
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
};