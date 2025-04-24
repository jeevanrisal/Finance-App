import React from 'react';

const LiabilitiesStep = ({ data, setData, onNext, onBack }) => {
  const handleChange = (index, field, value) => {
    const updated = [...data];
    updated[index][field] = value;
    setData(updated);
  };

  const handleAddAnother = () => {
    setData([
      ...data,
      { type: '', lender: '', amount: '', rate: '', term: '' },
    ]);
  };

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold text-gray-800'>Add Liabilities</h2>

      {data.map((item, index) => (
        <div
          key={index}
          className='grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border p-4 rounded-lg shadow-sm'
        >
          <input
            type='text'
            placeholder='Liability Type (e.g., Loan)'
            value={item.type}
            onChange={(e) => handleChange(index, 'type', e.target.value)}
            className='input'
          />
          <input
            type='text'
            placeholder='Lender Name'
            value={item.lender}
            onChange={(e) => handleChange(index, 'lender', e.target.value)}
            className='input'
          />
          <input
            type='number'
            placeholder='Outstanding Amount'
            value={item.amount}
            onChange={(e) => handleChange(index, 'amount', e.target.value)}
            className='input'
          />
          <input
            type='number'
            placeholder='Interest Rate'
            value={item.rate}
            onChange={(e) => handleChange(index, 'rate', e.target.value)}
            className='input'
          />
          <input
            type='text'
            placeholder='Repayment Period'
            value={item.term}
            onChange={(e) => handleChange(index, 'term', e.target.value)}
            className='input md:col-span-2'
          />
        </div>
      ))}

      <button
        onClick={handleAddAnother}
        className='text-purple-600 hover:underline font-medium'
      >
        + Add Another
      </button>

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
          Finish
        </button>
      </div>
    </div>
  );
};

export default LiabilitiesStep;
