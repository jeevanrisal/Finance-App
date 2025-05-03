import React from 'react';

const bankOptions = [
  'Commonwealth Bank',
  'ANZ',
  'Westpac',
  'National Australia Bank',
  'Macquarie Bank',
  'Suncorp',
  'Bank of Queensland',
  'ING',
];

export default function BankAccountForm({ fields, onChange }) {
  return (
    <>
      <h2 className='text-lg font-semibold mb-4'>Bank Account Information</h2>
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700'>
          Bank Name
        </label>
        <select
          name='provider'
          value={fields.provider || ''}
          onChange={onChange}
          className='mt-1 block w-1/2 border-gray-300 rounded-md shadow-sm'
        >
          <option value='' disabled>
            Select your bank
          </option>
          {bankOptions.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700'>
          Account Name
        </label>
        <input
          name='name'
          type='text'
          value={fields.name || ''}
          onChange={onChange}
          className='mt-1 block w-full max-w-lg border-gray-300 rounded-md shadow-sm'
        />
      </div>
      <div className='flex space-x-4 mb-4'>
        <div className='flex-1'>
          <label className='block text-sm font-medium text-gray-700'>
            BSB Number
          </label>
          <input
            name='bsbNumber'
            type='text'
            placeholder='123456'
            value={fields.bsbNumber || ''}
            onChange={onChange}
            className='mt-1 block w-full border-gray-300 rounded-md shadow-sm'
          />
        </div>
        <div className='flex-1'>
          <label className='block text-sm font-medium text-gray-700'>
            Account Number
          </label>
          <input
            name='accountNumber'
            type='text'
            value={fields.accountNumber || ''}
            onChange={onChange}
            className='mt-1 block w-full border-gray-300 rounded-md shadow-sm'
          />
        </div>
      </div>
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700'>
          Current Balance (AUD)
        </label>
        <div className='mt-1 relative max-w-lg'>
          <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'>
            $
          </span>
          <input
            name='balance'
            type='number'
            step='0.01'
            value={fields.balance || ''}
            onChange={onChange}
            className='block w-full pl-7 border-gray-300 rounded-md shadow-sm'
          />
        </div>
      </div>
    </>
  );
}
