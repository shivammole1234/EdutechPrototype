import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CodeXml,
  Building2,
  School,
  Network,
  GraduationCap,
  Code2,
  ArrowRight,
  Lock,
  Mail,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuthStore, MOCK_USERS, ALL_DEMO_ACCOUNTS } from '@/stores/useAuthStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [email, setEmail] = useState('alex.turner@student.eng.codepulse.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');
  const [isLoading, setIsLoading] = useState(false);

  const routeForUser = (role: UserRole) => {
    if (role === 'UNIVERSITY_ADMIN') return '/university/dashboard';
    if (role === 'DEPARTMENT_COORDINATOR' || role === 'ADMIN' || role === 'COLLEGE') {
      return '/coordinator/dashboard';
    }
    if (role === 'INSTRUCTOR') return '/instructor/dashboard';
    return '/student/dashboard';
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    try {
      const user = await login(selectedRole, email);
      navigate(routeForUser(user.role));
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async (role: UserRole) => {
    setSelectedRole(role);
    const demoUser = MOCK_USERS[role] || ALL_DEMO_ACCOUNTS[8];
    setEmail(demoUser.email);
    setIsLoading(true);
    try {
      const user = await login(role, demoUser.email);
      navigate(routeForUser(user.role));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-200">
      {/* Theme Toggle in top right */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition cursor-pointer shadow-xs"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="inline-flex p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-primary)] shadow-sm mb-4">
          <CodeXml className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
          CodePulse Academy
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-[var(--text-secondary)]">
          University & Multi-Campus Academic LMS & Assessment Engine
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0 z-10">
        {/* Quick Demo Switcher Card */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl p-6 shadow-[var(--card-shadow)]">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2.5">
              Select Demo Role to Instant Login:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('UNIVERSITY_ADMIN')}
                className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                  selectedRole === 'UNIVERSITY_ADMIN'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-300 ring-1 ring-amber-500/30'
                    : 'bg-[var(--bg-surface-secondary)] border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Building2 className="w-4 h-4 text-amber-500" />
                <span>Univ Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('COLLEGE')}
                className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                  selectedRole === 'COLLEGE'
                    ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-300 ring-1 ring-indigo-500/30'
                    : 'bg-[var(--bg-surface-secondary)] border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]'
                }`}
              >
                <School className="w-4 h-4 text-indigo-500" />
                <span>College Dean</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('DEPARTMENT_COORDINATOR')}
                className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                  selectedRole === 'DEPARTMENT_COORDINATOR' || selectedRole === 'ADMIN'
                    ? 'bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-300 ring-1 ring-purple-500/30'
                    : 'bg-[var(--bg-surface-secondary)] border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Network className="w-4 h-4 text-purple-500" />
                <span>Coordinator</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('INSTRUCTOR')}
                className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                  selectedRole === 'INSTRUCTOR'
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-300 ring-1 ring-blue-500/30'
                    : 'bg-[var(--bg-surface-secondary)] border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-blue-500" />
                <span>Instructor</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('STUDENT')}
                className={`col-span-2 sm:col-span-2 flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                  selectedRole === 'STUDENT'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-300 ring-1 ring-emerald-500/30'
                    : 'bg-[var(--bg-surface-secondary)] border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Code2 className="w-4 h-4 text-emerald-500" />
                <span>Student Portal</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 pt-2 border-t border-[var(--border-default)]">
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4 text-[var(--text-muted)]" />}
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4 text-[var(--text-muted)]" />}
              required
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-[var(--text-secondary)] cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded bg-[var(--bg-surface-secondary)] border-[var(--border-default)] text-[var(--text-primary)] focus:ring-0 cursor-pointer"
                />
                Remember session
              </label>
              <Link
                to="/forgot-password"
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
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
              Sign In to Portal
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          <div className="mt-5 text-center text-xs text-[var(--text-muted)]">
            Protected by CodePulse Multi-Campus SSO & Hierarchy RBAC.
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
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl p-6 shadow-[var(--card-shadow)]">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">Reset Password</h2>
          <p className="text-xs text-[var(--text-secondary)] mb-6">
            Enter your registered email address and we'll send a password recovery token.
          </p>

          {submitted ? (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-600 dark:text-emerald-300">
              <p className="font-semibold mb-1">Reset link dispatched</p>
              <p>Check your email for the reset instructions. (Mock token: cp-reset-8849)</p>
              <div className="mt-4">
                <Link to="/login" className="text-[var(--text-primary)] hover:underline font-semibold">
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
                <Link to="/login" className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
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
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl p-6 shadow-[var(--card-shadow)]">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">Set New Password</h2>
          <p className="text-xs text-[var(--text-secondary)] mb-6">Create a strong password for your account.</p>
          {done ? (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-600 dark:text-emerald-300">
              <p className="font-semibold mb-1">Password updated</p>
              <p>Your password has been changed successfully.</p>
              <div className="mt-4">
                <Link to="/login" className="text-[var(--text-primary)] hover:underline font-semibold">
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
