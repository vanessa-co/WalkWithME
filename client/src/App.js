

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Walks from './components/Walks';
import Reviews from './components/Reviews';
import Login from './components/Login';
import Signup from './components/Signup';
import { AuthContextProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
//import './style.css';

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/walks" element={<Walks />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
      <ToastContainer />
    </AuthContextProvider>
  );
}

export default App;

