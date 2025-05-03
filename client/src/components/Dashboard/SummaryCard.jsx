import {
  ArrowUp,
  ArrowDown,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PiggyBank,
} from 'lucide-react';

const iconMap = {
  balance: <DollarSign className='h-5 w-5' />,
  income: <TrendingUp className='h-5 w-5' />,
  expenses: <TrendingDown className='h-5 w-5' />,
  savings: <PiggyBank className='h-5 w-5' />,
};

const SummaryCard = ({ title, amount, change, type, isPositive }) => {
  return (
    <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
      <div className='flex justify-between items-start'>
        <div>
          <p className='text-sm font-medium text-gray-500'>{title}</p>
          <h3 className='text-2xl font-semibold text-gray-800 mt-1'>
            ${amount}
          </h3>
        </div>
        <div
          className={`p-2 rounded-lg ${isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
        >
          {iconMap[type]}
        </div>
      </div>

      <div
        className={`flex items-center mt-4 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}
      >
        {isPositive ? (
          <ArrowUp className='h-4 w-4 mr-1' />
        ) : (
          <ArrowDown className='h-4 w-4 mr-1' />
        )}
        <span>{change}</span>
        <span className='text-gray-500 ml-1'>vs last month</span>
      </div>
    </div>
  );
};

export default SummaryCard;
