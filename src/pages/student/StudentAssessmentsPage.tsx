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
        <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Coding Assessments & Tests</h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
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
                <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">{as.totalPoints} PTS</span>
              </div>

              <h3 className="font-bold text-[var(--text-primary)] text-sm">{as.title}</h3>
              <p className="text-xs text-[var(--text-secondary)] line-clamp-2">{as.description}</p>
            </div>

            <div className="space-y-2 pt-3 border-t border-[var(--border-default)] text-xs">
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span className="text-[var(--text-muted)]">Duration:</span>
                <span className="font-mono font-medium text-[var(--text-primary)]">{as.durationMinutes} Minutes</span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span className="text-[var(--text-muted)]">Tasks:</span>
                <span className="font-mono font-medium text-[var(--text-primary)]">{as.questionsCount} Algorithmic Problems</span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span className="text-[var(--text-muted)]">Proctor Mode:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
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
                  className="w-full"
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
        <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">My Submissions & Execution Log</h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
          History of all algorithmic solutions tested and submitted on the platform.
        </p>
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl overflow-hidden shadow-[var(--card-shadow)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[var(--text-secondary)]">
            <thead className="bg-[var(--bg-surface-secondary)] border-b border-[var(--border-default)] text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
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
            <tbody className="divide-y divide-[var(--border-default)]">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-[var(--bg-surface-hover)] transition">
                  <td className="py-3.5 px-4 font-semibold text-[var(--text-primary)]">{sub.questionTitle}</td>
                  <td className="py-3.5 px-4 font-mono text-[var(--text-primary)]">{sub.language}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant={sub.status === 'ACCEPTED' ? 'success' : 'danger'} size="sm">
                      {sub.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[var(--text-primary)]">
                    {sub.testsPassed} / {sub.totalTests}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[var(--text-muted)]">{sub.runtimeMs} ms</td>
                  <td className="py-3.5 px-4 font-mono text-emerald-600 dark:text-emerald-400 font-bold">{sub.score} PTS</td>
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
    </div>
  );
};
