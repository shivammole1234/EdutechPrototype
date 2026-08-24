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

  const userRole = user.role;

  // Direct check
  let isAllowed = allowedRoles.includes(userRole);

  // Department coordinator / Admin equivalence
  if (!isAllowed) {
    if (
      (userRole === 'ADMIN' || userRole === 'DEPARTMENT_COORDINATOR') &&
      (allowedRoles.includes('ADMIN') || allowedRoles.includes('DEPARTMENT_COORDINATOR'))
    ) {
      isAllowed = true;
    }
  }

  // College Dean / Admin has access to Coordinator and College-level portals
  if (!isAllowed && userRole === 'COLLEGE') {
    if (
      allowedRoles.includes('COLLEGE') ||
      allowedRoles.includes('DEPARTMENT_COORDINATOR') ||
      allowedRoles.includes('ADMIN')
    ) {
      isAllowed = true;
    }
  }

  // University Admin has super-administrative access to University, College, and Coordinator portals
  if (!isAllowed && userRole === 'UNIVERSITY_ADMIN') {
    if (
      allowedRoles.includes('UNIVERSITY_ADMIN') ||
      allowedRoles.includes('COLLEGE') ||
      allowedRoles.includes('DEPARTMENT_COORDINATOR') ||
      allowedRoles.includes('ADMIN')
    ) {
      isAllowed = true;
    }
  }

  // Fallback: If not allowed, redirect directly to user's assigned portal rather than throwing a blocking 403
  if (!isAllowed) {
    let targetRoute = '/student/dashboard';
    if (userRole === 'UNIVERSITY_ADMIN') targetRoute = '/university/dashboard';
    else if (userRole === 'COLLEGE' || userRole === 'DEPARTMENT_COORDINATOR' || userRole === 'ADMIN') {
      targetRoute = '/coordinator/dashboard';
    } else if (userRole === 'INSTRUCTOR') {
      targetRoute = '/instructor/dashboard';
    }
    return <Navigate to={targetRoute} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
