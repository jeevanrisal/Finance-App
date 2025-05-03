// src/components/NewAccountForm.jsx
import React, { useState } from 'react';
import BankAccountForm from './BankAccountForm';
import CreditCardForm from './CreditCardForm';
import DigitalWalletForm from './DigitalWalletForm';
import AssetForm from './AssetForm';
import LiabilityForm from './LiabilityForm';

export default function NewAccountForm({ onSave, onCancel }) {
  const [accountType, setAccountType] = useState('bank');
  const [fields, setFields] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5500/api/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ accountType, ...fields }),
      });
      if (!res.ok) throw new Error('Save failed');
      const account = await res.json();
      onSave(account);
    } catch (err) {
      alert(err.message || 'Error saving account');
    }
  };

  return (
    <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8'>
      {/* Account Type Selector */}
      <div className='mb-6'>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Account Type
        </label>
        <select
          value={accountType}
          onChange={(e) => {
            setAccountType(e.target.value);
            setFields({});
          }}
          className='block w-1/2 border-gray-300 rounded-md shadow-sm'
        >
          <option value='bank'>Bank Account</option>
          <option value='credit'>Credit Card</option>
          <option value='wallet'>Digital Wallet</option>
          <option value='asset'>Asset</option>
          <option value='liability'>Liability</option>
        </select>
      </div>

      {/* Conditional Form */}
      {accountType === 'bank' && (
        <BankAccountForm fields={fields} onChange={handleChange} />
      )}
      {accountType === 'credit' && (
        <CreditCardForm fields={fields} onChange={handleChange} />
      )}
      {accountType === 'wallet' && (
        <DigitalWalletForm fields={fields} onChange={handleChange} />
      )}
      {accountType === 'asset' && (
        <AssetForm fields={fields} onChange={handleChange} />
      )}
      {accountType === 'liability' && (
        <LiabilityForm fields={fields} onChange={handleChange} />
      )}

      {/* Actions */}
      <div className='flex space-x-4 mt-6'>
        <button
          onClick={handleSave}
          className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md'
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100'
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
