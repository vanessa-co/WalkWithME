
import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Walks from './components/Walks';
import Reviews from './components/Reviews';
import Auth from './components/Auth';
import { AuthContext, AuthContextProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Navbar />
        <MainRoutes />
      </Router>
      <ToastContainer />
    </AuthContextProvider>
  );
}

function MainRoutes() {
  const authContext = useContext(AuthContext);
  const { user } = authContext;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/walks" element={<Walks />} />
      <Route path="/reviews" element={<Reviews />} />
      {!user && <Route path="/auth" element={<Auth />} />}
    </Routes>
  );
}

export default App;







