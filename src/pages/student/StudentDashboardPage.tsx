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
import { Assessment, Submission, Assignment } from '@/types';
import { formatDate } from '@/lib/utils';

export const StudentDashboardPage: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

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
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-[#18181b] border border-[#27272a] rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Welcome Back</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Rank #4 in Cohort
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#fafafa] tracking-tight">
            Alex Turner • DSA Accelerator
          </h2>
          <p className="text-xs sm:text-sm text-[#a1a1aa]">
            You have <span className="text-blue-400 font-semibold">1 Live Assessment</span> ready to take today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/student/assessments/asm_01/question/q_01">
            <Button variant="primary" size="lg" className="bg-blue-600 hover:bg-blue-500 shadow-blue-600/20">
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
          icon={<Code2 className="w-4 h-4 text-emerald-400" />}
          subtitle="Top 5% speed in batch"
        />
        <StatCard
          title="Avg Assessment Score"
          value="92.4%"
          change="Grade: A"
          changeType="positive"
          icon={<Award className="w-4 h-4 text-blue-400" />}
          subtitle="DSA & Algorithm Midterms"
        />
        <StatCard
          title="Daily Streak"
          value="14 Days"
          change="Personal Record"
          changeType="positive"
          icon={<Flame className="w-4 h-4 text-orange-400 fill-orange-400" />}
          subtitle="Daily coding habit"
        />
        <StatCard
          title="Acceptance Rate"
          value="88.6%"
          change="1st attempt"
          changeType="positive"
          icon={<CheckCircle2 className="w-4 h-4 text-purple-400" />}
          subtitle="Judge0 test cases"
        />
      </div>

      {/* Weekly Progress Chart & Live Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Weekly Coding Velocity & Accuracy</CardTitle>
              <p className="text-xs text-[#a1a1aa] mt-0.5">Problems solved and benchmark score</p>
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
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.6} />
                <XAxis dataKey="day" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} domain={[0, 10]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }}
                  itemStyle={{ color: '#fafafa', fontSize: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="problems"
                  name="Problems Solved"
                  stroke="#3b82f6"
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
              <p className="text-xs text-[#a1a1aa] mt-0.5">Active & upcoming exams</p>
            </div>
            <Link to="/student/assessments" className="text-xs text-blue-400 hover:underline flex items-center font-medium">
              All <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </CardHeader>

          <div className="space-y-3">
            {assessments.map((as) => (
              <div
                key={as.id}
                className="p-3.5 bg-[#18181b] border border-[#27272a] rounded-xl space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-[#fafafa]">{as.title}</span>
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
                <p className="text-[11px] text-[#a1a1aa]">
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
              <p className="text-xs text-[#a1a1aa] mt-0.5">Verified outputs on Judge0 sandbox</p>
            </div>
            <Link to="/student/submissions" className="text-xs text-blue-400 hover:underline flex items-center font-medium">
              History <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </CardHeader>
          <div className="space-y-2.5">
            {submissions.map((sub) => (
              <Link
                key={sub.id}
                to={`/student/submissions/${sub.id}`}
                className="p-3 bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] hover:border-[#3f3f46] rounded-xl flex items-center justify-between transition block"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-[#fafafa]">{sub.questionTitle}</span>
                    <Badge variant={sub.status === 'ACCEPTED' ? 'success' : 'danger'} size="sm">
                      {sub.status}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[#a1a1aa]">
                    {sub.testsPassed} / {sub.totalTests} tests passed • {sub.runtimeMs}ms • {sub.language}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-xs text-emerald-400">{sub.score} PTS</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#71717a] ml-auto mt-1" />
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
              <p className="text-xs text-[#a1a1aa] mt-0.5">Lab deadlines and homework</p>
            </div>
            <Link to="/student/assignments" className="text-xs text-blue-400 hover:underline flex items-center font-medium">
              All <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </CardHeader>
          <div className="space-y-3">
            {assignments.map((ag) => (
              <div
                key={ag.id}
                className="p-3.5 bg-[#18181b] border border-[#27272a] rounded-xl flex items-center justify-between"
              >
                <div>
                  <h4 className="font-semibold text-xs text-[#fafafa]">{ag.title}</h4>
                  <p className="text-[11px] text-[#a1a1aa] mt-0.5">
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

export const StudentClassesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 tracking-tight">My Classes & Curriculum</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Full Stack & DSA Accelerator (Cohort 2025-A) • Led by Dr. Elena Rostova
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="success" size="sm">Current Module: Active</Badge>
            <span className="text-xs font-mono text-emerald-400 font-bold">68% Complete</span>
          </div>
          <h3 className="text-base font-bold text-slate-100">Module 4: Binary Search Trees & Heaps</h3>
          <p className="text-xs text-slate-400">
            Covers recursive traversals, self-balancing AVL properties, binary heap priority queues, and Dijkstra's shortest path.
          </p>

          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Next Live Lecture:</span>
              <span className="font-semibold text-slate-100">Today @ 2:00 PM</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Classroom Attendance:</span>
              <span className="text-emerald-400 font-mono font-bold">96% Present</span>
            </div>
          </div>
        </Card>

        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="primary" size="sm">Upcoming Module</Badge>
            <span className="text-xs font-mono text-slate-400">Starts in 6 days</span>
          </div>
          <h3 className="text-base font-bold text-slate-100">Module 5: Dynamic Programming & Graphs</h3>
          <p className="text-xs text-slate-400">
            Memoization vs. Tabulation, 0/1 Knapsack, Longest Common Subsequence, and Graph Topological Sorting.
          </p>
        </Card>
      </div>
    </div>
  );
};
