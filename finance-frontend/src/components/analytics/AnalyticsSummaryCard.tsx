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

type VaultResponse = Components.Schemas.VaultResponse;
type Price = Components.Schemas.Price;

interface AnalyticsSummaryCardProperties {
  vault: VaultResponse
  permissions: string[]
  statisticType: AnalyticsOverviewStatisticType
}

export const AnalyticsSummaryCard = ({ vault, permissions, statisticType }: AnalyticsSummaryCardProperties) => {
    const api = useApi();
    const t = useTranslations("Analytics");
    const { formatNumber } = useNumberFormatter();
    const [data, setData] = useState<Price | undefined>(undefined);

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
                        .then(response => setData(response.data.total));
                } else if (statisticType === "INCOME") {
                    client
                        .getFlowsByVaultId({
                            vaultId: vault.id,
                            transactionType: "INCOMING",
                            start: startDate,
                        })
                        .then(response => setData(response.data.total));
                } else if (statisticType === "EXPENSES") {
                    client
                        .getFlowsByVaultId({
                            vaultId: vault.id,
                            transactionType: "OUTGOING",
                            start: startDate,
                        })
                        .then(response => setData(response.data.total));
                }
            });
        };

        fetchData();
    }, [api, statisticType, vault.createdAt, vault.id]);

    return (
        <Card margin={2} boxShadow="md" borderRadius="md" overflow="hidden">
            <CardBody>
                <Stat>
                    <StatLabel>
                        {statisticType === "BALANCE" && t("balance")}
                        {statisticType === "INCOME" && t("income")}
                        {statisticType === "EXPENSES" && t("expenses")}
                    </StatLabel>
                    <StatNumber>
                        {data && (
                            <HStack alignItems="center">
                                <Text
                                    fontSize="2xl"
                                    fontWeight="600"
                                    color={
                                        data.amount === 0
                                            ? "black"
                                            : statisticType === "INCOME"
                                                ? "green"
                                                : "crimson"
                                    }
                                    isTruncated
                                >
                                    {data.amount !== 0 && (
                                        <StatArrow
                                            type={statisticType === "INCOME" ? "increase" : "decrease"}
                                            mr={2}
                                        />
                                    )}
                                    {formatNumber(data.amount)}
                                </Text>
                                <Text fontSize="xl" isTruncated>
                                    {data.currency}
                                </Text>
                            </HStack>
                        )}
                    </StatNumber>
                    <StatHelpText fontSize="sm" color="gray.600" mt={2}>
                        {data && data.amount === 0
                            ? t('no-transactions')
                            : `${t('transactions-amount')} TODO`}
                    </StatHelpText>
                </Stat>
            </CardBody>
        </Card>
    );
}