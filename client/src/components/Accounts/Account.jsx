// src/components/AccountsPage.jsx
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Navbar from '../Common/Navbar';
import Sidebar from '../Common/Sidebar';
import NewAccountForm from './NewAccountForm';
import { useNavigate } from 'react-router-dom';

const typeLabels = {
  bank: 'Bank Account',
  credit: 'Credit Card',
  wallet: 'Digital Wallet',
  asset: 'Asset',
  liability: 'Liability',
  temp: 'Temp',
};

const maskNumber = (num = '') => {
  const s = num.toString().replace(/\s+/g, '');
  return s.length > 4 ? `•••• •••• •••• ${s.slice(-4)}` : s;
};

const formatBalance = (amt) =>
  typeof amt === 'number'
    ? new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD',
      }).format(amt)
    : '-';

export default function Account({
  activeTab,
  setActiveTab,
  isSidebarOpen,
  setIsSidebarOpen,
}) {
  const navigate = useNavigate();

  //   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5500/api/accounts', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data) => setAccounts(data))
      .catch(() => setError('Failed to load accounts'))
      .finally(() => setLoading(false));
  }, []);

  const handleNewAccount = (acct) => {
    setAccounts((prev) => [...prev, acct]);
    setShowAddForm(false);
  };

  if (loading) return <div className='p-6'>Loading…</div>;
  if (error) return <div className='p-6 text-red-600'>{error}</div>;

  const grouped = accounts.reduce((acc, acct) => {
    (acc[acct.accountType] = acc[acct.accountType] || []).push(acct);
    return acc;
  }, {});

  return (
    <div className='flex flex-col min-h-screen bg-gray-50'>
      <Navbar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen((o) => !o)}
      />
      <div className='flex flex-1'>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            if (tab === 'Accounts') navigate('/accounts');
            else if (tab === 'Dashboard') navigate('/dashboard');
            else if (tab === 'Transactions') navigate('/transaction');
            else if (tab === 'Budget Planning') navigate('/budget');
            else if (tab === 'Analytics') navigate('/analytics');
            else if (tab === 'Report') navigate('/report');

            // ... other tabs ...
          }}
          isOpen={isSidebarOpen}
        />

        <main className='flex-1 p-6 overflow-auto'>
          {/* Header */}
          <div className='flex justify-between items-center mb-6'>
            <h1 className='text-2xl font-semibold text-gray-800'>Accounts</h1>
            <button
              className='inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md'
              onClick={() => setShowAddForm(true)}
            >
              <Plus className='h-4 w-4 mr-2' />
              Add Account
            </button>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <NewAccountForm
              onSave={handleNewAccount}
              onCancel={() => setShowAddForm(false)}
            />
          )}

          {/* Grouped Accounts Display */}
          {Object.entries(typeLabels).map(([type, label]) =>
            grouped[type]?.length > 0 ? (
              <section key={type} className='mb-8'>
                <h2 className='text-xl font-semibold text-gray-800 mb-4'>
                  {label + (grouped[type].length > 1 ? 's' : '')}
                </h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {grouped[type].map((acct) => (
                    <div
                      key={acct._id}
                      className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'
                    >
                      <h3 className='text-lg font-semibold text-gray-800'>
                        {acct.name}
                      </h3>
                      <p className='text-sm text-gray-500 mb-2'>
                        {type === 'wallet' ? acct.walletEmail : acct.provider}
                      </p>
                      <p className='font-medium mb-2'>
                        Balance:{' '}
                        <span className='text-gray-800'>
                          {formatBalance(acct.balance)}
                        </span>
                      </p>

                      {(type === 'bank' || type === 'liability') && (
                        <>
                          <p className='text-sm'>
                            Account #: {acct.accountNumber || '—'}
                          </p>
                          {acct.notes && (
                            <p className='text-sm'>Notes: {acct.notes}</p>
                          )}
                        </>
                      )}

                      {type === 'credit' && (
                        <>
                          <p className='text-sm'>
                            Card: {maskNumber(acct.cardNumber)}
                          </p>
                          <p className='text-sm'>Expiry: {acct.expiryDate}</p>
                          <p className='text-sm'>
                            Limit: {formatBalance(acct.cardLimit)}
                          </p>
                          <p className='text-sm'>
                            Used: {formatBalance(acct.usedBalance)}
                          </p>
                        </>
                      )}

                      {type === 'asset' && acct.notes && (
                        <p className='text-sm'>Notes: {acct.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ) : null
          )}
        </main>
      </div>
    </div>
  );
}
