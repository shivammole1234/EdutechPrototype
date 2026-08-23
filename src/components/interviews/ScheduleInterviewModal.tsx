import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  Briefcase,
  Users,
  Video,
  Plus,
  Trash2,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { batchService } from '@/services/batchService';
import { userService } from '@/services/userService';
import { interviewService } from '@/services/interviewService';
import { Batch, StudentBatch, User, InterviewType, InterviewCandidateSlot } from '@/types';

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialBatchId?: string;
}

const INTERVIEW_TYPE_OPTIONS: { value: InterviewType; label: string; desc: string; icon: string }[] = [
  {
    value: 'MOCK_TECHNICAL',
    label: 'DSA & Coding Mock',
    desc: 'Live problem solving, algorithms, and data structure evaluations.',
    icon: '💻',
  },
  {
    value: 'SYSTEM_DESIGN',
    label: 'System Design 1-on-1',
    desc: 'Distributed systems, database architecture, and scalability.',
    icon: '🏗️',
  },
  {
    value: 'CODING_ROUND',
    label: 'Live Pair Programming',
    desc: 'Hands-on feature implementation, debugging, and framework tests.',
    icon: '⚡',
  },
  {
    value: 'BEHAVIORAL',
    label: 'Behavioral & Leadership',
    desc: 'STAR method questions, teamwork, and culture alignment.',
    icon: '🤝',
  },
  {
    value: 'PORTFOLIO_REVIEW',
    label: 'Project & Portfolio Defense',
    desc: 'Review capstone projects, architecture choices, and code quality.',
    icon: '📂',
  },
];

const PRESET_TOPICS: Record<InterviewType, string[]> = {
  MOCK_TECHNICAL: ['Binary Trees & BST', 'Dynamic Programming', 'Graph Traversals', 'Sliding Window', 'Complexity Analysis'],
  SYSTEM_DESIGN: ['Microservices', 'Database Sharding', 'Redis Caching', 'Load Balancing', 'Message Queues (Kafka)'],
  CODING_ROUND: ['React Hooks & State', 'TypeScript Generics', 'RESTful API & Express', 'SQL Queries & Indexing'],
  BEHAVIORAL: ['Conflict Resolution', 'Handling Deadlines', 'Cross-functional Collaboration', 'Growth Mindset'],
  PORTFOLIO_REVIEW: ['Architecture Modularization', 'Test Coverage', 'Cloud Deployment & CI/CD', 'Security Best Practices'],
};

