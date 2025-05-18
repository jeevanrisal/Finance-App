// src/components/Common/UploadStatement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function UploadStatement({ onSuccess }) {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:5500/api/accounts', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) =>
        setAccounts(Array.isArray(res.data) ? res.data : res.data.accounts)
      )
      .catch(() => setMessage('Could not fetch accounts.'));
  }, []);

  const handleUpload = async () => {
    if (!selectedAccount || !file) {
      setMessage('Please select an account and a PDF file.');
      return;
    }
    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('accountId', selectedAccount);
    formData.append('statement', file);

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        'http://localhost:5500/api/upload/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(data.message);
      onSuccess?.();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      <h2 className='text-lg font-semibold'>Upload Bank Statement</h2>
      {message && <p className='text-red-600'>{message}</p>}
      <div>
        <label className='block mb-1 font-medium'>Account</label>
        <select
          className='w-full border rounded p-2'
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
        >
          <option value=''>-- select account --</option>
          {accounts.map((acc) => (
            <option key={acc._id} value={acc._id}>
              {acc.name} ({acc.accountNumber})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className='block mb-1 font-medium'>Statement PDF</label>
        <input
          type='file'
          accept='application/pdf'
          className='w-full'
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>
      <div className='flex justify-end'>
        <button
          type='button'
          onClick={handleUpload}
          disabled={loading}
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50'
        >
          {loading ? 'Uploading...' : 'Upload Statement'}
        </button>
      </div>
    </div>
  );
}
