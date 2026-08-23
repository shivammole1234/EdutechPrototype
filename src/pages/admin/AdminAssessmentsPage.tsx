import React, { useEffect, useState } from 'react';
import { FileCode2, Clock, CheckCircle2, AlertCircle, Shield, Play } from 'lucide-react';
import { Assessment } from '@/types';
import { assessmentService } from '@/services/assessmentService';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';

export const AdminAssessmentsPage: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  useEffect(() => {
    assessmentService.getAssessments().then(setAssessments);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Organization Assessments</h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5">
            Audit proctored examinations, question sets, and compliance policies.
          </p>
        </div>
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
                <span className="text-xs font-mono text-[var(--primary)] font-bold">{as.totalPoints} PTS</span>
              </div>

              <h3 className="text-sm font-bold text-[var(--text-primary)]">{as.title}</h3>
              <p className="text-xs text-[var(--text-muted)] line-clamp-2">{as.description}</p>
            </div>

            <div className="space-y-2 pt-3 border-t border-[var(--border-default)] text-xs">
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span className="text-[var(--text-muted)]">Duration:</span>
                <span className="font-mono">{as.durationMinutes} Minutes</span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span className="text-[var(--text-muted)]">Questions:</span>
                <span className="font-mono">{as.questionsCount} Coding Tasks</span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span className="text-[var(--text-muted)]">Proctoring:</span>
                <span className="text-emerald-500 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  {as.settings.proctoring.enableWebcam ? 'Webcam + Fullscreen' : 'Standard'}
                </span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span className="text-[var(--text-muted)]">Submissions Logged:</span>
                <span className="font-mono font-bold text-[var(--text-primary)]">{as.submissionsCount}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
