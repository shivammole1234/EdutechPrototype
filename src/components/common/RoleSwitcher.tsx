import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Network,
  GraduationCap,
  Code2,
  Check,
  Sun,
  Moon,
  Bell,
  LogOut,
  ChevronDown,
  Menu,
  X,
  School,
  Search,
  UserCheck,
  Users,
  Shield,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAuthStore, ALL_DEMO_ACCOUNTS, MOCK_USERS } from '@/stores/useAuthStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { User, UserRole } from '@/types';
import { Badge } from '@/components/ui/Badge';

interface TopNavbarProps {
  title?: string;
  onMenuToggle?: () => void;
  isSidebarOpen?: boolean;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ title, onMenuToggle, isSidebarOpen }) => {
  const { user, switchAccount, switchRole, logout, notificationMessage, clearNotification } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'hierarchy' | 'all'>('hierarchy');
  const [searchFilter, setSearchFilter] = useState('');

  // Auto-dismiss notification toast
  React.useEffect(() => {
    if (notificationMessage) {
      const timer = setTimeout(() => {
        clearNotification();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [notificationMessage, clearNotification]);

  const handleSelectAccount = (targetUser: User) => {
    switchAccount(targetUser);
    setSwitcherOpen(false);
    setProfileMenuOpen(false);

    // Navigate to role-specific portal landing
    if (targetUser.role === 'UNIVERSITY_ADMIN') {
      navigate('/university/dashboard');
    } else if (
      targetUser.role === 'DEPARTMENT_COORDINATOR' ||
      targetUser.role === 'ADMIN' ||
      targetUser.role === 'COLLEGE'
    ) {
      navigate('/coordinator/dashboard');
    } else if (targetUser.role === 'INSTRUCTOR') {
      navigate('/instructor/dashboard');
    } else {
      navigate('/student/dashboard');
    }
  };

  const handleSelectRole = (role: UserRole) => {
    const updatedUser = switchRole(role);
    setSwitcherOpen(false);
    setProfileMenuOpen(false);

    if (role === 'UNIVERSITY_ADMIN') navigate('/university/dashboard');
    else if (role === 'DEPARTMENT_COORDINATOR' || role === 'ADMIN' || role === 'COLLEGE') {
      navigate('/coordinator/dashboard');
    } else if (role === 'INSTRUCTOR') navigate('/instructor/dashboard');
    else navigate('/student/dashboard');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleColors: Record<string, 'purple' | 'primary' | 'success' | 'warning' | 'default'> = {
    UNIVERSITY_ADMIN: 'warning',
    COLLEGE: 'purple',
    DEPARTMENT_COORDINATOR: 'purple',
    ADMIN: 'purple',
    INSTRUCTOR: 'primary',
    STUDENT: 'success',
  };

  const formatRoleLabel = (r?: UserRole | string) => {
    if (r === 'UNIVERSITY_ADMIN') return 'University Admin';
    if (r === 'COLLEGE') return 'College Admin';
    if (r === 'DEPARTMENT_COORDINATOR' || r === 'ADMIN') return 'Dept. Co-ordinator';
    if (r === 'INSTRUCTOR') return 'Instructor';
    if (r === 'STUDENT') return 'Student';
    return r || 'User';
  };

  const getRoleIcon = (role?: UserRole | string, className = 'w-4 h-4') => {
    switch (role) {
      case 'UNIVERSITY_ADMIN':
        return <Building2 className={`${className} text-amber-500`} />;
      case 'COLLEGE':
        return <School className={`${className} text-indigo-500`} />;
      case 'DEPARTMENT_COORDINATOR':
      case 'ADMIN':
        return <Network className={`${className} text-purple-500`} />;
      case 'INSTRUCTOR':
        return <GraduationCap className={`${className} text-blue-500`} />;
      case 'STUDENT':
        return <Code2 className={`${className} text-emerald-500`} />;
      default:
        return <UserCheck className={`${className} text-[var(--text-muted)]`} />;
    }
  };

  const filteredAccounts = useMemo(() => {
    if (!searchFilter.trim()) return ALL_DEMO_ACCOUNTS;
    const q = searchFilter.toLowerCase();
    return ALL_DEMO_ACCOUNTS.filter(
      (acc) =>
        acc.name.toLowerCase().includes(q) ||
        acc.role.toLowerCase().includes(q) ||
        acc.email.toLowerCase().includes(q) ||
        (acc.collegeCode && acc.collegeCode.toLowerCase().includes(q)) ||
        (acc.collegeName && acc.collegeName.toLowerCase().includes(q)) ||
        (acc.departmentName && acc.departmentName.toLowerCase().includes(q)) ||
        (acc.batchName && acc.batchName.toLowerCase().includes(q))
    );
  }, [searchFilter]);

  // Primary 5 tier roles for quick switch
  const hierarchyTiers = [
    {
      role: 'UNIVERSITY_ADMIN' as UserRole,
      title: 'University Admin',
      subtitle: 'Dr. Arthur Vance • Systemwide Chancellor',
      account: ALL_DEMO_ACCOUNTS[0],
      icon: <Building2 className="w-4 h-4" />,
      colorClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      activeBorder: 'border-amber-500',
    },
    {
      role: 'COLLEGE' as UserRole,
      title: 'College Admin / Dean',
      subtitle: 'Dr. Richard Thorne • ACET Main Campus',
      account: ALL_DEMO_ACCOUNTS[2],
      icon: <School className="w-4 h-4" />,
      colorClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      activeBorder: 'border-indigo-500',
    },
    {
      role: 'DEPARTMENT_COORDINATOR' as UserRole,
      title: 'Department Co-ordinator',
      subtitle: 'Prof. Marcus Vance • ACET (CSE Department)',
      account: ALL_DEMO_ACCOUNTS[4],
      icon: <Network className="w-4 h-4" />,
      colorClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      activeBorder: 'border-purple-500',
    },
    {
      role: 'INSTRUCTOR' as UserRole,
      title: 'Instructor',
      subtitle: 'Dr. Elena Rostova • Algorithms & Proctoring',
      account: ALL_DEMO_ACCOUNTS[6],
      icon: <GraduationCap className="w-4 h-4" />,
      colorClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      activeBorder: 'border-blue-500',
    },
    {
      role: 'STUDENT' as UserRole,
      title: 'Student',
      subtitle: 'Alex Turner • Full Stack IDE & Assessments',
      account: ALL_DEMO_ACCOUNTS[8],
      icon: <Code2 className="w-4 h-4" />,
      colorClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      activeBorder: 'border-emerald-500',
    },
  ];

  return (
    <>
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
            {user?.collegeCode && (
              <span className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] text-[var(--text-muted)]">
                <School className="w-2.5 h-2.5" />
                {user.collegeCode}
              </span>
            )}
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Main Role & Account Switcher Dropdown Button */}
          <div className="relative">
            <button
              id="hierarchy-role-switcher-btn"
              onClick={() => {
                setSwitcherOpen(!switcherOpen);
                setProfileMenuOpen(false);
              }}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer shadow-xs border ${
                switcherOpen
                  ? 'bg-[var(--bg-surface-hover)] border-[var(--border-focus)] ring-1 ring-[var(--border-focus)]'
                  : 'bg-[var(--bg-surface-secondary)] hover:bg-[var(--bg-surface-hover)] border-[var(--border-default)] text-[var(--text-primary)]'
              }`}
              title="Switch account or explore academic hierarchy roles"
            >
              <span className="text-[var(--text-muted)] hidden sm:inline">View as:</span>
              <Badge
                variant={user ? roleColors[user.role] : 'default'}
                size="sm"
                className="px-1.5 sm:px-2 py-0.5 flex items-center gap-1.5 font-medium"
              >
                {getRoleIcon(user?.role, 'w-3 h-3')}
                <span className="truncate max-w-[120px]">{formatRoleLabel(user?.role)}</span>
              </Badge>
              <ChevronDown className={`w-3.5 h-3.5 text-[var(--text-muted)] transition-transform duration-200 ${switcherOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Hierarchy & Account Switcher Popover */}
            {switcherOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => {
                    setSwitcherOpen(false);
                    setSearchFilter('');
                  }}
                />
                <div
                  id="hierarchy-role-switcher-popover"
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl shadow-[var(--modal-shadow)] z-50 p-3 text-xs space-y-2.5 max-h-[85vh] flex flex-col"
                >
                  {/* Popover Header */}
                  <div className="pb-2 border-b border-[var(--border-default)]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <p className="font-bold text-[var(--text-primary)] text-sm">Switch Account & Role</p>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--bg-surface-secondary)] text-[var(--text-muted)] border border-[var(--border-default)]">
                        5-Tier Access
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                      Explore the University → College → Department → Cohort hierarchy
                    </p>

                    {/* View Tabs */}
                    <div className="flex items-center gap-1 mt-2.5 p-0.5 rounded-lg bg-[var(--bg-surface-secondary)] border border-[var(--border-default)]">
                      <button
                        onClick={() => setActiveTab('hierarchy')}
                        className={`flex-1 py-1 px-2 rounded-md font-medium text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          activeTab === 'hierarchy'
                            ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs font-semibold'
                            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <Layers className="w-3 h-3" />
                        Hierarchy Roles
                      </button>
                      <button
                        onClick={() => setActiveTab('all')}
                        className={`flex-1 py-1 px-2 rounded-md font-medium text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          activeTab === 'all'
                            ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs font-semibold'
                            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <Users className="w-3 h-3" />
                        All Accounts ({ALL_DEMO_ACCOUNTS.length})
                      </button>
                    </div>
                  </div>

                  {/* Search box for All Accounts view */}
                  {activeTab === 'all' && (
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        placeholder="Filter by name, college (ACET), role..."
                        className="w-full bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--border-focus)]"
                        autoFocus
                      />
                    </div>
                  )}

                  {/* Tab 1: 5-Tier Hierarchy Quick Switch */}
                  {activeTab === 'hierarchy' && (
                    <div className="space-y-1.5 overflow-y-auto max-h-[340px] pr-0.5">
                      {hierarchyTiers.map((tier) => {
                        const isCurrent = user?.role === tier.role || (tier.role === 'DEPARTMENT_COORDINATOR' && user?.role === 'ADMIN');
                        return (
                          <button
                            key={tier.role}
                            onClick={() => handleSelectAccount(tier.account)}
                            className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition cursor-pointer text-left ${
                              isCurrent
                                ? 'bg-[var(--bg-surface-secondary)] border-[var(--border-focus)] shadow-xs'
                                : 'border-transparent hover:bg-[var(--bg-surface-hover)] hover:border-[var(--border-default)]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={`p-2 rounded-lg border shrink-0 ${tier.colorClass}`}>
                                {tier.icon}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <p className="font-semibold text-[var(--text-primary)] truncate">{tier.title}</p>
                                  {isCurrent && (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                      ACTIVE
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-[var(--text-muted)] truncate">{tier.subtitle}</p>
                              </div>
                            </div>
                            <div className="shrink-0 pl-2">
                              {isCurrent ? (
                                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] opacity-50 group-hover:opacity-100" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Tab 2: Full Switchable Accounts List */}
                  {activeTab === 'all' && (
                    <div className="space-y-1.5 overflow-y-auto max-h-[320px] pr-0.5">
                      {filteredAccounts.length === 0 ? (
                        <div className="p-4 text-center text-[var(--text-muted)]">
                          No matching accounts found for "{searchFilter}"
                        </div>
                      ) : (
                        filteredAccounts.map((account) => {
                          const isCurrent = user?.id === account.id;
                          return (
                            <button
                              key={account.id}
                              onClick={() => handleSelectAccount(account)}
                              className={`w-full flex items-center justify-between p-2 rounded-xl border transition cursor-pointer text-left ${
                                isCurrent
                                  ? 'bg-[var(--bg-surface-secondary)] border-[var(--border-focus)] shadow-xs'
                                  : 'border-transparent hover:bg-[var(--bg-surface-hover)] hover:border-[var(--border-default)]'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <img
                                  src={account.avatar}
                                  alt={account.name}
                                  className="w-8 h-8 rounded-full object-cover border border-[var(--border-default)] shrink-0"
                                />
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <p className="font-semibold text-[var(--text-primary)] truncate">{account.name}</p>
                                    <Badge variant={roleColors[account.role]} size="sm" className="text-[9px] px-1 py-0">
                                      {formatRoleLabel(account.role)}
                                    </Badge>
                                  </div>
                                  <p className="text-[10px] text-[var(--text-muted)] truncate">
                                    {account.collegeCode ? `${account.collegeCode} • ` : ''}
                                    {account.departmentName || account.batchName || account.email}
                                  </p>
                                </div>
                              </div>
                              <div className="shrink-0 pl-2">
                                {isCurrent ? (
                                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                ) : (
                                  <span className="text-[10px] text-[var(--text-muted)] font-medium hover:text-[var(--text-primary)]">
                                    Switch
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}

                  {/* Popover Footer Info */}
                  <div className="pt-2 border-t border-[var(--border-default)] flex items-center justify-between text-[10px] text-[var(--text-muted)]">
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-emerald-500" />
                      Role-based access enforced
                    </span>
                    <button
                      onClick={() => {
                        setSwitcherOpen(false);
                        navigate('/login');
                      }}
                      className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline cursor-pointer"
                    >
                      Login screen →
                    </button>
                  </div>
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
              if (user?.role === 'UNIVERSITY_ADMIN') navigate('/university/notifications');
              else if (user?.role === 'DEPARTMENT_COORDINATOR' || user?.role === 'ADMIN' || user?.role === 'COLLEGE') {
                navigate('/coordinator/notifications');
              } else if (user?.role === 'INSTRUCTOR') navigate('/instructor/notifications');
              else navigate('/student/notifications');
            }}
            className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-colors cursor-pointer shrink-0"
            title="Notifications"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--text-primary)] ring-2 ring-[var(--bg-surface)]" />
          </button>

          {/* User Profile Menu Dropdown */}
          <div className="relative pl-1.5 sm:pl-2 border-l border-[var(--border-default)]">
            <button
              onClick={() => {
                setProfileMenuOpen(!profileMenuOpen);
                setSwitcherOpen(false);
              }}
              className="flex items-center gap-2 text-left cursor-pointer p-1 rounded-xl hover:bg-[var(--bg-surface-hover)] transition"
              title="User profile & account management"
            >
              <div className="relative shrink-0">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full object-cover border border-[var(--border-default)]"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[var(--bg-surface)]" />
              </div>
              <div className="hidden lg:block text-left text-xs">
                <p className="font-medium text-[var(--text-primary)] leading-tight truncate max-w-[110px]">{user?.name}</p>
                <p className="text-[10px] text-[var(--text-muted)] truncate max-w-[110px]">
                  {user?.collegeCode || user?.email}
                </p>
              </div>
              <ChevronDown className="w-3 h-3 text-[var(--text-muted)] hidden lg:block" />
            </button>

            {/* Profile Menu Popover */}
            {profileMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-72 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl shadow-[var(--modal-shadow)] z-50 p-2.5 text-xs space-y-2">
                  {/* Current User Card */}
                  <div className="p-3 rounded-xl bg-[var(--bg-surface-secondary)] border border-[var(--border-default)]">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={user?.avatar}
                        alt={user?.name}
                        className="w-10 h-10 rounded-full object-cover border border-[var(--border-default)]"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-[var(--text-primary)] truncate">{user?.name}</p>
                        <p className="text-[10px] text-[var(--text-muted)] truncate">{user?.email}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge variant={user ? roleColors[user.role] : 'default'} size="sm" className="text-[9px] px-1.5 py-0">
                            {formatRoleLabel(user?.role)}
                          </Badge>
                          {user?.collegeCode && (
                            <span className="text-[9px] font-mono px-1 rounded bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-muted)]">
                              {user.collegeCode}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Switch Account Quick Button */}
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      setSwitcherOpen(true);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] transition cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-500" />
                      <span>Switch Account / Persona</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  </button>

                  <div className="border-t border-[var(--border-default)] my-1" />

                  {/* Sign Out */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 transition cursor-pointer text-left font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Floating Notification Toast */}
      {notificationMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-emerald-500/30 text-[var(--text-primary)] shadow-lg animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-xs font-medium">{notificationMessage}</p>
          <button
            onClick={clearNotification}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] ml-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </>
  );
};

