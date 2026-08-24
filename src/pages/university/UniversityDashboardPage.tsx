import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  GraduationCap,
  TrendingUp,
  ArrowUpRight,
  Plus,
  CheckCircle2,
  Activity,
  School,
  FileCode2,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useThemeStore } from '@/stores/useThemeStore';
import { universityService, UniversityAnalyticsOverview } from '@/services/universityService';
import { College } from '@/types';

export const UniversityDashboardPage: React.FC = () => {
  const [data, setData] = useState<UniversityAnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  useEffect(() => {
    async function load() {
      try {
        const res = await universityService.getUniversityAnalytics();
        setData(res);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-72 bg-[var(--bg-surface-secondary)] rounded-md" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const COLORS = isDark
    ? ['#f59e0b', '#a855f7', '#3b82f6', '#10b981', '#71717a']
    : ['#d97706', '#9333ea', '#2563eb', '#059669', '#52525b'];

  return (
    <div className="space-y-8">
      {/* Top University Hero / Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                {data.university.name}
              </h1>
              <Badge variant="warning" size="sm">
                SYSTEM HQ
              </Badge>
              <Badge variant="success" size="sm">
                TIER-1 ACCREDITED
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
              Chancellor: <span className="text-[var(--text-primary)] font-medium">{data.university.chancellorName}</span> • Established {data.university.establishedYear} • Multi-Campus Governing Board
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link to="/university/colleges">
            <Button variant="outline" size="sm">
              <School className="w-4 h-4 mr-1.5 text-amber-500" />
              Manage Colleges
            </Button>
          </Link>
          <Link to="/university/reports">
            <Button variant="primary" size="sm">
              <Sparkles className="w-4 h-4 mr-1.5" />
              Accreditation Package
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Affiliated Colleges"
          value={data.totalColleges}
          change="+1 this academic year"
          changeType="positive"
          icon={<Building2 className="w-5 h-5 text-amber-500" />}
          subtitle="Constituent institutions"
        />
        <StatCard
          title="Total Students"
          value={data.totalStudents.toLocaleString()}
          change="+14.8% YoY enrollment"
          changeType="positive"
          icon={<GraduationCap className="w-5 h-5 text-blue-500" />}
          subtitle="Across all campuses"
        />
        <StatCard
          title="Faculty & Instructors"
          value={data.totalInstructors}
          change="98% retention rate"
          changeType="neutral"
          icon={<Users className="w-5 h-5 text-purple-500" />}
          subtitle="18:1 student-faculty ratio"
        />
        <StatCard
          title="Active Assessments"
          value={data.totalAssessments}
          change="8 live test proctoring"
          changeType="positive"
          icon={<FileCode2 className="w-5 h-5 text-emerald-500" />}
          subtitle="Systemwide evaluation"
        />
        <StatCard
          title="Avg System Pass Rate"
          value={`${data.overallPassRate}%`}
          change="+3.4% quality delta"
          changeType="positive"
          icon={<ShieldCheck className="w-5 h-5 text-emerald-500" />}
          subtitle="Benchmarked against ABET"
        />
      </div>

      {/* Charts Section: Comparative College Performance & Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Longitudinal College Benchmarks */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Collegiate Performance Trajectory</CardTitle>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Monthly average coding & algorithmic assessment scores per college
                </p>
              </div>
              <Badge variant="outline" size="sm">
                6-Month Trend
              </Badge>
            </div>
          </CardHeader>
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.monthlyPerformanceTrend}>
                <defs>
                  <linearGradient id="colorACET" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorAIAC" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorSSCA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#27272a' : '#e4e4e7'} vertical={false} />
                <XAxis dataKey="month" stroke={isDark ? '#71717a' : '#a1a1aa'} fontSize={11} tickLine={false} />
                <YAxis
                  domain={[70, 95]}
                  stroke={isDark ? '#71717a' : '#a1a1aa'}
                  fontSize={11}
                  tickLine={false}
                  unit="%"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#18181b' : '#ffffff',
                    borderColor: isDark ? '#27272a' : '#e4e4e7',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: isDark ? '#fafafa' : '#09090b',
                  }}
                />
                <Area type="monotone" dataKey="ACET" name="Apex Eng. (ACET)" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorACET)" />
                <Area type="monotone" dataKey="AIAC" name="AI Institute (AIAC)" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorAIAC)" />
                <Area type="monotone" dataKey="SSCA" name="Software Systems (SSCA)" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorSSCA)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Enrollment Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Enrollment by College</CardTitle>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              1,970 active students systemwide
            </p>
          </CardHeader>
          <div className="h-72 w-full flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="75%">
              <PieChart>
                <Pie
                  data={data.collegePerformance}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="studentsCount"
                  nameKey="collegeCode"
                >
                  {data.collegePerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#18181b' : '#ffffff',
                    borderColor: isDark ? '#27272a' : '#e4e4e7',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-3 text-xs flex-wrap">
              {data.collegePerformance.map((c, i) => (
                <div key={c.collegeId} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="font-medium text-[var(--text-primary)]">{c.collegeCode}:</span>
                  <span className="text-[var(--text-muted)]">{c.studentsCount}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* College Directory & Governance Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Constituent Colleges Directory</CardTitle>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Detailed institutional telemetry and leadership contact for all affiliated colleges
              </p>
            </div>
            <Link to="/university/colleges">
              <Button variant="outline" size="sm">
                View Detailed Directory
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[var(--border-default)] bg-[var(--bg-surface-secondary)] text-[var(--text-muted)] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">College Name</th>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Dean / Leadership</th>
                <th className="py-3 px-4">Students</th>
                <th className="py-3 px-4">Faculty</th>
                <th className="py-3 px-4">Avg Score</th>
                <th className="py-3 px-4">Pass Rate</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-default)] text-[var(--text-primary)]">
              {data.collegePerformance.map((college) => (
                <tr key={college.collegeId} className="hover:bg-[var(--bg-surface-hover)] transition-colors">
                  <td className="py-3.5 px-4 font-medium">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold shrink-0">
                        {college.collegeCode[0]}
                      </div>
                      <span className="font-semibold text-sm text-[var(--text-primary)]">{college.collegeName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded">
                      {college.collegeCode}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[var(--text-secondary)]">
                    {college.collegeCode === 'ACET' && 'Dr. Richard Thorne'}
                    {college.collegeCode === 'AIAC' && 'Dr. Samantha Meyers'}
                    {college.collegeCode === 'SSCA' && 'Prof. Vikram Singhania'}
                  </td>
                  <td className="py-3.5 px-4 font-semibold">{college.studentsCount}</td>
                  <td className="py-3.5 px-4 text-[var(--text-secondary)]">{college.instructorsCount}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-600 dark:text-amber-400">{college.avgScore}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-emerald-600 dark:text-emerald-400">{college.passRate}%</td>
                  <td className="py-3.5 px-4">
                    <Badge variant={college.status === 'ACTIVE' ? 'success' : 'default'} size="sm">
                      {college.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link to={`/university/colleges/${college.collegeId}`}>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        View College
                        <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Cross-College Recent System Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Systemwide Audit & Governance Logs</CardTitle>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Real-time feed of cross-college milestones, evaluations, and compliance validations
              </p>
            </div>
            <Badge variant="outline" size="sm" className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
              Live Feed
            </Badge>
          </div>
        </CardHeader>

        <div className="divide-y divide-[var(--border-default)]">
          {data.recentActivity.map((act) => (
            <div key={act.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[var(--bg-surface-hover)] transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] flex items-center justify-center shrink-0 mt-0.5">
                  {act.type === 'ASSESSMENT' && <FileCode2 className="w-4 h-4 text-amber-500" />}
                  {act.type === 'COLLEGE' && <Building2 className="w-4 h-4 text-purple-500" />}
                  {act.type === 'SECURITY' && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                  {act.type === 'USER' && <Users className="w-4 h-4 text-blue-500" />}
                  {act.type === 'SYSTEM' && <Sparkles className="w-4 h-4 text-amber-500" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-[var(--text-primary)]">{act.action}</p>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--bg-surface-secondary)] text-[var(--text-muted)] border border-[var(--border-default)]">
                      {act.collegeName}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">{act.details}</p>
                </div>
              </div>
              <span className="text-[10px] text-[var(--text-muted)] shrink-0 font-mono">{act.timestamp}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
