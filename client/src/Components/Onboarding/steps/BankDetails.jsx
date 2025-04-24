import React from 'react';

const BankDetailsStep = ({ data, setData, onNext }) => {
  const handleChange = (index, field, value) => {
    const updated = [...data];
    updated[index][field] = value;
    setData(updated);
  };

  const handleAddAnother = () => {
    setData([...data, { bank: '', accNo: '', accType: '' }]);
  };

  return (
    <div className='flex justify-center items-start min-h-screen py-8 px-4 bg-gray-50'>
      <div className='w-full max-w-3xl bg-white p-6 rounded-2xl shadow-lg space-y-6'>
        <h2 className='text-2xl font-bold text-gray-800'>Add Bank Details</h2>

        {data.map((bank, index) => (
          <div
            key={index}
            className='space-y-4 border border-gray-300 p-4 rounded-xl'
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <input
                type='text'
                placeholder='Bank Name'
                value={bank.bank}
                onChange={(e) => handleChange(index, 'bank', e.target.value)}
                className='input'
              />
              <input
                type='text'
                placeholder='Account Number'
                value={bank.accNo}
                onChange={(e) => handleChange(index, 'accNo', e.target.value)}
                className='input'
              />
            </div>
            <input
              type='text'
              placeholder='Account Type'
              value={bank.accType}
              onChange={(e) => handleChange(index, 'accType', e.target.value)}
              className='input w-full'
            />
          </div>
        ))}

        <button
          type='button'
          onClick={handleAddAnother}
          className='text-purple-600 hover:underline font-medium'
        >
          + Add Another
        </button>

        <div className='flex justify-end'>
          <button
            onClick={onNext}
            className='bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition'
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankDetailsStep;
