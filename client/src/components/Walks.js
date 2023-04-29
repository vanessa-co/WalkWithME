import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

function Walks() {
  const [walks, setWalks] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchWalks = async () => {
      const response = await fetch('http://127.0.0.1:5555/walks');
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
            <h3>{walk.location}</h3>
            <div>Description: {walk.description}</div>
            <div>
              <img src={walk.photo} alt={walk.name} style={{ width: '300px', height: '200px' }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Walks;
