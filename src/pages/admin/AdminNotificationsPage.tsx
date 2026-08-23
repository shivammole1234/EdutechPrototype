import React, { useEffect, useState } from 'react';
import { Bell, Send, CheckCheck, Megaphone, Info } from 'lucide-react';
import { Notification } from '@/types';
import { notificationService } from '@/services/notificationService';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

export const AdminNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetRole, setTargetRole] = useState<'ALL' | 'STUDENT' | 'INSTRUCTOR'>('ALL');
  const [type, setType] = useState<'INFO' | 'WARNING' | 'SUCCESS'>('INFO');

  const loadNotifications = async () => {
    const list = await notificationService.getNotifications();
    setNotifications(list);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    await notificationService.sendBroadcast({
      title,
      message,
      role: targetRole,
      type,
    });
    setTitle('');
    setMessage('');
    loadNotifications();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">System Broadcast Center</h2>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5">
          Push platform alerts, maintenance banners, and cohort announcements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Send Broadcast Form */}
        <Card className="lg:col-span-1 p-5 space-y-4">
          <CardHeader className="mb-2">
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-[var(--primary)]" />
              New Broadcast
            </CardTitle>
          </CardHeader>

          <form onSubmit={handleBroadcast} className="space-y-3 text-xs">
            <Input
              label="Broadcast Title"
              placeholder="E.g., Platform Maintenance Window"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                Target Audience
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value as any)}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-hover)]"
              >
                <option value="ALL">All Users (Students + Instructors)</option>
                <option value="STUDENT">Students Only</option>
                <option value="INSTRUCTOR">Faculty Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                Notification Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-hover)]"
              >
                <option value="INFO">Informational (Blue)</option>
                <option value="WARNING">Maintenance / Warning (Amber)</option>
                <option value="SUCCESS">Achievement / Release (Green)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Message Body
              </label>
              <textarea
                rows={4}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]"
                placeholder="Details of the announcement..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <Button variant="primary" type="submit" className="w-full mt-2">
              <Send className="w-4 h-4 mr-1.5" />
              Dispatch Broadcast
            </Button>
          </form>
        </Card>

        {/* History List */}
        <Card className="lg:col-span-2 p-5">
          <CardHeader>
            <CardTitle>Sent Broadcasts & Logs</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="p-4 bg-[var(--bg-muted)]/50 border border-[var(--border-default)] rounded-xl space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        n.type === 'SUCCESS'
                          ? 'success'
                          : n.type === 'WARNING'
                          ? 'warning'
                          : 'primary'
                      }
                      size="sm"
                    >
                      {n.type}
                    </Badge>
                    <h4 className="font-semibold text-sm text-[var(--text-primary)]">{n.title}</h4>
                  </div>
                  <span className="text-[11px] text-[var(--text-muted)] font-mono">{formatDate(n.createdAt)}</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">{n.message}</p>
                <div className="text-[10px] text-[var(--primary)] font-mono">Target: {n.role}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export const AdminSettingsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Organization & Sandbox Settings</h2>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5">
          Compiler resource allocations, auto-grading sandboxes, and authentication SSO.
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Judge0 Isolated Sandbox Limits</h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <Input label="Max CPU Time Limit (Sec)" defaultValue="5" />
            <Input label="Max Memory Limit (MB)" defaultValue="256" />
            <Input label="Max Execution Threads" defaultValue="8" />
            <Input label="Default Compiler Language" defaultValue="TypeScript 5.x" />
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--border-default)] space-y-4">
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Anti-Cheating & Proctoring Defaults</h3>
          <div className="space-y-2 text-xs text-[var(--text-secondary)]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded accent-purple-500" />
              Enable tab switch telemetry & warning strikes by default
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded accent-purple-500" />
              Enforce fullscreen lockdown on all graded tests
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded accent-purple-500" />
              Disable copy/paste from external clipboards in Monaco IDE
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--border-default)] flex justify-end">
          <Button variant="primary" onClick={() => alert('Settings updated successfully!')}>
            Save Enterprise Policy
          </Button>
        </div>
      </Card>
    </div>
  );
};
