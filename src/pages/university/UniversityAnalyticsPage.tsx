import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  Layers,
  Zap,
  ShieldCheck,
  Building2,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { useThemeStore } from '@/stores/useThemeStore';

const COMPETENCY_DATA = [
  { subject: 'Algorithms & DSA', ACET: 92, AIAC: 86, SSCA: 80, fullMark: 100 },
  { subject: 'System Design', ACET: 85, AIAC: 82, SSCA: 94, fullMark: 100 },
  { subject: 'AI & Data Engineering', ACET: 78, AIAC: 96, SSCA: 76, fullMark: 100 },
  { subject: 'Cloud & DevOps', ACET: 81, AIAC: 79, SSCA: 95, fullMark: 100 },
  { subject: 'Cybersecurity', ACET: 84, AIAC: 91, SSCA: 82, fullMark: 100 },
  { subject: 'Code Cleanliness', ACET: 90, AIAC: 88, SSCA: 87, fullMark: 100 },
];

const EXECUTION_SPEED_DATA = [
  { college: 'Apex Eng. (ACET)', avgRuntimeMs: 42, memoryMb: 18.2, testPassRate: 92.5 },
  { college: 'AI Institute (AIAC)', avgRuntimeMs: 56, memoryMb: 24.6, testPassRate: 89.1 },
  { college: 'Software Systems (SSCA)', avgRuntimeMs: 38, memoryMb: 16.4, testPassRate: 87.8 },
];

export const UniversityAnalyticsPage: React.FC = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
          Cross-College Intelligence & Comparative Analytics
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
          Benchmarking institutional compute telemetry, student algorithmic proficiency, and curriculum efficacy.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall System Score"
          value="85.4%"
          change="+3.4% above tier-1 quota"
          changeType="positive"
          icon={<Award className="w-5 h-5 text-amber-500" />}
          subtitle="Accreditation aggregate"
        />
        <StatCard
          title="Code Compilation Success"
          value="94.2%"
          change="1.4M lines evaluated"
          changeType="positive"
          icon={<Zap className="w-5 h-5 text-blue-500" />}
          subtitle="Judge0 test harness"
        />
        <StatCard
          title="Top Performing Domain"
          value="AI & ML (AIAC)"
          change="96% proficiency index"
          changeType="positive"
          icon={<Sparkles className="w-5 h-5 text-purple-500" />}
          subtitle="Specialization peak"
        />
        <StatCard
          title="Proctor Integrity Index"
          value="99.8%"
          change="Accredited sandbox"
          changeType="positive"
          icon={<ShieldCheck className="w-5 h-5 text-emerald-500" />}
          subtitle="Zero critical breaches"
        />
      </div>

      {/* Radar Competency Chart & Execution Speed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Matrix */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Collegiate Domain Competency Radar</CardTitle>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Multi-axial performance evaluation across engineering domains
                </p>
              </div>
              <Badge variant="outline" size="sm">
                Multi-College
              </Badge>
            </div>
          </CardHeader>
          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={COMPETENCY_DATA}>
                <PolarGrid stroke={isDark ? '#27272a' : '#e4e4e7'} />
                <PolarAngleAxis dataKey="subject" stroke={isDark ? '#a1a1aa' : '#52525b'} fontSize={11} />
                <PolarRadiusAxis domain={[0, 100]} stroke={isDark ? '#71717a' : '#a1a1aa'} fontSize={10} />
                <Radar name="ACET (Engineering)" dataKey="ACET" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.25} />
                <Radar name="AIAC (AI Institute)" dataKey="AIAC" stroke="#a855f7" fill="#a855f7" fillOpacity={0.25} />
                <Radar name="SSCA (Cloud Systems)" dataKey="SSCA" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} />
                <Legend />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#18181b' : '#ffffff',
                    borderColor: isDark ? '#27272a' : '#e4e4e7',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Runtime Performance */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Code Execution Latency & Test Pass Rate</CardTitle>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Average sandbox execution duration (ms) vs. pass rate (%)
                </p>
              </div>
            </div>
          </CardHeader>
          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={EXECUTION_SPEED_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#27272a' : '#e4e4e7'} vertical={false} />
                <XAxis dataKey="college" stroke={isDark ? '#71717a' : '#a1a1aa'} fontSize={10} tickLine={false} />
                <YAxis stroke={isDark ? '#71717a' : '#a1a1aa'} fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#18181b' : '#ffffff',
                    borderColor: isDark ? '#27272a' : '#e4e4e7',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend />
                <Bar dataKey="avgRuntimeMs" name="Avg Runtime (ms)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="testPassRate" name="Test Pass Rate (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
