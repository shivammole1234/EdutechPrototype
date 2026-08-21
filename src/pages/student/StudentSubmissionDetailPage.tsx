import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, Clock, Cpu, FileCode2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { submissionService } from '@/services/submissionService';
import { Submission } from '@/types';
import { formatDate } from '@/lib/utils';

export const StudentSubmissionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    submissionService.getSubmissions().then((list) => {
      const found = list.find((s) => s.id === id) || list[0];
      setSubmission(found);
    });
  }, [id]);

  if (!submission) return <div className="p-8 text-center text-slate-400">Loading submission...</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => navigate('/student/submissions')}>
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Submissions
        </Button>
        <Link to={`/student/assessments/asm_01/question/${submission.questionId}`}>
          <Button variant="primary" size="sm" className="bg-emerald-600 hover:bg-emerald-700">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Retry in IDE
          </Button>
        </Link>
      </div>

      {/* Submission Overview Card */}
      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant={submission.status === 'ACCEPTED' ? 'success' : 'danger'} size="md">
                {submission.status}
              </Badge>
              <h2 className="text-lg font-bold text-slate-100">{submission.questionTitle}</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">Submitted {formatDate(submission.createdAt)}</p>
          </div>

          <div className="text-right">
            <span className="text-2xl font-bold font-mono text-emerald-400">
              {submission.score} / {submission.totalPoints} PTS
            </span>
          </div>
        </div>

        {/* Telemetry Metrics */}
        <div className="grid grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Test Cases:
            </span>
            <p className="font-mono text-sm font-bold text-slate-200">
              {submission.testsPassed} / {submission.totalTests} Passed
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-400" /> Runtime:
            </span>
            <p className="font-mono text-sm font-bold text-slate-200">{submission.runtimeMs} ms</p>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-purple-400" /> Memory:
            </span>
            <p className="font-mono text-sm font-bold text-slate-200">{submission.memoryMB} MB</p>
          </div>
        </div>
      </Card>

      {/* Code Viewer */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <CardTitle className="text-xs font-mono text-slate-300">
            Source Code ({submission.language})
          </CardTitle>
        </div>
        <pre className="p-5 bg-slate-950 font-mono text-xs text-blue-300 overflow-x-auto leading-relaxed">
          {submission.code}
        </pre>
      </Card>
    </div>
  );
};

export const StudentAssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    import('@/services/assignmentService').then((m) => {
      m.assignmentService.getAssignments().then(setAssignments);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 tracking-tight">Course Assignments & Problem Sets</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Submit weekly coding exercises, lab solutions, and project repositories.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((ag) => (
          <Card key={ag.id} className="p-5 flex flex-col justify-between space-y-4" hoverable>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <Badge variant="primary" size="sm">Lab Task</Badge>
                <span className="font-mono text-xs font-bold text-emerald-400">{ag.totalPoints} PTS</span>
              </div>
              <h3 className="font-bold text-slate-100 text-sm">{ag.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2">{ag.description}</p>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Due:</span>
                <span>{formatDate(ag.dueDate)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Status:</span>
                <span className="text-emerald-400 font-semibold">Completed (100/100)</span>
              </div>
            </div>

            <div className="pt-2">
              <Button variant="outline" size="sm" className="w-full" onClick={() => alert('Viewing assignment rubric.')}>
                View Assignment & Code
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
