import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import './style.css';

const Header = () => {
  return (
    <Navbar expand="lg" className="bg-lightgray border-bottom border-3 border-primary">
      <Container>
        <Navbar.Brand href="#" className="fw-bold text-center mx-auto text-dark" style={{ fontFamily: "Poppins, sans-serif", fontSize: "2rem" }}>...</Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default Header;
