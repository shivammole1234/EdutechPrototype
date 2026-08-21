import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Clock,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Shield,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Send,
  Code2,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { questionService } from '@/services/questionService';
import { assessmentService } from '@/services/assessmentService';
import { executionService, CodeExecutionResponse } from '@/services/executionService';
import { submissionService } from '@/services/submissionService';
import { Question, Assessment } from '@/types';

type SupportedLanguage = 'typescript' | 'javascript' | 'python' | 'cpp' | 'java';

export const StudentAssessmentIDEPage: React.FC = () => {
  const { assessmentId, questionId } = useParams<{ assessmentId: string; questionId: string }>();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Editor State
  const [language, setLanguage] = useState<SupportedLanguage>('typescript');
  const [code, setCode] = useState('');
  const [lastSaved, setLastSaved] = useState<string>('Just now');

  // Execution & Test State
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeBottomTab, setActiveBottomTab] = useState<'tests' | 'results' | 'console'>('tests');
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState(0);
  const [customInput, setCustomInput] = useState('');
  const [executionResult, setExecutionResult] = useState<CodeExecutionResponse | null>(null);

  // Timer & Proctoring State
  const [secondsRemaining, setSecondsRemaining] = useState(5400); // 90 mins
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Load Assessment & Questions
  useEffect(() => {
    async function load() {
      const [asList, qList] = await Promise.all([
        assessmentService.getAssessments(),
        questionService.getQuestions(),
      ]);
      const currentAs = asList.find((a) => a.id === assessmentId) || asList[0];
      setAssessment(currentAs);

      // Filter questions in this assessment
      const filtered = qList.filter((q) => currentAs.questionIds.includes(q.id));
      const finalQuestions = filtered.length > 0 ? filtered : qList.slice(0, 3);
      setQuestions(finalQuestions);

      // Find question index by URL param if provided
      const targetIdx = finalQuestions.findIndex((q) => q.id === questionId);
      const initialIdx = targetIdx >= 0 ? targetIdx : 0;
      setCurrentQuestionIndex(initialIdx);

      // Set starter code
      const currentQ = finalQuestions[initialIdx];
      if (currentQ) {
        setCode(currentQ.starterCode[language] || currentQ.starterCode['typescript'] || '');
      }
    }
    load();
  }, [assessmentId, questionId]);

  // Handle Question Switch
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (currentQuestion) {
      setCode(currentQuestion.starterCode[language] || currentQuestion.starterCode['typescript'] || '');
      setExecutionResult(null);
    }
  }, [currentQuestionIndex, language]);

  // Timer Countdown Interval
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitAssessment();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Proctor Focus Lost Listener (Tab switch detection)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches((prev) => {
          const next = prev + 1;
          alert(`⚠️ PROCTOR WARNING: Focus lost from exam window (${next}/3 tab violations). Please stay on this tab.`);
          return next;
        });
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Format Timer Display mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Run Sample Tests
  const handleRunCode = async () => {
    if (!currentQuestion) return;
    setIsRunning(true);
    setActiveBottomTab('results');
    try {
      const result = await executionService.executeCode({
        code,
        language,
        testCases: currentQuestion.testCases.filter((tc) => !tc.isHidden),
      });
      setExecutionResult(result);
      setLastSaved(new Date().toLocaleTimeString());
    } finally {
      setIsRunning(false);
    }
  };

  // Submit Single Question Solution
  const handleSubmitSolution = async () => {
    if (!currentQuestion) return;
    setIsSubmitting(true);
    setActiveBottomTab('results');
    try {
      const result = await executionService.executeCode({
        code,
        language,
        testCases: currentQuestion.testCases, // all including hidden
      });
      setExecutionResult(result);

      // Record Submission
      await submissionService.saveSubmission({
        assessmentId: assessment?.id || 'asm_01',
        assessmentTitle: assessment?.title || 'Coding Assessment',
        questionId: currentQuestion.id,
        questionTitle: currentQuestion.title,
        studentId: 'usr_03',
        studentName: 'Alex Turner',
        studentEmail: 'alex.turner@student.codepulse.io',
        code,
        language,
        status: result.status,
        score: result.status === 'ACCEPTED' ? currentQuestion.points : Math.round(currentQuestion.points * 0.5),
        maxScore: currentQuestion.points,
        executionTimeMs: result.executionTimeMs,
        memoryUsedMb: result.memoryUsedMb,
        passedTests: result.passedTests,
        totalTests: result.totalTests,
        testCaseResults: result.testCaseResults,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Final Assessment Finish
  const handleSubmitAssessment = () => {
    setIsSubmitModalOpen(false);
    navigate('/student/submissions');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden select-none">
      {/* Top Header Bar */}
      <header className="h-14 bg-slate-950 border-b border-slate-800/90 px-4 flex items-center justify-between shrink-0 z-20">
        {/* Left: Test Title & Question Navigator */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/student/assessments')}
            className="text-slate-400 hover:text-slate-200"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Exit IDE
          </Button>

          <div className="hidden sm:block border-l border-slate-800 pl-4">
            <h1 className="text-xs font-bold text-slate-200 truncate max-w-xs sm:max-w-sm">
              {assessment?.title || 'Coding Assessment'}
            </h1>
          </div>

          {/* Question Nav Pills 01, 02, 03 */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-lg">
            {questions.map((q, idx) => {
              const isActive = idx === currentQuestionIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold font-mono transition cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <span>Q{idx + 1}</span>
                  {idx === 0 && <CheckCircle2 className="w-3 h-3 text-emerald-300" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Timer, Proctor status, Submit button */}
        <div className="flex items-center gap-3">
          {/* Countdown Clock */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-mono text-xs font-bold ${
              secondsRemaining < 600
                ? 'bg-rose-950/80 border-rose-600 text-rose-300 animate-pulse'
                : 'bg-slate-900 border-slate-800 text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatTime(secondsRemaining)}</span>
          </div>

          {/* Tab Switch warning badge */}
          {tabSwitches > 0 && (
            <Badge variant="warning" size="sm">
              <Shield className="w-3 h-3 mr-1" />
              {tabSwitches}/3 Violations
            </Badge>
          )}

          {/* Fullscreen Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-slate-400">
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>

          {/* Final Submit Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsSubmitModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 font-semibold"
          >
            <Send className="w-3.5 h-3.5 mr-1.5" />
            Finish Test
          </Button>
        </div>
      </header>

      {/* Main Two-Pane IDE Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Problem Description Panel (5 cols) */}
        <div className="lg:col-span-5 border-r border-slate-800 flex flex-col h-full bg-slate-950 overflow-hidden">
          {/* Problem Header */}
          <div className="p-4 border-b border-slate-800 shrink-0 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    currentQuestion.difficulty === 'EASY'
                      ? 'success'
                      : currentQuestion.difficulty === 'MEDIUM'
                      ? 'warning'
                      : 'danger'
                  }
                  size="sm"
                >
                  {currentQuestion.difficulty}
                </Badge>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  {currentQuestion.points} Points
                </span>
              </div>
              <span className="text-xs text-slate-400">{currentQuestion.topic}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-100">{currentQuestion.title}</h2>
          </div>

          {/* Problem Body Scrollable */}
          <div className="flex-1 p-5 overflow-y-auto space-y-6 text-xs text-slate-300 leading-relaxed">
            {/* Description */}
            <div className="space-y-2">
              <p className="whitespace-pre-line text-slate-200 text-sm">{currentQuestion.description}</p>
            </div>

            {/* Constraints */}
            {currentQuestion.constraints && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Constraints</h4>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg font-mono text-[11px] text-slate-300 whitespace-pre-line">
                  {currentQuestion.constraints}
                </div>
              </div>
            )}

            {/* Sample Test Cases */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Sample Test Cases</h4>
              {currentQuestion.testCases
                .filter((tc) => !tc.isHidden)
                .map((tc, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-[11px] font-bold text-slate-400">
                      <span>Example {idx + 1}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Input:</span>
                      <pre className="p-2 bg-slate-950 rounded font-mono text-emerald-300 text-[11px]">
                        {tc.input}
                      </pre>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Expected Output:</span>
                      <pre className="p-2 bg-slate-950 rounded font-mono text-blue-300 text-[11px]">
                        {tc.expectedOutput}
                      </pre>
                    </div>
                    {tc.explanation && (
                      <p className="text-slate-400 text-[11px] italic">Explanation: {tc.explanation}</p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Code Editor & Execution Panel (7 cols) */}
        <div className="lg:col-span-7 flex flex-col h-full bg-slate-950 overflow-hidden">
          {/* Editor Sub-Header (Language Switcher, Reset, Autosave indicator) */}
          <div className="h-11 bg-slate-900/90 border-b border-slate-800 px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="bg-slate-950 border border-slate-700/80 rounded-md px-2.5 py-1 text-xs font-mono text-slate-200 cursor-pointer focus:outline-none focus:border-emerald-500"
              >
                <option value="typescript">TypeScript 5.x</option>
                <option value="javascript">JavaScript (Node.js)</option>
                <option value="python">Python 3.11</option>
                <option value="cpp">C++ (GCC 13)</option>
                <option value="java">Java 21</option>
              </select>

              <button
                onClick={() =>
                  setCode(currentQuestion.codeTemplates[language] || currentQuestion.starterCode || '')
                }
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition cursor-pointer"
                title="Reset to starter template"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
              <span>Autosaved</span>
            </div>
          </div>

          {/* Monaco-Style Code Area */}
          <div className="flex-1 relative bg-slate-950 overflow-hidden font-mono text-xs flex">
            {/* Line numbers simulated */}
            <div className="w-10 py-3 bg-slate-950 border-r border-slate-900 text-right pr-2 select-none text-slate-600 text-[11px] font-mono leading-relaxed">
              {Array.from({ length: 28 }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Editable code buffer */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 p-3 bg-transparent text-slate-100 font-mono text-xs leading-relaxed focus:outline-none resize-none overflow-y-auto whitespace-pre tab-4"
              spellCheck={false}
              autoCapitalize="none"
            />
          </div>

          {/* Action Bar (Run Sample Tests & Submit Solution) */}
          <div className="h-12 bg-slate-900/90 border-t border-slate-800 px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveBottomTab('tests')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                  activeBottomTab === 'tests' ? 'bg-slate-800 text-slate-100' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Test Cases
              </button>
              <button
                onClick={() => setActiveBottomTab('results')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                  activeBottomTab === 'results' ? 'bg-slate-800 text-slate-100' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Test Results {executionResult && `(${executionResult.passedTests}/${executionResult.totalTests})`}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRunCode}
                isLoading={isRunning}
                disabled={isSubmitting}
              >
                <Play className="w-3.5 h-3.5 mr-1" />
                Run Code
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSubmitSolution}
                isLoading={isSubmitting}
                disabled={isRunning}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Send className="w-3.5 h-3.5 mr-1" />
                Submit Solution
              </Button>
            </div>
          </div>

          {/* Bottom Execution & Results Drawer */}
          <div className="h-44 bg-slate-950 border-t border-slate-800 p-3 overflow-y-auto shrink-0 text-xs">
            {activeBottomTab === 'tests' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {currentQuestion.testCases
                    .filter((tc) => !tc.isHidden)
                    .map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedTestCaseIndex(idx)}
                        className={`px-2.5 py-1 rounded text-xs font-mono transition ${
                          selectedTestCaseIndex === idx
                            ? 'bg-blue-950 text-blue-400 border border-blue-800'
                            : 'bg-slate-900 text-slate-400'
                        }`}
                      >
                        Case {idx + 1}
                      </button>
                    ))}
                </div>
                {currentQuestion.testCases[selectedTestCaseIndex] && (
                  <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800 space-y-1 font-mono text-[11px]">
                    <span className="text-slate-500 block">Input:</span>
                    <span className="text-slate-200">
                      {currentQuestion.testCases[selectedTestCaseIndex].input}
                    </span>
                  </div>
                )}
              </div>
            )}

            {activeBottomTab === 'results' && (
              <div>
                {isRunning || isSubmitting ? (
                  <div className="flex items-center gap-3 p-4 text-slate-400">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-emerald-500" />
                    <span>Executing in Judge0 Sandbox...</span>
                  </div>
                ) : executionResult ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={executionResult.status === 'ACCEPTED' ? 'success' : 'danger'}
                          size="md"
                        >
                          {executionResult.status}
                        </Badge>
                        <span className="font-mono text-slate-200 font-bold">
                          {executionResult.passedTests} / {executionResult.totalTests} Passed
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                        <span>Runtime: {executionResult.executionTimeMs}ms</span>
                        <span>Memory: {executionResult.memoryUsedMb}MB</span>
                      </div>
                    </div>

                    {/* Test Results Items */}
                    <div className="space-y-1.5">
                      {executionResult.testCaseResults.map((tcr, i) => (
                        <div
                          key={i}
                          className="p-2 bg-slate-900 rounded border border-slate-800 flex items-center justify-between text-[11px] font-mono"
                        >
                          <div className="flex items-center gap-2">
                            {tcr.passed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 text-rose-400" />
                            )}
                            <span className="text-slate-200">Case {i + 1}</span>
                          </div>
                          <span className="text-slate-400">{tcr.executionTimeMs || 10}ms</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 italic p-2">Click "Run Code" to view test results.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal to End Exam */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Submit & Conclude Assessment?"
        description="Are you sure you want to finalize your answers? You will not be able to re-enter this test session."
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Total Questions:</span>
              <span className="font-bold text-slate-200">{questions.length} Tasks</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Time Remaining:</span>
              <span className="font-mono text-emerald-400">{formatTime(secondsRemaining)}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setIsSubmitModalOpen(false)}>
              Continue Coding
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmitAssessment}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Confirm & Submit Exam
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
