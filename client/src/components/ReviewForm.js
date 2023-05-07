import { useState, useContext } from 'react';
import { useReviews } from '../contexts/ReviewsContext';
import { AuthContext } from '../contexts/AuthContext';

const ReviewForm = () => {
  const { reviews, setReviews } = useReviews();
  const { user } = useContext(AuthContext);
  const [event_name, setEventName] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState('');
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
    setRating('');
    setLocation('');
    setCategory('');
    setDate('');
    setTime('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add a new review</h2>
      <label>
        Event name:
        <input
          type="text"
          value={event_name}
          onChange={(e) => setEventName(e.target.value)}
          required
        />
      </label>
      <label>
        Review text:
        <textarea value={text} onChange={(e) => setText(e.target.value)} required />
      </label>
      <label>
        Rating:
        <input
          type="number"
          step="0.1"
          min="0"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
        />
      </label>
      <label>
        Location:
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </label>
      <label>
        Category:
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Select a category</option>
          <option value="leisure">Leisure</option>
          <option value="competitive">Competitive</option>
          <option value="charity">Charity</option>
        </select>
      </label>
      <label>
        Date:
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </label>
      <label>
        Time:
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </label>
      <button type="submit">Add Review</button>
    </form>
  );
};

export default ReviewForm;
