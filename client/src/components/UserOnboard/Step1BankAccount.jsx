import React, { useState } from 'react';

const Step1BankAccount = ({ formData, updateFormData, nextStep }) => {
  const [bankAccount, setBankAccount] = useState({
    bankName: '',
    accountName: '',
    bsbNumber: '',
    accountNumber: '',
    currentBalance: '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!bankAccount.bankName) newErrors.bankName = 'Bank name is required';
    if (!bankAccount.accountName)
      newErrors.accountName = 'Account name is required';
    if (!bankAccount.bsbNumber) newErrors.bsbNumber = 'BSB is required';
    else if (!/^\d{6}$/.test(bankAccount.bsbNumber))
      newErrors.bsbNumber = 'BSB must be 6 digits';
    if (!bankAccount.accountNumber)
      newErrors.accountNumber = 'Account number is required';
    if (!bankAccount.currentBalance)
      newErrors.currentBalance = 'Current balance is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBankAccount({
      ...bankAccount,
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
      const updatedBankAccounts = [...formData.bankAccounts, bankAccount];
      updateFormData('bankAccounts', updatedBankAccounts);
      nextStep();
    }
  };

  const addAnother = (e) => {
    e.preventDefault();
    if (validate()) {
      const updatedBankAccounts = [...formData.bankAccounts, bankAccount];
      updateFormData('bankAccounts', updatedBankAccounts);
      setBankAccount({
        bankName: '',
        accountName: '',
        bsbNumber: '',
        accountNumber: '',
        currentBalance: '',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className='text-lg font-medium text-gray-900 mb-6'>
        Bank Account Information
      </h3>

      <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
        <div className='sm:col-span-6'>
          <label
            htmlFor='bankName'
            className='block text-sm font-medium text-gray-700'
          >
            Bank Name
          </label>
          <select
            id='bankName'
            name='bankName'
            value={bankAccount.bankName}
            onChange={handleChange}
            className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
              errors.bankName ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
          >
            <option value=''>Select your bank</option>
            <option value='CommBank'>Commonwealth Bank</option>
            <option value='ANZ'>ANZ</option>
            <option value='Westpac'>Westpac</option>
            <option value='NAB'>National Australia Bank</option>
            <option value='Macquarie'>Macquarie Bank</option>
            <option value='Suncorp'>Suncorp</option>
            <option value='Bank of Queensland'>Bank of Queensland</option>
            <option value='ING'>ING</option>
          </select>
          {errors.bankName && (
            <p className='mt-2 text-sm text-red-600'>{errors.bankName}</p>
          )}
        </div>

        <div className='sm:col-span-6'>
          <label
            htmlFor='accountName'
            className='block text-sm font-medium text-gray-700'
          >
            Account Name
          </label>
          <input
            type='text'
            name='accountName'
            id='accountName'
            value={bankAccount.accountName}
            onChange={handleChange}
            className={`mt-1 block w-full shadow-sm sm:text-sm rounded-md ${
              errors.accountName ? 'border-red-500' : 'border-gray-300'
            } focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.accountName && (
            <p className='mt-2 text-sm text-red-600'>{errors.accountName}</p>
          )}
        </div>

        <div className='sm:col-span-3'>
          <label
            htmlFor='bsbNumber'
            className='block text-sm font-medium text-gray-700'
          >
            BSB Number
          </label>
          <input
            type='text'
            name='bsbNumber'
            id='bsbNumber'
            value={bankAccount.bsbNumber}
            onChange={handleChange}
            placeholder='123456'
            maxLength='6'
            className={`mt-1 block w-full shadow-sm sm:text-sm rounded-md ${
              errors.bsbNumber ? 'border-red-500' : 'border-gray-300'
            } focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.bsbNumber && (
            <p className='mt-2 text-sm text-red-600'>{errors.bsbNumber}</p>
          )}
        </div>

        <div className='sm:col-span-3'>
          <label
            htmlFor='accountNumber'
            className='block text-sm font-medium text-gray-700'
          >
            Account Number
          </label>
          <input
            type='text'
            name='accountNumber'
            id='accountNumber'
            value={bankAccount.accountNumber}
            onChange={handleChange}
            className={`mt-1 block w-full shadow-sm sm:text-sm rounded-md ${
              errors.accountNumber ? 'border-red-500' : 'border-gray-300'
            } focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.accountNumber && (
            <p className='mt-2 text-sm text-red-600'>{errors.accountNumber}</p>
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
              value={bankAccount.currentBalance}
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

      {formData.bankAccounts.length > 0 && (
        <div className='mt-8'>
          <h4 className='text-sm font-medium text-gray-700 mb-2'>
            Added Bank Accounts
          </h4>
          <ul className='border rounded-md divide-y divide-gray-200'>
            {formData.bankAccounts.map((account, index) => (
              <li key={index} className='px-4 py-3'>
                <div className='flex justify-between'>
                  <span className='font-medium'>{account.bankName}</span>
                  <span className='text-gray-600'>
                    ${account.currentBalance}
                  </span>
                </div>
                <div className='text-sm text-gray-500'>
                  {account.accountName} • BSB: {account.bsbNumber} • Account:{' '}
                  {account.accountNumber}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className='mt-8 flex justify-between'>
        <div>
          {formData.bankAccounts.length > 0 && (
            <button
              type='button'
              onClick={skip}
              className='inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            >
              Skip
            </button>
          )}
        </div>
        <div className='flex space-x-3'>
          <button
            type='button'
            onClick={addAnother}
            className='inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          >
            Add Another Account
          </button>
          <button
            type='submit'
            className='ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          >
            Continue to Credit Cards
          </button>
        </div>
      </div>
    </form>
  );
};

export default Step1BankAccount;
