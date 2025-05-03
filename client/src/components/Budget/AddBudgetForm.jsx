// src/components/Budget/AddBudgetForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

export default function AddBudgetForm({ year, month, onAdded }) {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const categories = [
    'Groceries & Household',
    'Transport',
    'Dining & Takeaway',
    'Shopping & Retail',
    'Utilities & Bills',
    'Health & Fitness',
    'Entertainment & Gaming',
    'Digital & Subscriptions',
    'Account Services',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5500/api/budgets',
        {
          category,
          amount: parseFloat(amount),
          year,
          month,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onAdded(res.data);
      setCategory('');
      setAmount('');
      setMessage('Budget saved!');
    } catch (err) {
      console.error('Failed to save budget', err);
      setMessage('Error saving budget');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6 max-w-xl mx-auto'>
      <h3 className='text-lg font-semibold text-gray-800 mb-4'>
        Add or Update Budget
      </h3>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className='w-full border rounded px-3 py-2'
            required
          >
            <option value=''>Select a category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Amount ($)
          </label>
          <input
            type='number'
            min='0'
            step='0.01'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className='w-full border rounded px-3 py-2'
            required
          />
        </div>

        <div className='flex items-center justify-between'>
          <button
            type='submit'
            className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Budget'}
          </button>
          {message && <span className='text-sm text-gray-600'>{message}</span>}
        </div>
      </form>
    </div>
  );
}
