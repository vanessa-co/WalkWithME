import React, { useState, useEffect } from 'react';
import UserList from './UserList';
import { Col, Container, Row } from 'react-bootstrap';

const UserAddFollow = ({ userId, onFollowChange }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    const fetchAllUsers = async () => {
      const response = await fetch('/api/users');
      const data = await response.json();
      const usersWithFollowerKey = data.map(user => ({ ...user, follower: user }));
      setAllUsers(usersWithFollowerKey);
    };

    fetchAllUsers();
  }, [userId, refreshCounter]);

  const handleFollow = async (followUserId) => {
    const response = await fetch(`/api/users/${userId}/follow/${followUserId}`, { method: 'POST' });
    const data = await response.json();
    if (response.ok) {
      setAllUsers(
        allUsers.map((user) =>
          user.id === followUserId
            ? { ...user, followed: true }
            : user
        )
      );
      onFollowChange((prev) => prev + 1);
    }
  };

  const handleUnfollow = async (unfollowUserId) => {
    const response = await fetch(`/api/users/${userId}/unfollow/${unfollowUserId}`, { method: 'POST' });
    const data = await response.json();
    if (response.ok) {
      setAllUsers(
        allUsers.map((user) =>
          user.id === unfollowUserId
            ? { ...user, followed: false }
            : user
        )
      );
      onFollowChange((prev) => prev + 1);
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col md={{ span: 4, offset: 5 }}>
          <div className="user-container">
            <h2>All Users:</h2>
            <div className="user-scroll">
              <UserList
                users={allUsers}
                onFollow={handleFollow}
                onUnfollow={handleUnfollow}
                title=""
                onFollowChange={setRefreshCounter}
              />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default UserAddFollow;
