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
} from 'recharts';

export default function WeekdaySpendingChart({ year, month }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(
        `http://localhost:5500/api/dashboard/weekdays?year=${year}&month=${month}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => setData(res.data.byWeekday))
      .catch((err) => console.error('Weekday chart error', err));
  }, [year, month]);

  return (
    <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
      <h3 className='text-lg font-semibold text-gray-800 mb-4'>
        Spending by Day of Week
      </h3>
      <ResponsiveContainer width='100%' height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='day' />
          <YAxis />
          <Tooltip />
          <Bar dataKey='value' fill='#f59e0b' />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
