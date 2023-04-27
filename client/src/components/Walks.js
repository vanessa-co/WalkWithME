import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';

const Walks = () => {
  const { user } = useContext(UserContext);
  const [walks, setWalks] = useState([]);

  useEffect(() => {
    if (user) {
      fetch('http://127.0.0.1:5555/walks')
        .then((response) => response.json())
        .then((data) => setWalks(data));
    }
  }, [user]);

  if (!user) {
    return <p>your walks.</p>;
  }

  return (
    <div>
      <h2>Walks</h2>
      <ul>
        {walks.map((walk) => (
          <li key={walk.id}>
            {walk.name} - {walk.location}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Walks;
