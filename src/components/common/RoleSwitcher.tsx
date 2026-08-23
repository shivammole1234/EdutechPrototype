import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, GraduationCap, Code2, Check, Sun, Moon, Bell, LogOut, ChevronDown, Menu, X } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { UserRole } from '@/types';
import { Badge } from '@/components/ui/Badge';

interface TopNavbarProps {
  title?: string;
  onMenuToggle?: () => void;
  isSidebarOpen?: boolean;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ title, onMenuToggle, isSidebarOpen }) => {
  const { user, switchRole, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleRoleChange = (role: UserRole) => {
    switchRole(role);
    setDropdownOpen(false);
    if (role === 'ADMIN') navigate('/admin/dashboard');
    else if (role === 'INSTRUCTOR') navigate('/instructor/dashboard');
    else navigate('/student/dashboard');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleColors: Record<UserRole, 'purple' | 'primary' | 'success'> = {
    ADMIN: 'purple',
    INSTRUCTOR: 'primary',
    STUDENT: 'success',
  };

  return (
    <header className="h-16 border-b border-[var(--border-default)] bg-[var(--bg-surface)] sticky top-0 z-30 px-3 sm:px-6 md:px-8 flex items-center justify-between transition-colors duration-200">
      {/* Left Title / Hamburger + Breadcrumb */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-lg bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] hover:border-[var(--border-hover)] text-[var(--text-primary)] transition-colors cursor-pointer flex items-center justify-center min-w-[40px] min-h-[40px] shrink-0"
            aria-label={isSidebarOpen ? 'Close navigation sidebar' : 'Open navigation sidebar'}
            title={isSidebarOpen ? 'Close Navigation' : 'Open Navigation'}
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        )}

        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[var(--text-secondary)] min-w-0">
          <span className="text-[var(--text-muted)] hidden sm:inline">Portal</span>
          <span className="text-[var(--border-hover)] hidden sm:inline">/</span>
          <span className="text-[var(--text-primary)] font-semibold truncate max-w-[130px] sm:max-w-[260px] md:max-w-none">
            {title || 'Overview'}
          </span>
        </div>
      </div>

      {/* Center Search Input */}
      <div className="hidden lg:flex items-center relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Quick search (Cmd+K)"
          className="bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-lg px-4 py-1.5 text-xs w-64 focus:outline-none focus:ring-1 focus:ring-[var(--border-focus)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-all"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Quick Role Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-[var(--bg-surface-secondary)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-default)] rounded-lg text-xs font-medium text-[var(--text-primary)] transition-all cursor-pointer shadow-xs"
            title="Switch demo portal role"
          >
            <span className="text-[var(--text-muted)] hidden sm:inline">View as:</span>
            <Badge variant={user ? roleColors[user.role] : 'default'} size="sm" className="px-1.5 sm:px-2 py-0.5">
              {user?.role === 'ADMIN' && <Shield className="w-3 h-3" />}
              {user?.role === 'INSTRUCTOR' && <GraduationCap className="w-3 h-3" />}
              {user?.role === 'STUDENT' && <Code2 className="w-3 h-3" />}
              <span className="hidden xs:inline">{user?.role}</span>
            </Badge>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-64 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl shadow-[var(--modal-shadow)] z-50 p-2 text-xs space-y-1">
                <div className="px-3 py-2 border-b border-[var(--border-default)]">
                  <p className="font-bold text-[var(--text-primary)]">Switch Active Portal</p>
                  <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Explore each dedicated dashboard</p>
                </div>

                <button
                  onClick={() => handleRoleChange('STUDENT')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[var(--bg-surface-hover)] transition cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <Code2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--text-primary)]">Student Portal</p>
                      <p className="text-[10px] text-[var(--text-muted)]">Alex Turner • IDE & Classes</p>
                    </div>
                  </div>
                  {user?.role === 'STUDENT' && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                </button>

                <button
                  onClick={() => handleRoleChange('INSTRUCTOR')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[var(--bg-surface-hover)] transition cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-[var(--bg-surface-secondary)] text-[var(--text-primary)] border border-[var(--border-hover)]">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--text-primary)]">Instructor Portal</p>
                      <p className="text-[10px] text-[var(--text-muted)]">Dr. Elena • Proctoring & Tests</p>
                    </div>
                  </div>
                  {user?.role === 'INSTRUCTOR' && <Check className="w-4 h-4 text-[var(--text-primary)]" />}
                </button>

                <button
                  onClick={() => handleRoleChange('ADMIN')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[var(--bg-surface-hover)] transition cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--text-primary)]">Admin Portal</p>
                      <p className="text-[10px] text-[var(--text-muted)]">Marcus Vance • Users & Org</p>
                    </div>
                  </div>
                  {user?.role === 'ADMIN' && <Check className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Global Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-colors cursor-pointer shrink-0"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>

        {/* Notifications Icon Button */}
        <button
          onClick={() => {
            if (user?.role === 'ADMIN') navigate('/admin/notifications');
            else if (user?.role === 'INSTRUCTOR') navigate('/instructor/notifications');
            else navigate('/student/notifications');
          }}
          className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-colors cursor-pointer shrink-0"
          title="Notifications"
        >
          <Bell className="w-3.5 h-3.5" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--text-primary)] ring-2 ring-[var(--bg-surface)]" />
        </button>

        {/* User Avatar & Logout */}
        <div className="flex items-center gap-2 sm:gap-3 pl-1.5 sm:pl-2 border-l border-[var(--border-default)]">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={user?.name}
            className="w-8 h-8 rounded-full object-cover border border-[var(--border-default)] shrink-0"
          />
          <div className="hidden lg:block text-left text-xs">
            <p className="font-medium text-[var(--text-primary)] leading-tight truncate max-w-[100px]">{user?.name}</p>
            <p className="text-[10px] text-[var(--text-muted)] truncate max-w-[100px]">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-[var(--text-muted)] hover:text-rose-500 transition-colors cursor-pointer shrink-0"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
