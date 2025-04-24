// StepperLayout.jsx
import React, { useState } from 'react';
import BankDetailsStep from './steps/BankDetails';
import WalletsStep from './steps/WalletDetails';
import CreditCardStep from './steps/CreditCardDetails';
import AssetsStep from './steps/AssetDetails';
import LiabilitiesStep from './steps/LiabilityDetails';

const StepperLayout = () => {
  const [step, setStep] = useState(0);

  const [bankDetails, setBankDetails] = useState([
    { bank: '', accNo: '', balance: '' },
  ]);
  const [wallets, setWallets] = useState([
    { name: '', email: '', balance: '' },
  ]);
  const [cards, setCards] = useState([
    { provider: '', number: '', limit: '', balance: '', dueDate: '' },
  ]);
  const [assets, setAssets] = useState([
    { type: '', description: '', value: '', ownership: '' },
  ]);
  const [liabilities, setLiabilities] = useState([
    { type: '', lender: '', amount: '', rate: '', term: '' },
  ]);

  const steps = [
    {
      label: 'Bank Details',
      component: (
        <BankDetailsStep
          data={bankDetails}
          setData={setBankDetails}
          onNext={() => setStep(step + 1)}
        />
      ),
    },
    {
      label: 'Financial Wallets',
      component: (
        <WalletsStep
          data={wallets}
          setData={setWallets}
          onNext={() => setStep(step + 1)}
          onBack={() => setStep(step - 1)}
        />
      ),
    },
    {
      label: 'Credit Cards',
      component: (
        <CreditCardStep
          cards={cards}
          setCards={setCards}
          onNext={() => setStep(step + 1)}
          onBack={() => setStep(step - 1)}
        />
      ),
    },
    {
      label: 'Assets',
      component: (
        <AssetsStep
          data={assets}
          setData={setAssets}
          onNext={() => setStep(step + 1)}
          onBack={() => setStep(step - 1)}
        />
      ),
    },
    {
      label: 'Liabilities',
      component: (
        <LiabilitiesStep
          data={liabilities}
          setData={setLiabilities}
          onBack={() => setStep(step - 1)}
          onNext={() => alert('All steps done!')}
        />
      ),
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50 px-4 py-8'>
      <div className='flex justify-center mb-6 space-x-3'>
        {steps.map((s, idx) => (
          <div
            key={idx}
            className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold text-white ${
              idx === step ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          >
            {idx + 1}
          </div>
        ))}
      </div>

      <div className='max-w-4xl mx-auto'>{steps[step].component}</div>
    </div>
  );
};

export default StepperLayout;
