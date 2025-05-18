import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ProfileDetails() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios
      .get('http://localhost:5500/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
        setForm({ name: res.data.name, phone: res.data.phone });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching profile:', err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setStatus('Saving...');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        'http://localhost:5500/api/users/profile',
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(res.data);
      setStatus('Profile updated successfully!');
    } catch (err) {
      console.error('Update error:', err);
      setStatus('Update failed');
    }
  };

  if (loading) return <div className='p-6'>Loading profile…</div>;
  if (!user) return <div className='p-6 text-red-600'>Profile not found.</div>;

  return (
    <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto mt-8'>
      <h2 className='text-xl font-semibold text-gray-800 mb-4'>User Profile</h2>
      <div className='space-y-4'>
        <div>
          <label className='block text-sm text-gray-600'>Full Name</label>
          <input
            type='text'
            name='name'
            value={form.name}
            onChange={handleChange}
            className='w-full border rounded p-2'
          />
        </div>
        <div>
          <label className='block text-sm text-gray-600'>
            Email (read-only)
          </label>
          <p className='text-gray-900 font-medium'>{user.email}</p>
        </div>
        <div>
          <label className='block text-sm text-gray-600'>Phone</label>
          <input
            type='text'
            name='phone'
            value={form.phone}
            onChange={handleChange}
            className='w-full border rounded p-2'
          />
        </div>
        <div>
          <label className='block text-sm text-gray-600'>Joined On</label>
          <p className='text-gray-900 font-medium'>
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className='mt-4 flex justify-end'>
          <button
            onClick={handleSave}
            className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
          >
            Save Changes
          </button>
        </div>
        {status && <p className='text-sm mt-2 text-gray-500'>{status}</p>}
      </div>
    </div>
  );
}
