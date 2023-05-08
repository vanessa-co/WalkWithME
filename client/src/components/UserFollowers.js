import React, { useState, useEffect } from 'react';
import { Tab } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import UserList from './UserList';
import './style.css';

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

  const panes = [
    {
      menuItem: 'Following',
      render: () => (
        <Tab.Pane>
          <div className="scroll-container">
            <UserList
              users={followers}
              followerList
              isNewUser={false}
              onFollow={(followUserId) => {
                handleFollow(followUserId);
                setFollowing((prevFollowing) => [...prevFollowing, { followed_username: followUserId }]);
              }}
              onUnfollow={handleUnfollow}
            />
          </div>
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Followers',
      render: () => (
        <Tab.Pane>
          <div className="scroll-container">
            <UserList
              users={following}
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
        </Tab.Pane>
      ),
    },
  ];

  return <Tab panes={panes} />;
};

export default UserFollowers;






