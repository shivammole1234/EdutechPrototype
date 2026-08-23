import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  Trash2,
  Shield,
  FileCode2,
  Clock,
  Lock,
  Layers,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Question } from '@/types';
import { questionService } from '@/services/questionService';
import { assessmentService } from '@/services/assessmentService';

export const InstructorAssessmentBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Details
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [batchId, setBatchId] = useState('batch_01');

  // Step 2: Selected Questions
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>(['q_01', 'q_02']);

  // Step 3: Security & Proctoring
  const [enableWebcam, setEnableWebcam] = useState(true);
  const [enforceFullscreen, setEnforceFullscreen] = useState(true);
  const [maxTabSwitches, setMaxTabSwitches] = useState(3);
  const [disableCopyPaste, setDisableCopyPaste] = useState(true);

  useEffect(() => {
    questionService.getQuestions().then(setAvailableQuestions);
  }, []);

  const totalPoints = selectedQuestionIds.reduce((sum, qid) => {
    const q = availableQuestions.find((item) => item.id === qid);
    return sum + (q?.points || 0);
  }, 0);

  const toggleSelectQuestion = (id: string) => {
    if (selectedQuestionIds.includes(id)) {
      setSelectedQuestionIds(selectedQuestionIds.filter((qid) => qid !== id));
    } else {
      setSelectedQuestionIds([...selectedQuestionIds, id]);
    }
  };

  const handlePublish = async () => {
    if (!title) {
      alert('Please enter an assessment title.');
      return;
    }

    await assessmentService.createAssessment({
      title,
      description,
      durationMinutes,
      batchIds: [batchId],
      totalPoints,
      questionsCount: selectedQuestionIds.length,
      questionIds: selectedQuestionIds,
      status: 'UPCOMING',
      startTime: new Date(Date.now() + 86400000).toISOString(),
      endTime: new Date(Date.now() + 86400000 + durationMinutes * 60000).toISOString(),
      submissionsCount: 0,
      settings: {
        shuffleQuestions: false,
        shuffleOptions: true,
        negativeMarking: false,
        sectionTiming: false,
        allowedLanguages: ['typescript', 'javascript', 'python', 'cpp', 'java'],
        proctoring: {
          enableWebcam,
          fullscreenRequired: enforceFullscreen,
          tabSwitchLimit: maxTabSwitches,
          blockCopyPaste: disableCopyPaste,
          trackAudio: false,
        },
      },
    });

    navigate('/instructor/assessments');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => navigate('/instructor/assessments')}>
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Cancel Wizard
        </Button>
        <span className="text-xs text-[var(--text-muted)] font-mono">Step {currentStep} of 4</span>
      </div>

      {/* Stepper Header Indicator */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold">
        <div
          className={`p-2.5 rounded-lg border transition ${
            currentStep === 1
              ? 'bg-[var(--bg-surface)] border-[var(--border-hover)] text-[var(--text-primary)] shadow-xs'
              : currentStep > 1
              ? 'bg-[var(--bg-muted)] border-[var(--border-default)] text-emerald-600 dark:text-emerald-400'
              : 'bg-[var(--bg-muted)]/50 border-[var(--border-default)] text-[var(--text-muted)]'
          }`}
        >
          1. Test Details
        </div>
        <div
          className={`p-2.5 rounded-lg border transition ${
            currentStep === 2
              ? 'bg-[var(--bg-surface)] border-[var(--border-hover)] text-[var(--text-primary)] shadow-xs'
              : currentStep > 2
              ? 'bg-[var(--bg-muted)] border-[var(--border-default)] text-emerald-600 dark:text-emerald-400'
              : 'bg-[var(--bg-muted)]/50 border-[var(--border-default)] text-[var(--text-muted)]'
          }`}
        >
          2. Questions ({selectedQuestionIds.length})
        </div>
        <div
          className={`p-2.5 rounded-lg border transition ${
            currentStep === 3
              ? 'bg-[var(--bg-surface)] border-[var(--border-hover)] text-[var(--text-primary)] shadow-xs'
              : currentStep > 3
              ? 'bg-[var(--bg-muted)] border-[var(--border-default)] text-emerald-600 dark:text-emerald-400'
              : 'bg-[var(--bg-muted)]/50 border-[var(--border-default)] text-[var(--text-muted)]'
          }`}
        >
          3. Security & Rules
        </div>
        <div
          className={`p-2.5 rounded-lg border transition ${
            currentStep === 4
              ? 'bg-[var(--bg-surface)] border-[var(--border-hover)] text-[var(--text-primary)] shadow-xs'
              : 'bg-[var(--bg-muted)]/50 border-[var(--border-default)] text-[var(--text-muted)]'
          }`}
        >
          4. Review & Publish
        </div>
      </div>

      {/* Step 1: Details */}
      {currentStep === 1 && (
        <Card className="p-6 space-y-4">
          <CardTitle>Assessment Basic Details</CardTitle>
          <Input
            label="Assessment Title"
            placeholder="E.g., Algorithms & Data Structures Mid-Term"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Description & Student Instructions
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Instructions for students regarding timing, allowed languages, and submission rules..."
              className="w-full bg-[var(--bg-muted)] border border-[var(--border-default)] rounded-lg p-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-hover)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Duration (Minutes)"
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
            />
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Target Cohort
              </label>
              <select
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                className="w-full bg-[var(--bg-muted)] border border-[var(--border-default)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-hover)]"
              >
                <option value="batch_01">Full Stack & DSA Accelerator (Cohort 2025-A)</option>
                <option value="batch_02">Python & Applied AI Engineering</option>
              </select>
            </div>
          </div>
        </Card>
      )}

      {/* Step 2: Questions Selection */}
      {currentStep === 2 && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Select Questions from Bank</CardTitle>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {selectedQuestionIds.length} Selected • {totalPoints} Total Points
              </p>
            </div>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {availableQuestions.map((q) => {
              const isSelected = selectedQuestionIds.includes(q.id);
              return (
                <div
                  key={q.id}
                  onClick={() => toggleSelectQuestion(q.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[var(--bg-surface)] border-[var(--border-hover)] ring-1 ring-[var(--border-hover)] shadow-xs'
                      : 'bg-[var(--bg-muted)] border-[var(--border-default)] hover:border-[var(--border-hover)]'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          q.difficulty === 'EASY'
                            ? 'success'
                            : q.difficulty === 'MEDIUM'
                            ? 'warning'
                            : 'danger'
                        }
                        size="sm"
                      >
                        {q.difficulty}
                      </Badge>
                      <h4 className="font-semibold text-sm text-[var(--text-primary)]">{q.title}</h4>
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">
                      Topic: <span className="text-[var(--text-primary)]">{q.topic}</span> • {q.testCases.length} Test cases
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm font-bold text-[var(--text-primary)]">{q.points} PTS</span>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                        isSelected
                          ? 'bg-[var(--text-primary)] border-[var(--text-primary)] text-[var(--bg-canvas)]'
                          : 'border-[var(--border-default)] bg-[var(--bg-surface)]'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Step 3: Security & Proctoring */}
      {currentStep === 3 && (
        <Card className="p-6 space-y-6">
          <CardTitle>Proctoring & Anti-Cheat Controls</CardTitle>

          <div className="space-y-4 text-xs">
            <div className="p-4 bg-[var(--bg-muted)] border border-[var(--border-default)] rounded-xl space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-semibold text-[var(--text-primary)] text-sm">Enforce Fullscreen Mode</p>
                  <p className="text-[var(--text-muted)]">Exiting fullscreen triggers a violation flag</p>
                </div>
                <input
                  type="checkbox"
                  checked={enforceFullscreen}
                  onChange={(e) => setEnforceFullscreen(e.target.checked)}
                  className="w-4 h-4 rounded bg-[var(--bg-surface)] border-[var(--border-default)] accent-neutral-600"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer pt-3 border-t border-[var(--border-default)]">
                <div>
                  <p className="font-semibold text-[var(--text-primary)] text-sm">Disable Clipboard (Copy/Paste)</p>
                  <p className="text-[var(--text-muted)]">Prevents pasting external code snippets</p>
                </div>
                <input
                  type="checkbox"
                  checked={disableCopyPaste}
                  onChange={(e) => setDisableCopyPaste(e.target.checked)}
                  className="w-4 h-4 rounded bg-[var(--bg-surface)] border-[var(--border-default)] accent-neutral-600"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer pt-3 border-t border-[var(--border-default)]">
                <div>
                  <p className="font-semibold text-[var(--text-primary)] text-sm">Webcam & Proctor Snapshot</p>
                  <p className="text-[var(--text-muted)]">Periodic snapshot captures for faculty review</p>
                </div>
                <input
                  type="checkbox"
                  checked={enableWebcam}
                  onChange={(e) => setEnableWebcam(e.target.checked)}
                  className="w-4 h-4 rounded bg-[var(--bg-surface)] border-[var(--border-default)] accent-neutral-600"
                />
              </label>
            </div>

            <div className="p-4 bg-[var(--bg-muted)] border border-[var(--border-default)] rounded-xl space-y-2">
              <p className="font-semibold text-[var(--text-primary)]">Tab Switch Tolerance</p>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={maxTabSwitches}
                  onChange={(e) => setMaxTabSwitches(Number(e.target.value))}
                  className="flex-1 accent-neutral-600 cursor-pointer"
                />
                <span className="font-mono text-sm font-bold text-[var(--text-primary)]">
                  {maxTabSwitches} Warnings Allowed
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Step 4: Review & Publish */}
      {currentStep === 4 && (
        <Card className="p-6 space-y-5">
          <CardTitle>Assessment Summary Review</CardTitle>

          <div className="p-4 bg-[var(--bg-muted)] border border-[var(--border-default)] rounded-xl space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Assessment Name:</span>
              <span className="font-bold text-[var(--text-primary)]">{title || 'Untitled Assessment'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Duration:</span>
              <span className="font-mono text-[var(--text-primary)]">{durationMinutes} Minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Questions Count:</span>
              <span className="font-mono text-[var(--text-primary)]">{selectedQuestionIds.length} Tasks</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Total Score:</span>
              <span className="font-mono font-bold text-[var(--text-primary)]">{totalPoints} Points</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Proctoring:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                {enableWebcam ? 'Webcam Snapshots' : ''} {enforceFullscreen ? '• Fullscreen Lock' : ''}
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Bottom Step Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--border-default)]">
        <Button
          variant="outline"
          disabled={currentStep === 1}
          onClick={() => setCurrentStep(currentStep - 1)}
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Previous Step
        </Button>

        {currentStep < 4 ? (
          <Button variant="primary" onClick={() => setCurrentStep(currentStep + 1)}>
            Next Step
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        ) : (
          <Button variant="primary" onClick={handlePublish} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Check className="w-4 h-4 mr-1.5" />
            Publish & Launch Assessment
          </Button>
        )}
      </div>
    </div>
  );
};
