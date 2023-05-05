import React, { useState, useEffect } from 'react';
import UserList from './UserList';
import { Col, Container, Row } from 'react-bootstrap';

const UserFollowers = ({ userId }) => {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const fetchFollowers = async () => {
      const response = await fetch(`/api/users/${userId}/followers`);
      const data = await response.json();
      setFollowers(data);
    };
  
    fetchFollowers();
  }, [userId]);

  useEffect(() => {
    const fetchFollowing = async () => {
      const response = await fetch(`/api/users/${userId}/followed`);
      const data = await response.json();
      setFollowing(data);
    };
  
    fetchFollowing();
  }, [userId]);

  return (
    <Container fluid>
      <Row>
        <Col md={{ span: 4, offset: 4 }}>
          <div className="user-container">
            <h2>Followers:</h2>
            <div className="user-scroll">
              <UserList users={followers} followerList={true} />
            </div>
          </div>
          <div className="user-container">
            <h2>Following:</h2>
            <div className="user-scroll">
              <UserList users={following} followerList={true} />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default UserFollowers;



// import React from 'react';

// function UserFollowers() {
//   return <div>coming soon...</div>;
// }

// export default UserFollowers;
