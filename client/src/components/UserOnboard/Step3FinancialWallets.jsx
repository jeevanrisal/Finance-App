import React, { useState } from 'react';

const Step3FinancialWallets = ({
  formData,
  updateFormData,
  nextStep,
  prevStep,
}) => {
  const [wallet, setWallet] = useState({
    walletProvider: '',
    walletId: '',
    currentBalance: '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!wallet.walletProvider)
      newErrors.walletProvider = 'Wallet provider is required';
    if (!wallet.walletId) newErrors.walletId = 'Wallet ID is required';
    if (!wallet.currentBalance)
      newErrors.currentBalance = 'Current balance is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWallet({
      ...wallet,
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
      const updatedWallets = [...formData.financialWallets, wallet];
      updateFormData('financialWallets', updatedWallets);
      nextStep();
    }
  };

  const addAnother = (e) => {
    e.preventDefault();
    if (validate()) {
      const updatedWallets = [...formData.financialWallets, wallet];
      updateFormData('financialWallets', updatedWallets);
      setWallet({
        walletProvider: '',
        walletId: '',
        currentBalance: '',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className='text-lg font-medium text-gray-900 mb-6'>
        Digital Wallet Information
      </h3>

      <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
        <div className='sm:col-span-6'>
          <label
            htmlFor='walletProvider'
            className='block text-sm font-medium text-gray-700'
          >
            Wallet Provider
          </label>
          <select
            id='walletProvider'
            name='walletProvider'
            value={wallet.walletProvider}
            onChange={handleChange}
            className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
              errors.walletProvider ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
          >
            <option value=''>Select your wallet provider</option>
            <option value='PayPal'>PayPal</option>
            <option value='Apple Pay'>Apple Pay</option>
            <option value='Google Pay'>Google Pay</option>
            <option value='Beem It'>Beem It</option>
            <option value='Afterpay'>Afterpay</option>
            <option value='Zip Pay'>Zip Pay</option>
            <option value='Other'>Other</option>
          </select>
          {errors.walletProvider && (
            <p className='mt-2 text-sm text-red-600'>{errors.walletProvider}</p>
          )}
        </div>

        <div className='sm:col-span-6'>
          <label
            htmlFor='walletId'
            className='block text-sm font-medium text-gray-700'
          >
            Wallet ID (Email)
          </label>
          <input
            type='email'
            name='walletId'
            id='walletId'
            value={wallet.walletId}
            onChange={handleChange}
            className={`mt-1 block w-full shadow-sm sm:text-sm rounded-md ${
              errors.walletId ? 'border-red-500' : 'border-gray-300'
            } focus:ring-blue-500 focus:border-blue-500`}
            placeholder='your@email.com'
          />
          {errors.walletId && (
            <p className='mt-2 text-sm text-red-600'>{errors.walletId}</p>
          )}
        </div>

        <div className='sm:col-span-6'>
          <label
            htmlFor='currentBalance'
            className='block text-sm font-medium text-gray-700'
          >
            Current Balance (AUD)
          </label>
          <div className='mt-1 relative rounded-md shadow-sm'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <span className='text-gray-500 sm:text-sm'>$</span>
            </div>
            <input
              type='number'
              name='currentBalance'
              id='currentBalance'
              value={wallet.currentBalance}
              onChange={handleChange}
              step='0.01'
              className={`block w-full pl-7 pr-12 sm:text-sm rounded-md ${
                errors.currentBalance ? 'border-red-500' : 'border-gray-300'
              } focus:ring-blue-500 focus:border-blue-500`}
              placeholder='0.00'
            />
          </div>
          {errors.currentBalance && (
            <p className='mt-2 text-sm text-red-600'>{errors.currentBalance}</p>
          )}
        </div>
      </div>

      {formData.financialWallets.length > 0 && (
        <div className='mt-8'>
          <h4 className='text-sm font-medium text-gray-700 mb-2'>
            Added Digital Wallets
          </h4>
          <ul className='border rounded-md divide-y divide-gray-200'>
            {formData.financialWallets.map((wallet, index) => (
              <li key={index} className='px-4 py-3'>
                <div className='flex justify-between'>
                  <span className='font-medium'>{wallet.walletProvider}</span>
                  <span className='text-gray-600'>
                    ${wallet.currentBalance}
                  </span>
                </div>
                <div className='text-sm text-gray-500'>{wallet.walletId}</div>
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
            Add Another Wallet
          </button>

          <button
            type='submit'
            className='ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          >
            Continue to Assets
          </button>
        </div>
      </div>
    </form>
  );
};

export default Step3FinancialWallets;
