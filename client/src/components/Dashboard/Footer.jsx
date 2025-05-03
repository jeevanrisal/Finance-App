import { Plus, ArrowUp, ArrowDown } from 'lucide-react';
import { transactions } from '../../data/transactions';

const TransactionsTable = () => {
  return (
    <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
      <div className='flex justify-between items-center mb-6'>
        <h3 className='font-medium text-gray-800'>Recent Transactions</h3>
        <button className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors'>
          <Plus className='h-4 w-4' />
          <span>Add Transaction</span>
        </button>
      </div>

      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                Transaction
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                Category
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                Date
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                Amount
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className='hover:bg-gray-50'>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center'>
                    <div
                      className={`p-2 rounded-lg mr-3 ${transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                    >
                      {transaction.type === 'income' ? (
                        <ArrowUp className='h-4 w-4' />
                      ) : (
                        <ArrowDown className='h-4 w-4' />
                      )}
                    </div>
                    <div>
                      <div className='font-medium text-gray-900'>
                        {transaction.name}
                      </div>
                      <div className='text-sm text-gray-500'>
                        {transaction.account}
                      </div>
                    </div>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${transaction.categoryColor}`}
                  >
                    {transaction.category}
                  </span>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {transaction.date}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-right font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}
                >
                  {transaction.type === 'income' ? '+' : '-'}$
                  {transaction.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsTable;
