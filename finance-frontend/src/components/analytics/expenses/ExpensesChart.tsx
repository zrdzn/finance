import {Bar} from "react-chartjs-2"
import {Chart as ChartJS, BarElement, CategoryScale, Filler, Legend, LinearScale, Title, Tooltip} from "chart.js"
import {PaymentExpensesRange, VaultResponse} from "@/components/api"
import {data} from "currency-codes"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler)

interface ExpensesChartProperties {
  expensesRange: PaymentExpensesRange
}

export const ExpensesChart = ({ expensesRange }: ExpensesChartProperties) => {


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

  return <Bar data={data} options={options} />;
}