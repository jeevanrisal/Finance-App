import React, { useState } from 'react';

const liabilityTypes = [
  'HECS-HELP',
  'Mortgage',
  'Personal Loan',
  'Credit Card Debt',
  'Car Loan',
  'Afterpay/Zip Pay',
  'Other',
];

const Step5Liabilities = ({ formData, updateFormData, nextStep, prevStep }) => {
  const [liability, setLiability] = useState({
    liabilityType: '',
    institution: '',
    outstandingBalance: '',
    monthlyRepayment: '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!liability.liabilityType)
      newErrors.liabilityType = 'Liability type is required';
    if (!liability.institution)
      newErrors.institution = 'Institution name is required';
    if (!liability.outstandingBalance)
      newErrors.outstandingBalance = 'Outstanding balance is required';
    if (!liability.monthlyRepayment)
      newErrors.monthlyRepayment = 'Monthly repayment is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const skip = (e) => {
    e.preventDefault();
    nextStep();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLiability({
      ...liability,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const updatedLiabilities = [...formData.liabilities, liability];
      updateFormData('liabilities', updatedLiabilities);
      nextStep();
    }
  };

  const addAnother = (e) => {
    e.preventDefault();
    if (validate()) {
      const updatedLiabilities = [...formData.liabilities, liability];
      updateFormData('liabilities', updatedLiabilities);
      setLiability({
        liabilityType: '',
        institution: '',
        outstandingBalance: '',
        monthlyRepayment: '',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className='text-lg font-medium text-gray-900 mb-6'>
        Liability Information
      </h3>

      <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
        <div className='sm:col-span-6'>
          <label
            htmlFor='liabilityType'
            className='block text-sm font-medium text-gray-700'
          >
            Liability Type
          </label>
          <select
            id='liabilityType'
            name='liabilityType'
            value={liability.liabilityType}
            onChange={handleChange}
            className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
              errors.liabilityType ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
          >
            <option value=''>Select liability type</option>
            {liabilityTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.liabilityType && (
            <p className='mt-2 text-sm text-red-600'>{errors.liabilityType}</p>
          )}
        </div>

        <div className='sm:col-span-6'>
          <label
            htmlFor='institution'
            className='block text-sm font-medium text-gray-700'
          >
            Institution or Lender Name
          </label>
          <input
            type='text'
            name='institution'
            id='institution'
            value={liability.institution}
            onChange={handleChange}
            className={`mt-1 block w-full shadow-sm sm:text-sm rounded-md ${
              errors.institution ? 'border-red-500' : 'border-gray-300'
            } focus:ring-blue-500 focus:border-blue-500`}
            placeholder='e.g., ATO, Commonwealth Bank'
          />
          {errors.institution && (
            <p className='mt-2 text-sm text-red-600'>{errors.institution}</p>
          )}
        </div>

        <div className='sm:col-span-3'>
          <label
            htmlFor='outstandingBalance'
            className='block text-sm font-medium text-gray-700'
          >
            Outstanding Balance (AUD)
          </label>
          <div className='mt-1 relative rounded-md shadow-sm'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <span className='text-gray-500 sm:text-sm'>$</span>
            </div>
            <input
              type='number'
              name='outstandingBalance'
              id='outstandingBalance'
              value={liability.outstandingBalance}
              onChange={handleChange}
              step='0.01'
              className={`block w-full pl-7 pr-12 sm:text-sm rounded-md ${
                errors.outstandingBalance ? 'border-red-500' : 'border-gray-300'
              } focus:ring-blue-500 focus:border-blue-500`}
              placeholder='0.00'
            />
          </div>
          {errors.outstandingBalance && (
            <p className='mt-2 text-sm text-red-600'>
              {errors.outstandingBalance}
            </p>
          )}
        </div>

        <div className='sm:col-span-3'>
          <label
            htmlFor='monthlyRepayment'
            className='block text-sm font-medium text-gray-700'
          >
            Monthly Repayment (AUD)
          </label>
          <div className='mt-1 relative rounded-md shadow-sm'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <span className='text-gray-500 sm:text-sm'>$</span>
            </div>
            <input
              type='number'
              name='monthlyRepayment'
              id='monthlyRepayment'
              value={liability.monthlyRepayment}
              onChange={handleChange}
              step='0.01'
              className={`block w-full pl-7 pr-12 sm:text-sm rounded-md ${
                errors.monthlyRepayment ? 'border-red-500' : 'border-gray-300'
              } focus:ring-blue-500 focus:border-blue-500`}
              placeholder='0.00'
            />
          </div>
          {errors.monthlyRepayment && (
            <p className='mt-2 text-sm text-red-600'>
              {errors.monthlyRepayment}
            </p>
          )}
        </div>
      </div>

      {formData.liabilities.length > 0 && (
        <div className='mt-8'>
          <h4 className='text-sm font-medium text-gray-700 mb-2'>
            Added Liabilities
          </h4>
          <ul className='border rounded-md divide-y divide-gray-200'>
            {formData.liabilities.map((liability, index) => (
              <li key={index} className='px-4 py-3'>
                <div className='flex justify-between'>
                  <span className='font-medium'>{liability.liabilityType}</span>
                  <span className='text-gray-600'>
                    ${liability.outstandingBalance}
                  </span>
                </div>
                <div className='text-sm text-gray-500'>
                  {liability.institution} • ${liability.monthlyRepayment}/month
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
            Add Another Liability
          </button>

          <button
            type='submit'
            className='ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          >
            Review and Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default Step5Liabilities;
