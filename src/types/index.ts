export type UserRole = 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  organizationId?: string;
  organizationName?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  joinedDate: string;
  phone?: string;
  bio?: string;
  batchIds?: string[];
  batchName?: string;
  performanceScore?: number;
  assignedBatchesCount?: number;
  totalStudentsCount?: number;
}

export interface Organization {
  id: string;
  name: string;
  domain: string;
  logo: string;
  plan: 'ENTERPRISE' | 'PRO' | 'STARTER';
  activeBatches: number;
  totalUsers: number;
}

export interface StudentBatch {
  id: string;
  name: string; // e.g. "Batch 2025-A: Alpha Group"
  code: string; // e.g. "BATCH-ALP-25"
  section: string; // e.g. "Morning Section", "Evening Track"
  studentIds: string[];
  studentCount: number;
  tags: string[];
  cohortId?: string;
  cohortName?: string;
  description?: string;
  createdAt: string;
}

export interface Cohort {
  id: string;
  name: string;
  code: string;
  programTrack: string;
  academicTerm: string;
  instructorId: string;
  instructorName: string;
  instructorAvatar?: string;
  instructorEmail?: string;
  coInstructorId?: string;
  coInstructorName?: string;
  assignedBatchIds: string[];
  assignedBatchNames: string[];
  totalStudentCount: number;
  startDate: string;
  endDate: string;
  schedule: string;
  maxCapacity: number;
  status: 'ACTIVE' | 'UPCOMING' | 'COMPLETED' | 'ARCHIVED';
  progress: number;
  description: string;
  topics: string[];
  virtualRoomId?: string;
  meetUrl?: string;
  createdAt: string;
}

export interface Batch extends Cohort {
  studentCount: number; // alias for totalStudentCount for backward compatibility
}

export interface ClassSession {
  id: string;
  batchId: string;
  batchName: string;
  title: string;
  instructorName: string;
  date: string;
  time: string;
  durationMinutes: number;
  status: 'SCHEDULED' | 'LIVE' | 'COMPLETED';
  meetUrl?: string;
  recordingUrl?: string;
  description?: string;
  attendanceCount?: number;
  totalStudents?: number;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  batchId: string;
  classId: string;
  classTitle: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  durationMinutes?: number;
  notes?: string;
}

export type QuestionType = 'CODING' | 'MCQ' | 'FILL_BLANK' | 'SUBJECTIVE' | 'FILE_UPLOAD';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  explanation?: string;
  timeLimitMs?: number;
  memoryLimitMb?: number;
}

export interface Question {
  id: string;
  title: string;
  slug: string;
  type: QuestionType;
  topic: string;
  subtopic?: string;
  difficulty: Difficulty;
  languages: string[];
  points: number;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  testCases: TestCase[];
  starterCode: Record<string, string>; // e.g. { javascript: '...', python: '...', typescript: '...', cpp: '...' }
  solutionCode?: Record<string, string>;
  options?: { id: string; text: string; isCorrect?: boolean }[]; // For MCQ
  updatedAt: string;
  createdAt: string;
  acceptanceRate?: number;
  submissionsCount?: number;
  authorName?: string;
}

export type AssessmentStatus = 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED';

export interface AssessmentProctorSettings {
  enableWebcam: boolean;
  fullscreenRequired: boolean;
  tabSwitchLimit: number;
  blockCopyPaste: boolean;
  trackAudio: boolean;
}

export interface AssessmentSettings {
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  negativeMarking: boolean;
  negativeMarkValue?: number;
  sectionTiming: boolean;
  allowedLanguages: string[];
  accessibilityExtensionMinutes?: number;
  proctoring: AssessmentProctorSettings;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  batchIds: string[];
  batchNames?: string[];
  questionIds: string[];
  durationMinutes: number;
  startTime: string;
  endTime: string;
  status: AssessmentStatus;
  totalPoints: number;
  passPercentage: number;
  settings: AssessmentSettings;
  questionsCount: number;
  submissionsCount: number;
  avgScore?: number;
  highestScore?: number;
  createdAt: string;
  authorName?: string;
}

export type ExecutionState = 'IDLE' | 'QUEUED' | 'RUNNING' | 'COMPLETED';

export type SubmissionStatus =
  | 'ACCEPTED'
  | 'WRONG_ANSWER'
  | 'TIME_LIMIT_EXCEEDED'
  | 'MEMORY_LIMIT_EXCEEDED'
  | 'COMPILATION_ERROR'
  | 'RUNTIME_ERROR'
  | 'PENDING';

export interface TestCaseResult {
  testCaseId: string;
  status: SubmissionStatus;
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  executionTimeMs?: number;
  memoryUsedMb?: number;
  errorMessage?: string;
  isHidden?: boolean;
}

