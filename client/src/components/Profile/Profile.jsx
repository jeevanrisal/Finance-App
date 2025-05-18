import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Common/Navbar';
import Sidebar from '../Common/Sidebar';
import ProfileDetails from './ProfileDetails';

export default function Profile({
  activeTab,
  setActiveTab,
  isSidebarOpen,
  setIsSidebarOpen,
}) {
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
          }}
          isOpen={isSidebarOpen}
        />

        <main className='flex-1 p-6 overflow-auto'>
          <ProfileDetails />
        </main>
      </div>
    </div>
  );
}
