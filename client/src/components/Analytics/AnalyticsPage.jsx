// src/components/AnalyticsPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from '../Common/Navbar';
import Sidebar from '../Common/Sidebar';
import MonthYearPicker from '../Common/MonthYearPicker';

import SpendingTrendChart from '../Charts/SpendingTrendChart';
import TopCategoryChart from '../Charts/TopCategoryChart';
import AccountSpendingChart from '../Charts/AccountSpendingChart';
import WeekdaySpendingChart from '../Charts/WeekdaySpendingChart';

function AnalyticsPage({
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
          }}
          isOpen={isSidebarOpen}
        />

        <main className='flex-1 p-6 overflow-auto'>
          <div className='flex items-center justify-between mb-6'>
            <h1 className='text-2xl font-semibold text-gray-800'>
              {activeTab}
            </h1>
            <MonthYearPicker
              year={filter.year}
              month={filter.month}
              onChange={setFilter}
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <SpendingTrendChart />
            <TopCategoryChart year={filter.year} month={filter.month} />
            <AccountSpendingChart year={filter.year} month={filter.month} />
            <WeekdaySpendingChart year={filter.year} month={filter.month} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AnalyticsPage;
