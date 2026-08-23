import React from 'react';
import { Download, FileSpreadsheet, FileText, Calendar, Filter } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export const AdminReportsPage: React.FC = () => {
  const reports = [
    {
      title: 'Cohort 2025-A Final Assessment Grades & Telemetry',
      type: 'CSV & PDF',
      generated: '2025-02-18',
      size: '2.4 MB',
      category: 'Academic',
    },
    {
      title: 'Plagiarism & Integrity Audit Report (Q1 2025)',
      type: 'PDF',
      generated: '2025-02-15',
      size: '8.1 MB',
      category: 'Compliance',
    },
    {
      title: 'Judge0 Sandbox Infrastructure SLA & Uptime',
      type: 'JSON & CSV',
      generated: '2025-02-10',
      size: '1.2 MB',
      category: 'DevOps',
    },
    {
      title: 'Instructor Hours & Live Coding Attendance Ledger',
      type: 'CSV',
      generated: '2025-02-01',
      size: '450 KB',
      category: 'Operations',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Academic & Compliance Reports</h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5">
            Export accredited student gradebooks, proctoring audit trails, and execution logs.
          </p>
        </div>
        <Button variant="primary" size="sm">
          <FileSpreadsheet className="w-4 h-4 mr-1.5" />
          Generate Custom Report
        </Button>
      </div>

      <div className="space-y-3">
        {reports.map((r, i) => (
          <Card key={i} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/30 text-[var(--primary)]">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[var(--text-primary)]">{r.title}</h4>
                <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mt-0.5">
                  <Badge variant="default" size="sm">{r.category}</Badge>
                  <span>Format: {r.type}</span>
                  <span>Generated: {r.generated}</span>
                  <span className="font-mono">{r.size}</span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => alert(`Downloading report: ${r.title}`)}>
              <Download className="w-4 h-4 mr-1.5" />
              Export
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
