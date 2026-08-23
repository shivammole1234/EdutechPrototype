import React from 'react';
import { Award, TrendingUp, CheckCircle, Flame, Star, Zap, Code2 } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { useThemeStore } from '@/stores/useThemeStore';
import {
  AreaChart,
  Area,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

export const StudentPerformancePage: React.FC = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const radarData = [
    { subject: 'Arrays & Strings', A: 96, fullMark: 100 },
    { subject: 'Binary Trees', A: 90, fullMark: 100 },
    { subject: 'Dynamic Prog', A: 78, fullMark: 100 },
    { subject: 'Graphs & BFS', A: 85, fullMark: 100 },
    { subject: 'HashMaps', A: 98, fullMark: 100 },
    { subject: 'System Design', A: 88, fullMark: 100 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Skill Radar & Academic Analytics</h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
          Comprehensive breakdown of your problem-solving accuracy, speed percentiles, and algorithm mastery.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Percentile"
          value="95.4%"
          change="Top Tier"
          changeType="positive"
          icon={<Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
          subtitle="Compared to all batch learners"
        />
        <StatCard
          title="Avg Time to Solve"
          value="14.2 min"
          change="-3.1 min"
          changeType="positive"
          icon={<Zap className="w-5 h-5 text-amber-500" />}
          subtitle="Medium difficulty baseline"
        />
        <StatCard
          title="Streak Record"
          value="14 Days"
          change="Active"
          changeType="positive"
          icon={<Flame className="w-5 h-5 text-orange-500 fill-orange-500" />}
          subtitle="100% daily challenge attendance"
        />
        <StatCard
          title="Badge Rank"
          value="Grandmaster"
          change="Tier 4"
          changeType="positive"
          icon={<Star className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
          subtitle="2,450 platform XP"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Topic Competency Radar</CardTitle>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">Scored out of 100 on test executions</p>
            </div>
          </CardHeader>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke={isDark ? '#27272a' : '#e4e4e7'} />
                <PolarAngleAxis dataKey="subject" stroke="#71717a" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke={isDark ? '#3f3f46' : '#d4d4d8'} />
                <Radar name="Alex Turner" dataKey="A" stroke={isDark ? '#fafafa' : '#18181b'} fill={isDark ? '#fafafa' : '#18181b'} fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Milestone Badges */}
        <Card className="space-y-4">
          <CardHeader>
            <div>
              <CardTitle>Earned Developer Badges</CardTitle>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">Certificates of completion</p>
            </div>
          </CardHeader>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-xl flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-[var(--text-primary)]">100 Algorithms Solved</h4>
                <p className="text-[var(--text-secondary)]">Completed 100 coding tasks with 100% test pass rate.</p>
              </div>
            </div>

            <div className="p-3.5 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-xl flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-[var(--text-primary)]">2-Week Coding Streak</h4>
                <p className="text-[var(--text-secondary)]">Submitted at least one algorithmic solution 14 consecutive days.</p>
              </div>
            </div>

            <div className="p-3.5 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-xl flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border-default)] text-[var(--text-primary)]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-[var(--text-primary)]">Fast Solver Award</h4>
                <p className="text-[var(--text-secondary)]">Solved Binary Tree Path Maximum in under 8 minutes.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export const StudentNotificationsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Notifications & Announcements</h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
          Class updates, grading reports, and faculty feedback.
        </p>
      </div>

      <div className="space-y-3">
        <Card className="p-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="primary" size="sm">Assessment</Badge>
              <h4 className="text-sm font-semibold text-[var(--text-primary)]">DSA Mid-Term Examination is Live</h4>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              You may start your timed 90-minute examination in the Monaco IDE workspace.
            </p>
          </div>
          <span className="text-[11px] text-[var(--text-muted)] font-mono">1h ago</span>
        </Card>
      </div>
    </div>
  );
};

export const StudentProfilePage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Learner Profile</h2>
      </div>

      <Card className="p-6 space-y-5">
        <div className="flex items-center gap-4 pb-4 border-b border-[var(--border-default)]">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
            alt="Alex Turner"
            className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500"
          />
          <div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Alex Turner</h3>
            <p className="text-xs text-[var(--text-secondary)]">alex.turner@student.codepulse.io • Student ID: CP-9942</p>
            <Badge variant="success" size="sm" className="mt-1.5">Full Stack & DSA Cohort 2025-A</Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-[var(--bg-surface-secondary)] rounded-lg border border-[var(--border-default)]">
            <span className="text-[var(--text-muted)] block mb-1">Preferred Language:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">TypeScript / Node.js</span>
          </div>
          <div className="p-3 bg-[var(--bg-surface-secondary)] rounded-lg border border-[var(--border-default)]">
            <span className="text-[var(--text-muted)] block mb-1">Current Academic Score:</span>
            <span className="font-semibold text-[var(--text-primary)] font-mono">92.4% (Grade A)</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export const StudentSettingsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">IDE & Account Preferences</h2>
      </div>

      <Card className="p-6 space-y-4 text-xs text-[var(--text-secondary)]">
        <label className="flex items-center gap-2 cursor-pointer text-[var(--text-primary)]">
          <input type="checkbox" defaultChecked className="rounded accent-current" />
          Enable automatic code completion in Monaco Editor
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-[var(--text-primary)]">
          <input type="checkbox" defaultChecked className="rounded accent-current" />
          Highlight matching brackets and indent guides
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-[var(--text-primary)]">
          <input type="checkbox" defaultChecked className="rounded accent-current" />
          Play sound chime on successful test acceptance
        </label>
      </Card>
    </div>
  );
};
