import React, { useState } from 'react';

const assetTypes = [
  'Property',
  'Vehicle',
  'Electronics',
  'Jewelry',
  'Collectibles',
  'Investments',
  'Other',
];

const Step4Assets = ({ formData, updateFormData, nextStep, prevStep }) => {
  const [asset, setAsset] = useState({
    description: '',
    assetType: '',
    currentValue: '',
    purchaseDate: '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!asset.description) newErrors.description = 'Description is required';
    if (!asset.assetType) newErrors.assetType = 'Asset type is required';
    if (!asset.currentValue)
      newErrors.currentValue = 'Current value is required';
    if (!asset.purchaseDate)
      newErrors.purchaseDate = 'Purchase date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAsset({
      ...asset,
      [name]: value,
    });
  };

  const skip = (e) => {
    e.preventDefault();
    nextStep();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const updatedAssets = [...formData.assets, asset];
      updateFormData('assets', updatedAssets);
      nextStep();
    }
  };

  const addAnother = (e) => {
    e.preventDefault();
    if (validate()) {
      const updatedAssets = [...formData.assets, asset];
      updateFormData('assets', updatedAssets);
      setAsset({
        description: '',
        assetType: '',
        currentValue: '',
        purchaseDate: '',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className='text-lg font-medium text-gray-900 mb-6'>
        Asset Information
      </h3>

      <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
        <div className='sm:col-span-6'>
          <label
            htmlFor='description'
            className='block text-sm font-medium text-gray-700'
          >
            Asset Description
          </label>
          <input
            type='text'
            name='description'
            id='description'
            value={asset.description}
            onChange={handleChange}
            className={`mt-1 block w-full shadow-sm sm:text-sm rounded-md ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            } focus:ring-blue-500 focus:border-blue-500`}
            placeholder='e.g., Toyota Corolla 2020, MacBook Pro'
          />
          {errors.description && (
            <p className='mt-2 text-sm text-red-600'>{errors.description}</p>
          )}
        </div>

        <div className='sm:col-span-6'>
          <label
            htmlFor='assetType'
            className='block text-sm font-medium text-gray-700'
          >
            Asset Type
          </label>
          <select
            id='assetType'
            name='assetType'
            value={asset.assetType}
            onChange={handleChange}
            className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
              errors.assetType ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
          >
            <option value=''>Select asset type</option>
            {assetTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.assetType && (
            <p className='mt-2 text-sm text-red-600'>{errors.assetType}</p>
          )}
        </div>

        <div className='sm:col-span-6'>
          <label
            htmlFor='currentValue'
            className='block text-sm font-medium text-gray-700'
          >
            Current Market Value (AUD)
          </label>
          <div className='mt-1 relative rounded-md shadow-sm'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <span className='text-gray-500 sm:text-sm'>$</span>
            </div>
            <input
              type='number'
              name='currentValue'
              id='currentValue'
              value={asset.currentValue}
              onChange={handleChange}
              step='0.01'
              className={`block w-full pl-7 pr-12 sm:text-sm rounded-md ${
                errors.currentValue ? 'border-red-500' : 'border-gray-300'
              } focus:ring-blue-500 focus:border-blue-500`}
              placeholder='0.00'
            />
          </div>
          {errors.currentValue && (
            <p className='mt-2 text-sm text-red-600'>{errors.currentValue}</p>
          )}
        </div>

        <div className='sm:col-span-6'>
          <label
            htmlFor='purchaseDate'
            className='block text-sm font-medium text-gray-700'
          >
            Purchase Date
          </label>
          <input
            type='date'
            name='purchaseDate'
            id='purchaseDate'
            value={asset.purchaseDate}
            onChange={handleChange}
            className={`mt-1 block w-full shadow-sm sm:text-sm rounded-md ${
              errors.purchaseDate ? 'border-red-500' : 'border-gray-300'
            } focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.purchaseDate && (
            <p className='mt-2 text-sm text-red-600'>{errors.purchaseDate}</p>
          )}
        </div>
      </div>

      {formData.assets.length > 0 && (
        <div className='mt-8'>
          <h4 className='text-sm font-medium text-gray-700 mb-2'>
            Added Assets
          </h4>
          <ul className='border rounded-md divide-y divide-gray-200'>
            {formData.assets.map((asset, index) => (
              <li key={index} className='px-4 py-3'>
                <div className='flex justify-between'>
                  <span className='font-medium'>{asset.description}</span>
                  <span className='text-gray-600'>${asset.currentValue}</span>
                </div>
                <div className='text-sm text-gray-500'>
                  {asset.assetType} • Purchased:{' '}
                  {new Date(asset.purchaseDate).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className='mt-8 flex justify-between'>
        <div className='flex space-x-3'>
          <button
            type='button'
            onClick={prevStep}
            className='inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          >
            Back
          </button>
          <button
            type='button'
            onClick={skip}
            className='inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          >
            Skip
          </button>
        </div>
        <div className='flex space-x-3'>
          <button
            type='button'
            onClick={addAnother}
            className='inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          >
            Add Another Asset
          </button>

          <button
            type='submit'
            className='ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          >
            Continue to Liabilities
          </button>
        </div>
      </div>
    </form>
  );
};

export default Step4Assets;
