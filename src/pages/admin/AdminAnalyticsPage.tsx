import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Cpu, Users, Award, Zap } from 'lucide-react';
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
import { analyticsService, AdminAnalytics } from '@/services/analyticsService';

export const AdminAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AdminAnalytics | null>(null);

  useEffect(() => {
    analyticsService.getAdminAnalytics().then(setData);
  }, []);

  if (!data) return <div className="p-8 text-center text-slate-400">Loading telemetry...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 tracking-tight">Platform Analytics & Execution Telemetry</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Real-time metrics on compiler latency, student engagement, and cohort retention.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Sandbox Throughput"
          value="42,890"
          change="+14.2%"
          changeType="positive"
          icon={<Zap className="w-5 h-5 text-purple-400" />}
          subtitle="Executions this month"
        />
        <StatCard
          title="Avg Compiler Latency"
          value="118 ms"
          change="-24 ms"
          changeType="positive"
          icon={<Cpu className="w-5 h-5 text-emerald-400" />}
          subtitle="Judge0 P95 latency"
        />
        <StatCard
          title="Avg Cohort Retention"
          value="94.6%"
          change="+1.8%"
          changeType="positive"
          icon={<Users className="w-5 h-5 text-purple-400" />}
          subtitle="180-day baseline"
        />
        <StatCard
          title="Completion Rate"
          value="88.2%"
          change="+5.1%"
          changeType="positive"
          icon={<Award className="w-5 h-5 text-amber-400" />}
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
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#E2E8F0', fontSize: '12px' }}
                />
                <Bar dataKey="accepted" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="failed" fill="#475569" radius={[4, 4, 0, 0]} />
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
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="#3B82F6"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
