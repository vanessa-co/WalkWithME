import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './style.css';

const Footer = () => {
  return (
    <footer className="bg-lightgray py-3">
      <Container>
        <Row className="text-dark align-items-center">
          <Col md="6">
            {/* <h4 className="font-weight-bold mb-3">About Us</h4> */}
            {/* <p>
              Walk With Me is a community-driven platform where users can share their walking adventures
              with others. Our mission is to inspire people to explore the world on foot and promote healthy 
              living for all.
            </p> */}
          </Col>
          <Col md="6">
            <h4 className="font-weight-bold mb-3"></h4>
            <ul className="list-unstyled mb-0">
              <li><i className=""></i></li>
            </ul>
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





