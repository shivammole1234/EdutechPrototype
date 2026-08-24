import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  GraduationCap,
  HelpCircle,
  FileCode2,
  FileText,
  UserCheck2,
  Video,
  BarChart3,
  FileSpreadsheet,
  Bell,
  Settings,
  X,
  Briefcase,
} from 'lucide-react';
import { TopNavbar } from '@/components/common/RoleSwitcher';
import { cn } from '@/lib/utils';

export const InstructorLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

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
    if (path.includes('/instructor/dashboard')) return 'Instructor Command Center';
    if (path.includes('/instructor/batches')) return 'Assigned Batches';
    if (path.includes('/instructor/attendance')) return 'Class Attendance & Sessions';
    if (path.includes('/instructor/students')) return 'Student Performance & Profiles';
    if (path.includes('/instructor/questions/new')) return 'Create Coding Question';
    if (path.includes('/instructor/questions')) return 'Question Bank';
    if (path.includes('/instructor/assessments/new')) return 'Assessment Wizard';
    if (path.includes('/instructor/assessments')) return 'Assessments & Proctoring';
    if (path.includes('/instructor/assignments')) return 'Assignments & Homework';
    if (path.includes('/instructor/live-sessions')) return 'Live Coding Lab & Proctoring';
    if (path.includes('/instructor/analytics')) return 'Batch Performance Analytics';
    if (path.includes('/instructor/reports')) return 'Instructor Reports';
    if (path.includes('/instructor/notifications')) return 'Instructor Notifications';
    if (path.includes('/instructor/settings')) return 'Instructor Preferences';
    return 'Instructor Portal';
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors min-h-[40px]',
      isActive
        ? 'bg-[var(--bg-surface-active)] text-[var(--text-primary)] font-semibold'
        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]'
    );

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
                AI STUDIO <span className="text-[10px] px-1.5 py-0.2 bg-[var(--bg-surface-secondary)] text-[var(--text-primary)] border border-[var(--border-hover)] rounded-md font-mono">FACULTY</span>
              </h2>
              <p className="text-[10px] text-[var(--text-muted)]">Classroom & Proctoring</p>
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

        {/* Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-semibold px-2 mb-2">
            Classroom & Teaching
          </div>

          <NavLink to="/instructor/dashboard" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <LayoutDashboard className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Overview</span>
          </NavLink>

          <NavLink to="/instructor/batches" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <Layers className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Batches</span>
          </NavLink>

          <NavLink to="/instructor/students" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <GraduationCap className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Students</span>
          </NavLink>

          <NavLink to="/instructor/attendance" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <UserCheck2 className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Attendance</span>
          </NavLink>

          <NavLink to="/instructor/live-sessions" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <Video className="w-4 h-4 text-[var(--text-muted)]" />
            <div className="flex items-center justify-between flex-1">
              <span>Live Coding Lab</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
          </NavLink>

          <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-semibold px-2 pt-4 mb-2">
            Assessments & Content
          </div>

          <NavLink to="/instructor/questions" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <HelpCircle className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Question Bank</span>
          </NavLink>

          <NavLink to="/instructor/assessments" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <FileCode2 className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Assessments</span>
          </NavLink>

          <NavLink to="/instructor/assignments" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <FileText className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Assignments</span>
          </NavLink>

          <NavLink to="/instructor/interviews" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <Briefcase className="w-4 h-4 text-[var(--text-muted)]" />
            <div className="flex items-center justify-between flex-1">
              <span>Interviews</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-[var(--bg-surface-secondary)] text-[var(--text-secondary)] border border-[var(--border-default)] rounded font-mono font-medium">
                Batch
              </span>
            </div>
          </NavLink>

          <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-semibold px-2 pt-4 mb-2">
            Insights & Settings
          </div>

          <NavLink to="/instructor/analytics" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <BarChart3 className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Analytics</span>
          </NavLink>

          <NavLink to="/instructor/reports" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <FileSpreadsheet className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Reports</span>
          </NavLink>

          <NavLink to="/instructor/notifications" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <Bell className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Notifications</span>
          </NavLink>

          <NavLink to="/instructor/settings" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <Settings className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Settings</span>
          </NavLink>
        </nav>

        {/* Footer info Bento */}
        <div className="p-4 border-t border-[var(--border-default)] bg-[var(--bg-surface)] text-xs">
          <p className="font-semibold text-[var(--text-primary)]">Live Proctor Engine</p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-0.5 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Tab & Focus Monitor Active
          </p>
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
