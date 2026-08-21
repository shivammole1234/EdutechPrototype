import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/useAuthStore';

export const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleGoDashboard = () => {
    if (user?.role === 'ADMIN') navigate('/admin/dashboard');
    else if (user?.role === 'INSTRUCTOR') navigate('/instructor/dashboard');
    else navigate('/student/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-800/60 text-rose-400 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-rose-950/40">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">403 — Access Forbidden</h1>
        <p className="text-sm text-slate-400 mt-2">
          You do not have administrative or faculty permissions to access this specific portal resource.
        </p>

        <div className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-xl my-6 text-xs text-left">
          <div className="flex justify-between text-slate-400">
            <span>Current Role:</span>
            <span className="font-semibold text-blue-400">{user?.role || 'Guest'}</span>
          </div>
          <div className="flex justify-between text-slate-400 mt-1">
            <span>Account:</span>
            <span className="text-slate-300">{user?.email || 'Not logged in'}</span>
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
    if (user?.role === 'ADMIN') navigate('/admin/dashboard');
    else if (user?.role === 'INSTRUCTOR') navigate('/instructor/dashboard');
    else navigate('/student/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-6xl font-black text-slate-700 font-mono tracking-wider mb-2">404</h1>
        <h2 className="text-xl font-bold text-slate-100 tracking-tight">Page Not Found</h2>
        <p className="text-sm text-slate-400 mt-2 mb-6">
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
