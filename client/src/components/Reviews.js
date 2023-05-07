
import { useState, useEffect } from 'react';
import { useReviews } from '../contexts/ReviewsContext';
import ReviewForm from './ReviewForm';

const Reviews = () => {
  const { reviews, setReviews } = useReviews();
  const [filteredReviews, setFilteredReviews] = useState(reviews);
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    fetch('/api/reviews')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setReviews(data))
      .catch(error => console.error('Error fetching reviews:', error));
  }, [setReviews]);

  useEffect(() => {
    if (filterCategory) {
      setFilteredReviews(reviews.filter(review => review.category.toLowerCase() === filterCategory.toLowerCase()));
    } else {
      setFilteredReviews(reviews);
    }
  }, [filterCategory, reviews]);

  const handleFilterChange = (e) => {
    setFilterCategory(e.target.value);
  };

  return (
    <div>
      <h2>Reviews</h2>
      <ReviewForm />
      <label>
        Filter by category:
        <select value={filterCategory} onChange={handleFilterChange}>
          <option value="">All</option>
          <option value="leisure">Leisure</option>
          <option value="competitive">Competitive</option>
          <option value="charity">Charity</option>
        </select>
      </label>
      {filteredReviews.map(review => (
        <div key={review.id}>
          <h3>{review.event_name} ({review.rating} / 5)</h3>
          <p>{review.text}</p>
          <p><strong>Location:</strong> {review.location}</p>
          <p><strong>Category:</strong> {review.category}</p>
          <p><strong>Username:</strong> {review.username}</p>
          <p><strong>Date:</strong> {review.date}</p>
          <p><strong>Time:</strong> {review.time}</p>
        </div>
      ))}
    </div>
  );
};

export default Reviews;

