import {
    Card,
    CardBody, CardHeader, Text, useColorMode,
} from "@chakra-ui/react"
import React, {useEffect, useState} from "react"
import {Components} from "@/api/api";
import {AnalyticsOverviewStatisticType, TransactionType} from "@/api/types";
import dynamic from "next/dynamic";
import {useTranslations} from "next-intl";
import {useApi} from "@/hooks/useApi";
import {useTheme} from "@/hooks/useTheme";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

type VaultResponse = Components.Schemas.VaultResponse;
type FlowsChartResponse = Components.Schemas.FlowsChartResponse;

interface AnalyticsChartProperties {
  vault: VaultResponse
  permissions: string[]
  transactionType?: TransactionType
}

export const AnalyticsChart = ({ vault, permissions, transactionType }: AnalyticsChartProperties) => {
    const theme = useTheme()
    const { colorMode } = useColorMode()
    const t = useTranslations("Analytics");
    const { api } = useApi()
    const [chartData, setChartData] = useState<FlowsChartResponse>({
        categories: [],
        series: []
    });

    useEffect(() => {
        api
            .then(client => client.getFlowsChart({ vaultId: vault.id, transactionType: transactionType }))
            .then(response => setChartData(response.data))
            .catch(error => console.error(error))
    }, [api, transactionType, vault.id]);

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
                    {!transactionType && t("balance-last-year")}
                    {transactionType === 'INCOMING' && t("income-last-year")}
                    {transactionType === 'OUTGOING' && t("expenses-last-year")}
                </Text>
            </CardHeader>
            <CardBody>
                {
                    chartData &&
                    <ApexChart type="line"
                               height={'400px'}
                               options={{
                                   chart: {
                                       id: 'apexchart-analytic',
                                       foreColor: theme.text.primary,
                                       toolbar: {
                                           show: false
                                       }
                                   },
                                   xaxis: {
                                       categories: chartData.categories
                                   },
                                   theme: {
                                       mode: colorMode,
                                       palette: 'palette1'
                                   }
                               }}
                               series={chartData.series} />
                }
            </CardBody>
        </Card>
    );
}