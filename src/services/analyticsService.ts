import { StudentPerformance } from '@/types';
import { MOCK_STUDENT_PERFORMANCE } from './mockData';

export interface AdminAnalytics {
  totalStudents: number;
  totalInstructors: number;
  activeBatches: number;
  activeAssessments: number;
  totalSubmissions: number;
  platformPassRate: number;
  studentGrowth: { month: string; students: number }[];
  submissionTrend: { date: string; accepted: number; failed: number }[];
  languageDistribution: { language: string; percentage: number; count: number }[];
  batchPerformance: { name: string; avgScore: number; completionRate: number }[];
}

export interface InstructorAnalytics {
  activeStudents: number;
  activeTests: number;
  averageScore: number;
  completionRate: number;
  batchScoreTrend: { week: string; score: number }[];
  weakTopics: { topic: string; score: number; failureRate: number }[];
  strongTopics: { topic: string; score: number; passRate: number }[];
  strugglingStudents: { name: string; email: string; avgScore: number; missedDeadlines: number }[];
}

class AnalyticsService {
  async getStudentPerformance(studentId: string = 'usr_stud_01'): Promise<StudentPerformance> {
    await new Promise((r) => setTimeout(r, 90));
    return JSON.parse(JSON.stringify(MOCK_STUDENT_PERFORMANCE));
  }

  async getAdminAnalytics(): Promise<AdminAnalytics> {
    await new Promise((r) => setTimeout(r, 100));
    return {
      totalStudents: 148,
      totalInstructors: 8,
      activeBatches: 6,
      activeAssessments: 4,
      totalSubmissions: 3840,
      platformPassRate: 84.6,
      studentGrowth: [
        { month: 'Sep', students: 45 },
        { month: 'Oct', students: 68 },
        { month: 'Nov', students: 92 },
        { month: 'Dec', students: 110 },
        { month: 'Jan', students: 132 },
        { month: 'Feb', students: 148 },
      ],
      submissionTrend: [
        { date: 'Feb 15', accepted: 42, failed: 12 },
        { date: 'Feb 16', accepted: 55, failed: 18 },
        { date: 'Feb 17', accepted: 68, failed: 14 },
        { date: 'Feb 18', accepted: 80, failed: 22 },
        { date: 'Feb 19', accepted: 95, failed: 20 },
        { date: 'Feb 20', accepted: 112, failed: 28 },
        { date: 'Feb 21', accepted: 130, failed: 24 },
      ],
      languageDistribution: [
        { language: 'TypeScript', percentage: 42, count: 1612 },
        { language: 'JavaScript', percentage: 28, count: 1075 },
        { language: 'Python', percentage: 20, count: 768 },
        { language: 'C++', percentage: 7, count: 268 },
        { language: 'Java', percentage: 3, count: 117 },
      ],
      batchPerformance: [
        { name: 'Cohort 2025-A', avgScore: 88.5, completionRate: 92 },
        { name: 'Python AI 2025', avgScore: 84.2, completionRate: 86 },
        { name: 'DSA Adv 01', avgScore: 79.1, completionRate: 81 },
      ],
    };
  }

  async getInstructorAnalytics(): Promise<InstructorAnalytics> {
    await new Promise((r) => setTimeout(r, 100));
    return {
      activeStudents: 118,
      activeTests: 3,
      averageScore: 86.4,
      completionRate: 91.2,
      batchScoreTrend: [
        { week: 'W1: Arrays', score: 92 },
        { week: 'W2: Stacks', score: 86 },
        { week: 'W3: Trees', score: 79 },
        { week: 'W4: DP', score: 74 },
        { week: 'W5: Graphs', score: 82 },
        { week: 'W6: Midterm', score: 88 },
      ],
      weakTopics: [
        { topic: 'Dynamic Programming & Memoization', score: 68, failureRate: 32 },
        { topic: 'Graph Shortest Paths (Dijkstra)', score: 72, failureRate: 28 },
        { topic: 'LRU Cache Invalidation', score: 74, failureRate: 26 },
      ],
      strongTopics: [
        { topic: 'Hash Map Key-Value Lookups', score: 96, passRate: 96 },
        { topic: 'Two Pointers Array Scan', score: 94, passRate: 94 },
        { topic: 'Stack-based Parentheses Checking', score: 91, passRate: 91 },
      ],
      strugglingStudents: [
        { name: 'Liam Martinez', email: 'liam.martinez@student.codepulse.io', avgScore: 74, missedDeadlines: 1 },
        { name: 'Ethan Wright', email: 'ethan.wright@student.codepulse.io', avgScore: 64, missedDeadlines: 3 },
      ],
    };
  }
}

export const analyticsService = new AnalyticsService();
