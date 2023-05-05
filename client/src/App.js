import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Walks from './components/Walks';
import Reviews from './components/Reviews';
import Auth from './components/Auth';
import AboutUs from './components/AboutUs';
import UserFollowers from './components/UserFollowers';
import UserFollowed from './components/UserFollowed';
import Header from './components/Header';
import Footer from './components/Footer';
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
            <Header/>
            <MainRoutes />
            <Footer/>
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
      <Route path="/AboutUs" element={<AboutUs />} />
      <Route path="/followers" element={<UserFollowers />} />
      <Route path="/followed" element={<UserFollowed />} />
      {!user && <Route path="/auth" element={<Auth />} />}
    </Routes>
  );
}

export default App;





