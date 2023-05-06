


import React, { createContext, useContext, useState, useEffect } from 'react';

const API_BASE_URL = 'http://127.0.0.1:5555'; 

const ReviewsContext = createContext();

export const ReviewsProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [formValues, setFormValues] = useState({
    text: '',
    rating: '',
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const response = await fetch(`${API_BASE_URL}/api/reviews`);
    const data = await response.json();
    setReviews(data);
  };

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestOptions = {
      method: editingReviewId ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formValues),
    };

    const url = editingReviewId
      ? `${API_BASE_URL}/api/reviews/${editingReviewId}`
      : `${API_BASE_URL}/api/reviews`;

    await fetch(url, requestOptions);

    setFormValues({ text: '', rating: '' });
    setEditingReviewId(null);
    fetchReviews();
  };

  const handleEdit = (review) => {
    setFormValues({ text: review.text, rating: review.rating });
    setEditingReviewId(review.id);
  };

  return (
    <ReviewsContext.Provider
      value={{
        reviews,
        editingReviewId,
        formValues,
        handleChange,
        handleSubmit,
        handleEdit,
        setEditingReviewId,
      }}
    >
      {children}
    </ReviewsContext.Provider>
  );
};

const useReviewsContext = () => {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error('useReviewsContext must be used within a ReviewsProvider');
  }
  return context;
};

export { useReviewsContext };
