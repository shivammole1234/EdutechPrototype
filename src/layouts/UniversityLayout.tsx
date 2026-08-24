import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Network,
  Users,
  FileCode2,
  BarChart3,
  FileSpreadsheet,
  Bell,
  Settings,
  X,
  School,
  Sparkles,
} from 'lucide-react';
import { TopNavbar } from '@/components/common/RoleSwitcher';
import { cn } from '@/lib/utils';

export const UniversityLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  React.useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

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
    if (path.includes('/university/dashboard')) return 'University Command Center';
    if (path.includes('/university/colleges/')) return 'College Profile & Telemetry';
    if (path.includes('/university/colleges')) return 'Affiliated Colleges';
    if (path.includes('/university/departments')) return 'Academic Departments';
    if (path.includes('/university/users')) return 'University Faculty & Staff';
    if (path.includes('/university/assessments')) return 'Systemwide Assessments';
    if (path.includes('/university/reports')) return 'Accreditation & Quality Reports';
    if (path.includes('/university/analytics')) return 'Cross-College Analytics';
    if (path.includes('/university/notifications')) return 'University Broadcasts';
    if (path.includes('/university/settings')) return 'University Governance & Settings';
    return 'University Console';
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
            <div className="w-8 h-8 bg-amber-500 rounded-md flex items-center justify-center font-bold text-black shadow-sm">
              <Building2 className="w-4 h-4 text-black" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-[var(--text-primary)] tracking-tight flex items-center gap-1.5">
                AI STUDIO <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-md font-mono">UNIV</span>
              </h2>
              <p className="text-[10px] text-[var(--text-muted)]">Apex Technical University</p>
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

        {/* University Badge Banner */}
        <div className="mx-3 mt-3 p-2.5 rounded-lg bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <School className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-medium text-[var(--text-primary)] truncate max-w-[130px]">Apex University System</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400">
            HQ
          </span>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-semibold px-2 mb-2">
            University Governance
          </div>

          <NavLink to="/university/dashboard" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <LayoutDashboard className="w-4 h-4 text-amber-500" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/university/colleges" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <Building2 className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Colleges</span>
          </NavLink>

          <NavLink to="/university/departments" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <Network className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Departments</span>
          </NavLink>

          <NavLink to="/university/users" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <Users className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Deans & Faculty</span>
          </NavLink>

          <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-semibold px-2 pt-4 mb-2">
            System Performance
          </div>

          <NavLink to="/university/assessments" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <FileCode2 className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Assessments</span>
          </NavLink>

          <NavLink to="/university/analytics" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <BarChart3 className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Analytics</span>
          </NavLink>

          <NavLink to="/university/reports" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <FileSpreadsheet className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Reports & Accreditation</span>
          </NavLink>

          <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-semibold px-2 pt-4 mb-2">
            System Administration
          </div>

          <NavLink to="/university/notifications" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <Bell className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Notifications</span>
          </NavLink>

          <NavLink to="/university/settings" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <Settings className="w-4 h-4 text-[var(--text-muted)]" />
            <span>University Settings</span>
          </NavLink>
        </nav>

        {/* Footer University Status */}
        <div className="p-4 border-t border-[var(--border-default)] bg-[var(--bg-surface)] text-xs">
          <div className="flex items-center justify-between text-[var(--text-secondary)]">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Accreditation:</span>
            </span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">TIER-1 ACTIVE</span>
          </div>
          <p className="text-[10px] text-[var(--text-muted)] mt-1 font-mono">3 Colleges • 1,970 Students</p>
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
