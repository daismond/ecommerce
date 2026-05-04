import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UserProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    // Redirect them to the /login page if they are not logged in
    return <Navigate to="/login" replace />;
  }

  // If logged in, render the child routes
  return <Outlet />;
};

export default UserProtectedRoute;