// src/pages/BudgetPlanningPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MonthYearPicker from '../Common/MonthYearPicker';
import BudgetOverviewCard from './BudgetOverviewCard';
import CategoryBudgetCard from './CategoryBudgetCard';
import AddBudgetForm from './AddBudgetForm';
import Navbar from '../Common/Navbar';
import Sidebar from '../Common/Sidebar';
import { useNavigate } from 'react-router-dom';

export default function BudgetPlanningPage({
  activeTab,
  setActiveTab,
  isSidebarOpen,
  setIsSidebarOpen,
}) {
  const navigate = useNavigate();

  const now = new Date();
  const [filter, setFilter] = useState({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  });
  const [budgets, setBudgets] = useState([]);
  const [expensesByCategory, setExpensesByCategory] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchBudgets = axios.get('http://localhost:5500/api/budgets', {
      headers: { Authorization: `Bearer ${token}` },
      params: filter,
    });

    const fetchSummary = axios.get(
      'http://localhost:5500/api/dashboard/summary',
      {
        headers: { Authorization: `Bearer ${token}` },
        params: filter,
      }
    );

    Promise.all([fetchBudgets, fetchSummary])
      .then(([budgetsRes, summaryRes]) => {
        setBudgets(budgetsRes.data);
        setExpensesByCategory(summaryRes.data.byCategory || {});
        setLoading(false);
      })
      .catch((err) => {
        console.error('Budget fetch error:', err);
        setLoading(false);
      });
  }, [filter]);

  const handleBudgetAdded = (updatedBudget) => {
    setBudgets((prev) => {
      const others = prev.filter(
        (b) =>
          !(
            b.category === updatedBudget.category &&
            b.month === updatedBudget.month &&
            b.year === updatedBudget.year
          )
      );
      return [...others, updatedBudget];
    });
  };

  if (loading) return <div className='p-6'>Loading budgets...</div>;

  return (
    <div className='flex flex-col min-h-screen bg-gray-50'>
      <Navbar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className='flex flex-1'>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            if (tab === 'Accounts') navigate('/accounts');
            else if (tab === 'Dashboard') navigate('/dashboard');
            else if (tab === 'Transactions') navigate('/transaction');
            else if (tab === 'Budget Planning') navigate('/budget');
            else if (tab === 'Analytics') navigate('/analytics');
            else if (tab === 'Report') navigate('/report');
          }}
          isOpen={isSidebarOpen}
        />
        <main className='flex-1 p-6 overflow-auto'>
          <div className='space-y-6'>
            <div className='flex justify-between items-center'>
              <h2 className='text-xl font-semibold text-gray-800'>
                Budget Planning
              </h2>
              <MonthYearPicker
                year={filter.year}
                month={filter.month}
                onChange={setFilter}
              />
            </div>

            <BudgetOverviewCard
              budgets={budgets}
              expensesByCategory={expensesByCategory}
            />

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {budgets.map((b) => (
                <CategoryBudgetCard
                  key={b._id}
                  budget={b}
                  spent={expensesByCategory[b.category] || 0}
                />
              ))}
            </div>

            <AddBudgetForm
              year={filter.year}
              month={filter.month}
              onAdded={handleBudgetAdded}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
