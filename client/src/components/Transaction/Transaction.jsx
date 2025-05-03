import Navbar from '../Common/Navbar';
import Sidebar from '../Common/Sidebar';
import TransactionsTable from './TransactionsTable';
import { useNavigate } from 'react-router-dom';

export default function Transaction({
  activeTab,
  setActiveTab,
  isSidebarOpen,
  setIsSidebarOpen,
}) {
  const navigate = useNavigate();

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

            // ... other tabs ...
          }}
          isOpen={isSidebarOpen}
        />

        <main className='flex-1 p-6 overflow-auto'>
          <TransactionsTable isCompactView={false} />
        </main>
      </div>
    </div>
  );
}
