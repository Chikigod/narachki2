import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
  const isAuthenticated = () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    return userData && userData.token; 
  };

  return isAuthenticated() ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
