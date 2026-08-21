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
        <span className="text-xs text-slate-400 font-mono">Step {currentStep} of 4</span>
      </div>

      {/* Stepper Header Indicator */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold">
        <div
          className={`p-2.5 rounded-lg border transition ${
            currentStep === 1
              ? 'bg-blue-950/60 border-blue-500 text-blue-400'
              : currentStep > 1
              ? 'bg-slate-900 border-slate-800 text-emerald-400'
              : 'bg-slate-950 border-slate-800 text-slate-500'
          }`}
        >
          1. Test Details
        </div>
        <div
          className={`p-2.5 rounded-lg border transition ${
            currentStep === 2
              ? 'bg-blue-950/60 border-blue-500 text-blue-400'
              : currentStep > 2
              ? 'bg-slate-900 border-slate-800 text-emerald-400'
              : 'bg-slate-950 border-slate-800 text-slate-500'
          }`}
        >
          2. Questions ({selectedQuestionIds.length})
        </div>
        <div
          className={`p-2.5 rounded-lg border transition ${
            currentStep === 3
              ? 'bg-blue-950/60 border-blue-500 text-blue-400'
              : currentStep > 3
              ? 'bg-slate-900 border-slate-800 text-emerald-400'
              : 'bg-slate-950 border-slate-800 text-slate-500'
          }`}
        >
          3. Security & Rules
        </div>
        <div
          className={`p-2.5 rounded-lg border transition ${
            currentStep === 4
              ? 'bg-blue-950/60 border-blue-500 text-blue-400'
              : 'bg-slate-950 border-slate-800 text-slate-500'
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Description & Student Instructions
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Instructions for students regarding timing, allowed languages, and submission rules..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
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
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Target Cohort
              </label>
              <select
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-200"
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
              <p className="text-xs text-slate-400 mt-0.5">
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
                      ? 'bg-blue-950/40 border-blue-500/80 shadow-xs'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
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
                      <h4 className="font-semibold text-sm text-slate-100">{q.title}</h4>
                    </div>
                    <p className="text-xs text-slate-400">
                      Topic: <span className="text-slate-300">{q.topic}</span> • {q.testCases.length} Test cases
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm font-bold text-blue-400">{q.points} PTS</span>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-slate-700 bg-slate-900'
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
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-semibold text-slate-100 text-sm">Enforce Fullscreen Mode</p>
                  <p className="text-slate-400">Exiting fullscreen triggers a violation flag</p>
                </div>
                <input
                  type="checkbox"
                  checked={enforceFullscreen}
                  onChange={(e) => setEnforceFullscreen(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer pt-3 border-t border-slate-800">
                <div>
                  <p className="font-semibold text-slate-100 text-sm">Disable Clipboard (Copy/Paste)</p>
                  <p className="text-slate-400">Prevents pasting external code snippets</p>
                </div>
                <input
                  type="checkbox"
                  checked={disableCopyPaste}
                  onChange={(e) => setDisableCopyPaste(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer pt-3 border-t border-slate-800">
                <div>
                  <p className="font-semibold text-slate-100 text-sm">Webcam & Proctor Snapshot</p>
                  <p className="text-slate-400">Periodic snapshot captures for faculty review</p>
                </div>
                <input
                  type="checkbox"
                  checked={enableWebcam}
                  onChange={(e) => setEnableWebcam(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600"
                />
              </label>
            </div>

            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
              <p className="font-semibold text-slate-100">Tab Switch Tolerance</p>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={maxTabSwitches}
                  onChange={(e) => setMaxTabSwitches(Number(e.target.value))}
                  className="flex-1 accent-blue-500 cursor-pointer"
                />
                <span className="font-mono text-sm font-bold text-blue-400">
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

          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Assessment Name:</span>
              <span className="font-bold text-slate-100">{title || 'Untitled Assessment'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Duration:</span>
              <span className="font-mono text-slate-200">{durationMinutes} Minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Questions Count:</span>
              <span className="font-mono text-slate-200">{selectedQuestionIds.length} Tasks</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Score:</span>
              <span className="font-mono font-bold text-blue-400">{totalPoints} Points</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Proctoring:</span>
              <span className="text-emerald-400 font-semibold">
                {enableWebcam ? 'Webcam Snapshots' : ''} {enforceFullscreen ? '• Fullscreen Lock' : ''}
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Bottom Step Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
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
          <Button variant="primary" onClick={handlePublish} className="bg-emerald-600 hover:bg-emerald-700">
            <Check className="w-4 h-4 mr-1.5" />
            Publish & Launch Assessment
          </Button>
        )}
      </div>
    </div>
  );
};
