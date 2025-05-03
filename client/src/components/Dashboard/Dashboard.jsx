// src/components/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from '../Common/Navbar';
import Sidebar from '../Common/Sidebar';
import SummaryCard from './SummaryCard';
import ChartSection from './ChartSection';
import TransactionsTable from '../Transaction/TransactionsTable';

import IncomeVsExpenseLineChart from '../Charts/IncomeVsExpenseLineChart';
import CategoryExpensesPieChart from '../Charts//CategoryExpensesPieChart';

// import CategoryExpensesBarChart from '../Charts/CategoryExpensesBarChart';

function Dashboard({
  activeTab,
  setActiveTab,
  isSidebarOpen,
  setIsSidebarOpen,
}) {
  const navigate = useNavigate();
  const now = new Date();
  const [filter, setFilter] = useState({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  });

  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5500/api/dashboard/summary', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data) => setSummary(data))
      .catch((err) => {
        console.error('Dashboard summary fetch error', err);
        // fallback...
      });
  }, []);

  // While loading...
  if (!summary) {
    return <div className='p-6'>Loading summary…</div>;
  }

  const cards = [
    {
      title: 'Total Balance',
      amount: summary.netWorth.toFixed(2),
      change: '', // you can compute vs last month if desired
      type: 'balance',
      isPositive: true,
    },
    {
      title: 'Monthly Income',
      amount: summary.income.toFixed(2),
      change: '',
      type: 'income',
      isPositive: true,
    },
    {
      title: 'Monthly Expenses',
      amount: summary.expense.toFixed(2),
      change: '',
      type: 'expenses',
      isPositive: false,
    },
    {
      title: 'Savings Rate',
      amount: `${summary.savingsRate.toFixed(2)}%`,
      change: '',
      type: 'savings',
      isPositive: summary.savingsRate >= 0,
    },
  ];

  return (
    <div className='flex flex-col min-h-screen bg-gray-50'>
      <Navbar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
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
          <h1 className='text-2xl font-semibold text-gray-800 mb-6'>
            {activeTab}
          </h1>
          {activeTab === 'Dashboard' && (
            <>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
                {cards.map((c, i) => (
                  <SummaryCard key={i} {...c} />
                ))}
              </div>
              {/* <ChartSection /> */}

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
                <IncomeVsExpenseLineChart />
                <CategoryExpensesPieChart />
              </div>

              <div className='mt-8'>
                <TransactionsTable isCompactView={true} />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
