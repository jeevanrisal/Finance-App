// src/components/Budget/CategoryBudgetCard.jsx
import React from 'react';

export default function CategoryBudgetCard({ budget, spent }) {
  const percentUsed = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
  const isOver = spent > budget.amount;

  const progressColor = isOver
    ? 'bg-red-500'
    : percentUsed > 75
      ? 'bg-yellow-500'
      : 'bg-green-500';

  return (
    <div className='bg-white p-4 rounded-xl shadow-sm border border-gray-100'>
      <div className='flex justify-between items-center mb-2'>
        <h4 className='text-md font-semibold text-gray-700'>
          {budget.category}
        </h4>
        <span
          className={`text-sm font-medium ${
            isOver ? 'text-red-600' : 'text-gray-600'
          }`}
        >
          ${spent.toFixed(2)} / ${budget.amount.toFixed(2)}
        </span>
      </div>

      <div className='h-3 w-full bg-gray-200 rounded-full overflow-hidden'>
        <div
          className={`h-full transition-all duration-300 ${progressColor}`}
          style={{ width: `${Math.min(percentUsed, 100)}%` }}
        />
      </div>

      {isOver && (
        <p className='text-xs text-red-500 mt-2'>
          Over budget by ${(spent - budget.amount).toFixed(2)}
        </p>
      )}
    </div>
  );
}
