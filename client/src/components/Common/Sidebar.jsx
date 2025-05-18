// src/components/Sidebar.jsx
import {
  LayoutDashboard,
  CreditCard,
  PieChart,
  LineChart,
  FileText,
  ChevronLeft,
  Banknote,
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Transactions', icon: CreditCard },
  { name: 'Accounts', icon: Banknote },
  { name: 'Budget Planning', icon: PieChart },
  { name: 'Analytics', icon: LineChart },
];

const Sidebar = ({ activeTab, setActiveTab, isOpen }) => {
  return (
    <aside
      className={`bg-white shadow-md transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-0'} lg:w-64 overflow-hidden flex-shrink-0`}
    >
      <div className={`p-4 h-full ${isOpen ? 'block' : 'hidden'} lg:block`}>
        <div className='flex items-center justify-between mb-8'>
          <h2 className='text-xl font-semibold text-gray-800'>Finance</h2>
          <button className='p-1 rounded-md hover:bg-gray-100 hidden lg:block'>
            <ChevronLeft className='h-5 w-5 text-gray-600' />
          </button>
        </div>

        <nav>
          <ul className='space-y-2'>
            {menuItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === item.name ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <item.icon className='h-5 w-5' />
                  <span className='font-medium'>{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
