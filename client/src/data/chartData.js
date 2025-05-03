const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
const years = ['2018', '2019', '2020', '2021', '2022', '2023'];

export const lineChartData = {
  weekly: {
    labels: weeks,
    datasets: [
      {
        label: 'Income',
        data: [1200, 1900, 1500, 1800],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Expenses',
        data: [800, 1200, 1000, 1100],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.3,
      },
    ],
  },
  monthly: {
    labels: months,
    datasets: [
      {
        label: 'Income',
        data: [4500, 5000, 4700, 5200, 4800, 5300, 5500],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Expenses',
        data: [3200, 3500, 3400, 3800, 3600, 3700, 3900],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.3,
      },
    ],
  },
  yearly: {
    labels: years,
    datasets: [
      {
        label: 'Income',
        data: [42000, 48000, 52000, 55000, 58000, 62000],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Expenses',
        data: [35000, 40000, 42000, 45000, 46000, 48000],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.3,
      },
    ],
  },
};

export const doughnutChartData = {
  labels: ['Housing', 'Food', 'Transport', 'Entertainment', 'Utilities'],
  datasets: [
    {
      data: [35, 25, 15, 10, 15],
      backgroundColor: [
        'rgba(59, 130, 246, 0.7)',
        'rgba(16, 185, 129, 0.7)',
        'rgba(245, 158, 11, 0.7)',
        'rgba(139, 92, 246, 0.7)',
        'rgba(20, 184, 166, 0.7)',
      ],
      borderColor: [
        'rgba(59, 130, 246, 1)',
        'rgba(16, 185, 129, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(139, 92, 246, 1)',
        'rgba(20, 184, 166, 1)',
      ],
      borderWidth: 1,
    },
  ],
};
