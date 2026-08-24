import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  FileCode2,
  FileText,
  Clock3,
  TrendingUp,
  Bell,
  User,
  Settings,
  X,
  Flame,
} from 'lucide-react';
import { TopNavbar } from '@/components/common/RoleSwitcher';
import { cn } from '@/lib/utils';

export const StudentLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar when route changes
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

  // If in assessment IDE, don't show full dashboard layout container if it's full screen
  const isAssessmentIDE = location.pathname.includes('/student/assessments/') && location.pathname.includes('/question/');

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/student/dashboard')) return 'Student Workspace';
    if (path.includes('/student/classes')) return 'Enrolled Classes & Syllabus';
    if (path.includes('/student/assessments')) return 'Timed Coding Assessments';
    if (path.includes('/student/assignments')) return 'Course Assignments & Labs';
    if (path.includes('/student/submissions')) return 'My Submissions & Execution Log';
    if (path.includes('/student/performance')) return 'Skill Radar & Progress';
    if (path.includes('/student/notifications')) return 'Student Notifications';
    if (path.includes('/student/profile')) return 'Developer Profile & Badges';
    if (path.includes('/student/settings')) return 'Preferences & IDE Setup';
    return 'Student Portal';
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors min-h-[40px]',
      isActive
        ? 'bg-[var(--bg-surface-active)] text-[var(--text-primary)] font-semibold'
        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]'
    );

  if (isAssessmentIDE) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col lg:flex-row relative">
      {/* Mobile & Tablet Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] lg:w-64 bg-[var(--bg-surface)] border-r border-[var(--border-default)] flex flex-col transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:shrink-0 lg:translate-x-0 shadow-2xl lg:shadow-none',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand & Mobile/Tablet Close Button */}
        <div className="h-16 px-4 sm:px-6 border-b border-[var(--border-default)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[var(--text-primary)] rounded-md flex items-center justify-center font-bold text-[var(--bg-canvas)] shadow-sm">
              A
            </div>
            <div>
              <h2 className="font-bold text-sm text-[var(--text-primary)] tracking-tight flex items-center gap-1.5">
                AI STUDIO <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-md font-mono">LEARNER</span>
              </h2>
              <p className="text-[10px] text-[var(--text-muted)]">Student ID: 48291</p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] hover:border-[var(--border-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Streak Highlight Card */}
        <div className="p-3.5 mx-3 my-3 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
              <Flame className="w-4 h-4 fill-orange-500" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">Coding Streak</p>
              <p className="text-xs font-mono font-bold text-[var(--text-primary)]">14 Days Active</p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono border border-emerald-500/20 font-bold">+240 XP</span>
        </div>

        {/* Links */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-semibold px-2 mb-2">
            Student Dashboard
          </div>

          <NavLink to="/student/dashboard" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <LayoutDashboard className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Overview</span>
          </NavLink>

          <NavLink to="/student/classes" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <GraduationCap className="w-4 h-4 text-[var(--text-muted)]" />
            <div className="flex items-center justify-between flex-1">
              <span>Live Classes</span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30 font-mono font-bold animate-pulse">
                🔴 LIVE
              </span>
            </div>
          </NavLink>

          <NavLink to="/student/assessments" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <FileCode2 className="w-4 h-4 text-[var(--text-muted)]" />
            <div className="flex items-center justify-between flex-1">
              <span>Assessments</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[var(--bg-surface-secondary)] text-[var(--text-primary)] border border-[var(--border-default)] font-mono font-bold">1 LIVE</span>
            </div>
          </NavLink>

          <NavLink to="/student/assignments" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <FileText className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Assignments</span>
          </NavLink>

          <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-semibold px-2 pt-4 mb-2">
            Performance & Code
          </div>

          <NavLink to="/student/submissions" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <Clock3 className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Submissions</span>
          </NavLink>

          <NavLink to="/student/performance" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <TrendingUp className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Performance</span>
          </NavLink>

          <NavLink to="/student/notifications" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <Bell className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Notifications</span>
          </NavLink>

          <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-semibold px-2 pt-4 mb-2">
            Account Settings
          </div>

          <NavLink to="/student/profile" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <User className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Profile</span>
          </NavLink>

          <NavLink to="/student/settings" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <Settings className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Settings</span>
          </NavLink>
        </nav>

        {/* Footer info Bento */}
        <div className="p-4 border-t border-[var(--border-default)] bg-[var(--bg-surface)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] flex items-center justify-center text-xs font-bold text-[var(--text-primary)]">
              AR
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-[var(--text-primary)]">Alex Rivera</span>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">Accuracy: 94.2%</span>
            </div>
          </div>
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
