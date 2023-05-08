import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

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
    <Form onSubmit={handleSubmit}>
      <h2>Tell Us Where You've Been</h2>
      <Form.Group controlId="name">
        <Form.Label>Walk</Form.Label>
        <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </Form.Group>
      <Form.Group controlId="location">
        <Form.Label>Location</Form.Label>
        <Form.Control type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
      </Form.Group>
      <Form.Group controlId="distance">
        <Form.Label>Distance (km)</Form.Label>
        <Form.Control type="number" step="0.1" value={distance} onChange={(e) => setDistance(e.target.value)} />
      </Form.Group>
      <Form.Group controlId="photo">
        <Form.Label>Photo URL</Form.Label>
        <Form.Control type="text" value={photo} onChange={(e) => setPhoto(e.target.value)} />
      </Form.Group>
      {/* <Form.Group controlId="description">
        <Form.Label>Description</Form.Label>
        <Form.Control as="textarea" value={description} onChange={(e) => setDescription(e.target.value)} />
      </Form.Group> */}
      <Button variant="primary" type="submit">Add Walk</Button>
    </Form>
  );
}

export default WalkForm;




