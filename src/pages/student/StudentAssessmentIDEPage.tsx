import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Clock,
  Play,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Shield,
  Maximize2,
  Minimize2,
  ChevronLeft,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useThemeStore } from '@/stores/useThemeStore';
import { questionService } from '@/services/questionService';
import { assessmentService } from '@/services/assessmentService';
import { executionService, CodeExecutionResponse } from '@/services/executionService';
import { submissionService } from '@/services/submissionService';
import { Question, Assessment } from '@/types';

type SupportedLanguage = 'typescript' | 'javascript' | 'python' | 'cpp' | 'java';

export const StudentAssessmentIDEPage: React.FC = () => {
  const { assessmentId, questionId } = useParams<{ assessmentId: string; questionId: string }>();
  const navigate = useNavigate();
  const { theme } = useThemeStore();

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Editor State
  const [language, setLanguage] = useState<SupportedLanguage>('typescript');
  const [code, setCode] = useState('');

  // Execution & Test State
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeBottomTab, setActiveBottomTab] = useState<'tests' | 'results' | 'console'>('tests');
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState(0);
  const [executionResult, setExecutionResult] = useState<CodeExecutionResponse | null>(null);

  // Timer & Proctoring State
  const [secondsRemaining, setSecondsRemaining] = useState(5400); // 90 mins
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'problem' | 'code' | 'tests'>('problem');

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
      const filtered = qList.filter((q) => currentAs?.questionIds?.includes(q.id));
      const finalQuestions = filtered.length > 0 ? filtered : qList.slice(0, 3);
      setQuestions(finalQuestions);

      // Find question index by URL param if provided
      if (questionId) {
        const foundIdx = finalQuestions.findIndex((q) => q.id === questionId);
        if (foundIdx !== -1) setCurrentQuestionIndex(foundIdx);
      }
    }
    load();
  }, [assessmentId, questionId]);

  const currentQuestion = questions[currentQuestionIndex];

  // Set initial template when question or language changes
  useEffect(() => {
    if (currentQuestion) {
      const starter =
        currentQuestion.codeTemplates?.[language] ||
        currentQuestion.starterCode ||
        '// Write your solution here\n';
      setCode(starter);
      setExecutionResult(null);
    }
  }, [currentQuestionIndex, questions, language]);

  // Countdown Timer Hook
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

  // Proctoring: Tab switch detector
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches((prev) => prev + 1);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleRunCode = async () => {
    if (!currentQuestion) return;
    setIsRunning(true);
    setActiveBottomTab('results');
    try {
      const res = await executionService.executeWithTestCases(
        code,
        language,
        currentQuestion.testCases.filter((tc) => !tc.isHidden)
      );
      setExecutionResult(res);
    } catch (err: any) {
      setExecutionResult({
        stdout: '',
        error: err.message || 'Execution error',
        status: 'RUNTIME_ERROR',
        passedTests: 0,
        totalTests: currentQuestion.testCases.length,
        executionTimeMs: 0,
        memoryUsedMb: 0,
        testCaseResults: [],
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitSolution = async () => {
    if (!currentQuestion) return;
    setIsSubmitting(true);
    try {
      const res = await executionService.executeWithTestCases(
        code,
        language,
        currentQuestion.testCases
      );
      setExecutionResult(res);
      await submissionService.createSubmission({
        studentId: 'usr-student-01',
        studentName: 'Alex Turner',
        studentEmail: 'alex.turner@student.codepulse.io',
        assessmentId: assessment?.id || 'asm-01',
        assessmentTitle: assessment?.title || 'Coding Assessment',
        questionId: currentQuestion.id,
        questionTitle: currentQuestion.title,
        code,
        language,
        status: res.status,
        score: Math.round((res.passedTests / res.totalTests) * currentQuestion.points),
        maxScore: currentQuestion.points,
        totalTests: res.totalTests,
        passedTests: res.passedTests,
        executionTimeMs: res.executionTimeMs,
        memoryUsedMb: res.memoryUsedMb,
        testCaseResults: res.testCaseResults,
      });

      // Move to next question if exists
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setIsSubmitModalOpen(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitAssessment = () => {
    setIsSubmitModalOpen(false);
    navigate('/student/assessments');
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
      <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[var(--text-primary)]" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col overflow-hidden select-none">
      {/* Top Header Bar */}
      <header className="h-14 bg-[var(--bg-surface)] border-b border-[var(--border-default)] px-3 sm:px-4 flex items-center justify-between shrink-0 z-20 gap-2">
        {/* Left: Exit + Question Navigator */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/student/assessments')}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-2 sm:px-3 text-xs shrink-0"
          >
            <ChevronLeft className="w-4 h-4 mr-0.5 sm:mr-1" />
            <span className="hidden xs:inline">Exit</span>
          </Button>

          <div className="hidden md:block border-l border-[var(--border-default)] pl-4">
            <h1 className="text-xs font-bold text-[var(--text-primary)] truncate max-w-[150px] lg:max-w-xs">
              {assessment?.title || 'Coding Assessment'}
            </h1>
          </div>

          {/* Question Nav Pills */}
          <div className="flex items-center gap-1 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] p-0.5 sm:p-1 rounded-lg shrink-0">
            {questions.map((q, idx) => {
              const isActive = idx === currentQuestionIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold font-mono transition cursor-pointer ${
                    isActive
                      ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] shadow-xs'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
                  }`}
                >
                  <span>Q{idx + 1}</span>
                  {idx === 0 && <CheckCircle2 className="w-3 h-3 text-emerald-500 hidden sm:inline" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Timer, Proctor status, Submit button */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Countdown Clock */}
          <div
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-lg border font-mono text-xs font-bold ${
              secondsRemaining < 600
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400 animate-pulse'
                : 'bg-[var(--bg-surface-secondary)] border-[var(--border-default)] text-[var(--text-primary)]'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <span>{formatTime(secondsRemaining)}</span>
          </div>

          {/* Tab Switch warning badge */}
          {tabSwitches > 0 && (
            <Badge variant="warning" size="sm" className="hidden sm:inline-flex">
              <Shield className="w-3 h-3 mr-1" />
              {tabSwitches}/3 Violations
            </Badge>
          )}

          {/* Fullscreen Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-[var(--text-secondary)] hidden sm:flex">
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>

          {/* Final Submit Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsSubmitModalOpen(true)}
            className="font-semibold text-xs px-2.5 sm:px-3"
          >
            <Send className="w-3.5 h-3.5 mr-1" />
            <span className="hidden sm:inline">Finish Test</span>
            <span className="sm:hidden">Finish</span>
          </Button>
        </div>
      </header>

      {/* Mobile View Switcher (Visible on < lg) */}
      <div className="lg:hidden flex items-center justify-around bg-[var(--bg-surface-secondary)] border-b border-[var(--border-default)] p-1 shrink-0">
        <button
          onClick={() => setMobileTab('problem')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-md text-center transition ${
            mobileTab === 'problem' ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          Problem
        </button>
        <button
          onClick={() => setMobileTab('code')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-md text-center transition ${
            mobileTab === 'code' ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          Code Editor
        </button>
        <button
          onClick={() => setMobileTab('tests')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-md text-center transition ${
            mobileTab === 'tests' ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          Test Cases
        </button>
      </div>

      {/* Main Two-Pane IDE Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Problem Description Panel (5 cols on lg, toggled on mobile) */}
        <div
          className={`lg:col-span-5 border-r border-[var(--border-default)] flex flex-col h-full bg-[var(--bg-surface)] overflow-hidden ${
            mobileTab === 'problem' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Problem Header */}
          <div className="p-4 border-b border-[var(--border-default)] shrink-0 space-y-2">
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
                <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {currentQuestion.points} Points
                </span>
              </div>
              <span className="text-xs text-[var(--text-muted)]">{currentQuestion.topic}</span>
            </div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">{currentQuestion.title}</h2>
          </div>

          {/* Problem Body Scrollable */}
          <div className="flex-1 p-5 overflow-y-auto space-y-6 text-xs text-[var(--text-secondary)] leading-relaxed">
            {/* Description */}
            <div className="space-y-2">
              <p className="whitespace-pre-line text-[var(--text-primary)] text-sm">{currentQuestion.description}</p>
            </div>

            {/* Constraints */}
            {currentQuestion.constraints && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Constraints</h4>
                <div className="p-3 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-lg font-mono text-[11px] text-[var(--text-primary)] whitespace-pre-line">
                  {currentQuestion.constraints}
                </div>
              </div>
            )}

            {/* Sample Test Cases */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Sample Test Cases</h4>
              {currentQuestion.testCases
                .filter((tc) => !tc.isHidden)
                .map((tc, idx) => (
                  <div key={idx} className="p-3.5 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-[11px] font-bold text-[var(--text-muted)]">
                      <span>Example {idx + 1}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block">Input:</span>
                      <pre className="p-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded font-mono text-emerald-600 dark:text-emerald-400 text-[11px]">
                        {tc.input}
                      </pre>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block">Expected Output:</span>
                      <pre className="p-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded font-mono text-[var(--text-primary)] text-[11px]">
                        {tc.expectedOutput}
                      </pre>
                    </div>
                    {tc.explanation && (
                      <p className="text-[var(--text-muted)] text-[11px] italic">Explanation: {tc.explanation}</p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Code Editor & Execution Panel (7 cols on lg, toggled on mobile) */}
        <div
          className={`lg:col-span-7 flex flex-col h-full bg-[var(--bg-canvas)] overflow-hidden ${
            mobileTab !== 'problem' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Editor Sub-Header (Language Switcher, Reset, Autosave indicator) */}
          <div className="h-11 bg-[var(--bg-surface)] border-b border-[var(--border-default)] px-3 sm:px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-md px-2 py-1 text-xs font-mono text-[var(--text-primary)] cursor-pointer focus:outline-none focus:border-[var(--border-focus)]"
              >
                <option value="typescript">TypeScript 5.x</option>
                <option value="javascript">JavaScript (Node.js)</option>
                <option value="python">Python 3.11</option>
                <option value="cpp">C++ (GCC 13)</option>
                <option value="java">Java 21</option>
              </select>

              <button
                onClick={() =>
                  setCode(currentQuestion.codeTemplates?.[language] || currentQuestion.starterCode || '')
                }
                className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition cursor-pointer"
                title="Reset to starter template"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-[var(--text-muted)] font-mono">
              <span className="hidden sm:inline">Autosaved</span>
            </div>
          </div>

          {/* Editable Code Area */}
          <div
            className={`relative bg-[var(--bg-canvas)] overflow-hidden font-mono text-xs flex ${
              mobileTab === 'tests' ? 'hidden lg:flex lg:flex-1' : 'flex-1'
            }`}
          >
            {/* Line numbers simulated */}
            <div className="w-8 sm:w-10 py-3 bg-[var(--bg-surface-secondary)] border-r border-[var(--border-default)] text-right pr-1.5 sm:pr-2 select-none text-[var(--text-muted)] text-[11px] font-mono leading-relaxed">
              {Array.from({ length: 28 }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Editable code buffer */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 p-3 bg-transparent text-[var(--text-primary)] font-mono text-xs leading-relaxed focus:outline-none resize-none overflow-y-auto whitespace-pre tab-4"
              spellCheck={false}
              autoCapitalize="none"
            />
          </div>

          {/* Action Bar (Run Sample Tests & Submit Solution) */}
          <div className="h-12 bg-[var(--bg-surface)] border-t border-[var(--border-default)] px-3 sm:px-4 flex items-center justify-between shrink-0 gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => {
                  setActiveBottomTab('tests');
                  setMobileTab('tests');
                }}
                className={`px-2 sm:px-2.5 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                  activeBottomTab === 'tests' ? 'bg-[var(--bg-surface-secondary)] text-[var(--text-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                Test Cases
              </button>
              <button
                onClick={() => {
                  setActiveBottomTab('results');
                  setMobileTab('tests');
                }}
                className={`px-2 sm:px-2.5 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                  activeBottomTab === 'results' ? 'bg-[var(--bg-surface-secondary)] text-[var(--text-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span className="hidden sm:inline">Test Results</span>
                <span className="sm:hidden">Results</span>{' '}
                {executionResult && `(${executionResult.passedTests}/${executionResult.totalTests})`}
              </button>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRunCode}
                isLoading={isRunning}
                disabled={isSubmitting}
                className="text-xs px-2 sm:px-3"
              >
                <Play className="w-3.5 h-3.5 mr-1" />
                <span className="hidden sm:inline">Run Code</span>
                <span className="sm:hidden">Run</span>
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSubmitSolution}
                isLoading={isSubmitting}
                disabled={isRunning}
                className="text-xs px-2 sm:px-3"
              >
                <Send className="w-3.5 h-3.5 mr-1" />
                <span className="hidden sm:inline">Submit Solution</span>
                <span className="sm:hidden">Submit</span>
              </Button>
            </div>
          </div>

          {/* Bottom Execution & Results Drawer */}
          <div
            className={`bg-[var(--bg-surface)] border-t border-[var(--border-default)] p-3 overflow-y-auto shrink-0 text-xs ${
              mobileTab === 'tests' ? 'flex-1 lg:h-44 lg:flex-none' : 'h-36 sm:h-44'
            }`}
          >
            {activeBottomTab === 'tests' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {currentQuestion.testCases
                    .filter((tc) => !tc.isHidden)
                    .map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedTestCaseIndex(idx)}
                        className={`px-2.5 py-1 rounded text-xs font-mono transition cursor-pointer ${
                          selectedTestCaseIndex === idx
                            ? 'bg-[var(--bg-surface-secondary)] text-[var(--text-primary)] border border-[var(--border-hover)]'
                            : 'bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        Case {idx + 1}
                      </button>
                    ))}
                </div>
                {currentQuestion.testCases[selectedTestCaseIndex] && (
                  <div className="p-2.5 bg-[var(--bg-surface-secondary)] rounded-lg border border-[var(--border-default)] space-y-1 font-mono text-[11px]">
                    <span className="text-[var(--text-muted)] block">Input:</span>
                    <span className="text-[var(--text-primary)]">
                      {currentQuestion.testCases[selectedTestCaseIndex].input}
                    </span>
                  </div>
                )}
              </div>
            )}

            {activeBottomTab === 'results' && (
              <div>
                {isRunning || isSubmitting ? (
                  <div className="flex items-center gap-3 p-4 text-[var(--text-muted)]">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-[var(--text-primary)]" />
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
                        <span className="font-mono text-[var(--text-primary)] font-bold">
                          {executionResult.passedTests} / {executionResult.totalTests} Passed
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[var(--text-muted)] font-mono text-[11px]">
                        <span>Runtime: {executionResult.executionTimeMs}ms</span>
                        <span>Memory: {executionResult.memoryUsedMb}MB</span>
                      </div>
                    </div>

                    {/* Test Results Items */}
                    <div className="space-y-1.5">
                      {executionResult.testCaseResults?.map((tcr, i) => (
                        <div
                          key={i}
                          className="p-2 bg-[var(--bg-surface-secondary)] rounded border border-[var(--border-default)] flex items-center justify-between text-[11px] font-mono"
                        >
                          <div className="flex items-center gap-2">
                            {tcr.passed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 text-rose-500" />
                            )}
                            <span className="text-[var(--text-primary)]">Case {i + 1}</span>
                          </div>
                          <span className="text-[var(--text-muted)]">{tcr.executionTimeMs || 10}ms</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-[var(--text-muted)] italic p-2">Click "Run Code" to view test results.</p>
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
          <div className="p-3 bg-[var(--bg-surface-secondary)] rounded-xl border border-[var(--border-default)] space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Total Questions:</span>
              <span className="font-bold text-[var(--text-primary)]">{questions.length} Tasks</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Time Remaining:</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{formatTime(secondsRemaining)}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border-default)]">
            <Button variant="outline" size="sm" onClick={() => setIsSubmitModalOpen(false)}>
              Continue Coding
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmitAssessment}
            >
              Confirm & Submit Exam
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
