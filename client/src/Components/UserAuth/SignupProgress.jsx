import React, { useState } from 'react';
import './FinancialDashboard.css'; // Optional: create styles for layout and progress bar

// Prefilled defaults for common items
const initialBankAccount = {
  bankName: 'Bank of America',
  accountType: 'savings',
  last4: '',
  currentBalance: '',
};
const initialWallet = { walletName: 'PayPal', contact: '', balance: '' };
const initialCreditCard = {
  provider: 'Visa',
  last4: '',
  limit: '',
  outstanding: '',
  dueDate: '',
};
const initialAsset = { type: '', name: '', value: '', acquisitionDate: '' };
const initialLiability = {
  type: '',
  creditor: '',
  amountOwed: '',
  interestRate: '',
  dueDate: '',
};

function FinancialDashboard() {
  // State hooks for each financial section
  const [bankAccounts, setBankAccounts] = useState([initialBankAccount]);
  const [wallets, setWallets] = useState([initialWallet]);
  const [creditCards, setCreditCards] = useState([initialCreditCard]);
  const [assets, setAssets] = useState([initialAsset]);
  const [liabilities, setLiabilities] = useState([initialLiability]);

  // Handlers for updating and adding entries in each section
  const handleChange = (stateArray, setStateArray, index, field, value) => {
    const updated = [...stateArray];
    updated[index] = { ...updated[index], [field]: value };
    setStateArray(updated);
  };

  const addEntry = (stateArray, setStateArray, initialEntry) => {
    setStateArray([...stateArray, initialEntry]);
  };

  // Simulated auto-save: on blur, you can trigger saving logic
  const handleBlur = () => {
    // TODO: Integrate auto-save functionality (e.g., API call to save data)
    console.log('Auto-saving data...', {
      bankAccounts,
      wallets,
      creditCards,
      assets,
      liabilities,
    });
  };

  return (
    <div className='financial-dashboard'>
      <h1>Financial Overview</h1>
      <ProgressBar
        bankAccounts={bankAccounts}
        wallets={wallets}
        creditCards={creditCards}
        assets={assets}
        liabilities={liabilities}
      />

      {/* Bank Accounts Section */}
      <section>
        <h2>🏦 Bank Accounts</h2>
        {bankAccounts.map((account, index) => (
          <div key={index} className='account-card'>
            <input
              type='text'
              placeholder='Bank Name'
              value={account.bankName}
              onChange={(e) =>
                handleChange(
                  bankAccounts,
                  setBankAccounts,
                  index,
                  'bankName',
                  e.target.value
                )
              }
              onBlur={handleBlur}
            />
            <select
              value={account.accountType}
              onChange={(e) =>
                handleChange(
                  bankAccounts,
                  setBankAccounts,
                  index,
                  'accountType',
                  e.target.value
                )
              }
              onBlur={handleBlur}
            >
              <option value='savings'>Savings</option>
              <option value='checking'>Checking</option>
            </select>
            <input
              type='text'
              placeholder='Last 4 Digits'
              value={account.last4}
              onChange={(e) =>
                handleChange(
                  bankAccounts,
                  setBankAccounts,
                  index,
                  'last4',
                  e.target.value
                )
              }
              onBlur={handleBlur}
            />
            <input
              type='number'
              placeholder='Current Balance'
              value={account.currentBalance}
              onChange={(e) =>
                handleChange(
                  bankAccounts,
                  setBankAccounts,
                  index,
                  'currentBalance',
                  e.target.value
                )
              }
              onBlur={handleBlur}
            />
          </div>
        ))}
        <button
          onClick={() =>
            addEntry(bankAccounts, setBankAccounts, initialBankAccount)
          }
        >
          Add Another Bank Account
        </button>
      </section>

      {/* Wallets / Payment Apps Section */}
      <section>
        <h2>👛 Wallets / Payment Apps</h2>
        {wallets.map((wallet, index) => (
          <div key={index} className='wallet-card'>
            <input
              type='text'
              placeholder='Wallet Name (e.g. PayPal, Venmo)'
              value={wallet.walletName}
              onChange={(e) =>
                handleChange(
                  wallets,
                  setWallets,
                  index,
                  'walletName',
                  e.target.value
                )
              }
              onBlur={handleBlur}
            />
            <input
              type='text'
              placeholder='Associated Email/Phone'
              value={wallet.contact}
              onChange={(e) =>
                handleChange(
                  wallets,
                  setWallets,
                  index,
                  'contact',
                  e.target.value
                )
              }
              onBlur={handleBlur}
            />
            <input
              type='number'
              placeholder='Balance'
              value={wallet.balance}
              onChange={(e) =>
                handleChange(
                  wallets,
                  setWallets,
                  index,
                  'balance',
                  e.target.value
                )
              }
              onBlur={handleBlur}
            />
          </div>
        ))}
        <button onClick={() => addEntry(wallets, setWallets, initialWallet)}>
          Add Another Wallet
        </button>
      </section>

      {/* Credit Cards Section */}
      <section>
        <h2>💳 Credit Cards</h2>
        {creditCards.map((card, index) => (
          <div key={index} className='credit-card'>
            <input
              type='text'
              placeholder='Card Provider'
              value={card.provider}
              onChange={(e) =>
                handleChange(
                  creditCards,
                  setCreditCards,
                  index,
                  'provider',
                  e.target.value
                )
              }
              onBlur={handleBlur}
            />
            <input
              type='text'
              placeholder='Last 4 Digits'
              value={card.last4}
              onChange={(e) =>
                handleChange(
                  creditCards,
                  setCreditCards,
                  index,
                  'last4',
                  e.target.value
                )
              }
              onBlur={handleBlur}
            />
            <input
              type='number'
              placeholder='Limit'
              value={card.limit}
              onChange={(e) =>
                handleChange(
                  creditCards,
                  setCreditCards,
                  index,
                  'limit',
                  e.target.value
                )
              }
              onBlur={handleBlur}
            />
            <input
              type='number'
              placeholder='Current Outstanding'
              value={card.outstanding}
              onChange={(e) =>
                handleChange(
                  creditCards,
                  setCreditCards,
                  index,
                  'outstanding',
                  e.target.value
                )
              }
              onBlur={handleBlur}
            />
            <input
              type='date'
              placeholder='Due Date'
              value={card.dueDate}
              onChange={(e) =>
                handleChange(
                  creditCards,
                  setCreditCards,
                  index,
                  'dueDate',
                  e.target.value
                )
              }
              onBlur={handleBlur}
            />
          </div>
        ))}
        <button
          onClick={() =>
            addEntry(creditCards, setCreditCards, initialCreditCard)
          }
        >
          Add Another Credit Card
        </button>
      </section>

      {/* Assets Section */}
      <section>
        <h2>🏠 Assets</h2>
        {assets.map((asset, index) => (
          <div key={index} className='asset-card'>
            <input
              type='text'
              placeholder='Type (e.g., house, car, stock)'
              value={asset.type}
              onChange={(e) =>
                handleChange(assets, setAssets, index, 'type', e.target.value)
              }
              onBlur={handleBlur}
            />
            <input
              type='text'
              placeholder='Name'
              value={asset.name}
              onChange={(e) =>
                handleChange(assets, setAssets, index, 'name', e.target.value)
              }
              onBlur={handleBlur}
            />
            <input
              type='number'
              placeholder='Value'
              value={asset.value}
              onChange={(e) =>
                handleChange(assets, setAssets, index, 'value', e.target.value)
              }
              onBlur={handleBlur}
            />
            <input
              type='date'
              placeholder='Acquisition Date'
              value={asset.acquisitionDate}
              onChange={(e) =>
                handleChange(
                  assets,
                  setAssets,
                  index,
                  'acquisitionDate',
                  e.target.value
                )
              }
              onBlur={handleBlur}
            />
          </div>
        ))}
        <button onClick={() => addEntry(assets, setAssets, initialAsset)}>
          Add Another Asset
        </button>
      </section>

      {/* Liabilities Section */}
      <section>
        <h2>💸 Liabilities</h2>
        {liabilities.map((liability, index) => (
          <div key={index} className='liability-card'>
            <input
              type='text'
              placeholder='Type (e.g., student loan, mortgage)'
              value={liability.type}
              onChange={(e) =>
                handleChange(
                  liabilities,
                  setLiabilities,
                  index,
                  'type',
                  e.target.value
                )
              }
              onBlur={handleBlur}
            />
            <input
              type='text'
              placeholder='Creditor'
              value={liability.creditor}
              onChange={(e) =>
                handleChange(
                  liabilities,
                  setLiabilities,
                  index,
                  'creditor',
                  e.target.value
                )
              }
              onBlur={handleBlur}
            />
            <input
              type='number'
              placeholder='Amount Owed'
              value={liability.amountOwed}
              onChange={(e) =>
                handleChange(
                  liabilities,
                  setLiabilities,
                  index,
                  'amountOwed',
                  e.target.value
                )
              }
              onBlur={handleBlur}
            />
            <input
              type='number'
              placeholder='Interest Rate'
              value={liability.interestRate}
              onChange={(e) =>
                handleChange(
                  liabilities,
                  setLiabilities,
                  index,
                  'interestRate',
                  e.target.value
                )
              }
              onBlur={handleBlur}
            />
            <input
              type='date'
              placeholder='Due Date'
              value={liability.dueDate}
              onChange={(e) =>
                handleChange(
                  liabilities,
                  setLiabilities,
                  index,
                  'dueDate',
                  e.target.value
                )
              }
              onBlur={handleBlur}
            />
          </div>
        ))}
        <button
          onClick={() =>
            addEntry(liabilities, setLiabilities, initialLiability)
          }
        >
          Add Another Liability
        </button>
      </section>

      {/* Save Button (or could trigger auto-save) */}
      <button
        className='save-btn'
        onClick={() =>
          console.log('Manual Save', {
            bankAccounts,
            wallets,
            creditCards,
            assets,
            liabilities,
          })
        }
      >
        Save
      </button>
    </div>
  );
}

// A simple progress bar component that calculates completion based on filled fields in each section
const ProgressBar = ({
  bankAccounts,
  wallets,
  creditCards,
  assets,
  liabilities,
}) => {
  const totalSections = 5;
  let completed = 0;
  if (bankAccounts.some((account) => account.last4 !== '')) completed++;
  if (wallets.some((wallet) => wallet.walletName !== '')) completed++;
  if (creditCards.some((card) => card.last4 !== '')) completed++;
  if (assets.some((asset) => asset.name !== '')) completed++;
  if (liabilities.some((liability) => liability.creditor !== '')) completed++;

  const percentage = (completed / totalSections) * 100;

  return (
    <div className='progress-bar-container'>
      <div className='progress-bar' style={{ width: `${percentage}%` }}>
        {percentage}% Complete
      </div>
    </div>
  );
};

export default FinancialDashboard;
