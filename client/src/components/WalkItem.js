import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

function WalkItem({ walk, onEditWalk, onDeleteWalk }) {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedWalk, setEditedWalk] = useState(walk);

  const handleSave = () => {
    onEditWalk(editedWalk);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedWalk(walk);
    setIsEditing(false);
  };

  return (
    <li>
      {isEditing ? (
        <div>
          <label>Name: </label>
          <input
            type="text"
            value={editedWalk.name}
            onChange={(e) => setEditedWalk({ ...editedWalk, name: e.target.value })}
          />
          <br />
          <label>Location: </label>
          <input
            type="text"
            value={editedWalk.location}
            onChange={(e) => setEditedWalk({ ...editedWalk, location: e.target.value })}
          />
          <br />
          <label>Distance (km): </label>
          <input
            type="number"
            step="0.1"
            value={editedWalk.distance}
            onChange={(e) => setEditedWalk({ ...editedWalk, distance: e.target.value })}
          />
          <br />
          <label>Photo URL: </label>
          <input
            type="text"
            value={editedWalk.photo}
            onChange={(e) => setEditedWalk({ ...editedWalk, photo: e.target.value })}
          />
          <br />
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      ) : (
        <>
          <h3>{walk.name}</h3>
          <div>Location: {walk.location}</div>
          <div>Distance: {walk.distance} km</div>
          {walk.photo && (
            <div>
              <img src={walk.photo} alt={walk.name} style={{ width: '300px', height: '200px' }} />
            </div>
          )}
          <div>Added by: {walk.username}</div>
          {user && user.username === walk.username && (
            <div>
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={() => onDeleteWalk(walk.id)}>Delete</button>
            </div>
          )}
        </>
      )}
    </li>
  );
}

export default WalkItem;

