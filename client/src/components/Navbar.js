// import React, { useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { AuthContext } from '../contexts/AuthContext';
// import { toast } from 'react-toastify';
// import CustomToast from './CustomToast';
// import { Navbar as BootstrapNavbar, Nav, Button } from 'react-bootstrap';

// function Navbar() {
//   const { user, setUser } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     const response = await fetch('/logout', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ user }),
//     });

//     if (response.ok) {
//       setUser(null);
//       localStorage.removeItem('user'); // Remove user from local storage
//       navigate('/');
//       toast(<CustomToast message="You have successfully logged out!" imageSrc="/path/to/your/image.png" />);
//     } else {
//       // Handle logout error
//     }
//   };

//   return (
//     <BootstrapNavbar bg="light" expand="lg">
//       <BootstrapNavbar.Brand as={Link} to="/">
//         Home
//       </BootstrapNavbar.Brand>
//       <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
//       <BootstrapNavbar.Collapse id="basic-navbar-nav">
//         <Nav className="me-auto">
//           {user && <Nav.Link as={Link} to="/walks">Walks</Nav.Link>}
//           {user && <Nav.Link as={Link} to="/reviews">Reviews</Nav.Link>}
//           {user && <Nav.Link as={Link} to={`/profile/${user._id}`}>Profile</Nav.Link>}
//         </Nav>
//         <Nav className="ms-auto">
//           {user ? (
//             <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
//           ) : (
//             <Nav.Link as={Link} to="/auth">Login / Signup</Nav.Link>
//           )}
//         </Nav>
//       </BootstrapNavbar.Collapse>
//     </BootstrapNavbar>
//   );
// }

// export default Navbar;





import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import CustomToast from './CustomToast';
import { Navbar as BootstrapNavbar, Nav, Button } from 'react-bootstrap';

function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const response = await fetch('/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user }),
    });

    if (response.ok) {
      setUser(null);
      localStorage.removeItem('user'); // Remove user from local storage
      navigate('/');
      toast(<CustomToast message="You have successfully logged out!" imageSrc="/path/to/your/image.png" />);
    } else {
      // Handle logout error
    }
  };

  return (
    <BootstrapNavbar bg="light" expand="lg">
      <BootstrapNavbar.Brand as={Link} to="/">
        Home
      </BootstrapNavbar.Brand>
      <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
      <BootstrapNavbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          {user && <Nav.Link as={Link} to="/walks">Walks</Nav.Link>}
          {user && <Nav.Link as={Link} to="/reviews">Reviews</Nav.Link>}
          {user && <Nav.Link as={Link} to={`/profile/${user._id}`}>Profile</Nav.Link>}
        </Nav>
        <Nav className="ms-auto">
          {user ? (
            <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
          ) : (
            <Nav.Link as={Link} to="/auth">Login / Signup</Nav.Link>
          )}
        </Nav>
      </BootstrapNavbar.Collapse>
    </BootstrapNavbar>
  );
}

export default Navbar;










