import React, { useState, useEffect } from 'react';
import UserList from './UserList';
import { Col, Container, Row } from 'react-bootstrap';

const UserFollowers = ({ userId }) => {
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    const fetchFollowers = async () => {
      const response = await fetch(`/api/users/${userId}/followers`);
      const data = await response.json();
      setFollowers(data);
    };
  
    fetchFollowers();
  }, [userId]);

  return (
    <Container fluid>
      <Row>
        <Col md={{ span: 4, offset: 5 }}>
          <div className="user-container">
            <h2>Following:</h2>
            <div className="user-scroll">
              <UserList users={followers} />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default UserFollowers;

