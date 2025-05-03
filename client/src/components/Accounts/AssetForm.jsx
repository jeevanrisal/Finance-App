// src/components/Accounts/AssetForm.jsx
import React from 'react';

const assetTypes = [
  'Property',
  'Vehicle',
  'Electronics',
  'Jewelry',
  'Collectibles',
  'Investments',
  'Other',
];

export default function AssetForm({ fields, onChange }) {
  return (
    <>
      <h2 className='text-lg font-semibold mb-4'>Asset Information</h2>

      {/* Asset Description */}
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700'>
          Asset Description
        </label>
        <input
          name='name'
          type='text'
          placeholder='e.g., Toyota Corolla 2020, MacBook Pro'
          value={fields.name || ''}
          onChange={onChange}
          className='mt-1 block w-full max-w-lg border-gray-300 rounded-md shadow-sm'
        />
      </div>

      {/* Asset Type */}
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700'>
          Asset Type
        </label>
        <select
          name='assetType'
          value={fields.assetType || ''}
          onChange={onChange}
          className='mt-1 block w-1/2 border-gray-300 rounded-md shadow-sm'
        >
          <option value='' disabled>
            Select asset type
          </option>
          {assetTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Current Market Value */}
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700'>
          Current Market Value (AUD)
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

      {/* Purchase Date */}
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700'>
          Purchase Date
        </label>
        <input
          name='purchaseDate'
          type='date'
          value={fields.purchaseDate || ''}
          onChange={onChange}
          className='mt-1 block w-1/3 border-gray-300 rounded-md shadow-sm'
        />
      </div>
    </>
  );
}
