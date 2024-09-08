export const expensesYearChart = {
  labels: [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ],
  datasets: [
    {
      label: "Expenses",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      borderColor: "rgb(255, 99, 132)",
      borderWidth: 1,
      data: [31, 72, 30, 33, 9, 14, 41, 42, 12, 95, 19, 49],
      barPercentage: 0.9,
      categoryPercentage: 0.8,
    }
  ]
};
