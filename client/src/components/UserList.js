import React from 'react';
import './style.css';

const UserList = ({ users, onFollow, onUnfollow }) => {
  return (
    <ul className="user-list">
      {users.map((user) => (
        <li key={user.id}>
          <div className="profile-container">
            <img
              className="profile-photo"
              src={user.profile_photo || user.default_profile_photo || 'https://static.vecteezy.com/system/resources/previews/002/318/271/original/user-profile-icon-free-vector.jpg'}
              alt={`${user.username}'s profile`}
            />
          </div>
          <div className="username-container">{user.username}</div>
          <div className="action-container">
            {user.followed ? (
              <button onClick={() => onUnfollow(user.id)}>Unfollow</button>
            ) : (
              <button onClick={() => onFollow(user.id)}>Follow</button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default UserList;
