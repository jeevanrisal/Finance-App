// src/components/ChartSection.jsx
import { useState, useEffect } from 'react';
import { LineChart, PieChart } from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function ChartSection() {
  const [timeRange, setTimeRange] = useState('monthly');
  const [trendData, setTrendData] = useState({
    labels: [],
    income: [],
    expenses: [],
  });
  const [doughnutData, setDoughnutData] = useState({ labels: [], data: [] });

  // Fetch trends whenever timeRange changes
  useEffect(() => {
    fetch(`http://localhost:5500/api/dashboard/trends?timeframe=${timeRange}`)
      .then((r) => r.json())
      .then(({ trends }) => {
        setTrendData({
          labels: trends.map((b) => b.label),
          income: trends.map((b) => b.income),
          expenses: trends.map((b) => b.expenses),
        });
      })
      .catch(console.error);
  }, [timeRange]);

  // Fetch category breakdown once
  useEffect(() => {
    fetch('/api/dashboard/summary')
      .then((r) => r.json())
      .then(({ byCategory }) => {
        setDoughnutData({
          labels: Object.keys(byCategory),
          data: Object.values(byCategory),
        });
      })
      .catch(console.error);
  }, []);

  const lineConfig = {
    labels: trendData.labels,
    datasets: [
      {
        label: 'Income',
        data: trendData.income,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Expenses',
        data: trendData.expenses,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const doughnutConfig = {
    labels: doughnutData.labels,
    datasets: [
      {
        data: doughnutData.data,
        backgroundColor: Array(doughnutData.labels.length).fill(undefined),
        // Colors will default; ChartJS will pick them for you
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
      {/* Income vs Expenses */}
      <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
        {/* header omitted for brevity */}
        <div className='h-64'>
          <Line
            data={lineConfig}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>
      </div>

      {/* Expense Categories */}
      <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
        {/* header omitted for brevity */}
        <div className='h-64 flex items-center justify-center'>
          <Doughnut
            data={doughnutConfig}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>
      </div>
    </div>
  );
}