export interface Submission {
  id: string;
  assessmentId?: string;
  assessmentTitle?: string;
  questionId: string;
  questionTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  batchId?: string;
  batchName?: string;
  language: string;
  code: string;
  status: SubmissionStatus;
  score: number;
  maxScore: number;
  totalTests: number;
  passedTests: number;
  executionTimeMs: number;
  memoryUsedMb: number;
  submittedAt: string;
  testCaseResults: TestCaseResult[];
  compilerMessage?: string;
  runtimeError?: string;
}

export interface Assignment {
  id: string;
  batchId: string;
  batchName: string;
  title: string;
  description: string;
  dueDate: string;
  totalPoints: number;
  status: 'ACTIVE' | 'DRAFT' | 'CLOSED';
  submissionsCount: number;
  totalStudents: number;
  attachments?: { name: string; size: string; url: string }[];
  tags: string[];
  createdAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  submittedAt: string;
  status: 'SUBMITTED' | 'GRADED' | 'LATE';
  grade?: number;
  maxGrade: number;
  feedback?: string;
  content: string;
  fileName?: string;
}

export type NotificationType =
  | 'ASSESSMENT'
  | 'ASSIGNMENT'
  | 'ATTENDANCE'
  | 'SYSTEM'
  | 'RESULT'
  | 'LIVE';

export interface Notification {
  id: string;
  userId?: string;
  role: UserRole | 'ALL';
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface ProctorFlag {
  id: string;
  type: 'TAB_SWITCH' | 'FULLSCREEN_EXIT' | 'COPY_PASTE' | 'MULTIPLE_FACES' | 'NO_FACE';
  timestamp: string;
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface LiveStudentState {
  studentId: string;
  studentName: string;
  studentEmail: string;
  avatar: string;
  status: 'ACTIVE' | 'IDLE' | 'DISCONNECTED' | 'FLAGGED' | 'COMPLETED';
  startedAt: string;
  currentQuestionIndex: number;
  currentQuestionTitle: string;
  questionsAttempted: number;
  totalQuestions: number;
  codeActivity: string;
  language: string;
  currentCode: string;
  testAttempts: number;
  score: number;
  connectionQuality: 'GOOD' | 'FAIR' | 'POOR';
  flags: ProctorFlag[];
  lastPing: string;
}

export interface LiveSession {
  id: string;
  batchId: string;
  batchName: string;
  assessmentId?: string;
  assessmentTitle?: string;
  title: string;
  instructorId: string;
  instructorName: string;
  startTime: string;
  status: 'LIVE' | 'SCHEDULED' | 'ENDED';
  activeParticipants: number;
  totalParticipants: number;
  students: LiveStudentState[];
}

export interface SkillProgress {
  skill: string;
  score: number; // 0-100
  problemsSolved: number;
  totalProblems: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface StudentPerformance {
  studentId: string;
  overallScore: number;
  problemsSolved: number;
  totalProblems: number;
  assessmentsCompleted: number;
  totalAssessments: number;
  currentStreak: number;
  longestStreak: number;
  hoursSpent: number;
  successRate: number;
  skills: SkillProgress[];
  topicPerformance: { topic: string; score: number; count: number }[];
  scoreTrend: { date: string; score: number; assessment: string }[];
  submissionActivity: { day: string; count: number }[];
}

export interface LiveChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar: string;
  text: string;
  time: string;
  isInstructor?: boolean;
  isPinned?: boolean;
  reactions?: Record<string, number>;
}

export interface LivePollOption {
  id: string;
  text: string;
  votes: number;
}

export interface LivePoll {
  id: string;
  question: string;
  options: LivePollOption[];
  status: 'ACTIVE' | 'CLOSED';
  totalVotes: number;
  correctOptionId?: string;
  userVotedOptionId?: string;
  createdAt: string;
}

export interface LiveHandRaise {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  raisedAt: string;
  status: 'WAITING' | 'SPEAKING' | 'RESOLVED';
}

export interface LiveWhiteboardStroke {
  points: { x: number; y: number }[];
  color: string;
  width: number;
  tool: 'pen' | 'highlighter' | 'eraser';
}

export interface LiveParticipant {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  role: UserRole;
  isSpeaking?: boolean;
  micOn?: boolean;
  camOn?: boolean;
  handRaised?: boolean;
  joinedAt: string;
}

export interface LiveClassRoom {
  id: string;
  batchId: string;
  batchName: string;
  title: string;
  topic: string;
  description: string;
  instructorId: string;
  instructorName: string;
  instructorAvatar: string;
  status: 'SCHEDULED' | 'LIVE' | 'ENDED';
  startedAt?: string;
  scheduledDate: string;
  scheduledTime: string;
  durationMinutes: number;
  tags: string[];
  code: string;
  language: string;
  instructorOutput: string;
  notes: string;
  chatMessages: LiveChatMessage[];
  polls: LivePoll[];
  raisedHands: LiveHandRaise[];
  whiteboardStrokes: LiveWhiteboardStroke[];
  participants: LiveParticipant[];
  recordingUrl?: string;
}

