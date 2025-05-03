// src/components/Budget/BudgetOverviewCard.jsx
import React from 'react';

export default function BudgetOverviewCard({ budgets, expensesByCategory }) {
  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => {
    const spent = expensesByCategory[b.category] || 0;
    return sum + spent;
  }, 0);

  const percentageUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const isOver = totalSpent > totalBudget;

  return (
    <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
      <h3 className='text-lg font-semibold text-gray-800 mb-4'>
        Monthly Budget Overview
      </h3>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <div>
          <p className='text-sm text-gray-500'>Total Budget</p>
          <p className='text-xl font-bold text-gray-800'>
            ${totalBudget.toFixed(2)}
          </p>
        </div>
        <div>
          <p className='text-sm text-gray-500'>Total Spent</p>
          <p
            className={`text-xl font-bold ${isOver ? 'text-red-600' : 'text-gray-800'}`}
          >
            ${totalSpent.toFixed(2)}
          </p>
        </div>
        <div className='w-full md:w-1/3'>
          <p className='text-sm text-gray-500 mb-1'>Used</p>
          <div className='h-4 w-full bg-gray-200 rounded-full overflow-hidden'>
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isOver ? 'bg-red-500' : 'bg-blue-600'
              }`}
              style={{ width: `${Math.min(percentageUsed, 100)}%` }}
            />
          </div>
          <p className='text-sm text-gray-600 mt-1'>
            {percentageUsed.toFixed(0)}% used
          </p>
        </div>
      </div>
    </div>
  );
}
