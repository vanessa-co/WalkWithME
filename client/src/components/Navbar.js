import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

// function Navbar() {
//   const { user, setUser } = useContext(AuthContext);

//   const handleLogout = () => {
//     setUser(null);
//   };

//   return (
//     <nav>
//       <Link to="/">Home</Link>
//       <Link to="/walks">Walks</Link>
//       <Link to="/reviews">Reviews</Link>
//       {user ? (
//         <button onClick={handleLogout}>Logout</button>
//       ) : (
//         <Link to="/login">Login</Link>
//       )}
//     </nav>
//   );
// }

// export default Navbar;

function Navbar() {
    const { user, setUser } = useContext(AuthContext);
  
    const handleLogout = async () => {
        const response = await fetch('http://127.0.0.1:5555/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user }),
        });
      
        if (response.ok) {
          setUser(null);
        } else {
          // Handle logout error
        }
      };
    return user ? (
      <nav>
        <Link to="/">Home</Link>
        <Link to="/walks">Walks</Link>
        <Link to="/reviews">Reviews</Link>
        {user ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    ) : null;
  }
  


export default Navbar;
