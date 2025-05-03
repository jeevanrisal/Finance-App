// src/components/Common/AddTransaction.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog } from '@headlessui/react';
import { XIcon, PlusIcon, Trash2 } from 'lucide-react';

export default function AddTransaction({
  onSuccess,
  triggerElement,
  editTransaction = null,
  onDelete = null,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [type, setType] = useState(editTransaction?.type || 'Expense');
  const [amount, setAmount] = useState(editTransaction?.amount || 0);
  const [fromAccountId, setFromAccountId] = useState(
    editTransaction?.fromAccountId || ''
  );
  const [toAccountId, setToAccountId] = useState(
    editTransaction?.toAccountId || ''
  );
  const [toAccountName, setToAccountName] = useState('');
  const [description, setDescription] = useState(
    editTransaction?.description || ''
  );
  const [date, setDate] = useState(
    editTransaction?.date?.slice(0, 10) || new Date().toISOString().slice(0, 10)
  );
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get('http://localhost:5500/api/accounts', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((res) => setAccounts(res.data))
      .catch((err) => console.error('Account fetch error', err));
  }, []);

  const resetForm = () => {
    setType('Expense');
    setAmount(0);
    setFromAccountId('');
    setToAccountId('');
    setToAccountName('');
    setDescription('');
    setDate(new Date().toISOString().slice(0, 10));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        type,
        amount,
        fromAccountId,
        toAccountId,
        toAccountName,
        description,
        date,
      };

      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const url = editTransaction
        ? `http://localhost:5500/api/transactions/${editTransaction._id}`
        : `http://localhost:5500/api/transactions`;

      const method = editTransaction ? 'put' : 'post';

      const res = await axios[method](url, payload, config);

      onSuccess?.(res.data.transaction || res.data);
      setIsOpen(false);
      resetForm();
    } catch (err) {
      console.error('Transaction save error', err);
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <span onClick={() => setIsOpen(true)}>{triggerElement}</span>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className='relative z-50'
      >
        <div className='fixed inset-0 bg-black/20' aria-hidden='true' />
        <div className='fixed inset-0 flex items-center justify-center p-4'>
          <Dialog.Panel className='w-full max-w-lg rounded-lg bg-white p-6 shadow-xl'>
            <div className='flex justify-between items-center mb-4'>
              <Dialog.Title className='text-lg font-semibold'>
                {editTransaction ? 'Edit Transaction' : 'Add Transaction'}
              </Dialog.Title>
              <button onClick={() => setIsOpen(false)}>
                <XIcon className='h-5 w-5 text-gray-500' />
              </button>
            </div>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className='w-full border rounded p-2'
              >
                <option value='Expense'>Expense</option>
                <option value='Income'>Income</option>
                <option value='Transfer'>Transfer</option>
              </select>

              <input
                type='number'
                className='w-full border rounded p-2'
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                placeholder='Amount'
                required
              />

              {type !== 'Income' && (
                <select
                  className='w-full border rounded p-2'
                  value={fromAccountId}
                  onChange={(e) => setFromAccountId(e.target.value)}
                >
                  <option value=''>Select From Account</option>
                  {accounts.map((acc) => (
                    <option key={acc._id} value={acc._id}>
                      {acc.name}
                    </option>
                  ))}
                </select>
              )}

              {type !== 'Expense' && (
                <select
                  className='w-full border rounded p-2'
                  value={toAccountId}
                  onChange={(e) => setToAccountId(e.target.value)}
                >
                  <option value=''>Select To Account</option>
                  {accounts.map((acc) => (
                    <option key={acc._id} value={acc._id}>
                      {acc.name}
                    </option>
                  ))}
                </select>
              )}

              <input
                type='text'
                className='w-full border rounded p-2'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Description'
              />

              <input
                type='date'
                className='w-full border rounded p-2'
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              {error && <div className='text-red-600 text-sm'>{error}</div>}

              <div className='flex justify-between items-center'>
                <button
                  type='submit'
                  className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
                  disabled={loading}
                >
                  {editTransaction ? 'Update' : 'Add'} Transaction
                </button>

                {editTransaction && onDelete && (
                  <button
                    type='button'
                    className='text-red-500 flex items-center gap-2'
                    onClick={() => {
                      if (
                        window.confirm(
                          'Are you sure you want to delete this transaction?'
                        )
                      ) {
                        onDelete(editTransaction._id);
                        setIsOpen(false);
                      }
                    }}
                  >
                    <Trash2 className='w-4 h-4' />
                    Delete
                  </button>
                )}
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