export const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialBatchId,
}) => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [studentBatches, setStudentBatches] = useState<StudentBatch[]>([]);
  const [allStudents, setAllStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [selectedBatchId, setSelectedBatchId] = useState<string>(initialBatchId || '');
  const [title, setTitle] = useState('');
  const [interviewType, setInterviewType] = useState<InterviewType>('MOCK_TECHNICAL');
  const [scheduledDate, setScheduledDate] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [startTime, setStartTime] = useState('14:00');
  const [slotDuration, setSlotDuration] = useState<number>(45);
  const [numSlots, setNumSlots] = useState<number>(4);
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('Please join 5 minutes early with your webcam, microphone, and code editor ready.');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [customTopicInput, setCustomTopicInput] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>(PRESET_TOPICS.MOCK_TECHNICAL);

  // Candidate Slot Assignments State
  const [slots, setSlots] = useState<InterviewCandidateSlot[]>([]);

  useEffect(() => {
    async function loadData() {
      const [bts, sbs, stds] = await Promise.all([
        batchService.getBatches(),
        batchService.getStudentBatches(),
        userService.getStudents(),
      ]);
      setBatches(bts);
      setStudentBatches(sbs);
      setAllStudents(stds);

      if (initialBatchId) {
        setSelectedBatchId(initialBatchId);
      } else if (bts.length > 0) {
        setSelectedBatchId(bts[0].id);
      }
    }
    if (isOpen) {
      loadData();
    }
  }, [isOpen, initialBatchId]);

  // Set default title when type or batch changes
  useEffect(() => {
    const batch = batches.find((b) => b.id === selectedBatchId);
    const batchName = batch ? batch.code : 'Batch';
    const typeLabel = INTERVIEW_TYPE_OPTIONS.find((t) => t.value === interviewType)?.label || 'Mock Interview';
    setTitle(`${typeLabel} • ${batchName}`);
    setMeetingUrl(`https://meet.codepulse.io/interview/${(batch?.code || 'batch').toLowerCase()}-${Date.now().toString().slice(-4)}`);
  }, [selectedBatchId, interviewType, batches]);

  // Update suggested topics when interview type changes
  const handleTypeChange = (type: InterviewType) => {
    setInterviewType(type);
    setSelectedTopics(PRESET_TOPICS[type] || []);
  };

  // Generate Slots dynamically based on start time, duration, and students from selected batch
  useEffect(() => {
    if (!selectedBatchId) return;

    // Filter students belonging to this batch
    const batchStudents = allStudents.filter((s) =>
      s.batchIds?.includes(selectedBatchId) || s.batchName?.includes(selectedBatchId)
    );
    // If no strict match, fallback to some available students
    const availableStudents = batchStudents.length > 0 ? batchStudents : allStudents.slice(0, numSlots);

    const generatedSlots: InterviewCandidateSlot[] = [];
    const [startH, startM] = startTime.split(':').map(Number);
    let currentMinute = (startH || 14) * 60 + (startM || 0);

    for (let i = 0; i < numSlots; i++) {
      const slotStartH = Math.floor(currentMinute / 60) % 24;
      const slotStartM = currentMinute % 60;
      const endMinute = currentMinute + slotDuration;
      const slotEndH = Math.floor(endMinute / 60) % 24;
      const slotEndM = endMinute % 60;

      const formatTime = (h: number, m: number) =>
        `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

      const timeRange = `${formatTime(slotStartH, slotStartM)} - ${formatTime(slotEndH, slotEndM)}`;
      const assignedStudent = availableStudents[i % availableStudents.length];

      generatedSlots.push({
        id: `slot_preview_${i + 1}`,
        studentId: assignedStudent?.id || `usr_stud_0${i + 1}`,
        studentName: assignedStudent?.name || `Batch Student ${i + 1}`,
        studentEmail: assignedStudent?.email || `student${i + 1}@codepulse.io`,
        studentAvatar: assignedStudent?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        scheduledTime: timeRange,
        durationMinutes: slotDuration,
        status: 'CONFIRMED',
        meetingUrl: `${meetingUrl}?slot=${i + 1}`,
      });

      currentMinute = endMinute;
    }

    setSlots(generatedSlots);
  }, [selectedBatchId, startTime, slotDuration, numSlots, allStudents, meetingUrl]);

  const handleToggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleAddCustomTopic = () => {
    if (customTopicInput.trim() && !selectedTopics.includes(customTopicInput.trim())) {
      setSelectedTopics([...selectedTopics, customTopicInput.trim()]);
      setCustomTopicInput('');
    }
  };

  const handleRemoveSlot = (slotId: string) => {
    setSlots(slots.filter((s) => s.id !== slotId));
    setNumSlots((prev) => Math.max(1, prev - 1));
  };

  const handleSlotStudentChange = (slotId: string, studentId: string) => {
    const student = allStudents.find((s) => s.id === studentId);
    if (!student) return;

    setSlots((prev) =>
      prev.map((s) =>
        s.id === slotId
          ? {
              ...s,
              studentId: student.id,
              studentName: student.name,
              studentEmail: student.email,
              studentAvatar: student.avatar,
            }
          : s
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedBatchId) return;

    setLoading(true);
    try {
      const batch = batches.find((b) => b.id === selectedBatchId);

      const endTime = slots.length > 0 ? slots[slots.length - 1].scheduledTime.split(' - ')[1] : '18:00';

      await interviewService.createInterview({
        title: title.trim(),
        type: interviewType,
        batchId: selectedBatchId,
        batchName: batch?.name || 'Selected Cohort Batch',
        batchCode: batch?.code || 'BATCH-2025',
        instructorId: batch?.instructorId || 'usr_inst_01',
        instructorName: batch?.instructorName || 'Dr. Elena Rostova',
        instructorAvatar: batch?.instructorAvatar,
        instructorEmail: batch?.instructorEmail,
        scheduledDate,
        startTime,
        endTime,
        durationPerSlotMinutes: slotDuration,
        status: 'SCHEDULED',
        description: description.trim() || `Technical interview round for ${batch?.name}.`,
        meetingUrl,
        targetTopics: selectedTopics,
        candidateSlots: slots.map((s, idx) => ({
          ...s,
          id: `slot_${Date.now()}_${idx + 1}`,
        })),
        instructions: instructions.trim(),
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to schedule interview:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentBatch = batches.find((b) => b.id === selectedBatchId);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--border-default)] flex items-center justify-between bg-[var(--bg-muted)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-primary)] flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                  Batch Scheduling & Proctoring
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-default)]">
                  1-on-1 Slots & Panel
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] tracking-tight">
                Schedule Interview for Specific Batch
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-xs text-[var(--text-primary)]">
          {/* Step 1: Batch Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-[var(--text-primary)] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[var(--text-muted)]" />
                Target Cohort / Student Batch <span className="text-rose-400">*</span>
              </span>
              <span className="text-[11px] font-normal text-[var(--text-muted)]">
                Only students in this batch will be assigned slots
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {batches.map((b) => {
                const isSelected = selectedBatchId === b.id;
                return (
                  <button
                    type="button"
                    key={b.id}
                    onClick={() => setSelectedBatchId(b.id)}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--bg-surface)] border-[var(--border-hover)] text-[var(--text-primary)] ring-1 ring-[var(--border-hover)]'
                        : 'bg-[var(--bg-muted)] border-[var(--border-default)] hover:border-[var(--border-hover)] text-[var(--text-muted)]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="font-semibold text-xs text-[var(--text-primary)]">{b.name}</div>
                      <Badge variant={isSelected ? 'primary' : 'default'} size="sm">
                        {b.code}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                      <span>{b.studentCount} Students Enrolled</span>
                      <span>{b.programTrack?.split('&')[0] || 'Full Stack'}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Interview Type Cards */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-[var(--text-primary)]">Interview Format & Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {INTERVIEW_TYPE_OPTIONS.map((opt) => {
                const isSelected = interviewType === opt.value;
                return (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => handleTypeChange(opt.value)}
                    className={`p-2.5 rounded-xl border text-left transition flex flex-col gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--bg-surface)] border-[var(--border-hover)] text-[var(--text-primary)] ring-1 ring-[var(--border-hover)]'
                        : 'bg-[var(--bg-muted)] border-[var(--border-default)] hover:border-[var(--border-hover)] text-[var(--text-muted)]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <span>{opt.icon}</span>
                      <span className="truncate">{opt.label}</span>
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] line-clamp-2 leading-tight">{opt.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Interview Title & Date / Time Configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold mb-1 text-[var(--text-primary)]">
                Interview Round Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Masterclass Mock Technical Round: Graph Algorithms & Optimization"
                className="w-full bg-[var(--bg-muted)] border border-[var(--border-default)] focus:border-[var(--border-hover)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-[var(--text-primary)]">
                <Calendar className="w-3.5 h-3.5 inline mr-1 text-[var(--text-muted)]" />
                Scheduled Date
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full bg-[var(--bg-muted)] border border-[var(--border-default)] focus:border-[var(--border-hover)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none font-mono"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-[var(--text-primary)]">
                <Clock className="w-3.5 h-3.5 inline mr-1 text-[var(--text-muted)]" />
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-[var(--bg-muted)] border border-[var(--border-default)] focus:border-[var(--border-hover)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none font-mono"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-[var(--text-primary)]">Slot Duration per Candidate</label>
              <select
                value={slotDuration}
                onChange={(e) => setSlotDuration(Number(e.target.value))}
                className="w-full bg-[var(--bg-muted)] border border-[var(--border-default)] focus:border-[var(--border-hover)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none"
              >
                <option value={30}>30 Minutes (Sprint Round)</option>
                <option value={45}>45 Minutes (Standard Technical)</option>
                <option value={60}>60 Minutes (Deep System / DSA)</option>
                <option value={90}>90 Minutes (Comprehensive Panel)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-[var(--text-primary)]">Number of Candidate Slots</label>
              <select
                value={numSlots}
                onChange={(e) => setNumSlots(Number(e.target.value))}
                className="w-full bg-[var(--bg-muted)] border border-[var(--border-default)] focus:border-[var(--border-hover)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none"
              >
                <option value={1}>1 Candidate Slot</option>
                <option value={2}>2 Candidate Slots</option>
                <option value={3}>3 Candidate Slots</option>
                <option value={4}>4 Candidate Slots</option>
                <option value={5}>5 Candidate Slots</option>
                <option value={6}>6 Candidate Slots</option>
              </select>
            </div>
          </div>

          {/* Step 4: Topics & Rubric Focus */}
          <div className="space-y-2">
            <label className="block font-semibold text-[var(--text-primary)] flex items-center justify-between">
              <span>Evaluation Topics & Rubric Focus</span>
              <span className="text-[11px] text-[var(--text-muted)]">Select or add topics tested in this round</span>
            </label>

            <div className="flex flex-wrap gap-1.5">
              {selectedTopics.map((topic) => (
                <span
                  key={topic}
                  onClick={() => handleToggleTopic(topic)}
                  className="px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-primary)] text-xs flex items-center gap-1.5 cursor-pointer hover:bg-rose-950/40 hover:border-rose-500/40 hover:text-rose-300 transition"
                >
                  {topic}
                  <X className="w-3 h-3" />
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={customTopicInput}
                onChange={(e) => setCustomTopicInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomTopic())}
                placeholder="Add custom topic (e.g. Rate Limiting, Kafka, Redux)..."
                className="flex-1 bg-[var(--bg-muted)] border border-[var(--border-default)] rounded-xl px-3 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-hover)]"
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddCustomTopic} className="text-xs">
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Topic
              </Button>
            </div>
          </div>

          {/* Step 5: Candidate Slot Assignments Preview */}
          <div className="space-y-3 pt-2 border-t border-[var(--border-default)]">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-[var(--text-primary)] flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-500" />
                  Candidate Slots & Schedule Breakdown ({slots.length} Slots)
                </h4>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Each batch candidate will receive an invitation with their dedicated time slot & IDE room.
                </p>
              </div>
            </div>

            <div className="space-y-2 bg-[var(--bg-muted)] border border-[var(--border-default)] p-3 rounded-xl">
              {slots.map((slot, idx) => (
                <div
                  key={slot.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg gap-2.5"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-[var(--bg-muted)] border border-[var(--border-default)] text-[var(--text-primary)] flex items-center justify-center font-mono font-bold text-xs">
                      {idx + 1}
                    </span>
                    <span className="font-mono text-xs text-[var(--text-primary)] font-semibold px-2 py-0.5 bg-[var(--bg-muted)] rounded border border-[var(--border-default)]">
                      {slot.scheduledTime}
                    </span>
                  </div>

                  <div className="flex-1 sm:max-w-xs">
                    <select
                      value={slot.studentId}
                      onChange={(e) => handleSlotStudentChange(slot.id, e.target.value)}
                      className="w-full bg-[var(--bg-muted)] border border-[var(--border-default)] focus:border-[var(--border-hover)] rounded-lg px-2.5 py-1 text-xs text-[var(--text-primary)] focus:outline-none cursor-pointer"
                    >
                      {allStudents.map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.name} ({st.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-2">
                    <Badge variant="success" size="sm">
                      {slot.status}
                    </Badge>
                    <button
                      type="button"
                      onClick={() => handleRemoveSlot(slot.id)}
                      className="text-[var(--text-muted)] hover:text-rose-500 p-1 transition cursor-pointer"
                      title="Remove slot"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions & Notes */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-[var(--text-primary)]">Candidate Instructions & Notes</label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Instructions shared with batch students..."
              className="w-full bg-[var(--bg-muted)] border border-[var(--border-default)] focus:border-[var(--border-hover)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none text-xs"
            />
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[var(--border-default)] bg-[var(--bg-muted)] flex items-center justify-between shrink-0">
          <div className="text-[11px] text-[var(--text-muted)]">
            Targeting <span className="font-semibold text-[var(--text-primary)]">{currentBatch?.name || 'Selected Batch'}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              isLoading={loading}
              className="font-semibold px-4"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Confirm & Schedule Interview
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
