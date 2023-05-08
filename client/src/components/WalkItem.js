import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Button, Form, Card } from 'semantic-ui-react';

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
    <Card>
      {isEditing ? (
        <Form>
          <Form.Field>
            <label>Name: </label>
            <input
              type="text"
              value={editedWalk.name}
              onChange={(e) => setEditedWalk({ ...editedWalk, name: e.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Location: </label>
            <input
              type="text"
              value={editedWalk.location}
              onChange={(e) => setEditedWalk({ ...editedWalk, location: e.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Distance (km): </label>
            <input
              type="number"
              step="0.1"
              value={editedWalk.distance}
              onChange={(e) => setEditedWalk({ ...editedWalk, distance: e.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Photo URL: </label>
            <input
              type="text"
              value={editedWalk.photo}
              onChange={(e) => setEditedWalk({ ...editedWalk, photo: e.target.value })}
            />
          </Form.Field>
          <Button compact onClick={handleSave}>Save</Button>
          <Button compact onClick={handleCancel}>Cancel</Button>
        </Form>
      ) : (
        <>
          <Card.Content>
            <Card.Header>{walk.name}</Card.Header>
            <Card.Meta>Location: {walk.location}</Card.Meta>
            <Card.Description>Distance: {walk.distance} km</Card.Description>
          </Card.Content>
          {walk.photo && (
            <Card.Content>
              <img
                src={walk.photo}
                alt={walk.name}
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              />
            </Card.Content>
          )}
          <Card.Content extra>
            <span>Added by: {walk.username}</span>
          </Card.Content>
          {user && user.username === walk.username && (
            <Card.Content extra>
              <Button compact onClick={() => setIsEditing(true)}>Edit</Button>
              <Button compact onClick={() => onDeleteWalk(walk.id)}>Delete</Button>
            </Card.Content>
          )}
        </>
      )}
    </Card>
  );
}

export default WalkItem;







