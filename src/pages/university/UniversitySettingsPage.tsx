import React, { useState } from 'react';
import {
  Settings,
  Building2,
  ShieldCheck,
  Cpu,
  Save,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export const UniversitySettingsPage: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    universityName: 'Apex Technical University System',
    shortCode: 'ATUS',
    chancellorName: 'Dr. Arthur Vance, Ph.D.',
    chancellorEmail: 'chancellor@university.codepulse.edu',
    establishedYear: '1984',
    headquarters: 'University Central District, Tower 1',
    accreditationBody: 'ABET Tier-1 & ISO-9001 Higher Ed',
    defaultPassingCutoff: '70',
    sandboxMaxMemoryMb: '256',
    sandboxCpuLimitSec: '3.0',
    proctoringStrictness: 'HIGH',
    allowCollegeCustomTopics: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            University System Governance Settings
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Configure systemwide academic accreditation parameters, sandbox quotas, and governance thresholds.
          </p>
        </div>

        {saved && (
          <Badge variant="success" size="md" className="flex items-center gap-1.5 animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            Changes Applied Systemwide
          </Badge>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Institutional Identity Card */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[var(--border-default)]">
            <Building2 className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="font-bold text-sm text-[var(--text-primary)]">Institutional Hierarchy Profile</h3>
              <p className="text-xs text-[var(--text-secondary)]">Governing University identity metadata</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-medium text-[var(--text-secondary)]">University System Name</label>
              <input
                type="text"
                value={formData.universityName}
                onChange={(e) => setFormData({ ...formData, universityName: e.target.value })}
                className="w-full px-3 py-2 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-lg text-[var(--text-primary)]"
              />
            </div>
            <div className="space-y-1">
              <label className="font-medium text-[var(--text-secondary)]">Short Code</label>
              <input
                type="text"
                value={formData.shortCode}
                onChange={(e) => setFormData({ ...formData, shortCode: e.target.value })}
                className="w-full px-3 py-2 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-lg text-[var(--text-primary)] font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-medium text-[var(--text-secondary)]">Chancellor Full Name</label>
              <input
                type="text"
                value={formData.chancellorName}
                onChange={(e) => setFormData({ ...formData, chancellorName: e.target.value })}
                className="w-full px-3 py-2 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-lg text-[var(--text-primary)]"
              />
            </div>
            <div className="space-y-1">
              <label className="font-medium text-[var(--text-secondary)]">Chancellor Secretariat Email</label>
              <input
                type="email"
                value={formData.chancellorEmail}
                onChange={(e) => setFormData({ ...formData, chancellorEmail: e.target.value })}
                className="w-full px-3 py-2 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-lg text-[var(--text-primary)]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-medium text-[var(--text-secondary)]">Accreditation Credentials</label>
            <input
              type="text"
              value={formData.accreditationBody}
              onChange={(e) => setFormData({ ...formData, accreditationBody: e.target.value })}
              className="w-full px-3 py-2 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-lg text-[var(--text-primary)]"
            />
          </div>
        </Card>

        {/* Standardized Coding Sandbox & Examination Thresholds */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[var(--border-default)]">
            <Cpu className="w-5 h-5 text-purple-500" />
            <div>
              <h3 className="font-bold text-sm text-[var(--text-primary)]">Judge0 Sandbox & Evaluation Parameters</h3>
              <p className="text-xs text-[var(--text-secondary)]">Resource boundaries applied across all constituent colleges</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-medium text-[var(--text-secondary)]">Default Pass Cutoff (%)</label>
              <input
                type="number"
                value={formData.defaultPassingCutoff}
                onChange={(e) => setFormData({ ...formData, defaultPassingCutoff: e.target.value })}
                className="w-full px-3 py-2 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-lg text-[var(--text-primary)] font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="font-medium text-[var(--text-secondary)]">Max Memory / Process (MB)</label>
              <input
                type="number"
                value={formData.sandboxMaxMemoryMb}
                onChange={(e) => setFormData({ ...formData, sandboxMaxMemoryMb: e.target.value })}
                className="w-full px-3 py-2 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-lg text-[var(--text-primary)] font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="font-medium text-[var(--text-secondary)]">CPU Time Limit (Sec)</label>
              <input
                type="number"
                step="0.5"
                value={formData.sandboxCpuLimitSec}
                onChange={(e) => setFormData({ ...formData, sandboxCpuLimitSec: e.target.value })}
                className="w-full px-3 py-2 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-lg text-[var(--text-primary)] font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="customTopics"
              checked={formData.allowCollegeCustomTopics}
              onChange={(e) => setFormData({ ...formData, allowCollegeCustomTopics: e.target.checked })}
              className="rounded text-amber-600 focus:ring-amber-500"
            />
            <label htmlFor="customTopics" className="text-xs text-[var(--text-primary)] font-medium cursor-pointer">
              Allow constituent college Department Co-ordinators to author custom assessment questions outside the standard core bank
            </label>
          </div>
        </Card>

        {/* Save Bar */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="submit" variant="primary" size="md">
            <Save className="w-4 h-4 mr-1.5" />
            Save Governance Configurations
          </Button>
        </div>
      </form>
    </div>
  );
};
