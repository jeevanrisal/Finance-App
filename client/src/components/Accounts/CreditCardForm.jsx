import React from 'react';

const creditProviders = [
  'Commonwealth Bank',
  'ANZ',
  'Westpac',
  'National Australia Bank',
  'American Express',
  'Citibank',
  'HSBC',
  'Other',
];

export default function CreditCardForm({ fields, onChange }) {
  return (
    <>
      <h2 className='text-lg font-semibold mb-4'>Credit Card Information</h2>
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700'>
          Card Name
        </label>
        <input
          name='name'
          type='text'
          value={fields.name || ''}
          onChange={onChange}
          className='mt-1 block w-full max-w-lg border-gray-300 rounded-md shadow-sm'
        />
      </div>
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700'>
          Card Provider
        </label>
        <select
          name='provider'
          value={fields.provider || ''}
          onChange={onChange}
          className='mt-1 block w-1/2 border-gray-300 rounded-md shadow-sm'
        >
          <option value='' disabled>
            Select your provider
          </option>
          {creditProviders.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <div className='flex space-x-4 mb-4'>
        <div className='flex-1'>
          <label className='block text-sm font-medium text-gray-700'>
            Card Number
          </label>
          <input
            name='cardNumber'
            type='text'
            placeholder='1234 5678 9012 3456'
            value={fields.cardNumber || ''}
            onChange={onChange}
            className='mt-1 block w-full border-gray-300 rounded-md shadow-sm'
          />
        </div>
        <div className='flex-1'>
          <label className='block text-sm font-medium text-gray-700'>
            Expiry Date (MM/YY)
          </label>
          <input
            name='expiryDate'
            type='text'
            placeholder='MM/YY'
            value={fields.expiryDate || ''}
            onChange={onChange}
            className='mt-1 block w-full border-gray-300 rounded-md shadow-sm'
          />
        </div>
      </div>
      <div className='flex space-x-4 mb-4'>
        <div className='flex-1'>
          <label className='block text-sm font-medium text-gray-700'>
            Card Limit (AUD)
          </label>
          <div className='mt-1 relative'>
            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'>
              $
            </span>
            <input
              name='cardLimit'
              type='number'
              step='0.01'
              value={fields.cardLimit || ''}
              onChange={onChange}
              className='block w-full pl-7 border-gray-300 rounded-md shadow-sm'
            />
          </div>
        </div>
        <div className='flex-1'>
          <label className='block text-sm font-medium text-gray-700'>
            Used Balance (AUD)
          </label>
          <div className='mt-1 relative'>
            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'>
              $
            </span>
            <input
              name='usedBalance'
              type='number'
              step='0.01'
              value={fields.usedBalance || ''}
              onChange={onChange}
              className='block w-full pl-7 border-gray-300 rounded-md shadow-sm'
            />
          </div>
        </div>
      </div>
    </>
  );
}
