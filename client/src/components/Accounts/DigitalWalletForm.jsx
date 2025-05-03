import React from 'react';

const walletProviders = [
  'PayPal',
  'Apple Pay',
  'Google Pay',
  'Beem It',
  'Afterpay',
  'Zip Pay',
  'Other',
];

export default function DigitalWalletForm({ fields, onChange }) {
  return (
    <>
      <h2 className='text-lg font-semibold mb-4'>Digital Wallet Information</h2>
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700'>
          Wallet Provider
        </label>
        <select
          name='provider'
          value={fields.provider || ''}
          onChange={onChange}
          className='mt-1 block w-1/2 border-gray-300 rounded-md shadow-sm'
        >
          <option value='' disabled>
            Select your wallet provider
          </option>
          {walletProviders.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>
      </div>
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700'>
          Wallet ID / Email
        </label>
        <input
          name='walletEmail'
          type='email'
          value={fields.walletEmail || ''}
          onChange={onChange}
          className='mt-1 block w-full max-w-lg border-gray-300 rounded-md shadow-sm'
        />
      </div>
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700'>
          Balance (AUD)
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
