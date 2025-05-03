import React, { useState } from 'react';

const Step2CreditCard = ({ formData, updateFormData, nextStep, prevStep }) => {
  const [creditCard, setCreditCard] = useState({
    name: '',
    provider: '',
    cardNumber: '',
    expiryDate: '',
    cardLimit: '',
    usedBalance: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!creditCard.name) newErrors.name = 'Card name is required';
    if (!creditCard.provider) newErrors.provider = 'Card provider is required';
    if (!creditCard.cardNumber)
      newErrors.cardNumber = 'Card number is required';
    if (!creditCard.expiryDate)
      newErrors.expiryDate = 'Expiry date is required';
    else if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(creditCard.expiryDate))
      newErrors.expiryDate = 'Format must be MM/YY';
    if (!creditCard.cardLimit) newErrors.cardLimit = 'Card limit is required';
    if (!creditCard.usedBalance)
      newErrors.usedBalance = 'Used balance is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCreditCard((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    updateFormData('creditCards', [...formData.creditCards, creditCard]);
    nextStep();
  };

  const addAnother = (e) => {
    e.preventDefault();
    if (!validate()) return;

    updateFormData('creditCards', [...formData.creditCards, creditCard]);
    setCreditCard({
      name: '',
      provider: '',
      cardNumber: '',
      expiryDate: '',
      cardLimit: '',
      usedBalance: '',
    });
    setErrors({});
  };

  const skip = (e) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className='text-lg font-medium text-gray-900 mb-6'>
        Credit Card Information
      </h3>

      <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
        {/* Card Name */}
        <div className='sm:col-span-6'>
          <label
            htmlFor='name'
            className='block text-sm font-medium text-gray-700'
          >
            Card Name
          </label>
          <input
            type='text'
            name='name'
            id='name'
            value={creditCard.name}
            onChange={handleChange}
            placeholder='ANZ Jeevan Card'
            className={`mt-1 block w-full shadow-sm sm:text-sm rounded-md ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            } focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.name && (
            <p className='mt-2 text-sm text-red-600'>{errors.name}</p>
          )}
        </div>

        {/* Card Provider */}
        <div className='sm:col-span-6'>
          <label
            htmlFor='provider'
            className='block text-sm font-medium text-gray-700'
          >
            Card Provider
          </label>
          <select
            id='provider'
            name='provider'
            value={creditCard.provider}
            onChange={handleChange}
            className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
              errors.provider ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
          >
            <option value=''>Select your provider</option>
            <option value='CommBank'>Commonwealth Bank</option>
            <option value='ANZ'>ANZ</option>
            <option value='Westpac'>Westpac</option>
            <option value='NAB'>National Australia Bank</option>
            <option value='AMEX'>American Express</option>
            <option value='Citibank'>Citibank</option>
            <option value='HSBC'>HSBC</option>
            <option value='Other'>Other</option>
          </select>
          {errors.provider && (
            <p className='mt-2 text-sm text-red-600'>{errors.provider}</p>
          )}
        </div>

        {/* Card Number */}
        <div className='sm:col-span-4'>
          <label
            htmlFor='cardNumber'
            className='block text-sm font-medium text-gray-700'
          >
            Card Number
          </label>
          <input
            type='text'
            name='cardNumber'
            id='cardNumber'
            value={creditCard.cardNumber}
            onChange={handleChange}
            placeholder='1234 5678 9012 3456'
            className={`mt-1 block w-full shadow-sm sm:text-sm rounded-md ${
              errors.cardNumber ? 'border-red-500' : 'border-gray-300'
            } focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.cardNumber && (
            <p className='mt-2 text-sm text-red-600'>{errors.cardNumber}</p>
          )}
        </div>

        {/* Expiry */}
        <div className='sm:col-span-2'>
          <label
            htmlFor='expiryDate'
            className='block text-sm font-medium text-gray-700'
          >
            Expiry Date (MM/YY)
          </label>
          <input
            type='text'
            name='expiryDate'
            id='expiryDate'
            value={creditCard.expiryDate}
            onChange={handleChange}
            placeholder='MM/YY'
            className={`mt-1 block w-full shadow-sm sm:text-sm rounded-md ${
              errors.expiryDate ? 'border-red-500' : 'border-gray-300'
            } focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.expiryDate && (
            <p className='mt-2 text-sm text-red-600'>{errors.expiryDate}</p>
          )}
        </div>

        {/* Card Limit */}
        <div className='sm:col-span-3'>
          <label
            htmlFor='cardLimit'
            className='block text-sm font-medium text-gray-700'
          >
            Card Limit (AUD)
          </label>
          <div className='mt-1 relative rounded-md shadow-sm'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <span className='text-gray-500 sm:text-sm'>$</span>
            </div>
            <input
              type='number'
              name='cardLimit'
              id='cardLimit'
              value={creditCard.cardLimit}
              onChange={handleChange}
              step='0.01'
              className={`block w-full pl-7 pr-12 sm:text-sm rounded-md ${
                errors.cardLimit ? 'border-red-500' : 'border-gray-300'
              } focus:ring-blue-500 focus:border-blue-500`}
              placeholder='0.00'
            />
          </div>
          {errors.cardLimit && (
            <p className='mt-2 text-sm text-red-600'>{errors.cardLimit}</p>
          )}
        </div>

        {/* Used Balance */}
        <div className='sm:col-span-3'>
          <label
            htmlFor='usedBalance'
            className='block text-sm font-medium text-gray-700'
          >
            Used Balance (AUD)
          </label>
          <div className='mt-1 relative rounded-md shadow-sm'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <span className='text-gray-500 sm:text-sm'>$</span>
            </div>
            <input
              type='number'
              name='usedBalance'
              id='usedBalance'
              value={creditCard.usedBalance}
              onChange={handleChange}
              step='0.01'
              className={`block w-full pl-7 pr-12 sm:text-sm rounded-md ${
                errors.usedBalance ? 'border-red-500' : 'border-gray-300'
              } focus:ring-blue-500 focus:border-blue-500`}
              placeholder='0.00'
            />
          </div>
          {errors.usedBalance && (
            <p className='mt-2 text-sm text-red-600'>{errors.usedBalance}</p>
          )}
        </div>
      </div>

      {/* Already added cards */}
      {formData.creditCards.length > 0 && (
        <div className='mt-8'>
          <h4 className='text-sm font-medium text-gray-700 mb-2'>
            Added Credit Cards
          </h4>
          <ul className='border rounded-md divide-y divide-gray-200'>
            {formData.creditCards.map((card, i) => (
              <li key={i} className='px-4 py-3'>
                <div className='flex justify-between'>
                  <span className='font-medium'>{card.provider}</span>
                  <span className='text-gray-600'>
                    ${card.usedBalance} of ${card.cardLimit}
                  </span>
                </div>
                <div className='text-sm text-gray-500'>
                  **** **** **** {card.cardNumber.slice(-4)} • Exp:{' '}
                  {card.expiryDate}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className='mt-8 flex justify-between'>
        <div className='flex space-x-3'>
          <button type='button' onClick={prevStep}>
            Back
          </button>
          <button type='button' onClick={skip}>
            Skip
          </button>
        </div>
        <div className='flex space-x-3'>
          <button type='button' onClick={addAnother}>
            Add Another Card
          </button>
          <button type='submit'>Continue</button>
        </div>
      </div>
    </form>
  );
};

export default Step2CreditCard;
