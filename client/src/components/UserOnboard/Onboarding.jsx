// src/components/Onboarding.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Step1BankAccount from './Step1BankAccount';
import Step2CreditCard from './Step2CreditCard';
import Step3FinancialWallets from './Step3FinancialWallets';
import Step4Assets from './Step4Assets';
import Step5Liabilities from './Step5Liabilities';
import Review from './Review';

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    bankAccounts: [],
    // initialize one empty credit‐card slot with all new fields:
    creditCards: [],
    financialWallets: [],
    assets: [],
    liabilities: [],
  });
  const [error, setError] = useState('');

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submitForm = async () => {
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5500/api/onboarding',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(`Created ${response.data.createdCount} accounts!`);
      navigate('/dashboard');
    } catch (err) {
      console.error('Onboarding error:', err);
      setError(err.response?.data?.message || 'Onboarding failed.');
    }
  };

  const steps = [
    'Bank Accounts',
    'Credit Cards',
    'Financial Wallets',
    'Assets',
    'Liabilities',
    'Review',
  ];

  const progressPercentage = ((step - 1) / (steps.length - 1)) * 100;

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-3xl mx-auto'>
        <div className='text-center mb-8'>
          <h2 className='text-3xl font-extrabold text-gray-900'>
            Complete Your Financial Profile
          </h2>
          <p className='mt-2 text-lg text-gray-600'>
            Let's get a complete picture of your finances to provide the best
            recommendations.
          </p>
          {error && <p className='mt-3 text-sm text-red-500'>{error}</p>}
        </div>

        {/* Progress Bar */}
        <div className='mb-8'>
          <div className='flex justify-between mb-2'>
            {steps.map((label, index) => (
              <div
                key={index}
                className={`text-sm font-medium ${
                  step > index + 1
                    ? 'text-green-600'
                    : step === index + 1
                      ? 'text-blue-600'
                      : 'text-gray-500'
                }`}
              >
                {label}
              </div>
            ))}
          </div>
          <div className='w-full bg-gray-200 rounded-full h-2.5'>
            <div
              className='bg-blue-600 h-2.5 rounded-full transition-all duration-300'
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Form Steps and Submit */}
        <div className='bg-white shadow rounded-lg p-6'>
          {step === 1 && (
            <Step1BankAccount
              formData={formData}
              updateFormData={updateFormData}
              nextStep={nextStep}
            />
          )}
          {step === 2 && (
            <Step2CreditCard
              formData={formData}
              updateFormData={updateFormData}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          {step === 3 && (
            <Step3FinancialWallets
              formData={formData}
              updateFormData={updateFormData}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          {step === 4 && (
            <Step4Assets
              formData={formData}
              updateFormData={updateFormData}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          {step === 5 && (
            <Step5Liabilities
              formData={formData}
              updateFormData={updateFormData}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          {step === 6 && (
            <Review
              formData={formData}
              prevStep={prevStep}
              submitForm={submitForm}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
