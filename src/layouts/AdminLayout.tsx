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
  Menu,
  X,
  CodeXml,
} from 'lucide-react';
import { TopNavbar } from '@/components/common/RoleSwitcher';
import { cn } from '@/lib/utils';

export const AdminLayout: React.FC = () => {
  const [usersOpen, setUsersOpen] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/admin/dashboard')) return 'Admin Overview';
    if (path.includes('/admin/users/students')) return 'Student Directory';
    if (path.includes('/admin/users/instructors')) return 'Instructor Management';
    if (path.includes('/admin/batches')) return 'Cohort & Batch Management';
    if (path.includes('/admin/assessments')) return 'Enterprise Assessments';
    if (path.includes('/admin/questions')) return 'Master Question Bank';
    if (path.includes('/admin/analytics')) return 'Platform Analytics';
    if (path.includes('/admin/reports')) return 'Academic & Compliance Reports';
    if (path.includes('/admin/notifications')) return 'Broadcast Center';
    if (path.includes('/admin/settings')) return 'Organization Settings';
    return 'Admin Console';
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
      isActive
        ? 'bg-[#27272a] text-white font-semibold'
        : 'text-[#a1a1aa] hover:bg-[#18181b] hover:text-white'
    );

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col md:flex-row">
      {/* Mobile Sidebar Toggle Button */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#09090b] border-b border-[#27272a]">
        <div className="flex items-center gap-2 font-bold text-[#fafafa]">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center font-bold text-white shadow-xs">
            <CodeXml className="w-4 h-4" />
          </div>
          <span className="font-bold tracking-tight text-sm">AI STUDIO <span className="text-purple-400 text-xs font-mono">ADMIN</span></span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-[#18181b] border border-[#27272a] text-[#a1a1aa]"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-[#09090b] border-r border-[#27272a] flex flex-col transition-transform duration-200 md:static md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand */}
        <div className="h-16 px-6 border-b border-[#27272a] flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center font-bold text-white shadow-sm shadow-blue-600/20">
            A
          </div>
          <div>
            <h2 className="font-bold text-sm text-[#fafafa] tracking-tight flex items-center gap-1.5">
              AI STUDIO <span className="text-[10px] px-1.5 py-0.2 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-md font-mono">ADMIN</span>
            </h2>
            <p className="text-[10px] text-[#71717a]">Enterprise LMS & Sandbox</p>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="text-[10px] uppercase tracking-widest text-[#71717a] font-semibold px-2 mb-2">
            Core Operations
          </div>

          <NavLink to="/admin/dashboard" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <LayoutDashboard className="w-4 h-4 text-purple-400" />
            <span>Overview</span>
          </NavLink>

          {/* Collapsible Users Submenu */}
          <div>
            <button
              onClick={() => setUsersOpen(!usersOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b] transition"
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-[#71717a]" />
                <span>User Directory</span>
              </div>
              {usersOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>

            {usersOpen && (
              <div className="pl-6 pr-1 pt-1 space-y-1">
                <NavLink to="/admin/users/students" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
                  <GraduationCap className="w-3.5 h-3.5 text-[#71717a]" />
                  <span>Students</span>
                </NavLink>
                <NavLink to="/admin/users/instructors" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
                  <UserCheck className="w-3.5 h-3.5 text-[#71717a]" />
                  <span>Instructors</span>
                </NavLink>
              </div>
            )}
          </div>

          <NavLink to="/admin/batches" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <Layers className="w-4 h-4 text-[#71717a]" />
            <span>Batches & Cohorts</span>
          </NavLink>

          <div className="text-[10px] uppercase tracking-widest text-[#71717a] font-semibold px-2 pt-4 mb-2">
            Academic Engine
          </div>

          <NavLink to="/admin/assessments" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <FileCode2 className="w-4 h-4 text-[#71717a]" />
            <span>Assessments</span>
          </NavLink>

          <NavLink to="/admin/questions" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <HelpCircle className="w-4 h-4 text-[#71717a]" />
            <span>Question Bank</span>
          </NavLink>

          <div className="text-[10px] uppercase tracking-widest text-[#71717a] font-semibold px-2 pt-4 mb-2">
            Intelligence & Control
          </div>

          <NavLink to="/admin/analytics" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <BarChart3 className="w-4 h-4 text-[#71717a]" />
            <span>Analytics</span>
          </NavLink>

          <NavLink to="/admin/reports" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <FileSpreadsheet className="w-4 h-4 text-[#71717a]" />
            <span>Reports</span>
          </NavLink>

          <NavLink to="/admin/notifications" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <Bell className="w-4 h-4 text-[#71717a]" />
            <span>Notifications</span>
          </NavLink>

          <NavLink to="/admin/settings" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
            <Settings className="w-4 h-4 text-[#71717a]" />
            <span>Settings</span>
          </NavLink>
        </nav>

        {/* Footer Org Info */}
        <div className="p-4 border-t border-[#27272a] bg-[#09090b] text-xs">
          <div className="flex items-center justify-between text-[#a1a1aa]">
            <span>Org Plan:</span>
            <span className="font-mono text-purple-400 font-semibold">ENTERPRISE</span>
          </div>
          <p className="text-[10px] text-[#71717a] mt-1 font-mono">Judge0 Sandboxes • Online</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#09090b]">
        <TopNavbar title={getPageTitle()} />
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
