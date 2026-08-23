import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Briefcase,
  Calendar,
  Clock,
  Users,
  Video,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Award,
  Layers,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  MoreVertical,
  Trash2,
  UserCheck2,
  FileCode2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { batchService } from '@/services/batchService';
import { interviewService } from '@/services/interviewService';
import { Batch, BatchInterview, InterviewType, InterviewStatus } from '@/types';
import { ScheduleInterviewModal } from '@/components/interviews/ScheduleInterviewModal';
import { InterviewEvaluationModal } from '@/components/interviews/InterviewEvaluationModal';
import { formatDate } from '@/lib/utils';

export const InstructorInterviewsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialBatchParam = searchParams.get('batchId') || '';

  const [interviews, setInterviews] = useState<BatchInterview[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedBatchFilter, setSelectedBatchFilter] = useState<string>(initialBatchParam);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [preselectedBatchId, setPreselectedBatchId] = useState<string>(initialBatchParam);
  const [evaluatingInterview, setEvaluatingInterview] = useState<BatchInterview | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ints, bts] = await Promise.all([
        interviewService.getInterviews(),
        batchService.getBatches(),
      ]);
      setInterviews(ints);
      setBatches(bts);
    } catch (err) {
      console.error('Failed to load interviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update batch filter if URL parameter changes
  useEffect(() => {
    if (initialBatchParam) {
      setSelectedBatchFilter(initialBatchParam);
      setPreselectedBatchId(initialBatchParam);
    }
  }, [initialBatchParam]);

  const handleOpenScheduleModal = (batchId?: string) => {
    setPreselectedBatchId(batchId || selectedBatchFilter || (batches[0]?.id ?? ''));
    setIsScheduleModalOpen(true);
  };

  const handleDeleteInterview = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to cancel and remove this scheduled interview round?')) {
      await interviewService.deleteInterview(id);
      loadData();
    }
  };

  // Filtered interviews
  const filteredInterviews = interviews.filter((item) => {
    if (selectedBatchFilter && item.batchId !== selectedBatchFilter) return false;
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchBatch = item.batchName.toLowerCase().includes(q);
      const matchStudent = item.candidateSlots.some((s) => s.studentName.toLowerCase().includes(q));
      if (!matchTitle && !matchBatch && !matchStudent) return false;
    }
    return true;
  });

  // Calculate Metrics
  const totalInterviews = interviews.length;
  const totalCandidateSlots = interviews.reduce((acc, curr) => acc + curr.candidateSlots.length, 0);
  const completedEvaluations = interviews.reduce(
    (acc, curr) => acc + curr.candidateSlots.filter((s) => s.status === 'COMPLETED').length,
    0
  );
  const scoredSlots = interviews.flatMap((i) => i.candidateSlots).filter((s) => typeof s.score === 'number');
  const avgOverallScore =
    scoredSlots.length > 0
      ? Math.round(scoredSlots.reduce((acc, s) => acc + (s.score || 0), 0) / scoredSlots.length)
      : 88;

  const getTypeBadgeColor = (type: InterviewType) => {
    switch (type) {
      case 'MOCK_TECHNICAL':
        return 'primary';
      case 'SYSTEM_DESIGN':
        return 'warning';
      case 'CODING_ROUND':
        return 'success';
      case 'BEHAVIORAL':
        return 'default';
      default:
        return 'primary';
    }
  };

  const formatTypeLabel = (type: InterviewType) => {
    switch (type) {
      case 'MOCK_TECHNICAL':
        return 'Mock Technical DSA';
      case 'SYSTEM_DESIGN':
        return 'System Design';
      case 'CODING_ROUND':
        return 'Live Pair Coding';
      case 'BEHAVIORAL':
        return 'Behavioral';
      case 'PORTFOLIO_REVIEW':
        return 'Portfolio Review';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Faculty Command</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-[var(--bg-muted)] text-[var(--text-muted)] border border-[var(--border-default)]">
              Batch Interview Scheduling
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight mt-1">
            Technical Mock Interviews & Batch Evaluations
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5">
            Schedule 1-on-1 mock interviews, system design panels, and coding screenings for specific student cohorts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleOpenScheduleModal()}
            className="font-bold text-xs shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Schedule Batch Interview
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Scheduled Rounds"
          value={totalInterviews.toString()}
          change={`${interviews.filter((i) => i.status === 'SCHEDULED').length} Upcoming`}
          changeType="neutral"
          icon={<Briefcase className="w-5 h-5 text-[var(--text-muted)]" />}
          subtitle="Across assigned cohorts"
        />
        <StatCard
          title="Batch Candidates"
          value={totalCandidateSlots.toString()}
          change={`${completedEvaluations} Evaluated`}
          changeType="positive"
          icon={<Users className="w-5 h-5 text-purple-400" />}
          subtitle="Assigned interview slots"
        />
        <StatCard
          title="Avg Batch Score"
          value={`${avgOverallScore}%`}
          change="+3.4% this month"
          changeType="positive"
          icon={<Award className="w-5 h-5 text-emerald-400" />}
          subtitle="Rubric-based evaluation"
        />
        <StatCard
          title="Active Batches"
          value={batches.length.toString()}
          change="All Synced"
          changeType="neutral"
          icon={<Layers className="w-5 h-5 text-amber-400" />}
          subtitle="Targetable student groups"
        />
      </div>

      {/* Filters and Search Bar */}
      <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-default)] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Batch Selector Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-muted)] font-medium flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              Batch:
            </span>
            <select
              value={selectedBatchFilter}
              onChange={(e) => setSelectedBatchFilter(e.target.value)}
              className="bg-[var(--bg-muted)] border border-[var(--border-default)] focus:border-[var(--border-hover)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none cursor-pointer"
            >
              <option value="">All Cohorts & Batches</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center p-1 bg-[var(--bg-muted)] border border-[var(--border-default)] rounded-lg text-xs">
            {['ALL', 'SCHEDULED', 'COMPLETED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-md transition cursor-pointer font-medium ${
                  statusFilter === st
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-default)] shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {st === 'ALL' ? 'All Status' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search interview or student..."
            className="w-full bg-[var(--bg-muted)] border border-[var(--border-default)] focus:border-[var(--border-hover)] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none placeholder:text-[var(--text-muted)]"
          />
        </div>
      </div>

      {/* Interviews Grid / List */}
      {filteredInterviews.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredInterviews.map((item) => {
            const completedCount = item.candidateSlots.filter((s) => s.status === 'COMPLETED').length;
            const progressPercent = Math.round((completedCount / (item.candidateSlots.length || 1)) * 100);

            return (
              <Card
                key={item.id}
                className="p-5 flex flex-col justify-between space-y-4 bg-[var(--bg-surface)] border-[var(--border-default)] hover:border-[var(--border-hover)] transition duration-200 shadow-sm"
              >
                {/* Header Information */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[var(--bg-muted)] border border-[var(--border-default)] text-[var(--text-primary)]">
                        {item.batchCode || 'BATCH'}
                      </span>
                      <Badge variant={getTypeBadgeColor(item.type)} size="sm">
                        {formatTypeLabel(item.type)}
                      </Badge>
                      <Badge
                        variant={item.status === 'COMPLETED' ? 'success' : 'default'}
                        size="sm"
                      >
                        {item.status}
                      </Badge>
                    </div>

                    <button
                      onClick={(e) => handleDeleteInterview(item.id, e)}
                      className="text-[var(--text-muted)] hover:text-rose-500 p-1 transition cursor-pointer"
                      title="Cancel Interview Round"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <h3 className="font-bold text-[var(--text-primary)] text-sm sm:text-base tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Batch & Schedule Details */}
                  <div className="p-3 bg-[var(--bg-muted)] border border-[var(--border-default)] rounded-xl space-y-2 text-xs text-[var(--text-primary)]">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                        Target Batch:
                      </span>
                      <span className="font-semibold text-[var(--text-primary)]">{item.batchName}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                        Scheduled Date & Time:
                      </span>
                      <span className="font-mono text-[var(--text-primary)]">
                        {formatDate(item.scheduledDate)} • {item.startTime} - {item.endTime}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        Slot Duration:
                      </span>
                      <span className="font-mono text-[var(--text-primary)]">
                        {item.durationPerSlotMinutes} mins per candidate
                      </span>
                    </div>
                  </div>

                  {/* Focus Topics Chips */}
                  {item.targetTopics && item.targetTopics.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase font-semibold text-[var(--text-muted)]">Tested Topics:</div>
                      <div className="flex flex-wrap gap-1">
                        {item.targetTopics.map((topic, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[10px] bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-default)]"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Candidate Slots Overview */}
                  <div className="space-y-2 pt-2 border-t border-[var(--border-default)]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--text-muted)] font-medium flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                        Batch Candidates ({item.candidateSlots.length} Slots):
                      </span>
                      <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                        {completedCount} / {item.candidateSlots.length} Evaluated ({progressPercent}%)
                      </span>
                    </div>

                    <div className="w-full bg-[var(--bg-muted)] rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    {/* Candidate Slot Pills */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                      {item.candidateSlots.map((slot) => (
                        <div
                          key={slot.id}
                          className="flex items-center justify-between p-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-default)] text-[11px]"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <img
                              src={slot.studentAvatar}
                              alt={slot.studentName}
                              className="w-5 h-5 rounded-full object-cover shrink-0"
                            />
                            <span className="text-[var(--text-primary)] font-medium truncate">{slot.studentName}</span>
                          </div>
                          <span className="font-mono text-[10px] text-[var(--text-muted)] shrink-0">
                            {slot.scheduledTime.split(' - ')[0]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="pt-3 border-t border-[var(--border-default)] flex items-center justify-between gap-2.5">
                  <a
                    href={item.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1"
                  >
                    <Button variant="outline" size="sm" className="w-full text-xs bg-[var(--bg-muted)] border-[var(--border-default)] text-[var(--text-primary)] hover:border-[var(--border-hover)]">
                      <Video className="w-3.5 h-3.5 mr-1 text-[var(--text-muted)]" />
                      Live Video Room
                    </Button>
                  </a>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setEvaluatingInterview(item)}
                    className="flex-1 text-xs font-semibold"
                  >
                    <UserCheck2 className="w-3.5 h-3.5 mr-1" />
                    Evaluate Candidates
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border-default)] text-[var(--text-primary)] flex items-center justify-center mx-auto">
            <Briefcase className="w-7 h-7" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-bold text-[var(--text-primary)]">No Interviews Found</h3>
            <p className="text-xs text-[var(--text-muted)]">
              {selectedBatchFilter
                ? 'No mock interviews scheduled for this specific batch yet. Click below to schedule a new 1-on-1 or panel round.'
                : 'Schedule your first technical mock interview, system design round, or coding screening for an enrolled student cohort.'}
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleOpenScheduleModal(selectedBatchFilter)}
            className="font-semibold text-xs"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Schedule Interview for Batch
          </Button>
        </div>
      )}

      {/* Schedule Interview Modal */}
      <ScheduleInterviewModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSuccess={loadData}
        initialBatchId={preselectedBatchId}
      />

      {/* Candidate Evaluation Modal */}
      <InterviewEvaluationModal
        isOpen={!!evaluatingInterview}
        interview={evaluatingInterview}
        onClose={() => setEvaluatingInterview(null)}
        onUpdated={() => {
          loadData();
          if (evaluatingInterview) {
            interviewService.getInterviewById(evaluatingInterview.id).then((updated) => {
              setEvaluatingInterview(updated || null);
            });
          }
        }}
      />
    </div>
  );
};
