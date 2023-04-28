import React, { createContext, useState, useEffect } from "react";

export const ReviewsContext = createContext();

export const ReviewsContextProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5555/reviews");
        const data = await response.json();
        setReviews(data.reviews);
      } catch (error) {
        console.log(error);
      }
    };

    fetchReviews();
  }, []);

  return (
    <ReviewsContext.Provider value={{ reviews }}>
      {children}
    </ReviewsContext.Provider>
  );
};


