import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import axios from 'axios';

export default function SearchDropdown() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({
    transactions: [],
    accounts: [],
    categories: [],
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const timeoutRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults({ transactions: [], accounts: [], categories: [] });
      setShowDropdown(false);
      return;
    }

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const token = localStorage.getItem('token');
      axios
        .get(`http://localhost:5500/api/search?query=${query}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setResults(res.data);
          setShowDropdown(true);
        })
        .catch((err) => console.error('Search failed', err));
    }, 300);
  }, [query]);

  const handleSelect = (item, type) => {
    setShowDropdown(false);
    setQuery('');
    if (type === 'transaction') navigate(`/transaction?highlight=${item._id}`);
    else if (type === 'account') navigate(`/accounts?highlight=${item._id}`);
    else if (type === 'category')
      navigate(`/transaction?category=${encodeURIComponent(item)}`);
  };

  return (
    <div className='relative w-full max-w-md'>
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
        <input
          type='text'
          placeholder='Search transactions, accounts, categories...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>

      {showDropdown && (
        <div className='absolute z-30 mt-1 w-full bg-white border rounded-md shadow-lg max-h-80 overflow-y-auto'>
          {results.accounts.length > 0 && (
            <div className='p-2'>
              <div className='text-xs text-gray-500 mb-1'>Accounts</div>
              {results.accounts.map((a) => (
                <div
                  key={a._id}
                  onClick={() => handleSelect(a, 'account')}
                  className='cursor-pointer px-3 py-2 hover:bg-gray-100 text-sm'
                >
                  {a.name} ({a.provider})
                </div>
              ))}
            </div>
          )}

          {results.transactions.length > 0 && (
            <div className='p-2'>
              <div className='text-xs text-gray-500 mb-1'>Transactions</div>
              {results.transactions.map((t) => (
                <div
                  key={t._id}
                  onClick={() => handleSelect(t, 'transaction')}
                  className='cursor-pointer px-3 py-2 hover:bg-gray-100 text-sm'
                >
                  {t.description} – ${t.amount}
                </div>
              ))}
            </div>
          )}

          {results.categories.length > 0 && (
            <div className='p-2'>
              <div className='text-xs text-gray-500 mb-1'>Categories</div>
              {results.categories.map((c, i) => (
                <div
                  key={i}
                  onClick={() => handleSelect(c, 'category')}
                  className='cursor-pointer px-3 py-2 hover:bg-gray-100 text-sm'
                >
                  {c}
                </div>
              ))}
            </div>
          )}

          {results.accounts.length === 0 &&
            results.transactions.length === 0 &&
            results.categories.length === 0 && (
              <div className='px-4 py-3 text-sm text-gray-500 text-center'>
                No results found
              </div>
            )}
        </div>
      )}
    </div>
  );
}
