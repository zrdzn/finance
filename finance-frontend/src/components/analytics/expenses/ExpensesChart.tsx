import {Bar} from "react-chartjs-2"
import {Chart as ChartJS, BarElement, CategoryScale, Filler, Legend, LinearScale, Title, Tooltip} from "chart.js"
import {PaymentExpensesRange, VaultResponse} from "@/components/api"
import {useEffect, useState} from "react"
import {useApi} from "@/hooks/apiClient"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler)

interface ExpensesChartProperties {
  vault: VaultResponse
  expensesRange: PaymentExpensesRange
}

export const ExpensesChart = ({ vault, expensesRange }: ExpensesChartProperties) => {
  const api = useApi()
  const [data, setData] = useState<any>()

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  useEffect(() => {
    const startDate = new Date();
    if (expensesRange === PaymentExpensesRange.Day) startDate.setDate(startDate.getDate() - 1);
    if (expensesRange === PaymentExpensesRange.Week) startDate.setDate(startDate.getDate() - 7);
    if (expensesRange === PaymentExpensesRange.Month) startDate.setMonth(startDate.getMonth() - 1);
    if (expensesRange === PaymentExpensesRange.Year) startDate.setFullYear(startDate.getFullYear() - 1);

    api.get(`/payment/${vault.id}/expenses-chart-data?currency=PLN&start=${startDate.toISOString()}&range=${expensesRange}`)
      .then(response => {
        const chartData = {
          labels: Object.keys(response.data.data),
          datasets: [
            {
              label: "Expenses",
              backgroundColor: "rgba(255, 99, 132, 0.5)",
              borderColor: "rgb(255, 99, 132)",
              borderWidth: 1,
              data: Object.values(response.data.data),
              barPercentage: 0.9,
              categoryPercentage: 0.8,
            }
          ]
        };
        setData(chartData);
      })
      .catch(error => console.error(error));
  }, [api, expensesRange, vault.id]);

  return data ? <Bar data={data} options={options} /> : <p>Loading...</p>;
}