import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/user';

const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    // You might want to show a spinner here while checking auth status
    return <div>Loading authentication status...</div>;
  }

  const isAuthorized = user && (user.role === UserRole.Admin || user.role === UserRole.Manager);

  if (!isAuthorized) {
    // Redirect them to the /login page if they are not authorized
    return <Navigate to="/login" replace />;
  }

  // If authorized, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;