import React, { useState, useEffect } from 'react';
import UserList from './UserList';

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
    <div>
      <h2>Followers:</h2>
      <UserList users={followers} />
    </div>
  );
};

export default UserFollowers;

