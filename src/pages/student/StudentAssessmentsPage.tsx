import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock, CheckCircle2, Shield, Calendar, ArrowRight } from 'lucide-react';
import { Assessment } from '@/types';
import { assessmentService } from '@/services/assessmentService';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

export const StudentAssessmentsPage: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  useEffect(() => {
    assessmentService.getAssessments().then(setAssessments);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 tracking-tight">Coding Assessments & Tests</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Proctored programming evaluations, benchmark mid-terms, and certification exams.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessments.map((as) => (
          <Card key={as.id} className="p-5 flex flex-col justify-between space-y-4" hoverable>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
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
                <span className="font-mono text-xs font-bold text-emerald-400">{as.totalPoints} PTS</span>
              </div>

              <h3 className="font-bold text-slate-100 text-sm">{as.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2">{as.description}</p>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Duration:</span>
                <span className="font-mono">{as.durationMinutes} Minutes</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Tasks:</span>
                <span className="font-mono">{as.questionsCount} Algorithmic Problems</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Proctor Mode:</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  {as.settings.proctoring.enableWebcam ? 'Webcam + Fullscreen' : 'Standard'}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link to={`/student/assessments/${as.id}/question/q_01`} className="block">
                <Button
                  variant={as.status === 'IN_PROGRESS' ? 'primary' : 'outline'}
                  size="sm"
                  className={`w-full ${as.status === 'IN_PROGRESS' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                >
                  <Play className="w-3.5 h-3.5 mr-1.5" />
                  {as.status === 'IN_PROGRESS' ? 'Start Assessment' : 'View Instructions'}
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const StudentSubmissionsPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    import('@/services/submissionService').then((m) => {
      m.submissionService.getSubmissions().then(setSubmissions);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 tracking-tight">My Submissions & Execution Log</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          History of all algorithmic solutions tested and submitted on the platform.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
            <tr>
              <th className="py-3 px-4 font-semibold">Problem Title</th>
              <th className="py-3 px-4 font-semibold">Language</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">Tests Passed</th>
              <th className="py-3 px-4 font-semibold">Runtime</th>
              <th className="py-3 px-4 font-semibold">Score</th>
              <th className="py-3 px-4 text-right font-semibold">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {submissions.map((sub) => (
              <tr key={sub.id} className="hover:bg-slate-850/60 transition">
                <td className="py-3.5 px-4 font-semibold text-slate-100">{sub.questionTitle}</td>
                <td className="py-3.5 px-4 font-mono text-slate-300">{sub.language}</td>
                <td className="py-3.5 px-4">
                  <Badge variant={sub.status === 'ACCEPTED' ? 'success' : 'danger'} size="sm">
                    {sub.status}
                  </Badge>
                </td>
                <td className="py-3.5 px-4 font-mono">
                  {sub.testsPassed} / {sub.totalTests}
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-400">{sub.runtimeMs} ms</td>
                <td className="py-3.5 px-4 font-mono text-emerald-400 font-bold">{sub.score} PTS</td>
                <td className="py-3.5 px-4 text-right">
                  <Link to={`/student/submissions/${sub.id}`}>
                    <Button variant="outline" size="sm">
                      Inspect
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
