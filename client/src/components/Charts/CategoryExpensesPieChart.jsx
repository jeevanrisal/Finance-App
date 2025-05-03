// src/components/Charts/CategoryExpensesPieChart.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = [
  '#3b82f6',
  '#f59e0b',
  '#10b981',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f43f5e',
  '#6366f1',
  '#22c55e',
  '#eab308',
];

export default function CategoryExpensesPieChart({ year, month }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios
      .get(
        `http://localhost:5500/api/dashboard/summary?year=${year}&month=${month}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        const raw = res.data.byCategory || {};
        const filtered = Object.entries(raw)
          .filter(
            ([k]) =>
              !k.toLowerCase().includes('income') &&
              !k.toLowerCase().includes('transfer')
          )
          .map(([name, value]) => ({ name, value }));

        setData(filtered);
      })
      .catch((err) => console.error('Pie chart fetch error', err));
  }, [year, month]);

  return (
    <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
      <h3 className='text-lg font-semibold text-gray-800 mb-4'>
        Expenses by Category
      </h3>
      <ResponsiveContainer width='100%' height={300}>
        <PieChart>
          <Pie
            dataKey='value'
            data={data}
            cx='50%'
            cy='50%'
            outerRadius={100}
            label
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend layout='vertical' align='right' verticalAlign='middle' />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
