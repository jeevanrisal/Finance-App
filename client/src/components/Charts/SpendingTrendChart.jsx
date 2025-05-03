// src/components/Charts/SpendingTrendChart.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function SpendingTrendChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:5500/api/dashboard/trends?timeframe=monthly', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const monthly = res.data.trends.map((t) => ({
          label: t.label,
          Expenses: t.expenses,
        }));
        setData(monthly);
      })
      .catch((err) => console.error('Trend chart error', err));
  }, []);

  return (
    <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
      <h3 className='text-lg font-semibold text-gray-800 mb-4'>
        Spending Trend (Last 6 Months)
      </h3>
      <ResponsiveContainer width='100%' height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='label' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type='monotone'
            dataKey='Expenses'
            stroke='#ef4444'
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
