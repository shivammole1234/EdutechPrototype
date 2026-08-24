import React, { useState } from 'react';
import {
  Bell,
  Send,
  Building2,
  AlertCircle,
  Info,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface Directive {
  id: string;
  title: string;
  scope: string;
  type: 'DIRECTIVE' | 'MEMO' | 'CRITICAL';
  date: string;
  content: string;
  issuedBy: string;
}

const INITIAL_DIRECTIVES: Directive[] = [
  {
    id: 'dir_01',
    title: 'Standardized ABET Midterm Assessment Scheduling Directive',
    scope: 'ALL COLLEGES (ACET, AIAC, SSCA)',
    type: 'DIRECTIVE',
    date: 'Aug 24, 2025',
    content: 'All constituent colleges are mandated to conduct the Fall 2025 Midterm coding evaluation between Sept 10 - Sept 15 under strict AI proctoring protocols.',
    issuedBy: 'Office of the Chancellor',
  },
  {
    id: 'dir_02',
    title: 'Judge0 Sandbox Engine Upgrade & C++20 Runtime Deployment',
    scope: 'ACET & AIAC',
    type: 'MEMO',
    date: 'Aug 20, 2025',
    content: 'The university cloud compute cluster has updated sandboxes to GCC 13 and Python 3.12 with 256MB memory boundaries per process container.',
    issuedBy: 'University IT & Systems Directorate',
  },
];

export const UniversityNotificationsPage: React.FC = () => {
  const [directives, setDirectives] = useState<Directive[]>(INITIAL_DIRECTIVES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    scope: 'ALL COLLEGES',
    type: 'DIRECTIVE' as const,
    content: '',
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    const newDir: Directive = {
      id: `dir_${Date.now()}`,
      title: formData.title,
      scope: formData.scope,
      type: formData.type,
      date: 'Just now',
      content: formData.content,
      issuedBy: 'Office of the Chancellor',
    };

    setDirectives([newDir, ...directives]);
    setIsModalOpen(false);
    setFormData({ title: '', scope: 'ALL COLLEGES', type: 'DIRECTIVE', content: '' });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            University Broadcast & Governance Memos
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Publish official academic directives, accreditation notices, and multi-campus broadcasts.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
          <Send className="w-4 h-4 mr-1.5" />
          Issue Systemwide Directive
        </Button>
      </div>

      {/* Directive Feed */}
      <div className="space-y-4">
        {directives.map((dir) => (
          <Card key={dir.id} className="p-5 hover:border-[var(--border-hover)] transition-all">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant={
                      dir.type === 'CRITICAL' ? 'danger' : dir.type === 'DIRECTIVE' ? 'warning' : 'default'
                    }
                    size="sm"
                  >
                    {dir.type}
                  </Badge>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[var(--bg-surface-secondary)] border border-[var(--border-default)]">
                    {dir.scope}
                  </span>
                </div>
                <span className="text-[10px] text-[var(--text-muted)] font-mono">{dir.date}</span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-[var(--text-primary)]">{dir.title}</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">{dir.content}</p>
              </div>

              <div className="pt-3 border-t border-[var(--border-default)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                <span>Issued by: <strong className="text-[var(--text-primary)]">{dir.issuedBy}</strong></span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  Delivered to All Deans
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-4">
              <h3 className="font-bold text-sm text-[var(--text-primary)]">
                Issue Systemwide Directive
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSend} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-[var(--text-secondary)]">Directive Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Mandatory Fall 2025 Midterm Exam Protocol"
                  className="w-full px-3 py-2 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-lg text-[var(--text-primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-[var(--text-secondary)]">Recipient Scope</label>
                  <select
                    value={formData.scope}
                    onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-lg text-[var(--text-primary)]"
                  >
                    <option value="ALL COLLEGES">All Constituent Colleges</option>
                    <option value="ACET ONLY">Apex Eng. (ACET) Only</option>
                    <option value="AIAC ONLY">AI Institute (AIAC) Only</option>
                    <option value="SSCA ONLY">Software Systems (SSCA) Only</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-[var(--text-secondary)]">Directive Severity</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-lg text-[var(--text-primary)]"
                  >
                    <option value="DIRECTIVE">Standard Directive</option>
                    <option value="MEMO">Information Memo</option>
                    <option value="CRITICAL">High Urgency Mandate</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-[var(--text-secondary)]">Mandate Body / Content *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Detail the mandatory compliance instructions, deadlines, and responsible faculty leads..."
                  className="w-full px-3 py-2 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-lg text-[var(--text-primary)]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[var(--border-default)]">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Broadcast Directive
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
