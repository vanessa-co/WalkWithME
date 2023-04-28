import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const PrivateRoute = (props) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return <Route {...props} />;
};

export default PrivateRoute;
