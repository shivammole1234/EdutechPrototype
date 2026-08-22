import React, { useState } from 'react';
import { Cohort, StudentBatch, User } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import {
  Users,
  GraduationCap,
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Radio,
  Calendar,
  Clock,
  ShieldCheck,
} from 'lucide-react';

interface CohortConnectivityMapProps {
  cohorts: Cohort[];
  studentBatches: StudentBatch[];
  instructors: User[];
  onSelectCohort?: (cohort: Cohort) => void;
}

export const CohortConnectivityMap: React.FC<CohortConnectivityMapProps> = ({
  cohorts,
  studentBatches,
  instructors,
  onSelectCohort,
}) => {
  const [selectedCohortId, setSelectedCohortId] = useState<string>(cohorts[0]?.id || '');

  const activeCohort = cohorts.find((c) => c.id === selectedCohortId) || cohorts[0];

  const assignedBatches = activeCohort
    ? studentBatches.filter((b) => activeCohort.assignedBatchIds?.includes(b.id))
    : [];

  const leadInstructor = instructors.find((i) => i.id === activeCohort?.instructorId) || {
    id: activeCohort?.instructorId || 'usr_inst',
    name: activeCohort?.instructorName || 'Lead Faculty',
    email: activeCohort?.instructorEmail || 'faculty@codepulse.io',
    avatar: activeCohort?.instructorAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'INSTRUCTOR' as const,
    status: 'ACTIVE' as const,
    joinedDate: '2024-01-01',
  };

  const coInstructor = activeCohort?.coInstructorName
    ? instructors.find((i) => i.id === activeCohort.coInstructorId) || {
        id: activeCohort.coInstructorId || 'usr_co',
        name: activeCohort.coInstructorName,
        email: 'co.instructor@codepulse.io',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        role: 'INSTRUCTOR' as const,
        status: 'ACTIVE' as const,
        joinedDate: '2024-01-01',
      }
    : null;

  return (
    <div className="space-y-6">
      {/* Top Architecture Bar */}
      <Card className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#fafafa]" />
            <h3 className="text-sm sm:text-base font-bold text-[#fafafa]">
              Academic Middleware & Routing Topology
            </h3>
          </div>
          <p className="text-xs text-[#a1a1aa] mt-1 max-w-2xl">
            Cohorts bridge Lead Faculty with assigned Student Batches, routing curriculum pacing, synchronized IDE sandboxes, and assessments.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-[#71717a] font-mono">Active Cohort:</span>
          <select
            value={selectedCohortId}
            onChange={(e) => {
              setSelectedCohortId(e.target.value);
              const found = cohorts.find((c) => c.id === e.target.value);
              if (found && onSelectCohort) onSelectCohort(found);
            }}
            className="bg-[#09090b] border border-[#27272a] text-[#fafafa] text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#3f3f46]"
          >
            {cohorts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} — {c.name}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* 3-Tier Middleware Flow Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* TIER 1: Instructors & Faculty */}
        <div className="lg:col-span-3 space-y-3 flex flex-col justify-between">
          <div className="p-3 bg-[#18181b] border border-[#27272a] rounded-xl flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#a1a1aa] font-mono flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-[#fafafa]" /> 1. Lead Faculty
            </span>
            <Badge variant="default" size="sm">Provider</Badge>
          </div>

          <Card className="p-4 flex-1 space-y-4">
            {/* Primary Instructor */}
            <div className="flex items-start gap-3">
              <img
                src={leadInstructor.avatar}
                alt={leadInstructor.name}
                className="w-12 h-12 rounded-full object-cover border border-[#27272a] shrink-0"
              />
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#71717a]">
                  Primary Instructor
                </span>
                <h4 className="text-sm font-bold text-[#fafafa]">{leadInstructor.name}</h4>
                <p className="text-[11px] text-[#a1a1aa] truncate">{leadInstructor.email}</p>
              </div>
            </div>

            {/* Co-Instructor / TA if assigned */}
            {coInstructor && (
              <div className="pt-3 border-t border-[#27272a] flex items-start gap-3">
                <img
                  src={coInstructor.avatar}
                  alt={coInstructor.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#27272a] shrink-0"
                />
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-[#71717a]">
                    Teaching Assistant
                  </span>
                  <h5 className="text-xs font-semibold text-[#fafafa]">{coInstructor.name}</h5>
                  <p className="text-[10px] text-[#a1a1aa]">Classroom Proctoring & Labs</p>
                </div>
              </div>
            )}

            <div className="p-3 bg-[#09090b] rounded-xl border border-[#27272a] space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#a1a1aa]">
                <span>Broadcast State:</span>
                <span className="text-emerald-400 font-mono font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Active
                </span>
              </div>
              <div className="flex items-center justify-between text-[#a1a1aa]">
                <span>Meeting Stream:</span>
                <span className="text-[#fafafa] font-mono text-[10px] truncate max-w-[120px]">
                  {activeCohort?.meetUrl || 'meet.codepulse.io'}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* TIER 2: Academic Cohort Middleware */}
        <div className="lg:col-span-5 space-y-3 flex flex-col justify-between">
          <div className="p-3 bg-[#18181b] border border-[#27272a] rounded-xl flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#a1a1aa] font-mono flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-400" /> 2. Cohort Middleware Bridge
            </span>
            <Badge variant="purple" size="sm">Routing Hub</Badge>
          </div>

          <Card className="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-mono text-[#71717a]">
                    {activeCohort?.code} • {activeCohort?.academicTerm || 'Term 2025'}
                  </span>
                  <h4 className="text-base font-bold text-[#fafafa] mt-1">{activeCohort?.name}</h4>
                  <p className="text-xs text-purple-400 font-medium">{activeCohort?.programTrack}</p>
                </div>
                <Badge variant={activeCohort?.status === 'ACTIVE' ? 'success' : 'default'} size="sm">
                  {activeCohort?.status}
                </Badge>
              </div>

              <p className="text-xs text-[#a1a1aa] leading-relaxed line-clamp-3">
                {activeCohort?.description}
              </p>

              {/* Progress and Topics */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#71717a]">Curriculum Progress:</span>
                  <span className="font-mono text-[#fafafa] font-bold">{activeCohort?.progress}%</span>
                </div>
                <div className="w-full bg-[#09090b] rounded-full h-1.5 overflow-hidden border border-[#27272a]">
                  <div
                    className="bg-[#fafafa] h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${activeCohort?.progress || 0}%` }}
                  />
                </div>
              </div>

              {/* Middleware Routing Indicators */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                <div className="p-2.5 bg-[#09090b] rounded-xl border border-[#27272a]">
                  <span className="text-[10px] text-[#71717a] block">Schedule</span>
                  <span className="font-medium text-[#fafafa] text-[11px] line-clamp-1">
                    {activeCohort?.schedule}
                  </span>
                </div>
                <div className="p-2.5 bg-[#09090b] rounded-xl border border-[#27272a]">
                  <span className="text-[10px] text-[#71717a] block">Total Enrolled</span>
                  <span className="font-mono font-bold text-[#fafafa] text-[11px]">
                    {activeCohort?.totalStudentCount} / {activeCohort?.maxCapacity} Students
                  </span>
                </div>
              </div>
            </div>

            {/* Bridge Status footer */}
            <div className="pt-3 border-t border-[#27272a] flex items-center justify-between text-xs text-[#a1a1aa]">
              <span className="flex items-center gap-1.5 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Live Sync Active
              </span>
              <span className="font-mono text-[#fafafa] font-semibold text-[11px]">
                {assignedBatches.length} Batches Attached
              </span>
            </div>
          </Card>
        </div>

        {/* TIER 3: Student Batches & Groups */}
        <div className="lg:col-span-4 space-y-3 flex flex-col justify-between">
          <div className="p-3 bg-[#18181b] border border-[#27272a] rounded-xl flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#a1a1aa] font-mono flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-400" /> 3. Student Batches
            </span>
            <Badge variant="success" size="sm">Consumers</Badge>
          </div>

          <div className="flex-1 space-y-3 flex flex-col">
            {assignedBatches.length === 0 ? (
              <div className="flex-1 p-6 rounded-2xl bg-[#18181b] border border-dashed border-[#27272a] flex flex-col items-center justify-center text-center">
                <Users className="w-8 h-8 text-[#71717a] mb-2" />
                <p className="text-xs text-[#a1a1aa] font-medium">No Student Batches Attached</p>
                <p className="text-[11px] text-[#71717a] mt-0.5">Assign student batches to this cohort middleware.</p>
              </div>
            ) : (
              assignedBatches.map((batch) => (
                <Card
                  key={batch.id}
                  className="p-4 flex flex-col justify-between"
                  hoverable
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#fafafa]">{batch.name}</span>
                        </div>
                        <p className="text-[11px] text-[#a1a1aa] mt-0.5 font-mono">
                          {batch.code} • {batch.section}
                        </p>
                      </div>
                      <Badge variant="success" size="sm">
                        {batch.studentCount} Students
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {batch.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-lg text-[10px] bg-[#09090b] text-[#a1a1aa] border border-[#27272a]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#27272a] flex items-center justify-between text-[11px] text-[#71717a]">
                    <span>Enrolled: {batch.studentCount} Learners</span>
                    <span className="text-emerald-400 flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3 h-3" /> Connected
                    </span>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
