// src/components/Transactions/TransactionFilters.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function TransactionFilters({ value, onChange }) {
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios
      .get('http://localhost:5500/api/accounts', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAccounts(res.data))
      .catch((err) => console.error('Account fetch error', err));

    setCategories([
      'Groceries & Household',
      'Transport',
      'Shopping & Retail',
      'Utilities & Bills',
      'Dining & Takeaway',
      'Income',
      'Transfers',
      'Account Services',
      'Digital & Subscriptions',
      'Health & Fitness',
    ]);
  }, []);

  const inputClass =
    'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500';

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6'>
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Type
        </label>
        <select
          className={inputClass}
          value={value.type}
          onChange={(e) =>
            onChange({ ...value, type: e.target.value, skip: 0 })
          }
        >
          <option value=''>All Types</option>
          <option value='Income'>Income</option>
          <option value='Expense'>Expense</option>
          <option value='Transfer'>Transfer</option>
        </select>
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Category
        </label>
        <select
          className={inputClass}
          value={value.category}
          onChange={(e) =>
            onChange({ ...value, category: e.target.value, skip: 0 })
          }
        >
          <option value=''>All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Account
        </label>
        <select
          className={inputClass}
          value={value.accountId}
          onChange={(e) =>
            onChange({ ...value, accountId: e.target.value, skip: 0 })
          }
        >
          <option value=''>All Accounts</option>
          {accounts.map((acc) => (
            <option key={acc._id} value={acc._id}>
              {acc.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Month
        </label>
        <input
          type='month'
          className={inputClass}
          onChange={(e) => {
            const [year, month] = e.target.value.split('-');
            onChange({ ...value, year, month, skip: 0 });
          }}
        />
      </div>

      <div className='md:col-span-2 lg:col-span-2'>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Search
        </label>
        <input
          type='text'
          className={inputClass}
          placeholder='Search by description or notes'
          value={value.search}
          onChange={(e) =>
            onChange({ ...value, search: e.target.value, skip: 0 })
          }
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Sort
        </label>
        <select
          className={inputClass}
          value={value.sort}
          onChange={(e) =>
            onChange({ ...value, sort: e.target.value, skip: 0 })
          }
        >
          <option value='-date'>Newest First</option>
          <option value='date'>Oldest First</option>
          <option value='-amount'>Amount: High to Low</option>
          <option value='amount'>Amount: Low to High</option>
        </select>
      </div>
    </div>
  );
}
