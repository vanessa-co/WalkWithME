import React from 'react';
import './style.css';

const UserList = ({
  users,
  onFollow,
  onUnfollow,
  title,
  followerList,
  onFollowChange,
}) => {
  const handleFollowClick = (followedUserId) => {
    onFollow(followedUserId);
    onFollowChange((prev) => prev + 1);
  };

  const handleUnfollowClick = (followedUserId) => {
    onUnfollow(followedUserId);
    onFollowChange((prev) => prev + 1);
  };

  return (
    <div className="user-list-container">
      <h3>{title}</h3>
      <ul className="user-list">
        {users?.map((user) => (
          <li key={user.id}>
            <div className="profile-container">
            <img
                className="profile-photo"
                src={
                  user.follower?.profile_photo ||
                  user.follower?.default_profile_photo ||
                  'https://static.vecteezy.com/system/resources/previews/002/318/271/original/user-profile-icon-free-vector.jpg'
                }
                alt={`${user.follower?.username || user.followed?.username}'s profile`}
              />
            </div>
            <div className="username-container">
              {followerList
                ? user.follower_username || user.followed_username
                : user.username}
            </div>
            <div className="follow-actions">
              {user.followed ? (
                <button
                  className="unfollow-button"
                  onClick={() => handleUnfollowClick(user.id)}
                >
                  Unfollow
                </button>
              ) : (
                <button
                  className="follow-button"
                  onClick={() => handleFollowClick(user.id)}
                >
                  Follow
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;






