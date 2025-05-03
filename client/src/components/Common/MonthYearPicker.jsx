// src/components/Common/MonthYearPicker.jsx
import React from 'react';

export default function MonthYearPicker({ year, month, onChange }) {
  const handleChange = (e) => {
    const [y, m] = e.target.value.split('-');
    onChange({ year: y, month: m });
  };

  return (
    <div className='mb-4 flex justify-end'>
      <input
        type='month'
        className='border border-gray-300 rounded-md px-3 py-2 text-sm'
        value={`${year}-${String(month).padStart(2, '0')}`}
        onChange={handleChange}
      />
    </div>
  );
}
