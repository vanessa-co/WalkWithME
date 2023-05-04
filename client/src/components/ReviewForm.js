import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const ReviewForm = ({ onSubmit }) => {
  const [event, setEvent] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ event, location, date, time, category });
    setEvent('');
    setLocation('');
    setDate('');
    setTime('');
    setCategory('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="event">
        <Form.Label>Event</Form.Label>
        <Form.Control
          type="text"
          value={event}
          onChange={(e) => setEvent(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="location">
        <Form.Label>Location</Form.Label>
        <Form.Control
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="date">
        <Form.Label>Date</Form.Label>
        <Form.Control
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="time">
        <Form.Label>Time</Form.Label>
        <Form.Control
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="category">
        <Form.Label>Category</Form.Label>
        <Form.Control
          as="select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select a category</option>
          <option value="leisure">Leisure</option>
          <option value="competitive">Competitive</option>
          <option value="athletic">Athletic</option>
          <option value="charity">Charity</option>
        </Form.Control>
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default ReviewForm;

