// src/components/Charts/CategoryExpensesBarChart.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';

export default function CategoryExpensesBarChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const now = new Date();
    const token = localStorage.getItem('token');
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    axios
      .get(
        `http://localhost:5500/api/dashboard/summary?year=${year}&month=${month}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        const categoryData = Object.entries(res.data.byCategory || {}).map(
          ([name, value]) => ({
            category: name,
            value,
          })
        );
        setData(categoryData);
      })
      .catch((err) => console.error('Bar chart fetch error', err));
  }, []);

  return (
    <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
      <h3 className='text-lg font-semibold text-gray-800 mb-4'>
        Expenses by Category
      </h3>
      <ResponsiveContainer width='100%' height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='category' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey='value' fill='#3b82f6' name='Expenses' />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
