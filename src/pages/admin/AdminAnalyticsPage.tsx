import React, { useEffect, useState } from 'react';
import { Cpu, Users, Award, Zap } from 'lucide-react';
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
} from 'recharts';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { useThemeStore } from '@/stores/useThemeStore';
import { analyticsService, AdminAnalytics } from '@/services/analyticsService';

export const AdminAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AdminAnalytics | null>(null);
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  useEffect(() => {
    analyticsService.getAdminAnalytics().then(setData);
  }, []);

  if (!data) return <div className="p-8 text-center text-[var(--text-muted)]">Loading telemetry...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Platform Analytics & Execution Telemetry</h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
          Real-time metrics on compiler latency, student engagement, and cohort retention.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Sandbox Throughput"
          value="42,890"
          change="+14.2%"
          changeType="positive"
          icon={<Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
          subtitle="Executions this month"
        />
        <StatCard
          title="Avg Compiler Latency"
          value="118 ms"
          change="-24 ms"
          changeType="positive"
          icon={<Cpu className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
          subtitle="Judge0 P95 latency"
        />
        <StatCard
          title="Avg Cohort Retention"
          value="94.6%"
          change="+1.8%"
          changeType="positive"
          icon={<Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
          subtitle="180-day baseline"
        />
        <StatCard
          title="Completion Rate"
          value="88.2%"
          change="+5.1%"
          changeType="positive"
          icon={<Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
          subtitle="Graduated engineers"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Submissions Volume (Last 7 Days)</CardTitle>
          </CardHeader>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.submissionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#27272a' : '#e4e4e7'} />
                <XAxis dataKey="date" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#18181b' : '#ffffff',
                    borderColor: isDark ? '#27272a' : '#e4e4e7',
                    borderRadius: '8px',
                    color: isDark ? '#fafafa' : '#18181b',
                  }}
                  itemStyle={{ color: isDark ? '#fafafa' : '#18181b', fontSize: '12px' }}
                />
                <Bar dataKey="accepted" fill={isDark ? '#fafafa' : '#18181b'} radius={[4, 4, 0, 0]} />
                <Bar dataKey="failed" fill={isDark ? '#3f3f46' : '#d4d4d8'} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cumulative Student Enrollment</CardTitle>
          </CardHeader>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.studentGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#27272a' : '#e4e4e7'} />
                <XAxis dataKey="month" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#18181b' : '#ffffff',
                    borderColor: isDark ? '#27272a' : '#e4e4e7',
                    borderRadius: '8px',
                    color: isDark ? '#fafafa' : '#18181b',
                  }}
                  itemStyle={{ color: isDark ? '#fafafa' : '#18181b', fontSize: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="students"
                  stroke={isDark ? '#fafafa' : '#18181b'}
                  strokeWidth={2}
                  fill={isDark ? '#fafafa' : '#18181b'}
                  fillOpacity={0.12}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
