import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthLayout = () => {
  return (
    <div className='min-h-screen flex flex-col md:flex-row bg-gray-50'>
      {/* Left Side - Background Image */}
      <div className='hidden md:block md:w-1/2 relative overflow-hidden'>
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className='absolute inset-0 bg-black/40'
        >
          <img
            src='https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80'
            alt='Finance background'
            className='w-full h-full object-cover'
          />
        </motion.div>
        <div className='absolute inset-0 flex items-center justify-center p-12'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className='text-white'
          >
            <h1 className='text-4xl font-bold mb-4'>Welcome to FinancePro</h1>
            <p className='text-xl'>Your personal finance management solution</p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form Content */}
      <div className='w-full md:w-1/2 flex items-center justify-center p-4 md:p-8'>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
