import React, { useState } from 'react';
import { Cohort, StudentBatch, User } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import {
  Layers,
  GraduationCap,
  Users,
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  BookOpen,
  Sparkles,
  ExternalLink,
  Code2,
  FileCheck,
  TrendingUp,
  Tag,
  Copy,
  Check,
} from 'lucide-react';

interface CohortDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  cohort: Cohort | null;
  studentBatches?: StudentBatch[];
  instructors?: User[];
  onOpenBatchDetail?: (batch: StudentBatch) => void;
}

export const CohortDetailModal: React.FC<CohortDetailModalProps> = ({
  isOpen,
  onClose,
  cohort,
  studentBatches = [],
  instructors = [],
  onOpenBatchDetail,
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'BATCHES' | 'SYLLABUS' | 'FACULTY'>('OVERVIEW');
  const [copiedMeet, setCopiedMeet] = useState(false);

  if (!cohort) return null;

  const leadInstructor = instructors.find((i) => i.id === cohort.instructorId) || {
    id: cohort.instructorId,
    name: cohort.instructorName,
    email: cohort.instructorEmail || `${cohort.instructorName.toLowerCase().replace(/\s+/g, '.')}@codepulse.io`,
    avatar: cohort.instructorAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    bio: 'Lead Faculty member directing curriculum and evaluation frameworks.',
  };

  const coInstructor = cohort.coInstructorId
    ? instructors.find((i) => i.id === cohort.coInstructorId) || {
        id: cohort.coInstructorId,
        name: cohort.coInstructorName || 'Teaching Assistant',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        email: 'ta@codepulse.io',
      }
    : null;

  const assignedBatches = studentBatches.filter((b) =>
    cohort.assignedBatchIds?.includes(b.id) || b.cohortId === cohort.id
  );

  const totalCalculatedStudents = assignedBatches.reduce((acc, b) => acc + (b.studentCount || 0), 0) ||
    cohort.totalStudentCount ||
    cohort.studentCount ||
    0;

  const handleCopyLink = () => {
    if (cohort.meetUrl) {
      navigator.clipboard.writeText(cohort.meetUrl);
      setCopiedMeet(true);
      setTimeout(() => setCopiedMeet(false), 2000);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Academic Cohort Overview & Detail"
      description="Detailed curriculum roadmap, live routing topology, lead faculty, and attached student batches."
      maxWidth="3xl"
    >
      <div className="space-y-5">
        {/* Header Profile Section */}
        <div className="p-4 rounded-xl bg-[#09090b] border border-[#27272a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <img
              src={leadInstructor.avatar}
              alt={leadInstructor.name}
              className="w-14 h-14 rounded-full object-cover border border-[#27272a] shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#fafafa]">{cohort.name}</h3>
                <Badge variant={cohort.status === 'ACTIVE' ? 'success' : 'default'} size="sm">
                  {cohort.status === 'ACTIVE' ? 'Active' : cohort.status}
                </Badge>
              </div>
              <p className="text-xs text-[#a1a1aa] mt-0.5 font-mono">
                <span className="text-[#fafafa]">{cohort.code}</span> • {cohort.programTrack}
              </p>
              <p className="text-[11px] text-[#71717a] mt-0.5">
                Academic Term: <strong className="text-[#a1a1aa] font-medium">{cohort.academicTerm || 'Spring 2025'}</strong>
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#27272a]">
            <span className="text-[11px] text-[#71717a] font-mono">Curriculum Pacing</span>
            <span className="font-mono text-base font-bold text-[#fafafa]">{cohort.progress}%</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 border-b border-[#27272a] pb-1 overflow-x-auto">
          {[
            { id: 'OVERVIEW', label: 'Overview & Metrics', icon: Layers },
            { id: 'BATCHES', label: `Student Batches (${assignedBatches.length})`, icon: Users },
            { id: 'SYLLABUS', label: `Topics & Modules (${cohort.topics?.length || 0})`, icon: BookOpen },
            { id: 'FACULTY', label: 'Faculty & TAs', icon: GraduationCap },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-[#27272a] text-[#fafafa]'
                    : 'text-[#71717a] hover:text-[#fafafa] hover:bg-[#18181b]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW & METRICS */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-4">
            {/* Description */}
            <div className="p-4 bg-[#18181b] rounded-xl border border-[#27272a] space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717a]">
                Cohort Description & Goals
              </span>
              <p className="text-xs text-[#a1a1aa] leading-relaxed">
                {cohort.description || 'No detailed syllabus overview provided.'}
              </p>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-[#09090b] rounded-xl border border-[#27272a] space-y-1">
                <span className="text-[#71717a] flex items-center gap-1.5 text-[11px]">
                  <Users className="w-3.5 h-3.5 text-[#fafafa]" /> Total Enrolled
                </span>
                <span className="text-sm font-bold text-[#fafafa] font-mono">
                  {totalCalculatedStudents} Learners
                </span>
                <span className="text-[10px] text-[#71717a] block">
                  Capacity: {cohort.maxCapacity || 60} Max
                </span>
              </div>

              <div className="p-3 bg-[#09090b] rounded-xl border border-[#27272a] space-y-1">
                <span className="text-[#71717a] flex items-center gap-1.5 text-[11px]">
                  <Layers className="w-3.5 h-3.5 text-[#fafafa]" /> Attached Batches
                </span>
                <span className="text-sm font-bold text-[#fafafa] font-mono">
                  {assignedBatches.length} Groups
                </span>
                <span className="text-[10px] text-[#71717a] block">
                  Synchronized
                </span>
              </div>

              <div className="p-3 bg-[#09090b] rounded-xl border border-[#27272a] space-y-1">
                <span className="text-[#71717a] flex items-center gap-1.5 text-[11px]">
                  <TrendingUp className="w-3.5 h-3.5 text-[#fafafa]" /> Pacing Status
                </span>
                <span className="text-sm font-bold text-[#fafafa] font-mono">
                  {cohort.progress}% Completed
                </span>
                <span className="text-[10px] text-[#71717a] block">
                  On Track
                </span>
              </div>

              <div className="p-3 bg-[#09090b] rounded-xl border border-[#27272a] space-y-1">
                <span className="text-[#71717a] flex items-center gap-1.5 text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-[#fafafa]" /> Duration
                </span>
                <span className="text-xs font-bold text-[#fafafa] font-mono truncate block">
                  {formatDate(cohort.startDate)}
                </span>
                <span className="text-[10px] text-[#71717a] block truncate">
                  to {formatDate(cohort.endDate)}
                </span>
              </div>
            </div>

            {/* Schedule & Live Stream Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-[#09090b] rounded-xl border border-[#27272a] space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#fafafa]">
                  <Clock className="w-3.5 h-3.5 text-[#71717a]" />
                  <span>Class Schedule</span>
                </div>
                <p className="text-xs text-[#a1a1aa] font-medium">{cohort.schedule}</p>
                <p className="text-[10px] text-[#71717a]">Live synchronized coding sandbox broadcast</p>
              </div>

              <div className="p-3.5 bg-[#09090b] rounded-xl border border-[#27272a] space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-[#fafafa]">
                  <span className="flex items-center gap-2">
                    <Video className="w-3.5 h-3.5 text-[#71717a]" />
                    <span>Live Meeting Stream</span>
                  </span>
                  {cohort.meetUrl && (
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="text-[11px] text-[#a1a1aa] hover:text-[#fafafa] flex items-center gap-1"
                    >
                      {copiedMeet ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedMeet ? 'Copied' : 'Copy'}
                    </button>
                  )}
                </div>
                <p className="text-xs text-[#a1a1aa] font-mono truncate">
                  {cohort.meetUrl || 'meet.codepulse.io/live'}
                </p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Live Socket Relay Ready
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="p-3.5 bg-[#09090b] rounded-xl border border-[#27272a] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#71717a]">Syllabus Completion</span>
                <span className="font-mono font-bold text-[#fafafa]">{cohort.progress}%</span>
              </div>
              <div className="w-full bg-[#18181b] rounded-full h-2 overflow-hidden border border-[#27272a]">
                <div
                  className="bg-[#fafafa] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${cohort.progress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STUDENT BATCHES */}
        {activeTab === 'BATCHES' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#a1a1aa]">
                These student batches receive curriculum milestones and live evaluations from this cohort:
              </p>
              <Badge variant="default" size="sm">
                {assignedBatches.length} Groups • {totalCalculatedStudents} Learners
              </Badge>
            </div>

            {assignedBatches.length === 0 ? (
              <div className="p-8 rounded-xl bg-[#09090b] border border-dashed border-[#27272a] text-center space-y-2">
                <Users className="w-8 h-8 text-[#71717a] mx-auto" />
                <p className="text-xs font-semibold text-[#fafafa]">No Student Batches Attached</p>
                <p className="text-[11px] text-[#71717a]">
                  This cohort middleware is currently unassigned to any student section.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {assignedBatches.map((batch) => (
                  <div
                    key={batch.id}
                    className="p-3.5 rounded-xl bg-[#09090b] border border-[#27272a] hover:border-[#3f3f46] transition flex flex-col justify-between space-y-2"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h5 className="text-xs font-bold text-[#fafafa]">{batch.name}</h5>
                          <p className="text-[11px] text-[#a1a1aa] font-mono mt-0.5">
                            {batch.code} • {batch.section}
                          </p>
                        </div>
                        <Badge variant="success" size="sm">
                          {batch.studentCount} Students
                        </Badge>
                      </div>
                      {batch.description && (
                        <p className="text-[11px] text-[#71717a] mt-1.5 line-clamp-2">
                          {batch.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-[#27272a] flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {(batch.tags || []).slice(0, 2).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded text-[10px] bg-[#18181b] text-[#71717a] border border-[#27272a]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      {onOpenBatchDetail && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onOpenBatchDetail(batch)}
                          className="text-[11px] h-7 px-2"
                        >
                          View Batch <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SYLLABUS & TOPICS */}
        {activeTab === 'SYLLABUS' && (
          <div className="space-y-3">
            <p className="text-xs text-[#a1a1aa]">
              Sequential curriculum milestones and topic roadmaps active in this cohort:
            </p>

            <div className="space-y-2">
              {(cohort.topics || []).map((topic, index) => (
                <div
                  key={index}
                  className="p-3 rounded-xl bg-[#09090b] border border-[#27272a] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-center font-mono text-[11px] font-bold text-[#fafafa]">
                      {index + 1}
                    </span>
                    <span className="font-semibold text-[#fafafa]">{topic}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Synchronized
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: FACULTY & INSTRUCTORS */}
        {activeTab === 'FACULTY' && (
          <div className="space-y-4">
            <div className="p-4 bg-[#09090b] rounded-xl border border-[#27272a] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717a]">
                  Primary Lead Faculty
                </span>
                <Badge variant="default" size="sm">Provider</Badge>
              </div>

              <div className="flex items-start gap-3.5">
                <img
                  src={leadInstructor.avatar}
                  alt={leadInstructor.name}
                  className="w-12 h-12 rounded-full object-cover border border-[#27272a] shrink-0"
                />
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-[#fafafa]">{leadInstructor.name}</h4>
                  <p className="text-xs text-[#a1a1aa] font-mono">{leadInstructor.email}</p>
                  <p className="text-[11px] text-[#71717a] pt-1">
                    {leadInstructor.bio || 'Directs synchronous lecture streams and evaluates code submissions.'}
                  </p>
                </div>
              </div>
            </div>

            {coInstructor && (
              <div className="p-4 bg-[#09090b] rounded-xl border border-[#27272a] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717a]">
                    Assigned Teaching Assistant (TA)
                  </span>
                  <Badge variant="default" size="sm">Proctor & Labs</Badge>
                </div>

                <div className="flex items-start gap-3.5">
                  <img
                    src={coInstructor.avatar}
                    alt={coInstructor.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#27272a] shrink-0"
                  />
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-[#fafafa]">{coInstructor.name}</h4>
                    <p className="text-[11px] text-[#a1a1aa] font-mono">{coInstructor.email}</p>
                    <p className="text-[10px] text-[#71717a] pt-1">
                      Assists with student debugging, live class proctoring, and doubt clearance.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#27272a] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-[#71717a] font-mono">
            <span>Created {formatDate(cohort.createdAt)}</span>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
