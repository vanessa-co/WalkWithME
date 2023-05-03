import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Walks from './components/Walks';
import Reviews from './components/Reviews';
import Auth from './components/Auth';
import Profile from './components/Profile';
import UserFollowers from './components/UserFollowers';
import { AuthContext, AuthContextProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import { ReviewsContextProvider } from "./contexts/ReviewsContext";
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <AuthContextProvider>
      <ReviewsContextProvider>
          <Router>
            <Navbar />
            <MainRoutes />
          </Router>
          <ToastContainer />
      </ReviewsContextProvider>
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
      <Route path="/profile/:userId" element={<Profile />} />
      <Route path="/followers" element={<UserFollowers />} />
      {!user && <Route path="/auth" element={<Auth />} />}
    </Routes>
  );
}

export default App;





