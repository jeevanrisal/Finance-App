import React from 'react';

const CreditCardStep = ({ cards, setCards, onNext, onBack }) => {
  const handleChange = (index, field, value) => {
    const updated = [...cards];
    updated[index][field] = value;
    setCards(updated);
  };

  const handleAddAnother = () => {
    setCards([
      ...cards,
      { provider: '', number: '', limit: '', balance: '', dueDate: '' },
    ]);
  };

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col items-center px-4 py-10'>
      {/* Step Progress */}
      {/* <div className='flex space-x-4 mb-6'>
        {[
          'Bank Details',
          'Financial Wallets',
          'Credit Cards',
          'Assets',
          'Liabilities',
        ].map((label, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-white ${
              idx === 2 ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          >
            {idx + 1}
          </div>
        ))}
      </div> */}

      {/* Card */}
      <div className='w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 space-y-4'>
        <h2 className='text-2xl font-bold text-gray-800'>
          Add Credit Card Details
        </h2>

        {cards.map((card, index) => (
          <div
            key={index}
            className='grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg bg-gray-50'
          >
            <input
              type='text'
              placeholder='Card Provider'
              className='input'
              value={card.provider}
              onChange={(e) => handleChange(index, 'provider', e.target.value)}
            />
            <input
              type='text'
              placeholder='Card Number'
              className='input'
              value={card.number}
              onChange={(e) => handleChange(index, 'number', e.target.value)}
            />
            <input
              type='number'
              placeholder='Credit Limit'
              className='input'
              value={card.limit}
              onChange={(e) => handleChange(index, 'limit', e.target.value)}
            />
            <input
              type='number'
              placeholder='Current Balance'
              className='input'
              value={card.balance}
              onChange={(e) => handleChange(index, 'balance', e.target.value)}
            />
            <input
              type='date'
              placeholder='Due Date'
              className='input'
              value={card.dueDate}
              onChange={(e) => handleChange(index, 'dueDate', e.target.value)}
            />
          </div>
        ))}

        <button
          type='button'
          onClick={handleAddAnother}
          className='text-purple-600 font-medium hover:underline'
        >
          + Add Another
        </button>

        {/* Navigation */}
        <div className='flex justify-between mt-6'>
          <button
            onClick={onBack}
            className='px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300'
          >
            Back
          </button>
          <button
            onClick={onNext}
            className='px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700'
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreditCardStep;
