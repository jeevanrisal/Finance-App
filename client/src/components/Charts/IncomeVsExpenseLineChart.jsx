// src/components/Charts/IncomeVsExpenseLineChart.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export default function IncomeVsExpenseLineChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:5500/api/dashboard/trends?timeframe=monthly', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(res.data.trends))
      .catch((err) => console.error('Line chart fetch error', err));
  }, []);

  return (
    <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
      <h3 className='text-lg font-semibold text-gray-800 mb-4'>
        Income vs Expenses (Last 6 Months)
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
            dataKey='income'
            stroke='#10b981'
            name='Income'
          />
          <Line
            type='monotone'
            dataKey='expenses'
            stroke='#ef4444'
            name='Expenses'
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
