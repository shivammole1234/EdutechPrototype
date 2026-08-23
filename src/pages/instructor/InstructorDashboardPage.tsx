import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  CalendarCheck,
  FileCode2,
  Video,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Radio,
  Briefcase,
} from 'lucide-react';
import { ScheduleInterviewModal } from '@/components/interviews/ScheduleInterviewModal';
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
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useThemeStore } from '@/stores/useThemeStore';
import { batchService } from '@/services/batchService';
import { assessmentService } from '@/services/assessmentService';
import { liveSessionService } from '@/services/liveSessionService';
import { assignmentService } from '@/services/assignmentService';
import { Batch, Assessment, LiveSession, Assignment } from '@/types';
import { formatDate } from '@/lib/utils';

export const InstructorDashboardPage: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  useEffect(() => {
    async function load() {
      const [bt, as, ls, ag] = await Promise.all([
        batchService.getBatches(),
        assessmentService.getAssessments(),
        liveSessionService.getSessions(),
        assignmentService.getAssignments(),
      ]);
      setBatches(bt);
      setAssessments(as);
      setLiveSessions(ls);
      setAssignments(ag);
    }
    load();
  }, []);

  const performanceTrend = [
    { week: 'Week 1', avgScore: 76, submissions: 140 },
    { week: 'Week 2', avgScore: 81, submissions: 190 },
    { week: 'Week 3', avgScore: 84, submissions: 220 },
    { week: 'Week 4', avgScore: 89, submissions: 285 },
    { week: 'Week 5', avgScore: 92, submissions: 340 },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            Faculty Command Center
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Active classrooms, test proctoring, live coding sessions, and submission review queues.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/instructor/interviews">
            <Button variant="outline" size="sm">
              <Briefcase className="w-4 h-4 mr-1.5 text-[var(--text-muted)]" />
              Schedule Interview
            </Button>
          </Link>
          <Link to="/instructor/assessments/new">
            <Button variant="outline" size="sm">
              <FileCode2 className="w-4 h-4 mr-1.5" />
              New Assessment
            </Button>
          </Link>
          <Link to="/instructor/live-sessions">
            <Button variant="primary" size="sm">
              <Video className="w-4 h-4 mr-1.5" />
              Launch Live Lab
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Students"
          value="90"
          change="3 Batches"
          changeType="neutral"
          icon={<Users className="w-5 h-5 text-[var(--text-muted)]" />}
          subtitle="96.2% active participation"
        />
        <StatCard
          title="Class Attendance"
          value="94.5%"
          change="+2.1% this week"
          changeType="positive"
          icon={<CalendarCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
          subtitle="18 sessions conducted"
        />
        <StatCard
          title="Pending Submissions"
          value="14"
          change="Review Required"
          changeType="negative"
          icon={<FileText className="w-5 h-5 text-amber-500" />}
          subtitle="Assignments & tests"
        />
        <StatCard
          title="Avg Assessment Score"
          value="88.4%"
          change="+4.2% cohort gain"
          changeType="positive"
          icon={<TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
          subtitle="DSA & Algorithm track"
        />
      </div>

      {/* Cohort Performance Chart & Live Proctor Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Cohort Average Performance Trend</CardTitle>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Average score (%) vs. problem completion volume</p>
            </div>
            <Badge variant="primary" size="sm">
              <TrendingUp className="w-3 h-3 mr-1" />
              +16% Trajectory
            </Badge>
          </CardHeader>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceTrend}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isDark ? '#fafafa' : '#18181b'} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={isDark ? '#fafafa' : '#18181b'} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#27272a' : '#e4e4e7'} opacity={0.7} />
                <XAxis dataKey="week" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} domain={[60, 100]} />
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
                  dataKey="avgScore"
                  name="Avg Score (%)"
                  stroke={isDark ? '#fafafa' : '#18181b'}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#scoreGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Live Proctoring & Session Hub */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Live Proctoring</CardTitle>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Active test sessions</p>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <Radio className="w-3.5 h-3.5 animate-pulse" /> LIVE
            </span>
          </CardHeader>

          <div className="space-y-4">
            <div className="p-3.5 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-[var(--text-primary)]">DSA Mid-Term Mock</span>
                <Badge variant="success" size="sm">28 Online</Badge>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                Fullscreen lockdown active • 0 tab violations detected
              </p>
              <Link to="/instructor/assessments/asm_01/monitor">
                <Button variant="primary" size="sm" className="w-full mt-1">
                  Open Proctor Monitor
                </Button>
              </Link>
            </div>

            <div className="p-3.5 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-[var(--text-primary)]">Next Live Lab</span>
                <span className="text-[11px] text-[var(--text-primary)] font-mono">Today, 2:00 PM</span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                Binary Tree Traversal & Recursion Debugging
              </p>
              <Link to="/instructor/live-sessions">
                <Button variant="outline" size="sm" className="w-full mt-1">
                  Join Room
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Cohorts and Quick Assessment Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>My Cohorts</CardTitle>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Assigned teaching tracks</p>
            </div>
            <Link to="/instructor/batches" className="text-xs text-[var(--text-primary)] hover:underline flex items-center font-medium">
              All batches <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </CardHeader>
          <div className="space-y-3">
            {batches.map((b) => (
              <div
                key={b.id}
                className="p-3.5 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-xl flex items-center justify-between"
              >
                <div>
                  <h4 className="font-semibold text-xs sm:text-sm text-[var(--text-primary)]">{b.name}</h4>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    {b.studentCount} Students • Progress: <span className="text-[var(--text-primary)] font-mono font-bold">{b.progress}%</span>
                  </p>
                </div>
                <Link to={`/instructor/batches`}>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Recent Assessments</CardTitle>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Examinations & tests created</p>
            </div>
            <Link to="/instructor/assessments" className="text-xs text-[var(--text-primary)] hover:underline flex items-center font-medium">
              All tests <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </CardHeader>
          <div className="space-y-3">
            {assessments.map((as) => (
              <div
                key={as.id}
                className="p-3.5 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-xl flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-xs sm:text-sm text-[var(--text-primary)]">{as.title}</h4>
                    <Badge variant={as.status === 'IN_PROGRESS' ? 'success' : 'default'} size="sm">
                      {as.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    {as.questionsCount} Questions • {as.durationMinutes} mins • {as.submissionsCount} Submissions
                  </p>
                </div>
                <Link to={`/instructor/assessments/${as.id}/monitor`}>
                  <Button variant="outline" size="sm">
                    Monitor
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

export const InstructorBatchesPage: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [scheduleModalBatchId, setScheduleModalBatchId] = useState<string | null>(null);

  useEffect(() => {
    batchService.getBatches().then(setBatches);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Assigned Cohorts & Batches</h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
            View syllabus pacing, student roster, batch interviews, and cohort attendance.
          </p>
        </div>
        <Link to="/instructor/interviews">
          <Button variant="outline" size="sm">
            <Briefcase className="w-4 h-4 mr-1.5 text-[var(--text-muted)]" />
            View All Batch Interviews
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batches.map((b) => (
          <Card key={b.id} className="p-5 flex flex-col justify-between space-y-4" hoverable>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <Badge variant="primary" size="sm">{b.code}</Badge>
                <Badge variant="success" size="sm">{b.status}</Badge>
              </div>
              <h3 className="font-bold text-[var(--text-primary)] text-sm">{b.name}</h3>
              <p className="text-xs text-[var(--text-secondary)] line-clamp-2">{b.description}</p>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--text-muted)]">Curriculum Pacing:</span>
                  <span className="text-[var(--text-primary)] font-mono font-bold">{b.progress}%</span>
                </div>
                <div className="w-full bg-[var(--bg-surface-secondary)] rounded-full h-2 overflow-hidden border border-[var(--border-default)]">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${b.progress}%` }} />
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-[var(--border-default)] text-xs">
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span className="text-[var(--text-muted)]">Enrolled Students:</span>
                <span className="font-mono font-bold text-[var(--text-primary)]">{b.studentCount} Engineers</span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span className="text-[var(--text-muted)]">Start Date:</span>
                <span className="text-[var(--text-primary)]">{formatDate(b.startDate)}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[var(--border-default)]">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setScheduleModalBatchId(b.id)}
                className="w-full font-semibold text-xs"
              >
                <Briefcase className="w-3.5 h-3.5 mr-1.5" />
                Schedule Interview for this Batch
              </Button>

              <div className="flex items-center justify-between gap-2">
                <Link to="/instructor/students" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    Roster
                  </Button>
                </Link>
                <Link to="/instructor/attendance" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    Attendance
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <ScheduleInterviewModal
        isOpen={!!scheduleModalBatchId}
        onClose={() => setScheduleModalBatchId(null)}
        onSuccess={() => setScheduleModalBatchId(null)}
        initialBatchId={scheduleModalBatchId || undefined}
      />
    </div>
  );
};

export const InstructorStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    import('@/services/userService').then((m) => {
      m.userService.getStudents().then(setStudents);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Enrolled Students Roster</h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
          Student performance scores, attendance rates, and assessment completion.
        </p>
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs text-[var(--text-secondary)]">
          <thead className="bg-[var(--bg-surface-secondary)] border-b border-[var(--border-default)] text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
            <tr>
              <th className="py-3 px-4 font-semibold">Student</th>
              <th className="py-3 px-4 font-semibold">Enrolled Cohort</th>
              <th className="py-3 px-4 font-semibold">Academic Score</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-default)]">
            {students.map((st) => (
              <tr key={st.id} className="hover:bg-[var(--bg-surface-hover)] transition">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={st.avatar}
                      alt={st.name}
                      className="w-8 h-8 rounded-full object-cover border border-[var(--border-default)]"
                    />
                    <div>
                      <p className="font-semibold text-[var(--text-primary)]">{st.name}</p>
                      <p className="text-[11px] text-[var(--text-muted)]">{st.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-[var(--text-secondary)]">{st.batchName || 'Cohort 2025-A'}</td>
                <td className="py-3.5 px-4 font-mono font-bold text-[var(--text-primary)]">
                  {st.performanceScore || 90}%
                </td>
                <td className="py-3.5 px-4">
                  <Badge variant={st.status === 'ACTIVE' ? 'success' : 'default'} size="sm">
                    {st.status}
                  </Badge>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <Button variant="outline" size="sm" onClick={() => alert(`Viewing report for ${st.name}`)}>
                    Inspect
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const InstructorQuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    import('@/services/questionService').then((m) => {
      m.questionService.getQuestions().then(setQuestions);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Question Bank & Test Suites</h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
            Create coding problems, define hidden test cases, and manage starter code templates.
          </p>
        </div>
        <Link to="/instructor/questions/new">
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Create Problem
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {questions.map((q) => (
          <Card key={q.id} className="p-5 flex flex-col justify-between space-y-4" hoverable>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <Badge
                  variant={
                    q.difficulty === 'EASY'
                      ? 'success'
                      : q.difficulty === 'MEDIUM'
                      ? 'warning'
                      : 'danger'
                  }
                  size="sm"
                >
                  {q.difficulty}
                </Badge>
                <span className="font-mono text-xs font-bold text-[var(--text-primary)]">{q.points} PTS</span>
              </div>
              <h3 className="font-bold text-[var(--text-primary)] text-sm">{q.title}</h3>
              <p className="text-xs text-[var(--text-secondary)] line-clamp-2">{q.description}</p>
            </div>

            <div className="space-y-2 pt-3 border-t border-[var(--border-default)] text-xs">
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span className="text-[var(--text-muted)]">Topic:</span>
                <span className="text-[var(--text-primary)]">{q.topic}</span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span className="text-[var(--text-muted)]">Test Cases:</span>
                <span className="font-mono font-bold text-[var(--text-primary)]">{q.testCases?.length || 3} Cases</span>
              </div>
            </div>

            <div className="pt-2">
              <Link to={`/instructor/questions/new`}>
                <Button variant="outline" size="sm" className="w-full">
                  Edit Problem & Tests
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

