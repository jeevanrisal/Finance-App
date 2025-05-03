import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    passwordMatch: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updatedFormData = {
        ...prev,
        [name]: value,
      };

      // Real-time password match checking
      if (name === 'password' || name === 'confirmPassword') {
        setErrors({
          passwordMatch:
            updatedFormData.password !== updatedFormData.confirmPassword,
        });
      }

      return updatedFormData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1) Password match check
    if (formData.password !== formData.confirmPassword) {
      setErrors({ passwordMatch: true });
      return;
    }
    setErrors({}); // clear any previous errors

    try {
      // 2) Try signing up
      const response = await fetch('http://localhost:5500/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // 3a) Signup failed: show server message
        alert(data.message || 'Signup failed');
        return;
      }

      // 3b) Signup succeeded—see if we got a token back
      let token = data.token;
      if (!token) {
        // 4) If signup doesn’t return a token, fall back to logging in
        const loginRes = await fetch('http://localhost:5500/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const loginData = await loginRes.json();
        if (!loginRes.ok) {
          alert(loginData.message || 'Login after signup failed');
          return;
        }
        token = loginData.token;
      }

      // 5) Store JWT & navigate
      localStorage.setItem('token', token);
      navigate('/onboarding');
    } catch (networkError) {
      console.error('Error connecting to server:', networkError);
      alert('Network error. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className='w-full max-w-md'
    >
      <div className='bg-white p-8 rounded-lg shadow-xl'>
        <div className='text-center mb-8'>
          <h2 className='text-3xl font-bold text-gray-800'>Create Account</h2>
          <p className='text-gray-600 mt-2'>Join us today</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Full Name
            </label>
            <input
              type='text'
              id='name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200'
              placeholder='John Doe'
              required
            />
          </div>

          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Email Address
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200'
              placeholder='you@example.com'
              required
            />
          </div>

          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Phone
            </label>
            <input
              type='phone'
              id='phone'
              name='phone'
              value={formData.phone}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200'
              placeholder='0400 000 000'
              required
            />
          </div>

          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Password
            </label>
            <input
              type='password'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200'
              placeholder='••••••••'
              minLength='8'
              required
            />
          </div>

          <div>
            <label
              htmlFor='confirmPassword'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Confirm Password
            </label>
            <input
              type='password'
              id='confirmPassword'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${errors.passwordMatch ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
              placeholder='••••••••'
              required
            />
            {errors.passwordMatch && (
              <p className='mt-1 text-sm text-red-600'>Passwords don't match</p>
            )}
          </div>

          <button
            type='submit'
            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 transform hover:scale-105'
          >
            Create Account
          </button>
        </form>

        <div className='mt-6 text-center'>
          <p className='text-sm text-gray-600'>
            Already have an account?{' '}
            <Link
              to='/login'
              className='text-blue-600 font-medium hover:underline'
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Signup;
