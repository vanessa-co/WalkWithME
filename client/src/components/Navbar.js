import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import CustomToast from './CustomToast';

function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const response = await fetch('http://127.0.0.1:5555/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user }),
    });

    if (response.ok) {
      setUser(null);
      navigate('/');
      toast(<CustomToast message="You have successfully logged out!" imageSrc="/path/to/your/image.png" />);
    } else {
      // Handle logout error
    }
  };

  return (
    <nav>
      {user && <Link to="/">Home</Link>}
      {user && <Link to="/walks">Walks</Link>}
      {user && <Link to="/reviews">Reviews</Link>}
      {user ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <Link to="/auth">Login / Signup</Link>
      )}
    </nav>
  );
}

export default Navbar;














