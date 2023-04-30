


// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// function Profile() {
//   const [userData, setUserData] = useState(null);
//   const [isFollowing, setIsFollowing] = useState(false);
//   const [followers, setFollowers] = useState([]);
//   const { userId } = useParams();

//   useEffect(() => {
//     axios
//       .get(`/users/${userId}`)
//       .then((response) => {
//         setUserData(response.data);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }, [userId]);

//   useEffect(() => {
//     if (userData && userData.followers) {
//       setIsFollowing(userData.followers.some((follower) => follower.id === 1));
//       setFollowers(userData.followers);
//     }
//   }, [userData]);

//   const handleFollow = () => {
//     axios
//       .post("/follows", { follower_id: 1, followed_id: userId })
//       .then(() => {
//         setIsFollowing(true);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };

//   const handleUnfollow = () => {
//     axios
//       .delete(`/follows/${userData.followers.find((follower) => follower.id === 1).follow_id}`)
//       .then(() => {
//         setIsFollowing(false);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };

//   return (
//     <div>
//       {userData ? (
//         <div>
//           <div style={{ display: "flex", alignItems: "center" }}>
//             <img src={`http://localhost:5555/uploads/${userData.profile_photo}`} alt="Profile" style={{ width: "100px", height: "100px", borderRadius: "50%" }} />
//             <div style={{ marginLeft: "20px" }}>
//               <h1>{userData.username}</h1>
//               <p>Email: {userData.email}</p>
//               <p>Bio: {userData.bio || "No bio yet"}</p>
//               {isFollowing ? (
//                 <button onClick={handleUnfollow}>Unfollow</button>
//               ) : (
//                 <button onClick={handleFollow}>Follow</button>
//               )}
//             </div>
//           </div>
//           <hr />
//           <h2>Followers ({followers.length})</h2>
//           <div style={{ display: "flex", flexWrap: "wrap" }}>
//             {followers.map((follower) => (
//               <div key={follower.id} style={{ margin: "10px" }}>
//                 <img src={`http://localhost:5555/uploads/${follower.profile_photo}`} alt="Profile" style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
//                 <p>{follower.username}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// }

// export default Profile;


import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Profile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${userId}/profile`)
      .then(response => response.json())
      .then(data => setUser(data));
  }, [userId]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{user.username}'s Profile</h1>
      <img src={user.profile_photo} alt="Profile" />
      <h2>Followers</h2>
      <ul>
        {user.followers.map(follower => (
          <li key={follower.id}>
            <img
              src={follower.profile_photo}
              alt="Follower"
              onClick={() => window.location.href = `/profile/${follower.id}`}
            />
            <span>{follower.username}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Profile;




