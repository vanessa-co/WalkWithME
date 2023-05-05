// import React, { useState, useEffect } from 'react';
// import UserList from './UserList';
// import { Col, Container, Row } from 'react-bootstrap';

// const UserAddFollow = ({ userId, isNewUser }) => {
//   const [allUsers, setAllUsers] = useState([]);
//   const [followers, setFollowers] = useState([]);
//   const [following, setFollowing] = useState([]);

//   useEffect(() => {
//     const fetchAllUsers = async () => {
//       const response = await fetch('/api/users');
//       const data = await response.json();
//       const usersWithFollowerKey = data.map(user => ({ ...user, follower: user }));
//       setAllUsers(usersWithFollowerKey);
//     };

//     fetchAllUsers();
//   }, [userId]);

//   const handleFollow = async (followUserId, isNewUser) => {
//     const response = await fetch(`/api/users/${userId}/follow/${followUserId}`, { method: 'POST' });
//     const data = await response.json();
//     if (response.ok) {
//       setAllUsers(
//         allUsers.map((user) =>
//           user.id === followUserId
//             ? { ...user, followed: true }
//             : user
//         )
//       );
//     }
//   };
  

//   const handleUnfollow = async (unfollowUserId) => {
//     const response = await fetch(`/api/users/${userId}/unfollow/${unfollowUserId}`, { method: 'POST' });
//     const data = await response.json();
//     if (response.ok) {
//       setAllUsers(
//         allUsers.map((user) =>
//           user.id === unfollowUserId
//             ? { ...user, followed: false }
//             : user
//         )
//       );
//     }
//   };

//   return (
//     <Container fluid>
//       <Row>
//         <Col md={{ span: 4, offset: 5 }}>
//           <div className="user-container">
//             <h2>All Users:</h2>
//             <div className="user-scroll">
//               <UserList
//                 users={allUsers}
//                 onFollow={handleFollow}
//                 onUnfollow={handleUnfollow}
//                 title=""
//                 isNewUser={isNewUser}
//               />
//             </div>
//           </div>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default UserAddFollow;




import React, { useState, useEffect } from 'react';
import UserList from './UserList';
import { Col, Container, Row } from 'react-bootstrap';

const UserAddFollow = ({ userId, isNewUser }) => {
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

  const updateFollowers = async () => {
    const response = await fetch(`/api/users/${userId}/followers`);
    const data = await response.json();
    setFollowers(data);
  };

  const updateFollowing = async () => {
    const response = await fetch(`/api/users/${userId}/followed`);
    const data = await response.json();
    setFollowing(data);
  };

  const handleFollow = async (followUserId, isNewUser) => {
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
      updateFollowers();
      updateFollowing();
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
      updateFollowers();
      updateFollowing();
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
                isNewUser={isNewUser}
              />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default UserAddFollow;










