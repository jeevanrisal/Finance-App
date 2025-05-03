// src/components/Accounts/LiabilityForm.jsx
import React from 'react';

const liabilityTypes = [
  'HECS-HELP',
  'Mortgage',
  'Personal Loan',
  'Credit Card Debt',
  'Car Loan',
  'Afterpay/Zip Pay',
  'Other',
];

export default function LiabilityForm({ fields, onChange }) {
  return (
    <>
      <h2 className='text-lg font-semibold mb-4'>Liability Information</h2>

      {/* Liability Type */}
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700'>
          Liability Type
        </label>
        <select
          name='liabilityType'
          value={fields.liabilityType || ''}
          onChange={onChange}
          className='mt-1 block w-1/2 border-gray-300 rounded-md shadow-sm'
        >
          <option value='' disabled>
            Select liability type
          </option>
          {liabilityTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Institution / Lender Name */}
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700'>
          Institution / Lender Name
        </label>
        <input
          name='provider'
          type='text'
          placeholder='e.g., ATO, Commonwealth Bank'
          value={fields.provider || ''}
          onChange={onChange}
          className='mt-1 block w-full max-w-lg border-gray-300 rounded-md shadow-sm'
        />
      </div>

      {/* Outstanding Balance & Monthly Repayment */}
      <div className='flex space-x-4 mb-4'>
        <div className='flex-1'>
          <label className='block text-sm font-medium text-gray-700'>
            Outstanding Balance (AUD)
          </label>
          <div className='mt-1 relative'>
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
        <div className='flex-1'>
          <label className='block text-sm font-medium text-gray-700'>
            Monthly Repayment (AUD)
          </label>
          <div className='mt-1 relative'>
            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'>
              $
            </span>
            <input
              name='monthlyRepayment'
              type='number'
              step='0.01'
              value={fields.monthlyRepayment || ''}
              onChange={onChange}
              className='block w-full pl-7 border-gray-300 rounded-md shadow-sm'
            />
          </div>
        </div>
      </div>
    </>
  );
}
