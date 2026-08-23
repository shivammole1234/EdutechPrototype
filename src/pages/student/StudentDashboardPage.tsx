import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  CheckCircle2,
  Clock,
  Flame,
  Award,
  ArrowUpRight,
  Play,
  FileCode2,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  Radio,
  Video,
  Users,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { assessmentService } from '@/services/assessmentService';
import { submissionService } from '@/services/submissionService';
import { assignmentService } from '@/services/assignmentService';
import { useLiveClassStore } from '@/stores/useLiveClassStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { Assessment, Submission, Assignment } from '@/types';
import { formatDate } from '@/lib/utils';

export { StudentLiveClassesPage as StudentClassesPage } from './StudentLiveClassesPage';

export const StudentDashboardPage: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const { getLiveClasses } = useLiveClassStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const liveClasses = getLiveClasses();
  const activeClass = liveClasses[0];

  useEffect(() => {
    async function load() {
      const [as, sb, ag] = await Promise.all([
        assessmentService.getAssessments(),
        submissionService.getSubmissions(),
        assignmentService.getAssignments(),
      ]);
      setAssessments(as);
      setSubmissions(sb);
      setAssignments(ag);
    }
    load();
  }, []);

  const progressData = [
    { day: 'Mon', problems: 4, score: 90 },
    { day: 'Tue', problems: 6, score: 95 },
    { day: 'Wed', problems: 3, score: 85 },
    { day: 'Thu', problems: 8, score: 100 },
    { day: 'Fri', problems: 5, score: 92 },
    { day: 'Sat', problems: 9, score: 96 },
    { day: 'Sun', problems: 7, score: 94 },
  ];

  return (
    <div className="space-y-8">
      {/* Live Class In Session Alert Banner */}
      {activeClass && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)] border border-rose-500/30 shadow-[var(--card-shadow)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
              <Radio className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="danger" size="sm" className="font-mono text-[10px]">
                  🔴 LIVE IN SESSION
                </Badge>
                <span className="text-xs text-[var(--text-muted)] font-mono hidden sm:inline">
                  {activeClass.batchName.split('(')[0]}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">
                {activeClass.title}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Led by <span className="text-[var(--text-primary)] font-medium">{activeClass.instructorName}</span> • {activeClass.participants.length} peers connected
              </p>
            </div>
          </div>

          <Link to={`/student/live-class/${activeClass.id}`} className="shrink-0">
            <Button
              variant="danger"
              size="md"
              className="w-full sm:w-auto font-medium shadow-none"
            >
              <Play className="w-4 h-4 mr-2 fill-white" />
              Join Live Class
            </Button>
          </Link>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl shadow-[var(--card-shadow)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Welcome Back</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium font-mono bg-[var(--bg-surface-secondary)] text-[var(--text-secondary)] border border-[var(--border-default)]">
              Rank #4 in Cohort
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            Alex Turner • DSA Accelerator
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            You have <span className="text-[var(--text-primary)] font-medium">1 Live Assessment</span> ready to take today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/student/classes">
            <Button variant="outline" size="lg">
              <Video className="w-4 h-4 mr-2 text-[var(--text-muted)]" />
              Live Classes Hub
            </Button>
          </Link>
          <Link to="/student/assessments/asm_01/question/q_01">
            <Button variant="primary" size="lg" className="shadow-none">
              <Play className="w-4 h-4 mr-2" />
              Enter Live Test IDE
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Problems Solved"
          value="142"
          change="+12 this week"
          changeType="positive"
          icon={<Code2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
          subtitle="Top 5% speed in batch"
        />
        <StatCard
          title="Avg Assessment Score"
          value="92.4%"
          change="Grade: A"
          changeType="positive"
          icon={<Award className="w-4 h-4 text-[var(--text-muted)]" />}
          subtitle="DSA & Algorithm Midterms"
        />
        <StatCard
          title="Daily Streak"
          value="14 Days"
          change="Personal Record"
          changeType="positive"
          icon={<Flame className="w-4 h-4 text-orange-500 fill-orange-500" />}
          subtitle="Daily coding habit"
        />
        <StatCard
          title="Acceptance Rate"
          value="88.6%"
          change="1st attempt"
          changeType="positive"
          icon={<CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
          subtitle="Judge0 test cases"
        />
      </div>

      {/* Weekly Progress Chart & Live Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Weekly Coding Velocity & Accuracy</CardTitle>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">Problems solved and benchmark score</p>
            </div>
            <Badge variant="success" size="sm">
              <TrendingUp className="w-3 h-3 mr-1" />
              42 Solved this week
            </Badge>
          </CardHeader>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressData}>
                <defs>
                  <linearGradient id="studentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isDark ? '#fafafa' : '#18181b'} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={isDark ? '#fafafa' : '#18181b'} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#27272a' : '#e4e4e7'} opacity={0.6} />
                <XAxis dataKey="day" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} domain={[0, 10]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#18181b' : '#ffffff',
                    borderColor: isDark ? '#27272a' : '#e4e4e7',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                  itemStyle={{ color: isDark ? '#fafafa' : '#18181b', fontSize: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="problems"
                  name="Problems Solved"
                  stroke={isDark ? '#fafafa' : '#18181b'}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#studentGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Live / Upcoming Assessments */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Assessments</CardTitle>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">Active & upcoming exams</p>
            </div>
            <Link to="/student/assessments" className="text-xs text-[var(--text-primary)] hover:underline flex items-center font-medium">
              All <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </CardHeader>

          <div className="space-y-3">
            {assessments.map((as) => (
              <div
                key={as.id}
                className="p-3.5 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-xl space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-[var(--text-primary)]">{as.title}</span>
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
                <p className="text-[11px] text-[var(--text-secondary)]">
                  {as.durationMinutes} mins • {as.questionsCount} Coding Tasks • {as.totalPoints} PTS
                </p>
                <Link to={`/student/assessments/${as.id}/question/q_01`} className="block mt-1">
                  <Button variant={as.status === 'IN_PROGRESS' ? 'primary' : 'outline'} size="sm" className="w-full">
                    {as.status === 'IN_PROGRESS' ? 'Resume IDE' : 'View Test'}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Submissions & Homework Labs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Submissions */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Recent Code Executions</CardTitle>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">Verified outputs on Judge0 sandbox</p>
            </div>
            <Link to="/student/submissions" className="text-xs text-[var(--text-primary)] hover:underline flex items-center font-medium">
              History <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </CardHeader>
          <div className="space-y-2.5">
            {submissions.map((sub) => (
              <Link
                key={sub.id}
                to={`/student/submissions/${sub.id}`}
                className="p-3 bg-[var(--bg-surface-secondary)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-default)] hover:border-[var(--border-hover)] rounded-xl flex items-center justify-between transition block"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-[var(--text-primary)]">{sub.questionTitle}</span>
                    <Badge variant={sub.status === 'ACCEPTED' ? 'success' : 'danger'} size="sm">
                      {sub.status}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    {sub.testsPassed} / {sub.totalTests} tests passed • {sub.runtimeMs}ms • {sub.language}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">{sub.score} PTS</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] ml-auto mt-1" />
                </div>
              </Link>
            ))}
          </div>
        </Card>

        {/* Course Assignments */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Course Assignments</CardTitle>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">Lab deadlines and homework</p>
            </div>
            <Link to="/student/assignments" className="text-xs text-[var(--text-primary)] hover:underline flex items-center font-medium">
              All <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </CardHeader>
          <div className="space-y-3">
            {assignments.map((ag) => (
              <div
                key={ag.id}
                className="p-3.5 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-xl flex items-center justify-between"
              >
                <div>
                  <h4 className="font-semibold text-xs text-[var(--text-primary)]">{ag.title}</h4>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                    Due: {formatDate(ag.dueDate)} • {ag.totalPoints} Points
                  </p>
                </div>
                <Link to={`/student/assignments`}>
                  <Button variant="outline" size="sm">
                    Open Lab
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
