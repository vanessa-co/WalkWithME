

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

function Walks() {
  const [walks, setWalks] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchWalks = async () => {
      const response = await fetch('/walks');
      const data = await response.json();
      setWalks(data);
    };

    fetchWalks();
  }, []);

  return (
    <div>
      <h2>Walks</h2>
      {user && <p>Welcome, {user.username}!</p>}
      <ul>
        {walks.map((walk) => (
          <li key={walk.id}>
            <h3>{walk.name}</h3>
            <div>Location: {walk.location}</div>
            <div>Distance: {walk.distance} km</div>
            {walk.photo && (
              <div>
                <img src={walk.photo} alt={walk.name} style={{ width: '300px', height: '200px' }} />
              </div>
            )}
            {walk.description && <div>Description: {walk.description}</div>}
            <div>Added by: {walk.username}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Walks;
