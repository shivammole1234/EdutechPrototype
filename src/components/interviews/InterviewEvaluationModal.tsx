import React, { useState } from 'react';
import {
  X,
  User,
  Clock,
  Video,
  CodeXml,
  CheckCircle2,
  AlertCircle,
  Star,
  Award,
  Sparkles,
  MessageSquare,
  FileText,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BatchInterview, InterviewCandidateSlot, InterviewRubric } from '@/types';
import { interviewService } from '@/services/interviewService';

interface InterviewEvaluationModalProps {
  isOpen: boolean;
  interview: BatchInterview | null;
  onClose: () => void;
  onUpdated: () => void;
}

export const InterviewEvaluationModal: React.FC<InterviewEvaluationModalProps> = ({
  isOpen,
  interview,
  onClose,
  onUpdated,
}) => {
  if (!isOpen || !interview) return null;

  const [selectedSlotId, setSelectedSlotId] = useState<string>(
    interview.candidateSlots[0]?.id || ''
  );
  const [isSaving, setIsSaving] = useState(false);

  const selectedSlot = interview.candidateSlots.find((s) => s.id === selectedSlotId);

  // Rubric local state
  const [rubric, setRubric] = useState<InterviewRubric>({
    problemSolving: selectedSlot?.rubricScores?.problemSolving || 4,
    codeQuality: selectedSlot?.rubricScores?.codeQuality || 4,
    communication: selectedSlot?.rubricScores?.communication || 4,
    csFundamentals: selectedSlot?.rubricScores?.csFundamentals || 4,
  });

  const [feedback, setFeedback] = useState(selectedSlot?.feedback || '');
  const [notes, setNotes] = useState(selectedSlot?.notes || '');
  const [slotStatus, setSlotStatus] = useState<InterviewCandidateSlot['status']>(
    selectedSlot?.status || 'CONFIRMED'
  );

  // When switching slots
  const handleSelectSlot = (slot: InterviewCandidateSlot) => {
    setSelectedSlotId(slot.id);
    setRubric({
      problemSolving: slot.rubricScores?.problemSolving || 4,
      codeQuality: slot.rubricScores?.codeQuality || 4,
      communication: slot.rubricScores?.communication || 4,
      csFundamentals: slot.rubricScores?.csFundamentals || 4,
    });
    setFeedback(slot.feedback || '');
    setNotes(slot.notes || '');
    setSlotStatus(slot.status || 'CONFIRMED');
  };

  // Calculate Overall Score (out of 100) based on Rubric (sum/20 * 100)
  const calculateTotalScore = (r: InterviewRubric) => {
    const totalPoints = r.problemSolving + r.codeQuality + r.communication + r.csFundamentals;
    return Math.round((totalPoints / 20) * 100);
  };

  const currentScore = calculateTotalScore(rubric);

  const handleSaveEvaluation = async () => {
    if (!selectedSlot) return;
    setIsSaving(true);

    try {
      await interviewService.updateCandidateSlot(interview.id, selectedSlot.id, {
        status: slotStatus === 'CONFIRMED' ? 'COMPLETED' : slotStatus,
        score: currentScore,
        rubricScores: rubric,
        feedback: feedback.trim(),
        notes: notes.trim(),
        evaluatedAt: new Date().toISOString().split('T')[0],
      });

      onUpdated();
    } catch (err) {
      console.error('Failed to save evaluation:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const quickFeedbackSnippets = [
    'Strong grasp of optimal time & space complexity analysis.',
    'Clear verbal communication and structured problem breakdown.',
    'Demonstrated good testing habits and edge-case handling.',
    'Clean, idiomatic code with appropriate modular design.',
    'Recommend practicing more dynamic programming and graph state trees.',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--border-default)] bg-[var(--bg-muted)] flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="primary" size="sm">
                {interview.batchCode || 'BATCH'}
              </Badge>
              <span className="text-xs text-[var(--text-muted)] font-mono">{interview.batchName}</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] tracking-tight mt-0.5">
              {interview.title} • Live Candidate Evaluation
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Two Pane Layout: Candidates Roster on Left, Active Rubric / Workspace on Right */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left: Candidates Slots List (4 cols) */}
          <div className="md:col-span-4 border-r border-[var(--border-default)] bg-[var(--bg-muted)]/50 p-3 space-y-2 overflow-y-auto">
            <div className="text-[11px] uppercase font-bold text-[var(--text-muted)] px-2 py-1 flex items-center justify-between">
              <span>Batch Candidates ({interview.candidateSlots.length})</span>
              <span>Slots</span>
            </div>

            {interview.candidateSlots.map((slot, idx) => {
              const isSelected = slot.id === selectedSlotId;
              const isCompleted = slot.status === 'COMPLETED';

              return (
                <button
                  key={slot.id}
                  onClick={() => handleSelectSlot(slot)}
                  className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--bg-surface)] border-[var(--border-hover)] text-[var(--text-primary)] ring-1 ring-[var(--border-hover)] shadow-xs'
                      : 'bg-[var(--bg-surface)]/60 border-[var(--border-default)] hover:border-[var(--border-hover)] text-[var(--text-muted)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={slot.studentAvatar}
                      alt={slot.studentName}
                      className="w-8 h-8 rounded-full object-cover border border-[var(--border-default)] shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-xs text-[var(--text-primary)] truncate">{slot.studentName}</p>
                      <p className="text-[10px] text-[var(--text-muted)] font-mono">{slot.scheduledTime}</p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    {typeof slot.score === 'number' ? (
                      <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                        {slot.score}%
                      </span>
                    ) : (
                      <Badge variant={slot.status === 'IN_PROGRESS' ? 'warning' : 'default'} size="sm">
                        {slot.status}
                      </Badge>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Active Candidate Evaluation Sheet (8 cols) */}
          {selectedSlot ? (
            <div className="md:col-span-8 flex flex-col h-full bg-[var(--bg-surface)] overflow-y-auto p-4 sm:p-6 space-y-6 text-xs text-[var(--text-primary)]">
              {/* Candidate Info Banner & Actions */}
              <div className="p-4 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-default)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedSlot.studentAvatar}
                    alt={selectedSlot.studentName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[var(--border-default)]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-[var(--text-primary)]">{selectedSlot.studentName}</h3>
                      <Badge variant={slotStatus === 'COMPLETED' ? 'success' : 'default'} size="sm">
                        {slotStatus}
                      </Badge>
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">{selectedSlot.studentEmail}</p>
                    <p className="text-[11px] text-[var(--text-muted)] font-mono mt-0.5">
                      Assigned Slot: {selectedSlot.scheduledTime} ({selectedSlot.durationMinutes} mins)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={selectedSlot.meetingUrl || interview.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="outline" size="sm" className="text-xs bg-[var(--bg-surface)] border-[var(--border-default)] text-[var(--text-primary)] hover:border-[var(--border-hover)]">
                      <Video className="w-3.5 h-3.5 mr-1 text-[var(--text-muted)]" />
                      Join Video IDE
                    </Button>
                  </a>
                </div>
              </div>

              {/* Rubric Evaluation Sliders & Score Box */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-500" />
                      Technical & Behavioral Rubric (1 - 5 Scale)
                    </h4>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      Score the candidate on core engineering proficiencies.
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Total Computed Score</div>
                    <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">{currentScore}%</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Rubric 1: Problem Solving */}
                  <div className="p-3.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-default)] space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-[var(--text-primary)]">1. Problem Solving & Approach</span>
                      <span className="font-mono font-bold text-[var(--text-primary)] text-sm">{rubric.problemSolving} / 5</span>
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)]">
                      Understanding constraints, decomposing problem, edge-cases.
                    </p>
                    <div className="flex gap-1.5 pt-1">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          type="button"
                          key={val}
                          onClick={() => setRubric({ ...rubric, problemSolving: val })}
                          className={`flex-1 py-1 rounded text-xs font-mono font-bold transition cursor-pointer ${
                            rubric.problemSolving === val
                              ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] shadow-xs'
                              : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-default)]'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rubric 2: Code Quality */}
                  <div className="p-3.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-default)] space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-[var(--text-primary)]">2. Code Quality & Speed</span>
                      <span className="font-mono font-bold text-[var(--text-primary)] text-sm">{rubric.codeQuality} / 5</span>
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)]">
                      Idiomatic syntax, modular design, variable naming, speed.
                    </p>
                    <div className="flex gap-1.5 pt-1">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          type="button"
                          key={val}
                          onClick={() => setRubric({ ...rubric, codeQuality: val })}
                          className={`flex-1 py-1 rounded text-xs font-mono font-bold transition cursor-pointer ${
                            rubric.codeQuality === val
                              ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] shadow-xs'
                              : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-default)]'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rubric 3: Communication */}
                  <div className="p-3.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-default)] space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-[var(--text-primary)]">3. Communication & Clarification</span>
                      <span className="font-mono font-bold text-[var(--text-primary)] text-sm">{rubric.communication} / 5</span>
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)]">
                      Thinking out loud, listening to hints, articulating trade-offs.
                    </p>
                    <div className="flex gap-1.5 pt-1">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          type="button"
                          key={val}
                          onClick={() => setRubric({ ...rubric, communication: val })}
                          className={`flex-1 py-1 rounded text-xs font-mono font-bold transition cursor-pointer ${
                            rubric.communication === val
                              ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] shadow-xs'
                              : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-default)]'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rubric 4: CS Fundamentals */}
                  <div className="p-3.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-default)] space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-[var(--text-primary)]">4. CS & Systems Fundamentals</span>
                      <span className="font-mono font-bold text-[var(--text-primary)] text-sm">{rubric.csFundamentals} / 5</span>
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)]">
                      Time/Space complexity, data structures, caching, threading.
                    </p>
                    <div className="flex gap-1.5 pt-1">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          type="button"
                          key={val}
                          onClick={() => setRubric({ ...rubric, csFundamentals: val })}
                          className={`flex-1 py-1 rounded text-xs font-mono font-bold transition cursor-pointer ${
                            rubric.csFundamentals === val
                              ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] shadow-xs'
                              : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-default)]'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Qualitative Detailed Feedback */}
              <div className="space-y-2">
                <label className="block font-semibold text-[var(--text-primary)] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-[var(--text-muted)]" />
                    Written Qualitative Feedback (Shared with Student)
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)]">Visible on Student Dashboard</span>
                </label>

                {/* Quick feedback snippet chips */}
                <div className="flex flex-wrap gap-1.5 pb-1">
                  {quickFeedbackSnippets.map((chip, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setFeedback((prev) => (prev ? `${prev}\n• ${chip}` : `• ${chip}`))}
                      className="px-2 py-0.5 rounded bg-[var(--bg-muted)] border border-[var(--border-default)] text-[10px] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition cursor-pointer"
                    >
                      + {chip.slice(0, 32)}...
                    </button>
                  ))}
                </div>

                <textarea
                  rows={4}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide structured feedback on what the candidate did well, areas to improve, and recommended study topics..."
                  className="w-full bg-[var(--bg-muted)] border border-[var(--border-default)] focus:border-[var(--border-hover)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none text-xs leading-relaxed"
                />
              </div>

              {/* Status & Save Button */}
              <div className="p-4 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-default)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--text-muted)] font-medium">Candidate Status:</span>
                  <select
                    value={slotStatus}
                    onChange={(e) => setSlotStatus(e.target.value as InterviewCandidateSlot['status'])}
                    className="bg-[var(--bg-surface)] border border-[var(--border-default)] focus:border-[var(--border-hover)] rounded-lg px-2.5 py-1 text-xs text-[var(--text-primary)] focus:outline-none"
                  >
                    <option value="CONFIRMED">Scheduled (Confirmed)</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed & Evaluated</option>
                    <option value="NO_SHOW">No Show</option>
                  </select>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveEvaluation}
                  isLoading={isSaving}
                  className="font-semibold"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Save Evaluation & Publish Score ({currentScore}%)
                </Button>
              </div>
            </div>
          ) : (
            <div className="md:col-span-8 flex items-center justify-center p-8 text-[var(--text-muted)]">
              Select a candidate slot on the left to review or evaluate.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
