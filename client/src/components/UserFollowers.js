import React, { useState, useEffect } from 'react';
import UserList from './UserList';

const UserFollowers = ({ userId }) => {
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    const fetchFollowers = async () => {
      setFollowers([
        {
          id: 1,
          username: 'Eliut',
          profile_photo: 'https://randomuser.me/api/portraits/men/1.jpg'
        },
        {
          id: 2,
          username: 'Ana',
          profile_photo: 'https://randomuser.me/api/portraits/women/2.jpg'
        },
        {
          id: 3,
          username: 'Rui',
          profile_photo: 'https://randomuser.me/api/portraits/men/3.jpg'
        }
      ]);
    };
  
    fetchFollowers();
  }, []);
  
  const followedIds = new Set(followers.map((follower) => follower.id));

  const handleFollow = (followedId) => {
    fetch(`/api/users/${userId}/follow/${followedId}`, {
      method: 'POST',
    })
      .then((response) => response.json())
      .then((data) => {
        setFollowers(data.followers);
      });
  };

  const handleUnfollow = (followedId) => {
    fetch(`/api/users/${userId}/unfollow/${followedId}`, {
      method: 'POST',
    })
      .then((response) => response.json())
      .then((data) => {
        setFollowers(data.followers);
      });
  };

  return (
    <div>
      <h2>Followers:</h2>
      <UserList users={followers} followedIds={followedIds} onFollow={handleFollow} onUnfollow={handleUnfollow} />
    </div>
  );
};

export default UserFollowers;


