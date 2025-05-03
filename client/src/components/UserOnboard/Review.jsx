import React from 'react';

const Review = ({ formData, prevStep, submitForm }) => {
  const calculateTotals = () => {
    const totals = {
      bankAccounts: 0,
      creditCards: 0,
      financialWallets: 0,
      assets: 0,
      liabilities: 0,
      monthlyRepayments: 0,
    };

    formData.bankAccounts.forEach((account) => {
      totals.bankAccounts += parseFloat(account.currentBalance) || 0;
    });

    formData.creditCards.forEach((card) => {
      totals.creditCards += parseFloat(card.usedBalance) || 0;
    });

    formData.financialWallets.forEach((wallet) => {
      totals.financialWallets += parseFloat(wallet.currentBalance) || 0;
    });

    formData.assets.forEach((asset) => {
      totals.assets += parseFloat(asset.currentValue) || 0;
    });

    formData.liabilities.forEach((liability) => {
      totals.liabilities += parseFloat(liability.outstandingBalance) || 0;
      totals.monthlyRepayments += parseFloat(liability.monthlyRepayment) || 0;
    });

    return totals;
  };

  const totals = calculateTotals();

  return (
    <div>
      <h3 className='text-lg font-medium text-gray-900 mb-6'>
        Review Your Information
      </h3>

      <div className='space-y-8'>
        {/* Bank Accounts */}
        {formData.bankAccounts.length > 0 && (
          <div>
            <h4 className='text-md font-medium text-gray-900 mb-4'>
              Bank Accounts
            </h4>
            <div className='bg-gray-50 p-4 rounded-md'>
              <ul className='space-y-3'>
                {formData.bankAccounts.map((account, index) => (
                  <li key={index} className='flex justify-between items-center'>
                    <div>
                      <span className='font-medium'>{account.bankName}</span>
                      <p className='text-sm text-gray-500'>
                        {account.accountName} • BSB: {account.bsbNumber} •
                        Account: {account.accountNumber}
                      </p>
                    </div>
                    <span className='font-medium'>
                      ${account.currentBalance}
                    </span>
                  </li>
                ))}
              </ul>
              <div className='mt-4 pt-4 border-t border-gray-200 flex justify-between'>
                <span className='font-medium'>Total Bank Balance</span>
                <span className='font-bold'>
                  ${totals.bankAccounts.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Credit Cards */}
        {formData.creditCards.length > 0 && (
          <div>
            <h4 className='text-md font-medium text-gray-900 mb-4'>
              Credit Cards
            </h4>
            <div className='bg-gray-50 p-4 rounded-md'>
              <ul className='space-y-3'>
                {formData.creditCards.map((card, index) => (
                  <li key={index} className='flex justify-between items-center'>
                    <div>
                      <span className='font-medium'>{card.cardProvider}</span>
                      <p className='text-sm text-gray-500'>
                        **** **** **** {card.cardNumber.slice(-4)} • Exp:{' '}
                        {card.expiryDate}
                      </p>
                    </div>
                    <div className='text-right'>
                      <span className='font-medium block'>
                        ${card.usedBalance}
                      </span>
                      <span className='text-sm text-gray-500'>
                        of ${card.cardLimit}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className='mt-4 pt-4 border-t border-gray-200 flex justify-between'>
                <span className='font-medium'>Total Credit Card Debt</span>
                <span className='font-bold'>
                  ${totals.creditCards.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Financial Wallets */}
        {formData.financialWallets.length > 0 && (
          <div>
            <h4 className='text-md font-medium text-gray-900 mb-4'>
              Digital Wallets
            </h4>
            <div className='bg-gray-50 p-4 rounded-md'>
              <ul className='space-y-3'>
                {formData.financialWallets.map((wallet, index) => (
                  <li key={index} className='flex justify-between items-center'>
                    <div>
                      <span className='font-medium'>
                        {wallet.walletProvider}
                      </span>
                      <p className='text-sm text-gray-500'>{wallet.walletId}</p>
                    </div>
                    <span className='font-medium'>
                      ${wallet.currentBalance}
                    </span>
                  </li>
                ))}
              </ul>
              <div className='mt-4 pt-4 border-t border-gray-200 flex justify-between'>
                <span className='font-medium'>Total Wallet Balance</span>
                <span className='font-bold'>
                  ${totals.financialWallets.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Assets */}
        {formData.assets.length > 0 && (
          <div>
            <h4 className='text-md font-medium text-gray-900 mb-4'>Assets</h4>
            <div className='bg-gray-50 p-4 rounded-md'>
              <ul className='space-y-3'>
                {formData.assets.map((asset, index) => (
                  <li key={index} className='flex justify-between items-center'>
                    <div>
                      <span className='font-medium'>{asset.description}</span>
                      <p className='text-sm text-gray-500'>
                        {asset.assetType} • Purchased:{' '}
                        {new Date(asset.purchaseDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className='font-medium'>${asset.currentValue}</span>
                  </li>
                ))}
              </ul>
              <div className='mt-4 pt-4 border-t border-gray-200 flex justify-between'>
                <span className='font-medium'>Total Asset Value</span>
                <span className='font-bold'>${totals.assets.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Liabilities */}
        {formData.liabilities.length > 0 && (
          <div>
            <h4 className='text-md font-medium text-gray-900 mb-4'>
              Liabilities
            </h4>
            <div className='bg-gray-50 p-4 rounded-md'>
              <ul className='space-y-3'>
                {formData.liabilities.map((liability, index) => (
                  <li key={index} className='flex justify-between items-center'>
                    <div>
                      <span className='font-medium'>
                        {liability.liabilityType}
                      </span>
                      <p className='text-sm text-gray-500'>
                        {liability.institution} • ${liability.monthlyRepayment}
                        /month
                      </p>
                    </div>
                    <span className='font-medium'>
                      ${liability.outstandingBalance}
                    </span>
                  </li>
                ))}
              </ul>
              <div className='mt-4 pt-4 border-t border-gray-200'>
                <div className='flex justify-between mb-2'>
                  <span className='font-medium'>Total Debt</span>
                  <span className='font-bold'>
                    ${totals.liabilities.toFixed(2)}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='font-medium'>Total Monthly Repayments</span>
                  <span className='font-bold'>
                    ${totals.monthlyRepayments.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className='bg-blue-50 p-4 rounded-md'>
          <h4 className='text-md font-medium text-gray-900 mb-4'>
            Financial Summary
          </h4>
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span>Total Liquid Assets:</span>
              <span className='font-medium'>
                ${(totals.bankAccounts + totals.financialWallets).toFixed(2)}
              </span>
            </div>
            <div className='flex justify-between'>
              <span>Total Assets:</span>
              <span className='font-medium'>
                $
                {(
                  totals.bankAccounts +
                  totals.financialWallets +
                  totals.assets
                ).toFixed(2)}
              </span>
            </div>
            <div className='flex justify-between'>
              <span>Total Liabilities:</span>
              <span className='font-medium text-red-600'>
                ${totals.liabilities.toFixed(2)}
              </span>
            </div>
            <div className='pt-2 border-t border-blue-200 flex justify-between'>
              <span className='font-medium'>Net Worth:</span>
              <span
                className={`font-bold ${
                  totals.bankAccounts +
                    totals.financialWallets +
                    totals.assets -
                    totals.liabilities >=
                  0
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                $
                {(
                  totals.bankAccounts +
                  totals.financialWallets +
                  totals.assets -
                  totals.liabilities
                ).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-8 flex justify-between'>
        <button
          type='button'
          onClick={prevStep}
          className='inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        >
          Back
        </button>
        <button
          type='button'
          onClick={submitForm}
          className='ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
        >
          Complete Onboarding
        </button>
      </div>
    </div>
  );
};

export default Review;
