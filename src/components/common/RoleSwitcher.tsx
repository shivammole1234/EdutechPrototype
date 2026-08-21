import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, GraduationCap, Code2, Check, Sun, Moon, Bell, LogOut, ChevronDown, User } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { UserRole } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export const TopNavbar: React.FC<{ title?: string }> = ({ title }) => {
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
    <header className="h-16 border-b border-[#27272a] bg-[#09090b] sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between">
      {/* Left Title / Breadcrumb context */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-[#a1a1aa]">
        <span className="text-[#71717a]">Portal</span>
        <span className="text-[#3f3f46]">/</span>
        <span className="text-white font-medium">{title || 'Overview'}</span>
      </div>

      {/* Center Search Input */}
      <div className="hidden lg:flex items-center relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Quick search (Cmd+K)"
          className="bg-[#18181b] border border-[#27272a] rounded-lg px-4 py-1.5 text-xs w-64 focus:outline-none focus:ring-1 focus:ring-blue-500 text-[#a1a1aa] placeholder:text-[#71717a] transition-all"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Quick Role Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] rounded-lg text-xs font-medium text-[#fafafa] transition-all cursor-pointer shadow-xs"
            title="Switch demo portal role"
          >
            <span className="text-[#71717a]">View as:</span>
            <Badge variant={user ? roleColors[user.role] : 'default'} size="sm">
              {user?.role === 'ADMIN' && <Shield className="w-3 h-3" />}
              {user?.role === 'INSTRUCTOR' && <GraduationCap className="w-3 h-3" />}
              {user?.role === 'STUDENT' && <Code2 className="w-3 h-3" />}
              {user?.role}
            </Badge>
            <ChevronDown className="w-3.5 h-3.5 text-[#71717a]" />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-64 bg-[#18181b] border border-[#27272a] rounded-2xl shadow-xl z-50 p-2 text-xs space-y-1">
                <div className="px-3 py-2 border-b border-[#27272a]">
                  <p className="font-bold text-[#fafafa]">Switch Active Portal</p>
                  <p className="text-[10px] text-[#71717a] mt-0.5">Explore each dedicated dashboard</p>
                </div>

                <button
                  onClick={() => handleRoleChange('STUDENT')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#27272a] transition cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Code2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#fafafa]">Student Portal</p>
                      <p className="text-[10px] text-[#71717a]">Alex Turner • IDE & Classes</p>
                    </div>
                  </div>
                  {user?.role === 'STUDENT' && <Check className="w-4 h-4 text-emerald-400" />}
                </button>

                <button
                  onClick={() => handleRoleChange('INSTRUCTOR')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#27272a] transition cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#fafafa]">Instructor Portal</p>
                      <p className="text-[10px] text-[#71717a]">Dr. Elena • Proctoring & Tests</p>
                    </div>
                  </div>
                  {user?.role === 'INSTRUCTOR' && <Check className="w-4 h-4 text-blue-400" />}
                </button>

                <button
                  onClick={() => handleRoleChange('ADMIN')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#27272a] transition cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#fafafa]">Admin Portal</p>
                      <p className="text-[10px] text-[#71717a]">Marcus Vance • Users & Org</p>
                    </div>
                  </div>
                  {user?.role === 'ADMIN' && <Check className="w-4 h-4 text-purple-400" />}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#18181b] border border-[#27272a] text-[#a1a1aa] hover:text-[#fafafa] hover:border-[#3f3f46] transition-colors cursor-pointer"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
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
          className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-[#18181b] border border-[#27272a] text-[#a1a1aa] hover:text-[#fafafa] hover:border-[#3f3f46] transition-colors cursor-pointer"
        >
          <Bell className="w-3.5 h-3.5" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 ring-2 ring-[#18181b]" />
        </button>

        {/* User Avatar & Logout */}
        <div className="flex items-center gap-3 pl-2 border-l border-[#27272a]">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={user?.name}
            className="w-8 h-8 rounded-full object-cover border border-[#27272a]"
          />
          <div className="hidden md:block text-left text-xs">
            <p className="font-medium text-[#fafafa] leading-tight">{user?.name}</p>
            <p className="text-[10px] text-[#71717a]">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-[#71717a] hover:text-rose-400 transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
