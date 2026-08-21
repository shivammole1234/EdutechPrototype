import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Clock, Users, Shield, Radio, CheckCircle2, MoreVertical, Eye, Play } from 'lucide-react';
import { Assessment } from '@/types';
import { assessmentService } from '@/services/assessmentService';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

export const InstructorAssessmentsPage: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  useEffect(() => {
    assessmentService.getAssessments().then(setAssessments);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">Assessments & Examinations</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Create timed coding assessments, configure proctoring controls, and monitor live test-takers.
          </p>
        </div>
        <Link to="/instructor/assessments/new">
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Create Assessment
          </Button>
        </Link>
      </div>

      {/* Grid of Assessments */}
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
                  {as.status === 'IN_PROGRESS' && <Radio className="w-3 h-3 mr-1 animate-pulse" />}
                  {as.status}
                </Badge>
                <span className="font-mono text-xs font-bold text-blue-400">{as.totalPoints} PTS</span>
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
                <span className="text-slate-400">Questions:</span>
                <span className="font-mono">{as.questionsCount} Algorithmic Tasks</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Security:</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  {as.settings.proctoring.enableWebcam ? 'Webcam + Lock' : 'Standard'}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Submissions Logged:</span>
                <span className="font-mono font-bold text-slate-200">{as.submissionsCount}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <Link to={`/instructor/assessments/${as.id}/monitor`} className="flex-1">
                <Button
                  variant={as.status === 'IN_PROGRESS' ? 'primary' : 'outline'}
                  size="sm"
                  className="w-full"
                >
                  <Eye className="w-3.5 h-3.5 mr-1.5" />
                  {as.status === 'IN_PROGRESS' ? 'Live Proctor' : 'Monitor'}
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
