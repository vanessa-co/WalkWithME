import React, { useState, useEffect } from 'react';
import UserList from './UserList';

const UserFollowers = ({ userId, forceUpdate, handleFollow, handleUnfollow }) => {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const fetchFollowers = async () => {
      const response = await fetch(`/api/users/${userId}/followers`);
      const data = await response.json();
      setFollowers(data);
    };

    fetchFollowers();
  }, [userId, forceUpdate]);

  useEffect(() => {
    const fetchFollowing = async () => {
      const response = await fetch(`/api/users/${userId}/followed`);
      const data = await response.json();
      setFollowing(data);
    };

    fetchFollowing();
  }, [userId, forceUpdate]);
  return (
    <div>
      <h2>Followers:</h2>
      <UserList
        users={followers}
        title="Your followers"
        followerList
        isNewUser={false}
        onFollow={(followUserId) => {
          handleFollow(followUserId);
          setFollowing((prevFollowing) => [...prevFollowing, { followed_username: followUserId }]);
        }}
        onUnfollow={handleUnfollow}
      />
      <h2>Following:</h2>
      <UserList
        users={following}
        title="People you're following"
        followerList
        isNewUser={false}
        onFollow={(followUserId) => {
          handleFollow(followUserId);
          setFollowing((prevFollowing) => [...prevFollowing, { followed_username: followUserId }]);
        }}
        onUnfollow={(unfollowUserId) => {
          handleUnfollow(unfollowUserId);
          setFollowing((prevFollowing) =>
            prevFollowing.filter((user) => user.followed_username !== unfollowUserId)
          );
        }}
      />
    </div>
  );
};

export default UserFollowers;

