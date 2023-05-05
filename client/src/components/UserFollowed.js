import React, { useState, useEffect } from 'react';
import UserList from './UserList';
import { Col, Container, Row } from 'react-bootstrap';

const UserFollowed = ({ userId }) => {
  const [followed, setFollowed] = useState([]);

  useEffect(() => {
    const fetchFollowed = async () => {
      const response = await fetch(`/api/users/${userId}/followed`);
      const data = await response.json();
      setFollowed(data);
    };

    fetchFollowed();
  }, [userId]);

  return (
    <Container fluid>
      <Row>
        <Col md={{ span: 4, offset: 5 }}>
          <div className="user-container">
            <h2>Following:</h2>
            <div className="user-scroll">
              <UserList users={followed} />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default UserFollowed;

