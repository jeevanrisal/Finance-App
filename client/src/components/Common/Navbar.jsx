import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, Menu } from 'lucide-react';
import logo from '../../assets/logo.svg';
import SearchDropdown from './SearchDropdown';

const Navbar = ({ isSidebarOpen, toggleSidebar }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); // or navigate('/') depending on your route setup
  };

  return (
    <header className='bg-white shadow-sm py-3 px-6 flex items-center justify-between sticky top-0 z-10'>
      <div className='flex items-center space-x-4'>
        <button
          onClick={toggleSidebar}
          className='p-1 rounded-md hover:bg-gray-100 lg:hidden'
        >
          <Menu className='h-5 w-5 text-gray-600' />
        </button>
        <img src={logo} alt='Finance Dashboard' className='h-8' />
      </div>

      <div className='hidden md:flex flex-1 max-w-md mx-4'>
        <SearchDropdown />
      </div>

      <div className='flex items-center space-x-4'>
        <div className='relative'>
          <Bell className='h-5 w-5 text-gray-600 cursor-pointer hover:text-gray-800' />
          <span className='absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500'></span>
        </div>

        <div className='relative'>
          <div
            className='flex items-center space-x-2 cursor-pointer'
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div className='h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium'>
              JD
            </div>
            <ChevronDown
              className={`h-4 w-4 text-gray-600 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
            />
          </div>

          {isProfileOpen && (
            <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20'>
              <a
                href='/profile'
                className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
              >
                Profile
              </a>

              <button
                onClick={handleLogout}
                className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
