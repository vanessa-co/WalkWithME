
import { createContext, useContext, useState } from 'react';

const ReviewContext = createContext();

export const useReviews = () => {
  return useContext(ReviewContext);
};

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);

  return (
    <ReviewContext.Provider value={{ reviews, setReviews }}>
      {children}
    </ReviewContext.Provider>
  );
};





