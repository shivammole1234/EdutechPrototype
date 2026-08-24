import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  FileText,
  CheckCircle2,
  Calendar,
  Building2,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface ComplianceReport {
  id: string;
  title: string;
  category: 'ACCREDITATION' | 'PERFORMANCE' | 'AUDIT' | 'SECURITY';
  period: string;
  generatedDate: string;
  fileSize: string;
  status: 'VERIFIED' | 'READY';
  summary: string;
}

const SYSTEM_REPORTS: ComplianceReport[] = [
  {
    id: 'rep_01',
    title: 'ABET Tier-1 Multi-Campus Accreditation Compliance Dossier',
    category: 'ACCREDITATION',
    period: 'Academic Year 2024-2025',
    generatedDate: '2025-08-20',
    fileSize: '4.8 MB',
    status: 'VERIFIED',
    summary: 'Comprehensive validation of curriculum rigor, algorithmic labs, faculty credentials, and student outcome benchmarks.',
  },
  {
    id: 'rep_02',
    title: 'University-Wide Placement & Skill Competency Index',
    category: 'PERFORMANCE',
    period: 'Q3 2025',
    generatedDate: '2025-08-15',
    fileSize: '2.4 MB',
    status: 'READY',
    summary: 'Cross-college benchmarking of 1,970 students across Dynamic Programming, Cloud Microservices, and System Architecture.',
  },
  {
    id: 'rep_03',
    title: 'Judge0 Sandboxed Execution & Integrity Telemetry Audit',
    category: 'SECURITY',
    period: 'Last 30 Days',
    generatedDate: '2025-08-10',
    fileSize: '1.2 MB',
    status: 'VERIFIED',
    summary: 'Complete audit of 142,000 code executions with memory isolation compliance and Zero-Trust network containment.',
  },
];

export const UniversityReportsPage: React.FC = () => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = (id: string, title: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      alert(`Report "${title}" exported successfully.`);
    }, 800);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            Accreditation & Institutional Reports
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Systemwide compliance packages, ABET dossiers, and cross-college audit exports.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => alert('Generating full systemwide compilation export...')}
        >
          <Sparkles className="w-4 h-4 mr-1.5" />
          Generate New System Audit
        </Button>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {SYSTEM_REPORTS.map((rep) => (
          <Card key={rep.id} className="p-5 hover:border-[var(--border-hover)] transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="warning" size="sm">
                      {rep.category}
                    </Badge>
                    <Badge variant="success" size="sm" className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      {rep.status}
                    </Badge>
                    <span className="text-[10px] text-[var(--text-muted)] font-mono">{rep.period}</span>
                  </div>
                  <h3 className="font-bold text-sm text-[var(--text-primary)]">{rep.title}</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{rep.summary}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs shrink-0 self-end lg:self-center">
                <span className="text-[10px] text-[var(--text-muted)] font-mono">{rep.fileSize}</span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={downloadingId === rep.id}
                  onClick={() => handleDownload(rep.id, rep.title)}
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  {downloadingId === rep.id ? 'Exporting...' : 'Download Package'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
