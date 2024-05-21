import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, authUser, adminOnly = false }) => {
  if (!authUser) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && authUser.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return <Component />;
};

export default ProtectedRoute;
