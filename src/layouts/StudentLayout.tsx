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
  Menu,
  X,
  CodeXml,
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
        ? 'bg-[#27272a] text-white font-semibold'
        : 'text-[#a1a1aa] hover:bg-[#18181b] hover:text-white'
    );

  if (isAssessmentIDE) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col md:flex-row relative">
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] md:w-64 bg-[#09090b] border-r border-[#27272a] flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 shadow-2xl md:shadow-none',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand & Mobile Close Button */}
        <div className="h-16 px-4 sm:px-6 border-b border-[#27272a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#fafafa] rounded-md flex items-center justify-center font-bold text-[#09090b] shadow-sm">
              A
            </div>
            <div>
              <h2 className="font-bold text-sm text-[#fafafa] tracking-tight flex items-center gap-1.5">
                AI STUDIO <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md font-mono">LEARNER</span>
              </h2>
              <p className="text-[10px] text-[#71717a]">Student ID: 48291</p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 rounded-lg bg-[#18181b] border border-[#27272a] hover:border-[#3f3f46] text-[#a1a1aa] hover:text-[#fafafa] transition cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Streak Highlight Card */}
        <div className="p-3.5 mx-3 my-3 bg-[#18181b] border border-[#27272a] rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Flame className="w-4 h-4 fill-orange-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-[#71717a] tracking-wider">Coding Streak</p>
              <p className="text-xs font-mono font-bold text-[#fafafa]">14 Days Active</p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20 font-bold">+240 XP</span>
        </div>

        {/* Links */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <div className="text-[10px] uppercase tracking-widest text-[#71717a] font-semibold px-2 mb-2">
            Student Dashboard
          </div>

          <NavLink to="/student/dashboard" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <LayoutDashboard className="w-4 h-4 text-blue-400" />
            <span>Overview</span>
          </NavLink>

          <NavLink to="/student/classes" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <GraduationCap className="w-4 h-4 text-[#71717a]" />
            <div className="flex items-center justify-between flex-1">
              <span>Live Classes</span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono font-bold animate-pulse">
                🔴 LIVE
              </span>
            </div>
          </NavLink>

          <NavLink to="/student/assessments" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <FileCode2 className="w-4 h-4 text-[#71717a]" />
            <div className="flex items-center justify-between flex-1">
              <span>Assessments</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-500/20 text-blue-300 font-mono font-bold">1 LIVE</span>
            </div>
          </NavLink>

          <NavLink to="/student/assignments" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <FileText className="w-4 h-4 text-[#71717a]" />
            <span>Assignments</span>
          </NavLink>

          <div className="text-[10px] uppercase tracking-widest text-[#71717a] font-semibold px-2 pt-4 mb-2">
            Performance & Code
          </div>

          <NavLink to="/student/submissions" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <Clock3 className="w-4 h-4 text-[#71717a]" />
            <span>Submissions</span>
          </NavLink>

          <NavLink to="/student/performance" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <TrendingUp className="w-4 h-4 text-[#71717a]" />
            <span>Performance</span>
          </NavLink>

          <NavLink to="/student/notifications" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <Bell className="w-4 h-4 text-[#71717a]" />
            <span>Notifications</span>
          </NavLink>

          <div className="text-[10px] uppercase tracking-widest text-[#71717a] font-semibold px-2 pt-4 mb-2">
            Account Settings
          </div>

          <NavLink to="/student/profile" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <User className="w-4 h-4 text-[#71717a]" />
            <span>Profile</span>
          </NavLink>

          <NavLink to="/student/settings" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <Settings className="w-4 h-4 text-[#71717a]" />
            <span>Settings</span>
          </NavLink>
        </nav>

        {/* Footer info Bento */}
        <div className="p-4 border-t border-[#27272a] bg-[#09090b]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#27272a] border border-[#3f3f46] flex items-center justify-center text-xs font-bold text-[#fafafa]">
              AR
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-[#fafafa]">Alex Rivera</span>
              <span className="text-[10px] text-[#71717a] font-mono">Accuracy: 94.2%</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#09090b]">
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
