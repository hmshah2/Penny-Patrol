import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, signedIn }) => {
  if (!signedIn) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
