import React from 'react';
import { Link } from 'react-router-dom';
import './style.css'; 

const UserList = ({ users, followedIds, onFollow }) => {
  return (
    <ul className="user-list">
      {users.map((user) => (
        <li key={user.id}>
          <div className="profile-container">
            <img className="profile-photo" src={user.profile_photo} alt={`${user.username}'s profile`} />
          </div>
          <div className="username-container">
            {user.username}
          </div>
          {followedIds.has(user.id) ? (
            <Link to={`/users/${user.id}`}><button>View profile</button></Link>
          ) : (
            <button onClick={() => onFollow(user.id)}>Follow</button>
          )}
        </li>
      ))}
    </ul>
  );
};

export default UserList;


