import React, { useState, useEffect } from 'react';
import UserList from './UserList';
import { Col, Container, Row } from 'react-bootstrap';

const UserAddFollow = ({ userId }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      const response = await fetch('/api/users');
      const data = await response.json();
      const usersWithFollowerKey = data.map(user => ({ ...user, follower: user }));
      setAllUsers(usersWithFollowerKey);
    };


  
    fetchAllUsers();

  }, [userId]);

  const handleFollow = async (followUserId) => {
    const response = await fetch(`/api/users/${followUserId}/follow`, { method: 'POST' });
    const data = await response.json();
    setFollowers([...followers, data]);
  };

  const handleUnfollow = async (unfollowUserId) => {
    const response = await fetch(`/api/users/${unfollowUserId}/unfollow`, { method: 'POST' });
    const data = await response.json();
    setFollowers(followers.filter(follower => follower.id !== data.id));
  };

  return (
    <Container fluid>
      <Row>
        <Col md={{ span: 4, offset: 5 }}>
          <div className="user-container">
            <h2>All Users:</h2>
            <div className="user-scroll">
              <UserList users={allUsers} onFollow={handleFollow} title="" />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default UserAddFollow;

