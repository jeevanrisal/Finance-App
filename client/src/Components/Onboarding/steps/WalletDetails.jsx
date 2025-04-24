import React from 'react';

const FinancialDetailStep = ({ data, setData, onNext, onBack }) => {
  const handleChange = (field, value) => {
    setData({ ...data, [field]: value });
  };

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold text-gray-800'>
        Add Financial Overview
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border p-6 rounded-lg shadow-sm'>
        <input
          type='number'
          placeholder='Monthly Income'
          value={data.income}
          onChange={(e) => handleChange('income', e.target.value)}
          className='input'
        />
        <input
          type='text'
          placeholder='Primary Income Source'
          value={data.incomeSource}
          onChange={(e) => handleChange('incomeSource', e.target.value)}
          className='input'
        />
        <input
          type='number'
          placeholder='Estimated Net Worth'
          value={data.netWorth}
          onChange={(e) => handleChange('netWorth', e.target.value)}
          className='input'
        />
        <input
          type='number'
          placeholder='Monthly Expenses'
          value={data.expenses}
          onChange={(e) => handleChange('expenses', e.target.value)}
          className='input'
        />
      </div>

      {/* Navigation */}
      <div className='flex justify-between mt-4'>
        <button
          onClick={onBack}
          className='bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400'
        >
          Back
        </button>
        <button
          onClick={onNext}
          className='bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700'
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FinancialDetailStep;
