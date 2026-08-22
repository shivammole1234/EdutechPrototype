import React, { useState } from 'react';
import { Cohort, StudentBatch, User } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  GraduationCap,
  Users,
  Layers,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  Plus,
  X,
  Radio,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface CreateCohortModalProps {
  isOpen: boolean;
  onClose: () => void;
  instructors: User[];
  studentBatches: StudentBatch[];
  onCohortCreated: (newCohort: Partial<Cohort>) => Promise<void>;
  onOpenCreateBatch?: () => void;
}

export const CreateCohortModal: React.FC<CreateCohortModalProps> = ({
  isOpen,
  onClose,
  instructors,
  studentBatches,
  onCohortCreated,
  onOpenCreateBatch,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    programTrack: 'Full Stack & Cloud Architecture',
    academicTerm: 'Spring 2025',
    instructorId: instructors[0]?.id || '',
    coInstructorId: '',
    assignedBatchIds: [] as string[],
    maxCapacity: 60,
    startDate: '2025-04-01',
    endDate: '2025-09-30',
    schedule: 'Mon, Wed, Fri • 6:00 PM - 8:30 PM EST',
    description: '',
    topics: ['Data Structures & Algorithms', 'Full Stack System Design', 'High-Scale Cloud Systems'],
    newTopicInput: '',
    virtualRoomId: `room_${Math.random().toString(36).substring(2, 7)}`,
  });

  const selectedLeadInstructor = instructors.find((i) => i.id === formData.instructorId) || instructors[0];
  const selectedCoInstructor = instructors.find((i) => i.id === formData.coInstructorId);

  const selectedBatches = studentBatches.filter((sb) =>
    formData.assignedBatchIds.includes(sb.id)
  );
  const totalEnrolledStudents = selectedBatches.reduce((acc, b) => acc + (b.studentCount || 0), 0);

  const handleToggleBatch = (batchId: string) => {
    setFormData((prev) => {
      const exists = prev.assignedBatchIds.includes(batchId);
      if (exists) {
        return {
          ...prev,
          assignedBatchIds: prev.assignedBatchIds.filter((id) => id !== batchId),
        };
      } else {
        return {
          ...prev,
          assignedBatchIds: [...prev.assignedBatchIds, batchId],
        };
      }
    });
  };

  const handleAddTopic = () => {
    if (!formData.newTopicInput.trim()) return;
    if (formData.topics.includes(formData.newTopicInput.trim())) return;
    setFormData((prev) => ({
      ...prev,
      topics: [...prev.topics, prev.newTopicInput.trim()],
      newTopicInput: '',
    }));
  };

  const handleRemoveTopic = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      topics: prev.topics.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim() || !formData.instructorId) {
      setActiveStep(1);
      return;
    }

    setIsSubmitting(true);
    try {
      await onCohortCreated({
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        programTrack: formData.programTrack,
        academicTerm: formData.academicTerm,
        instructorId: selectedLeadInstructor.id,
        instructorName: selectedLeadInstructor.name,
        instructorAvatar: selectedLeadInstructor.avatar,
        instructorEmail: selectedLeadInstructor.email,
        coInstructorId: selectedCoInstructor?.id,
        coInstructorName: selectedCoInstructor?.name,
        assignedBatchIds: formData.assignedBatchIds,
        assignedBatchNames: selectedBatches.map((b) => b.name),
        totalStudentCount: totalEnrolledStudents,
        maxCapacity: formData.maxCapacity,
        startDate: formData.startDate,
        endDate: formData.endDate,
        schedule: formData.schedule,
        description: formData.description || `Academic Cohort bridging faculty with ${selectedBatches.length} student batches.`,
        topics: formData.topics,
        virtualRoomId: formData.virtualRoomId,
        meetUrl: `https://meet.codepulse.io/live/${formData.code.toLowerCase()}`,
        status: 'ACTIVE',
        progress: 0,
      });

      // Reset form
      setFormData({
        name: '',
        code: '',
        programTrack: 'Full Stack & Cloud Architecture',
        academicTerm: 'Spring 2025',
        instructorId: instructors[0]?.id || '',
        coInstructorId: '',
        assignedBatchIds: [],
        maxCapacity: 60,
        startDate: '2025-04-01',
        endDate: '2025-09-30',
        schedule: 'Mon, Wed, Fri • 6:00 PM - 8:30 PM EST',
        description: '',
        topics: ['Data Structures & Algorithms', 'Full Stack System Design', 'High-Scale Cloud Systems'],
        newTopicInput: '',
        virtualRoomId: `room_${Math.random().toString(36).substring(2, 7)}`,
      });
      setActiveStep(1);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Academic Cohort"
      description="Configure the academic bridge linking lead faculty with assigned student batches."
      maxWidth="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Step Indicator */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { step: 1, label: '1. Track & Identity' },
            { step: 2, label: '2. Faculty Assignment' },
            { step: 3, label: '3. Student Batches' },
            { step: 4, label: '4. Topology Review' },
          ].map((s) => (
            <button
              key={s.step}
              type="button"
              onClick={() => setActiveStep(s.step)}
              className={`p-2.5 rounded-lg text-xs font-semibold transition text-left border ${
                activeStep === s.step
                  ? 'bg-[#27272a] border-[#3f3f46] text-[#fafafa]'
                  : activeStep > s.step
                  ? 'bg-[#18181b] border-[#27272a] text-[#a1a1aa]'
                  : 'bg-[#09090b] border-[#27272a]/60 text-[#71717a]'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* STEP 1: Track & Identity */}
        {activeStep === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Cohort Name"
                placeholder="e.g. Distributed Systems & Cloud Accelerator 2025"
                value={formData.name}
                onChange={(e) => {
                  const val = e.target.value;
                  const autoCode = val
                    .split(' ')
                    .map((w) => w[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 6);
                  setFormData({
                    ...formData,
                    name: val,
                    code: formData.code || (autoCode ? `${autoCode}-2025` : ''),
                  });
                }}
                required
              />

              <Input
                label="Cohort Code"
                placeholder="e.g. DIST-SYS-2025"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#71717a]">
                  Academic Program Track
                </label>
                <select
                  value={formData.programTrack}
                  onChange={(e) => setFormData({ ...formData, programTrack: e.target.value })}
                  className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3.5 py-2 text-xs text-[#fafafa] focus:outline-none focus:border-[#3f3f46] focus:ring-1 focus:ring-[#3f3f46]"
                >
                  <option value="Full Stack & Cloud Architecture">Full Stack & Cloud Architecture</option>
                  <option value="Algorithms & High-Scale Systems">Algorithms & High-Scale Systems</option>
                  <option value="Artificial Intelligence & Machine Learning">Artificial Intelligence & Machine Learning</option>
                  <option value="Systems Programming in Go & Rust">Systems Programming in Go & Rust</option>
                  <option value="Cybersecurity & Network Engineering">Cybersecurity & Network Engineering</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#71717a]">
                  Academic Term / Semester
                </label>
                <select
                  value={formData.academicTerm}
                  onChange={(e) => setFormData({ ...formData, academicTerm: e.target.value })}
                  className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3.5 py-2 text-xs text-[#fafafa] focus:outline-none focus:border-[#3f3f46] focus:ring-1 focus:ring-[#3f3f46]"
                >
                  <option value="Spring 2025">Spring 2025 (Jan - Jun)</option>
                  <option value="Summer 2025">Summer 2025 (Jun - Aug)</option>
                  <option value="Fall 2025">Fall 2025 (Sep - Dec)</option>
                  <option value="Winter Intensive 2025">Winter Intensive 2025</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
              <Input
                label="End Date"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
              <Input
                label="Max Student Capacity"
                type="number"
                value={formData.maxCapacity}
                onChange={(e) => setFormData({ ...formData, maxCapacity: Number(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#71717a]">
                Cohort Overview & Syllabus Goals
              </label>
              <textarea
                rows={3}
                placeholder="Describe curriculum milestones, proctored midterm timelines, and live coding requirements..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3.5 py-2 text-xs text-[#fafafa] placeholder-[#71717a] focus:outline-none focus:border-[#3f3f46] focus:ring-1 focus:ring-[#3f3f46]"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Faculty Assignment */}
        {activeStep === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#71717a] mb-2">
                Select Primary Lead Instructor (Faculty Provider)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {instructors.map((inst) => {
                  const isSelected = formData.instructorId === inst.id;
                  return (
                    <div
                      key={inst.id}
                      onClick={() => setFormData({ ...formData, instructorId: inst.id })}
                      className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                        isSelected
                          ? 'bg-[#27272a] border-[#52525b] shadow-sm'
                          : 'bg-[#09090b] border-[#27272a] hover:border-[#3f3f46]'
                      }`}
                    >
                      <img
                        src={inst.avatar}
                        alt={inst.name}
                        className="w-11 h-11 rounded-full object-cover border border-[#27272a] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-[#fafafa] truncate">{inst.name}</h4>
                          {isSelected && <Check className="w-4 h-4 text-[#fafafa]" />}
                        </div>
                        <p className="text-[11px] text-[#a1a1aa] truncate">{inst.email}</p>
                        <p className="text-[10px] text-[#71717a] mt-1 line-clamp-1">{inst.bio}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#71717a] mb-2">
                Optional Secondary Co-Instructor / Teaching Assistant (TA)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => setFormData({ ...formData, coInstructorId: '' })}
                  className={`p-3 rounded-xl border cursor-pointer transition text-center ${
                    !formData.coInstructorId
                      ? 'bg-[#27272a] border-[#52525b] text-[#fafafa]'
                      : 'bg-[#09090b] border-[#27272a] text-[#71717a] hover:border-[#3f3f46]'
                  }`}
                >
                  <p className="text-xs font-semibold">No Secondary TA</p>
                  <p className="text-[10px] text-[#71717a] mt-0.5">Solo faculty cohort</p>
                </div>

                {instructors
                  .filter((inst) => inst.id !== formData.instructorId)
                  .map((inst) => {
                    const isSelected = formData.coInstructorId === inst.id;
                    return (
                      <div
                        key={inst.id}
                        onClick={() => setFormData({ ...formData, coInstructorId: inst.id })}
                        className={`p-3 rounded-xl border cursor-pointer transition flex items-center gap-2.5 ${
                          isSelected
                            ? 'bg-[#27272a] border-[#52525b] shadow-sm'
                            : 'bg-[#09090b] border-[#27272a] hover:border-[#3f3f46]'
                        }`}
                      >
                        <img
                          src={inst.avatar}
                          alt={inst.name}
                          className="w-8 h-8 rounded-full object-cover border border-[#27272a] shrink-0"
                        />
                        <div className="min-w-0">
                          <h5 className="text-xs font-semibold text-[#fafafa] truncate">{inst.name}</h5>
                          <span className="text-[10px] text-[#a1a1aa] font-mono">Assigned as TA</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Input
                label="Weekly Lecture & Broadcast Schedule"
                placeholder="Mon, Wed, Fri • 6:00 PM - 8:30 PM EST"
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                required
              />

              <Input
                label="Virtual Live Room ID"
                placeholder="room_fsd_live_01"
                value={formData.virtualRoomId}
                onChange={(e) => setFormData({ ...formData, virtualRoomId: e.target.value })}
                required
              />
            </div>
          </div>
        )}

        {/* STEP 3: Assign Student Batches */}
        {activeStep === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#71717a]">
                  Assign Student Batches
                </label>
                <p className="text-[11px] text-[#a1a1aa] mt-0.5">
                  Select existing student batches or create a new student group.
                </p>
              </div>

              {onOpenCreateBatch && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onOpenCreateBatch}
                  className="text-xs"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  New Student Batch
                </Button>
              )}
            </div>

            {/* Aggregated Headcount Bar */}
            <div className="p-3.5 rounded-xl bg-[#09090b] border border-[#27272a] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#fafafa]">{selectedBatches.length} Batches Selected</span>
                <span className="text-[#71717a]">•</span>
                <span className="text-[#fafafa] font-mono font-bold">
                  {totalEnrolledStudents} Total Students
                </span>
              </div>
              <div className="text-[#71717a] font-mono text-[11px]">
                Capacity: {totalEnrolledStudents} / {formData.maxCapacity} Seats
              </div>
            </div>

            {/* Batch Cards Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
              {studentBatches.map((batch) => {
                const isSelected = formData.assignedBatchIds.includes(batch.id);
                return (
                  <div
                    key={batch.id}
                    onClick={() => handleToggleBatch(batch.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between space-y-2.5 ${
                      isSelected
                        ? 'bg-[#27272a] border-[#52525b] shadow-sm'
                        : 'bg-[#09090b] border-[#27272a] hover:border-[#3f3f46]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#fafafa]">{batch.name}</span>
                        </div>
                        <p className="text-[11px] text-[#a1a1aa] mt-1 font-mono">{batch.code} • {batch.section}</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-[#fafafa] border-[#fafafa] text-[#09090b]'
                            : 'border-[#27272a] bg-[#18181b]'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#27272a]">
                      <span className="text-[#a1a1aa]">{batch.studentCount} Students</span>
                      {batch.cohortName ? (
                        <span className="text-[#71717a] text-[10px] font-mono truncate max-w-[120px]">
                          In {batch.cohortName.split('(')[0]}
                        </span>
                      ) : (
                        <span className="text-[#71717a] text-[10px]">Unassigned Batch</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Syllabus Topic Tags */}
            <div className="pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#71717a] mb-1.5">
                Core Syllabus Topic Milestones
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add curriculum module (e.g. Distributed Lock Managers)"
                  value={formData.newTopicInput}
                  onChange={(e) => setFormData({ ...formData, newTopicInput: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTopic();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={handleAddTopic} size="sm">
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {formData.topics.map((top, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-[#09090b] border border-[#27272a] text-[#fafafa]"
                  >
                    {top}
                    <button
                      type="button"
                      onClick={() => handleRemoveTopic(idx)}
                      className="text-[#71717a] hover:text-rose-400 transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Topology Review & Live Preview */}
        {activeStep === 4 && (
          <div className="space-y-4">
            <div className="p-3.5 bg-[#09090b] border border-[#27272a] rounded-xl flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#fafafa] shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-[#fafafa]">Live Architecture Review</h4>
                <p className="text-[11px] text-[#a1a1aa]">
                  Verify the faculty instructor, middleware cohort configuration, and student batch routing.
                </p>
              </div>
            </div>

            {/* Interactive Preview Flow */}
            <div className="p-4 bg-[#09090b] border border-[#27272a] rounded-xl space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                {/* 1. Instructor Node */}
                <div className="p-3.5 rounded-xl bg-[#18181b] border border-[#27272a] space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#71717a]">
                    Lead Faculty
                  </span>
                  <div className="flex items-center gap-2.5">
                    <img
                      src={selectedLeadInstructor.avatar}
                      alt={selectedLeadInstructor.name}
                      className="w-9 h-9 rounded-full object-cover border border-[#27272a]"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#fafafa] truncate">{selectedLeadInstructor.name}</p>
                      <p className="text-[10px] text-[#71717a] truncate">{selectedLeadInstructor.email}</p>
                    </div>
                  </div>
                </div>

                {/* 2. Cohort Middleware Node */}
                <div className="p-3.5 rounded-xl bg-[#18181b] border border-[#27272a] space-y-2 text-center">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#71717a]">
                    Cohort Middleware
                  </span>
                  <p className="text-xs font-bold text-[#fafafa]">{formData.name || 'New Cohort'}</p>
                  <p className="text-[10px] font-mono text-[#a1a1aa]">{formData.code || 'COHORT-CODE'}</p>
                  <span className="text-[10px] text-[#71717a] block">{formData.schedule}</span>
                </div>

                {/* 3. Student Batches Node */}
                <div className="p-3.5 rounded-xl bg-[#18181b] border border-[#27272a] space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#71717a]">
                    {selectedBatches.length} Batches ({totalEnrolledStudents} Students)
                  </span>
                  <div className="space-y-1">
                    {selectedBatches.length === 0 ? (
                      <p className="text-[11px] text-[#71717a] italic">No batches assigned yet</p>
                    ) : (
                      selectedBatches.map((b) => (
                        <div key={b.id} className="text-[11px] text-[#fafafa] flex items-center justify-between">
                          <span className="truncate">{b.name}</span>
                          <span className="font-mono text-[#a1a1aa] text-[10px]">{b.studentCount} students</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#18181b] rounded-xl border border-[#27272a] text-xs text-[#a1a1aa] flex items-center justify-between">
                <span>Program Track: <strong className="text-[#fafafa]">{formData.programTrack}</strong></span>
                <span>Term: <strong className="text-[#fafafa]">{formData.academicTerm}</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* Modal Controls */}
        <div className="pt-4 flex items-center justify-between border-t border-[#27272a]">
          <div>
            {activeStep > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActiveStep(activeStep - 1)}
              >
                Previous Step
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>

            {activeStep < 4 ? (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => setActiveStep(activeStep + 1)}
              >
                Next Step <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isSubmitting}
              >
                <Sparkles className="w-4 h-4 mr-1.5" />
                {isSubmitting ? 'Launching...' : 'Launch Cohort'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
};
