import React, { useState } from 'react';
import {
  FileCode2,
  Search,
  Filter,
  GraduationCap,
  Building2,
  CheckCircle2,
  TrendingUp,
  Clock,
  ShieldAlert,
  BarChart2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';

interface SystemAssessment {
  id: string;
  title: string;
  scope: 'SYSTEMWIDE' | 'COLLEGE_SPECIFIC';
  collegesCovered: string[];
  totalCandidates: number;
  completedCandidates: number;
  durationMinutes: number;
  avgScore: number;
  passPercentage: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'UPCOMING';
  targetTopic: string;
  createdAt: string;
}

const SYSTEM_ASSESSMENTS: SystemAssessment[] = [
  {
    id: 'as_01',
    title: 'University Midterm: Distributed Algorithms & System Design',
    scope: 'SYSTEMWIDE',
    collegesCovered: ['ACET', 'AIAC', 'SSCA'],
    totalCandidates: 840,
    completedCandidates: 812,
    durationMinutes: 120,
    avgScore: 88.4,
    passPercentage: 92.5,
    status: 'IN_PROGRESS',
    targetTopic: 'Graph Heuristics, Distributed Locking & Paxos',
    createdAt: '2025-08-15',
  },
  {
    id: 'as_02',
    title: 'Advanced Deep Learning & Tensor Operations Evaluation',
    scope: 'COLLEGE_SPECIFIC',
    collegesCovered: ['AIAC'],
    totalCandidates: 280,
    completedCandidates: 280,
    durationMinutes: 90,
    avgScore: 85.1,
    passPercentage: 89.0,
    status: 'COMPLETED',
    targetTopic: 'Neural Autograd, CNN Kernels, PyTorch C++ Extensions',
    createdAt: '2025-08-10',
  },
  {
    id: 'as_03',
    title: 'Cloud Infrastructure, Docker & Kubernetes Orchestration',
    scope: 'COLLEGE_SPECIFIC',
    collegesCovered: ['SSCA'],
    totalCandidates: 260,
    completedCandidates: 254,
    durationMinutes: 100,
    avgScore: 82.6,
    passPercentage: 86.4,
    status: 'COMPLETED',
    targetTopic: 'Helm Charts, Ingress Controllers, Service Meshes',
    createdAt: '2025-08-05',
  },
  {
    id: 'as_04',
    title: 'Fall 2025 University Standardized Coding Placement Trial',
    scope: 'SYSTEMWIDE',
    collegesCovered: ['ACET', 'AIAC', 'SSCA'],
    totalCandidates: 1200,
    completedCandidates: 0,
    durationMinutes: 180,
    avgScore: 0,
    passPercentage: 0,
    status: 'UPCOMING',
    targetTopic: 'Dynamic Programming, Trees, Concurrency & SQL',
    createdAt: '2025-09-01',
  },
];

export const UniversityAssessmentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'IN_PROGRESS' | 'COMPLETED' | 'UPCOMING'>('ALL');

  const filtered = SYSTEM_ASSESSMENTS.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.targetTopic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            Systemwide Assessment Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Standardized examination benchmarks and multi-college coding evaluations.
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total System Tests"
          value="34"
          change="Standardized benchmarks"
          changeType="neutral"
          icon={<FileCode2 className="w-5 h-5 text-amber-500" />}
          subtitle="All constituent colleges"
        />
        <StatCard
          title="Participating Students"
          value="1,970"
          change="96.2% completion rate"
          changeType="positive"
          icon={<GraduationCap className="w-5 h-5 text-blue-500" />}
          subtitle="Systemwide turnout"
        />
        <StatCard
          title="Avg Assessment Score"
          value="85.4%"
          change="+3.1% YoY quality"
          changeType="positive"
          icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
          subtitle="Cross-campus average"
        />
        <StatCard
          title="AI Proctor Compliance"
          value="99.8%"
          change="Zero critical breaches"
          changeType="positive"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
          subtitle="Judge0 test sandbox"
        />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assessments, topics..."
            className="w-full pl-9 pr-4 py-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--border-focus)]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          {(['ALL', 'IN_PROGRESS', 'COMPLETED', 'UPCOMING'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                statusFilter === s
                  ? 'bg-[var(--bg-surface-active)] text-[var(--text-primary)] font-bold border border-[var(--border-default)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Assessments List */}
      <div className="space-y-4">
        {filtered.map((test) => (
          <Card key={test.id} className="p-5 hover:border-[var(--border-hover)] transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant={
                      test.status === 'IN_PROGRESS'
                        ? 'warning'
                        : test.status === 'COMPLETED'
                        ? 'success'
                        : 'default'
                    }
                    size="sm"
                  >
                    {test.status.replace('_', ' ')}
                  </Badge>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[var(--bg-surface-secondary)] border border-[var(--border-default)]">
                    {test.scope}
                  </span>
                  <div className="flex items-center gap-1">
                    {test.collegesCovered.map((code) => (
                      <span
                        key={code}
                        className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold"
                      >
                        {code}
                      </span>
                    ))}
                  </div>
                </div>

                <h3 className="font-bold text-base text-[var(--text-primary)]">{test.title}</h3>
                <p className="text-xs text-[var(--text-secondary)]">Topic: {test.targetTopic}</p>
              </div>

              <div className="flex items-center gap-6 text-xs text-center shrink-0">
                <div>
                  <p className="text-[10px] text-[var(--text-muted)]">Candidates</p>
                  <p className="font-bold text-[var(--text-primary)] mt-0.5">
                    {test.completedCandidates} / {test.totalCandidates}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-[var(--text-muted)]">Duration</p>
                  <p className="font-bold text-[var(--text-primary)] mt-0.5">{test.durationMinutes} mins</p>
                </div>
                {test.status !== 'UPCOMING' && (
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)]">Avg Score</p>
                    <p className="font-bold text-amber-600 dark:text-amber-400 mt-0.5">{test.avgScore}%</p>
                  </div>
                )}
                {test.status !== 'UPCOMING' && (
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)]">Pass Rate</p>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{test.passPercentage}%</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
