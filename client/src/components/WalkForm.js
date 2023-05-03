
import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

function WalkForm({ onAddWalk }) {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [distance, setDistance] = useState('');
  const [photo, setPhoto] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) {
      alert('Please log in to add a walk');
      return;
    }

    const newWalk = {
      name,
      location,
      distance,
      photo,
      description,
      user_id: user.id,
    };

    const response = await fetch('/walks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newWalk),
    });

    if (response.ok) {
      const walk = await response.json();
      onAddWalk(walk);
      setName('');
      setLocation('');
      setDistance('');
      setPhoto('');
      setDescription('');
    } else {
      alert('Error adding walk');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>...</h2>
      <div>
        <label>Trail: </label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label>Location: </label>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
      </div>
      <div>
        <label>Distance (km): </label>
        <input type="number" step="0.1" value={distance} onChange={(e) => setDistance(e.target.value)} />
      </div>
      <div>
        <label>Photo URL: </label>
        <input type="text" value={photo} onChange={(e) => setPhoto(e.target.value)} />
      </div>
      {/* <div>
        <label>Description: </label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div> */}
      <button type="submit">Add Walk</button>
    </form>
  );
}

export default WalkForm;
