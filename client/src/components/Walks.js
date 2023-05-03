
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import WalkForm from './WalkForm';
import WalkItem from './WalkItem';
import UserFollowers from './UserFollowers';

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

  const addWalk = (walk) => {
    setWalks((prevWalks) => [...prevWalks, walk]);
  };

  const handleEditWalk = async (updatedWalk) => {
    const response = await fetch(`/walks/${updatedWalk.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedWalk),
    });
  
    if (response.ok) {
      const walk = await response.json();
      setWalks((prevWalks) => prevWalks.map((w) => (w.id === walk.id ? walk : w)));
    } else {
      alert('Error updating walk');
    }
  };
  

  const handleDeleteWalk = async (walkId) => {
    const response = await fetch(`/walks/${walkId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setWalks((prevWalks) => prevWalks.filter((w) => w.id !== walkId));
    } else {
      alert('Error deleting walk');
    }
  };

  return (
    <div>
      <h2>...</h2>
      {user && <p>Welcome, {user.username}!</p>}
      {user && <UserFollowers userId={user.id} />}
      {user && <WalkForm onAddWalk={addWalk} />}
      <ul>
        {walks.map((walk) => (
          <WalkItem
            key={walk.id}
            walk={walk}
            onEditWalk={handleEditWalk}
            onDeleteWalk={handleDeleteWalk}
            isOwner={user && user.id === walk.user_id}
          />
        ))}
      </ul>
    </div>
  );
}

export default Walks;


