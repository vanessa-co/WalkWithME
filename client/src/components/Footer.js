import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import './style.css';

const Footer = () => {
  return (
    <footer className="bg-lightgray py-3">
      <Container>
        <Row className="text-dark align-items-center">
          <Col md="3">
            <h4 className="font-weight-bold mb-3">About Us</h4>
            <p>
              Walk With Me is a community-driven platform where users can share their walking adventures
              with others. Our mission is to inspire people to explore the world on foot and promote healthy 
              living for all.
            </p>
          </Col>
          <Col md="3">
            <h4 className="font-weight-bold mb-3">Our Address</h4>
            <p>
              Walk With Me Inc.<br />
              1234 Adventure Street<br />
              Hiking City, HC 56789<br />
              United States
            </p>
          </Col>
          <Col md="3">
            <h4 className="font-weight-bold mb-3">Contact Us</h4>
            <p>
              <a href="mailto:info@walkwithme.com">info@walkwithme.com</a><br />
              <a href="tel:+1234567890">+1 (234) 567-890</a>
            </p>
          </Col>
          <Col md="3">
            <h4 className="font-weight-bold mb-3">Follow Us</h4>
            <div className="social-icons">
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
              <a href="https://www.twitter.com/" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
            </div>
          </Col>
        </Row>
        <hr className="bg-secondary my-3" />
        <Row>
          <Col className="text-center text-dark">
            <p className="font-weight-bold mb-0">&copy; 2023 Walk With Me. All Rights Reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;


