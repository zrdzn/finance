export const expensesWeekChart = {
  labels: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ],
  datasets: [
    {
      label: "Expenses",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      borderColor: "rgb(255, 99, 132)",
      borderWidth: 1,
      data: [70,
        30,
        33,
        9,
        14,
        41,
        42],
      barPercentage: 0.9,
      categoryPercentage: 0.8,
    }
  ]
};
