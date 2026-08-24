import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/useAuthStore';

export const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleGoDashboard = () => {
    if (user?.role === 'UNIVERSITY_ADMIN') navigate('/university/dashboard');
    else if (user?.role === 'COLLEGE' || user?.role === 'DEPARTMENT_COORDINATOR' || user?.role === 'ADMIN') {
      navigate('/coordinator/dashboard');
    } else if (user?.role === 'INSTRUCTOR') {
      navigate('/instructor/dashboard');
    } else {
      navigate('/student/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl p-8 shadow-[var(--modal-shadow)]">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">403 — Access Forbidden</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-2">
          You do not have administrative or faculty permissions to access this specific portal resource.
        </p>

        <div className="p-3.5 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-xl my-6 text-xs text-left">
          <div className="flex justify-between text-[var(--text-secondary)]">
            <span>Current Role:</span>
            <span className="font-semibold text-purple-600 dark:text-purple-400">{user?.role || 'Guest'}</span>
          </div>
          <div className="flex justify-between text-[var(--text-secondary)] mt-1">
            <span>Account:</span>
            <span className="text-[var(--text-primary)]">{user?.email || 'Not logged in'}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button variant="outline" onClick={() => navigate(-1)} className="w-full sm:w-auto">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <Button variant="primary" onClick={handleGoDashboard} className="w-full sm:w-auto">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            My Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleGoDashboard = () => {
    if (user?.role === 'UNIVERSITY_ADMIN') navigate('/university/dashboard');
    else if (user?.role === 'COLLEGE' || user?.role === 'DEPARTMENT_COORDINATOR' || user?.role === 'ADMIN') {
      navigate('/coordinator/dashboard');
    } else if (user?.role === 'INSTRUCTOR') {
      navigate('/instructor/dashboard');
    } else {
      navigate('/student/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl p-8 shadow-[var(--modal-shadow)]">
        <h1 className="text-6xl font-black text-[var(--text-muted)] font-mono tracking-wider mb-2">404</h1>
        <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Page Not Found</h2>
        <p className="text-sm text-[var(--text-secondary)] mt-2 mb-6">
          The requested URL path does not exist in the CodePulse platform.
        </p>

        <Button variant="primary" onClick={handleGoDashboard} className="w-full sm:w-auto">
          <LayoutDashboard className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};
