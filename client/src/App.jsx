// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/UserAuth/Login';
import Signup from './Components/UserAuth/Signup';
import Dashboard from './Components/Onboarding/UserOnboardingFlow'; // Add this if you have it
import UserOnboardingFlow from './Components/Onboarding/UserOnboardingFlow';
import './App.css';

const App = () => {
  return (
    <>
      <UserOnboardingFlow />
    </>
    // <Router>
    //   <Routes>
    //     <Route path='/' element={<Login />} />
    //     <Route path='/signup' element={<Signup />} />
    //     <Route path='/dashboard' element={<Dashboard />} />
    //   </Routes>
    // </Router>
  );
};

export default App;
