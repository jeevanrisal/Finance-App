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

export default function AccountSpendingChart({ year, month }) {
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
        const accountData = Object.entries(res.data.byAccount || {}).map(
          ([name, value]) => ({ name, value })
        );
        setData(accountData);
      })
      .catch((err) => console.error('Account chart error', err));
  }, [year, month]);

  return (
    <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
      <h3 className='text-lg font-semibold text-gray-800 mb-4'>
        Account-wise Spending
      </h3>
      <ResponsiveContainer width='100%' height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey='value' fill='#6366f1' name='Expenses' />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
