import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import WalkForm from './WalkForm';
import WalkItem from './WalkItem';
import UserFollowers from './UserFollowers';

function Walks() {
  const [walks, setWalks] = useState([]);
  const { user } = useContext(AuthContext);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

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
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
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
  const shouldDelete = window.confirm('Are you sure you want to delete this walk?');

  if (shouldDelete) {
    const response = await fetch(`/walks/${walkId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setWalks((prevWalks) => prevWalks.filter((w) => w.id !== walkId));
    } else {
      alert('Error deleting walk');
    }
  }
};




  const successPopup = (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        zIndex: 999,
      }}
    >
      <p>Thanks for posting!</p>
    </div>
  );

  return (
    <div>
      <h2>Walks</h2>
      {user && <p>Welcome, {user.username}!</p>}
      {user && <UserFollowers userId={user.id} />}
      {user && <WalkForm onAddWalk={addWalk} />}
      {showSuccessPopup && successPopup}
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
