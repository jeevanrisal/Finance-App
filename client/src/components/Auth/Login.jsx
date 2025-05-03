import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({ server: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ server: '' });
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5500/api/users/login', {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        setErrors({ server: data.message || 'Login failed' });
        setLoading(false);
        return;
      }

      const { token } = data;
      if (!token) {
        setErrors({ server: 'No token returned from server' });
        setLoading(false);
        return;
      }

      // Store JWT and redirect
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Network error:', err);
      setErrors({ server: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className='w-full max-w-md mx-auto'
    >
      <div className='bg-white p-8 rounded-lg shadow-xl'>
        <h2 className='text-3xl font-bold text-gray-800 text-center'>
          Welcome Back
        </h2>
        {errors.server && (
          <p className='mt-4 text-center text-red-600'>{errors.server}</p>
        )}

        <form onSubmit={handleSubmit} className='space-y-6 mt-4'>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'
            >
              Email Address
            </label>
            <input
              id='email'
              name='email'
              type='email'
              value={formData.email}
              onChange={handleChange}
              required
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700'
            >
              Password
            </label>
            <input
              id='password'
              name='password'
              type='password'
              value={formData.password}
              onChange={handleChange}
              required
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
            />
            <div className='text-right mt-2'>
              <Link
                to='/forgot-password'
                className='text-sm text-blue-600 hover:underline'
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type='submit'
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-transform transform hover:scale-105 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className='mt-6 text-center text-sm text-gray-600'>
          Don’t have an account?{' '}
          <Link to='/signup' className='text-blue-600 hover:underline'>
            Sign Up
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
