import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  Layers,
  FileCode2,
  TrendingUp,
  ArrowUpRight,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Server,
  Activity,
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
} from 'recharts';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { analyticsService, AdminAnalytics } from '@/services/analyticsService';
import { batchService } from '@/services/batchService';
import { assessmentService } from '@/services/assessmentService';
import { Batch, Assessment } from '@/types';
import { formatDate } from '@/lib/utils';

export const AdminDashboardPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [an, bt, as] = await Promise.all([
          analyticsService.getAdminAnalytics(),
          batchService.getBatches(),
          assessmentService.getAssessments(),
        ]);
        setAnalytics(an);
        setBatches(bt.slice(0, 3));
        setAssessments(as.slice(0, 3));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || !analytics) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-slate-800 rounded-md" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-900 border border-slate-800 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#64748B'];

  return (
    <div className="space-y-8">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            Enterprise Command Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            System overview, student cohort progression, and code execution telemetry.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin/batches">
            <Button variant="outline" size="sm">
              <Layers className="w-4 h-4 mr-1.5" />
              Manage Batches
            </Button>
          </Link>
          <Link to="/admin/users/students">
            <Button variant="primary" size="sm">
              <Plus className="w-4 h-4 mr-1.5" />
              Enroll Student
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={analytics.totalStudents}
          change="+18% this month"
          changeType="positive"
          icon={<GraduationCap className="w-5 h-5 text-purple-400" />}
          subtitle="Enrolled across 6 cohorts"
        />
        <StatCard
          title="Total Instructors"
          value={analytics.totalInstructors}
          change="3 Lead Faculty"
          changeType="neutral"
          icon={<Users className="w-5 h-5 text-[#fafafa]" />}
          subtitle="100% active this week"
        />
        <StatCard
          title="Active Batches"
          value={analytics.activeBatches}
          change="2 Upcoming"
          changeType="neutral"
          icon={<Layers className="w-5 h-5 text-emerald-400" />}
          subtitle="Avg completion: 68%"
        />
        <StatCard
          title="Platform Pass Rate"
          value={`${analytics.platformPassRate}%`}
          change="+3.4% YoY"
          changeType="positive"
          icon={<CheckCircle2 className="w-5 h-5 text-amber-400" />}
          subtitle="3,840 submissions verified"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Growth & Enrollment Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Student Growth & Enrollment Trend</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">Cumulative enrolled engineers</p>
            </div>
            <Badge variant="purple" size="sm">
              <TrendingUp className="w-3 h-3 mr-1" />
              +228% Growth
            </Badge>
          </CardHeader>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.studentGrowth}>
                <defs>
                  <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#E2E8F0', fontSize: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="students"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#growthGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Execution Languages Distribution */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Language Breakdown</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">Submissions by compiler</p>
            </div>
          </CardHeader>
          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.languageDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="percentage"
                >
                  {analytics.languageDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#E2E8F0', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {analytics.languageDistribution.map((item, idx) => (
              <div key={item.language} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-slate-300">{item.language}</span>
                </div>
                <span className="text-slate-400 font-mono">{item.percentage}% ({item.count})</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Submissions Daily Trend & Batch Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Daily Code Submissions</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">Accepted vs. Failed test execution runs</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Accepted
              </span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" /> Failed / Error
              </span>
            </div>
          </CardHeader>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.submissionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#E2E8F0', fontSize: '12px' }}
                />
                <Bar dataKey="accepted" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="failed" fill="#F43F5E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Sandbox & Server Health */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Sandbox Health</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">Execution node telemetry</p>
            </div>
            <Badge variant="success" size="sm">
              <Activity className="w-3 h-3 mr-1" />
              Healthy
            </Badge>
          </CardHeader>
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Judge0 Cluster:</span>
                <span className="font-mono text-emerald-400 font-semibold">4/4 Nodes Online</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Queue Latency:</span>
                <span className="font-mono text-slate-200">28ms avg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Memory Pressure:</span>
                <span className="font-mono text-slate-200">34.2%</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-slate-300">
                <span>CPU Utilization</span>
                <span className="font-mono text-slate-400">22%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#fafafa] h-1.5 rounded-full" style={{ width: '22%' }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-slate-300">
                <span>Docker Sandbox Pool</span>
                <span className="font-mono text-slate-400">48 / 64 warm</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Cohorts & Upcoming Assessments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Batches */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Active Cohorts</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">Currently running curricula</p>
            </div>
            <Link to="/admin/batches" className="text-xs text-purple-400 hover:underline flex items-center">
              View all <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </CardHeader>
          <div className="space-y-3">
            {batches.map((batch) => (
              <div
                key={batch.id}
                className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-100">{batch.name}</h4>
                    <Badge variant="purple" size="sm">{batch.code}</Badge>
                  </div>
                  <p className="text-xs text-slate-400">
                    Lead: <span className="text-slate-300">{batch.instructorName}</span> • {batch.studentCount} Students
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-200">{batch.progress}%</span>
                  <div className="w-20 bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
                    <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${batch.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Assessments Overview */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Assessments Overview</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">Scheduled and live testing</p>
            </div>
            <Link to="/admin/assessments" className="text-xs text-purple-400 hover:underline flex items-center">
              View all <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </CardHeader>
          <div className="space-y-3">
            {assessments.map((as) => (
              <div
                key={as.id}
                className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-100">{as.title}</h4>
                    <Badge
                      variant={
                        as.status === 'IN_PROGRESS'
                          ? 'success'
                          : as.status === 'UPCOMING'
                          ? 'primary'
                          : 'default'
                      }
                      size="sm"
                    >
                      {as.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400">
                    {as.questionsCount} Questions • {as.durationMinutes} Mins • {as.submissionsCount} Submissions
                  </p>
                </div>
                <Link to="/admin/assessments">
                  <Button variant="outline" size="sm">
                    Inspect
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
