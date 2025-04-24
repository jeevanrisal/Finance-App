// Stepper.jsx
import React from 'react';

const Stepper = ({ steps, currentStep }) => {
  return (
    <div className='flex justify-center items-center space-x-4'>
      {steps.map((step, index) => (
        <div key={index} className='flex items-center space-x-2'>
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${
              index <= currentStep
                ? 'bg-purple-600 text-white'
                : 'bg-gray-300 text-gray-600'
            }`}
          >
            {index + 1}
          </div>
          <span className='text-sm'>{step}</span>
        </div>
      ))}
    </div>
  );
};

export default Stepper;
