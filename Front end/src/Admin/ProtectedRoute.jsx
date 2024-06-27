import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ token, isAdmin, children }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (isAdmin && (!user || !user.is_admin)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
