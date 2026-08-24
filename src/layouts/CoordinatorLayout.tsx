import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  GraduationCap,
  Layers,
  FileCode2,
  HelpCircle,
  BarChart3,
  FileSpreadsheet,
  Bell,
  Settings,
  ChevronDown,
  ChevronRight,
  X,
  School,
  Building2,
} from 'lucide-react';
import { TopNavbar } from '@/components/common/RoleSwitcher';
import { useAuthStore } from '@/stores/useAuthStore';
import { cn } from '@/lib/utils';

export const CoordinatorLayout: React.FC = () => {
  const [usersOpen, setUsersOpen] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuthStore();

  // Close sidebar on route change
  React.useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Handle escape key and lock body scroll on mobile
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);

    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/coordinator/dashboard') || path.includes('/admin/dashboard')) return 'Department Co-ordinator Command Center';
    if (path.includes('/users/students')) return 'Department Student Directory';
    if (path.includes('/users/instructors')) return 'Department Faculty Management';
    if (path.includes('/batches')) return 'Department Batches & Cohorts';
    if (path.includes('/assessments')) return 'Department Assessments';
    if (path.includes('/questions')) return 'Curriculum Question Bank';
    if (path.includes('/analytics')) return 'Department Analytics';
    if (path.includes('/reports')) return 'Department Performance Reports';
    if (path.includes('/notifications')) return 'Department Announcements';
    if (path.includes('/settings')) return 'Department Settings';
    return 'Department Console';
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors min-h-[40px]',
      isActive
        ? 'bg-[var(--bg-surface-active)] text-[var(--text-primary)] font-semibold'
        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]'
    );

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col md:flex-row relative">
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] md:w-64 bg-[var(--bg-surface)] border-r border-[var(--border-default)] flex flex-col transition-transform duration-300 ease-in-out md:sticky md:top-0 md:h-screen md:shrink-0 md:translate-x-0 shadow-2xl md:shadow-none',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand & Mobile Close Button */}
        <div className="h-16 px-4 sm:px-6 border-b border-[var(--border-default)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-md flex items-center justify-center font-bold text-white shadow-sm">
              <School className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-[var(--text-primary)] tracking-tight flex items-center gap-1.5">
                AI STUDIO <span className="text-[10px] px-1.5 py-0.2 bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 rounded-md font-mono">COORDINATOR</span>
              </h2>
              <p className="text-[10px] text-[var(--text-muted)]">College & Department Portal</p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 rounded-lg bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] hover:border-[var(--border-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Assigned Hierarchy Banner */}
        <div className="mx-3 mt-3 p-2.5 rounded-lg bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-[var(--text-secondary)] font-medium">
              <Building2 className="w-3 h-3 text-purple-500" />
              <span className="truncate max-w-[120px]">{user?.collegeCode || 'ACET'}</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.2 font-mono rounded bg-purple-500/15 text-purple-600 dark:text-purple-400 font-semibold">
              COLLEGE
            </span>
          </div>
          <p className="text-[10px] text-[var(--text-muted)] truncate">
            {user?.departmentName || 'Computer Science & Engineering'}
          </p>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-semibold px-2 mb-2">
            Department Ops
          </div>

          <NavLink to="/coordinator/dashboard" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <LayoutDashboard className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Overview</span>
          </NavLink>

          {/* Collapsible Users Submenu */}
          <div>
            <button
              onClick={() => setUsersOpen(!usersOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition min-h-[40px] cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-[var(--text-muted)]" />
                <span>Department Users</span>
              </div>
              {usersOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>

            {usersOpen && (
              <div className="pl-6 pr-1 pt-1 space-y-1">
                <NavLink to="/coordinator/users/students" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
                  <GraduationCap className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  <span>Students</span>
                </NavLink>
                <NavLink to="/coordinator/users/instructors" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
                  <UserCheck className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  <span>Faculty & Instructors</span>
                </NavLink>
              </div>
            )}
          </div>

          <NavLink to="/coordinator/batches" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <Layers className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Batches & Cohorts</span>
          </NavLink>

          <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-semibold px-2 pt-4 mb-2">
            Curriculum & Tests
          </div>

          <NavLink to="/coordinator/assessments" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <FileCode2 className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Assessments</span>
          </NavLink>

          <NavLink to="/coordinator/questions" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <HelpCircle className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Question Bank</span>
          </NavLink>

          <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-semibold px-2 pt-4 mb-2">
            Intelligence & Control
          </div>

          <NavLink to="/coordinator/analytics" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <BarChart3 className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Analytics</span>
          </NavLink>

          <NavLink to="/coordinator/reports" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <FileSpreadsheet className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Reports</span>
          </NavLink>

          <NavLink to="/coordinator/notifications" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <Bell className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Notifications</span>
          </NavLink>

          <NavLink to="/coordinator/settings" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <Settings className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Settings</span>
          </NavLink>
        </nav>

        {/* Footer Org Info */}
        <div className="p-4 border-t border-[var(--border-default)] bg-[var(--bg-surface)] text-xs">
          <div className="flex items-center justify-between text-[var(--text-secondary)]">
            <span>Hierarchy Scope:</span>
            <span className="font-mono text-purple-600 dark:text-purple-400 font-semibold">DEPARTMENT</span>
          </div>
          <p className="text-[10px] text-[var(--text-muted)] mt-1 font-mono">College: ACET • 840 Students</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[var(--bg-canvas)]">
        <TopNavbar
          title={getPageTitle()}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          isSidebarOpen={sidebarOpen}
        />
        <main className="flex-1 p-3 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
