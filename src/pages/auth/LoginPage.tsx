import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CodeXml, Shield, GraduationCap, Code2, ArrowRight, Lock, Mail } from 'lucide-react';
import { useAuthStore, MOCK_USERS } from '@/stores/useAuthStore';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('alex.turner@student.codepulse.io');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    try {
      const user = await login(selectedRole, email);
      if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (user.role === 'INSTRUCTOR') navigate('/instructor/dashboard');
      else navigate('/student/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async (role: UserRole) => {
    setSelectedRole(role);
    setEmail(MOCK_USERS[role].email);
    setIsLoading(true);
    try {
      const user = await login(role, MOCK_USERS[role].email);
      if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (user.role === 'INSTRUCTOR') navigate('/instructor/dashboard');
      else navigate('/student/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="inline-flex p-3 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/30 mb-4">
          <CodeXml className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
          CodePulse Academy
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-400">
          Coding Education & Assessment Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 z-10">
        {/* Quick Demo Switcher Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
              Select Demo Role to Login:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('STUDENT')}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                  selectedRole === 'STUDENT'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/50'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <Code2 className="w-5 h-5 text-emerald-400" />
                <span>Student</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('INSTRUCTOR')}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                  selectedRole === 'INSTRUCTOR'
                    ? 'bg-blue-950/60 border-blue-500 text-blue-300 ring-1 ring-blue-500/50'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <GraduationCap className="w-5 h-5 text-blue-400" />
                <span>Instructor</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('ADMIN')}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                  selectedRole === 'ADMIN'
                    ? 'bg-purple-950/60 border-purple-500 text-purple-300 ring-1 ring-purple-500/50'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <Shield className="w-5 h-5 text-purple-400" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 pt-2 border-t border-slate-800">
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4 text-slate-500" />}
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4 text-slate-500" />}
              required
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-0"
                />
                Remember session
              </label>
              <Link
                to="/forgot-password"
                className="text-blue-400 hover:text-blue-300 transition"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2"
            >
              Sign In to {selectedRole} Portal
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          <div className="mt-5 text-center text-xs text-slate-400">
            Protected by CodePulse Enterprise Auth & SSO.
          </div>
        </div>
      </div>
    </div>
  );
};

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-xl font-bold text-slate-100 mb-1">Reset Password</h2>
          <p className="text-xs text-slate-400 mb-6">
            Enter your registered email address and we'll send a password recovery token.
          </p>

          {submitted ? (
            <div className="p-4 bg-emerald-950/60 border border-emerald-800/60 rounded-xl text-xs text-emerald-300">
              <p className="font-semibold mb-1">Reset link dispatched</p>
              <p>Check your email for the reset instructions. (Mock token: cp-reset-8849)</p>
              <div className="mt-4">
                <Link to="/login" className="text-blue-400 hover:underline">
                  Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-4"
            >
              <Input
                label="Email address"
                type="email"
                placeholder="you@codepulse.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" variant="primary" className="w-full">
                Send Recovery Link
              </Button>
              <div className="text-center">
                <Link to="/login" className="text-xs text-slate-400 hover:text-slate-200">
                  Cancel and return to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export const ResetPasswordPage: React.FC = () => {
  const [done, setDone] = useState(false);
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-xl font-bold text-slate-100 mb-1">Set New Password</h2>
          <p className="text-xs text-slate-400 mb-6">Create a strong password for your account.</p>
          {done ? (
            <div className="p-4 bg-emerald-950/60 border border-emerald-800/60 rounded-xl text-xs text-emerald-300">
              <p className="font-semibold mb-1">Password updated</p>
              <p>Your password has been changed successfully.</p>
              <div className="mt-4">
                <Link to="/login" className="text-blue-400 hover:underline">
                  Sign In Now
                </Link>
              </div>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setDone(true);
              }}
              className="space-y-4"
            >
              <Input label="New Password" type="password" required />
              <Input label="Confirm New Password" type="password" required />
              <Button type="submit" variant="primary" className="w-full">
                Update Password
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
