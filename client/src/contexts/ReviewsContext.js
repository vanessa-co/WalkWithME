

import React, { createContext, useState, useEffect } from 'react';

export const ReviewsContext = createContext();

export const ReviewsContextProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);

  const addReview = (newReview) => {
    return fetch('http://127.0.0.1:5555/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newReview)
    })
      .then(response => response.json())
      .then(data => {
        setReviews([...reviews, data]);
        return data;
      });
  };

  const editReview = (id, updatedReview) => {
    return fetch(`http://127.0.0.1:5555/reviews/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedReview)
    })
      .then(response => response.json())
      .then(data => {
        setReviews(reviews.map((review) => (review.id === id ? data : review)));
        return data;
      });
  };
  

  const deleteReview = (id) => {
    return fetch(`http://127.0.0.1:5555/reviews/${id}`, {
      method: 'DELETE'
    })
      .then(response => {
        setReviews(reviews.filter((review) => review.id !== id));
      });
  };

  useEffect(() => {
    fetch('http://127.0.0.1:5555/reviews')
      .then(response => response.json())
      .then(data => {
        setReviews(data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const value = {
    reviews,
    addReview,
    editReview,
    deleteReview
  };

  return (
    <ReviewsContext.Provider value={value}>
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = () => {
  const context = React.useContext(ReviewsContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewsContextProvider');
  }
  return context;
};

