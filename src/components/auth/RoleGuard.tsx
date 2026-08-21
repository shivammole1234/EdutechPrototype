import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { UserRole } from '@/types';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
