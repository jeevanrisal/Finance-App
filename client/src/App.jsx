import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AccountsPage from './components/Accounts/Account';
import AuthLayout from './components/Auth/AuthLayout';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import Onboarding from './components/UserOnboard/Onboarding';
import { useState } from 'react';
import Transaction from './components/Transaction/Transaction';
import Budget from './components/Budget/BudgetPlanningPage';
import Analytics from './components/Analytics/AnalyticsPage';
import Profile from './components/Profile/Profile';

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <Router>
      <Routes>
        <Route path='/' element={<AuthLayout />}>
          <Route index element={<Login />} />
          <Route path='login' element={<Login />} />
          <Route path='signup' element={<Signup />} />
        </Route>
        <Route
          path='dashboard'
          element={
            <Dashboard
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          }
        />
        <Route path='onboarding' element={<Onboarding />} />
        <Route
          path='accounts'
          element={
            <AccountsPage
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          }
        />
        <Route
          path='transaction'
          element={
            <Transaction
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          }
        />
        <Route
          path='budget'
          element={
            <Budget
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          }
        />
        <Route
          path='analytics'
          element={
            <Analytics
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          }
        />
        <Route
          path='profile'
          element={
            <Profile
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
