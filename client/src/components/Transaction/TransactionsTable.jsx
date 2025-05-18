// src/components/TransactionsTable.jsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { ArrowUp, ArrowDown, Pencil, Trash, Plus } from 'lucide-react';
import AddTransaction from '../Common/AddTransaction';
import TransactionFilters from './TransactionFilters';

export default function TransactionsTable({ isCompactView = false }) {
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editTxn, setEditTxn] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    accountId: '',
    search: '',
    year: '',
    month: '',
    sort: '-date',
    skip: 0,
    limit: 10,
  });

  const { search } = useLocation();
  const highlightId = new URLSearchParams(search).get('highlight');
  const highlightRef = useRef(null);

  const fetchTransactions = async (reset = false) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = {
        ...filters,
        withTotals: true,
      };
      const res = await axios.get('http://localhost:5500/api/transactions', {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      if (reset) {
        setTxns(res.data.transactions);
      } else {
        setTxns((prev) => [...prev, ...res.data.transactions]);
      }
      setTotalCount(res.data.totals.count || 0);
    } catch (err) {
      console.error('Error fetching transactions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(true);
  }, [
    filters.type,
    filters.category,
    filters.accountId,
    filters.search,
    filters.year,
    filters.month,
    filters.sort,
  ]);

  // Scroll to highlighted transaction
  useEffect(() => {
    if (highlightRef.current) {
      highlightRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [txns]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!window.confirm('Are you sure you want to delete this transaction?'))
      return;
    try {
      await axios.delete(`http://localhost:5500/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTxns((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const loadMore = () => {
    setFilters((prev) => ({ ...prev, skip: prev.skip + filters.limit }));
  };

  return (
    <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='font-medium text-gray-800'>
          {isCompactView ? 'Recent Transactions' : 'All Transactions'}
        </h3>

        {!isCompactView && (
          <AddTransaction
            onSuccess={() => fetchTransactions(true)}
            triggerElement={
              <button className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2'>
                <Plus className='h-4 w-4' />
                <span>Add</span>
              </button>
            }
          />
        )}
      </div>

      {!isCompactView && (
        <TransactionFilters value={filters} onChange={setFilters} />
      )}

      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-4 py-2 text-left text-sm font-medium text-gray-600'>
                Transaction
              </th>
              <th className='px-4 py-2 text-left text-sm font-medium text-gray-600'>
                Category
              </th>
              <th className='px-4 py-2 text-left text-sm font-medium text-gray-600'>
                Account
              </th>
              <th className='px-4 py-2 text-left text-sm font-medium text-gray-600'>
                Date
              </th>
              <th className='px-4 py-2 text-right text-sm font-medium text-gray-600'>
                Amount
              </th>
              {!isCompactView && (
                <th className='px-4 py-2 text-right text-sm font-medium text-gray-600'>
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {txns.map((tx) => (
              <tr
                key={tx._id}
                ref={tx._id === highlightId ? highlightRef : null}
                className={`hover:bg-gray-50 ${
                  tx._id === highlightId
                    ? 'bg-yellow-100 border-l-4 border-yellow-400'
                    : ''
                }`}
              >
                <td className='px-4 py-2'>
                  <div className='flex items-center gap-2'>
                    <div
                      className={`p-2 rounded-md ${
                        tx.type === 'Income'
                          ? 'bg-green-100 text-green-600'
                          : tx.type === 'Expense'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {tx.type === 'Income' ? (
                        <ArrowUp className='w-4 h-4' />
                      ) : tx.type === 'Expense' ? (
                        <ArrowDown className='w-4 h-4' />
                      ) : (
                        <span>T</span>
                      )}
                    </div>
                    <div>
                      <div className='font-medium text-gray-900'>
                        {tx.description}
                      </div>
                    </div>
                  </div>
                </td>

                <td className='px-4 py-2'>
                  <div className='text-sm text-gray-700'>
                    {tx.category}
                    {tx.subCategory && ` > ${tx.subCategory}`}
                  </div>
                </td>

                <td className='px-4 py-2 text-sm text-gray-500'>
                  {tx.fromAccountId?.name || tx.toAccountId?.name || '—'}
                </td>

                <td className='px-4 py-2 text-sm text-gray-500'>
                  {new Date(tx.date).toLocaleDateString()}
                </td>

                <td
                  className={`px-4 py-2 text-right font-semibold ${
                    tx.type === 'Income' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {tx.type === 'Income' ? '+' : '-'}${tx.amount.toFixed(2)}
                </td>

                {!isCompactView && (
                  <td className='px-4 py-2 text-right text-sm flex justify-end gap-2'>
                    <AddTransaction
                      editTransaction={tx}
                      onSuccess={() => fetchTransactions(true)}
                      onDelete={handleDelete}
                      triggerElement={
                        <button className='text-blue-500 hover:text-blue-700'>
                          <Pencil className='w-4 h-4' />
                        </button>
                      }
                    />
                    <button
                      onClick={() => handleDelete(tx._id)}
                      className='text-red-500 hover:text-red-700'
                    >
                      <Trash className='w-4 h-4' />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!isCompactView && txns.length < totalCount && (
        <div className='text-center mt-4'>
          <button
            onClick={loadMore}
            className='text-blue-600 font-medium hover:underline disabled:opacity-50'
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
          <p className='text-xs text-gray-500 mt-1'>
            Showing {txns.length} of {totalCount} transactions
          </p>
        </div>
      )}
    </div>
  );
}
