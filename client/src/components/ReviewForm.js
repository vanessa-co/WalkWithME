import React, { useState, useContext } from 'react';
import { useReviews } from '../contexts/ReviewsContext';
import { AuthContext } from '../contexts/AuthContext';
import ReactStars from "react-rating-stars-component";

const ReviewForm = ({ onSubmit }) => {
  const { reviews, setReviews } = useReviews();
  const { user } = useContext(AuthContext);
  const [event_name, setEventName] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const newReview = {
      id: Date.now(),
      event_name,
      text,
      rating: parseFloat(rating),
      location,
      category,
      date,
      time,
      user_id: user ? user.id : null,
    };

    fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newReview),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setReviews([...reviews, data]);
      })
      .catch((error) => console.error('Error saving review:', error));

    setEventName('');
    setText('');
    setRating(0);
    setLocation('');
    setCategory('');
    setDate('');
    setTime('');

    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <div className="container">
      <h2>Community Posts and Reviews</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Event name:</label>
          <input
            type="text"
            className="form-control"
            value={event_name}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Review:</label>
          <textarea
            className="form-control"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Rating:</label>
          <div>
          <ReactStars
           count={5}
           value={rating}
           onChange={(newRating) => setRating(newRating)}
           size={40}
           activeColor="#ffd700"
           />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Location:</label>
          <input
            type="text"
            className="form-control"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Category:</label>
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            <option value="leisure">Leisure</option>
            <option value="athletic">Athletic</option>
            <option value="charity">Charity</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Date:</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Time:</label>
          <input
            type="time"
            className="form-control"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Review
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;

