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
      <div className="user-list">
        <ul className="scroll-container">
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
                {user.followed || followerList ? (
                  <button
                    className={`ui button ${user.followed ? "unfollow-button" : "following-button primary"}`}
                    onClick={user.followed ? () => handleUnfollowClick(user.id) : () => handleFollowClick(user.id)}
                  >
                    {user.followed ? "Unfollow" : "Following"}
                  </button>
                ) : (
                  <button
                    className="ui button follow-button"
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
    </div>
  );
};

export default UserList;





