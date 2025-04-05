// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/UserAuth/Login';
import Signup from './Components/UserAuth/Signup';
import Dashboard from './Components/UserAuth/SignupProgress'; // Add this if you have it

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
