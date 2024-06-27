import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ token, allowAccess, children }) => {
  if (!token && !allowAccess) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
