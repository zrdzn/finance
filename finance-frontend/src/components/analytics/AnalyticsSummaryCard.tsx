import {
    Card,
    CardBody,
    CardHeader,
    Flex,
    Text,
    Stack,
    theme,
    Stat,
    StatLabel,
    StatNumber,
    HStack, StatArrow, StatHelpText
} from "@chakra-ui/react"
import React, {useEffect, useState} from "react"
import {useTranslations} from "next-intl";
import {Components} from "@/api/api";
import {useApi} from "@/hooks/useApi";
import {useNumberFormatter} from "@/hooks/useNumberFormatter";
import {AnalyticsOverviewStatisticType} from "@/api/types";
import {useTheme} from "@/hooks/useTheme";

type VaultResponse = Components.Schemas.VaultResponse;
type TransactionFlowsResponse = Components.Schemas.TransactionFlowsResponse;

interface AnalyticsSummaryCardProperties {
  vault: VaultResponse
  permissions: string[]
  statisticType: AnalyticsOverviewStatisticType
}

export const AnalyticsSummaryCard = ({ vault, permissions, statisticType }: AnalyticsSummaryCardProperties) => {
    const api = useApi();
    const t = useTranslations("Analytics");
    const theme = useTheme()
    const { formatNumber } = useNumberFormatter();
    const [flows, setFlows] = useState<TransactionFlowsResponse>({
        total: {
            amount: 0,
            currency: 'PLN'
        },
        count: {
            amount: 0
        }
    })

    useEffect(() => {
        const fetchData = () => {
            api.then(client => {
                const startDate = new Date(vault.createdAt).toISOString();
                if (statisticType === "BALANCE") {
                    client
                        .getFlowsByVaultId({
                            vaultId: vault.id,
                            start: startDate,
                        })
                        .then(response => setFlows(response.data));
                } else if (statisticType === "INCOME") {
                    client
                        .getFlowsByVaultId({
                            vaultId: vault.id,
                            transactionType: "INCOMING",
                            start: startDate,
                        })
                        .then(response => setFlows(response.data));
                } else if (statisticType === "EXPENSES") {
                    client
                        .getFlowsByVaultId({
                            vaultId: vault.id,
                            transactionType: "OUTGOING",
                            start: startDate,
                        })
                        .then(response => setFlows(response.data));
                }
            });
        };

        fetchData();
    }, [api, statisticType, vault.createdAt, vault.id]);

    const getColor = () => {
        if (statisticType === "INCOME") return theme.text.green;
        if (statisticType === "EXPENSES") return theme.text.red;
        return flows.total.amount >= 0 ? theme.text.green : flows.total.amount < 0 ? theme.text.red : theme.text.primary;
    };

    const getArrowType = () => {
        if (statisticType === "INCOME") return "increase";
        if (statisticType === "EXPENSES") return "decrease";
        return flows.total.amount >= 0 ? "increase" : "decrease";
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
            <CardBody>
                <Stat>
                    <StatLabel>
                        {statisticType === "BALANCE" && t("balance")}
                        {statisticType === "INCOME" && t("income")}
                        {statisticType === "EXPENSES" && t("expenses")}
                    </StatLabel>
                    <StatNumber>
                        {flows && (
                            <HStack alignItems="center">
                                <Text
                                    fontSize="2xl"
                                    fontWeight="600"
                                    color={getColor()}
                                    isTruncated
                                >
                                    {flows.total.amount !== 0 && (
                                        <StatArrow
                                          type={getArrowType()}
                                          mr={2}
                                        />
                                    )}
                                    {formatNumber(flows.total.amount)}
                                </Text>
                                <Text fontSize="xl" isTruncated>
                                    {flows.total.currency}
                                </Text>
                            </HStack>
                        )}
                    </StatNumber>
                    <StatHelpText fontSize="sm" color={theme.text.secondary} mt={2}>
                        {flows && flows.total.amount === 0
                            ? t('no-transactions')
                            : (
                                <>
                                    {t('transactions-amount')}{" "}
                                    <Text as="span" color={theme.text.primary} ml={1} fontWeight={flows.count.amount > 0 ? "bold" : "normal"}>
                                        {flows.count.amount}
                                    </Text>
                                </>
                            )}
                    </StatHelpText>
                </Stat>
            </CardBody>
        </Card>
    );
}