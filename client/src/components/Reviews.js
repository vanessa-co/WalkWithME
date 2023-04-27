import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(1);
  const [reviewPhoto, setReviewPhoto] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const user = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5555/reviews');
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('text', reviewText);
    formData.append('rating', reviewRating);
    if (reviewPhoto) {
      formData.append('photo', reviewPhoto);
    }

    try {
      const response = await fetch(selectedReview ? `http://127.0.0.1:5555/reviews/${selectedReview.id}` : 'http://127.0.0.1:5555/reviews', {
        method: selectedReview ? 'PUT' : 'POST',
        body: formData,
      });

      const data = await response.json();
      if (selectedReview) {
        setReviews(reviews.map((review) => (review.id === data.id ? data : review)));
      } else {
        setReviews([...reviews, data]);
      }

      setReviewText('');
      setReviewRating(1);
      setReviewPhoto(null);
      setSelectedReview(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await fetch(`http://127.0.0.1:5555/reviews/${reviewId}`, {
        method: 'DELETE',
      });
      setReviews(reviews.filter((review) => review.id !== reviewId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (review) => {
    setSelectedReview(review);
    setReviewText(review.text);
    setReviewRating(review.rating);
    setReviewPhoto(review.photo);
  };

  if (!user) {
    return <p>You need to be logged in to view reviews.</p>;
  }

  return (
    <div>
      <h1>Reviews</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="reviewText">Review Text:</label>
        <input
          id="reviewText"
          type="text"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />

        <label htmlFor="reviewRating">Rating:</label>
        <input
          id="reviewRating"
          type="number"
          min="1"
          max="5"
          value={reviewRating}
          onChange={(e) => setReviewRating(e.target.value)}
        />

        <label htmlFor="reviewPhoto">Photo:</label>
        <input
          id="reviewPhoto"
          type="file"
          onChange={(e) => setReviewPhoto(e.target.files[0])}
        />

        <button type="submit">{selectedReview ? 'Update' : 'Submit'} Review</button>
      </form>
      {reviews.map((review) => (
            <div key={review.id}>
            <h3>{review.text}</h3>
            <p>Rating: {review.rating}</p>
            {review.photo && <img src={review.photo} alt="Review" width="200" />}
            <button onClick={() => handleEdit(review)}>Edit</button>
            <button onClick={() => handleDelete(review.id)}>Delete</button>
            </div>
            ))}
          </div>
        );
      };
      
      export default Reviews;
      
