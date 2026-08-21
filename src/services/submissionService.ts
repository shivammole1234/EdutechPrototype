import { Submission } from '@/types';
import { INITIAL_SUBMISSIONS } from './mockData';

class SubmissionService {
  private submissions: Submission[] = [...INITIAL_SUBMISSIONS];

  async getSubmissions(filters?: {
    studentId?: string;
    assessmentId?: string;
    questionId?: string;
    status?: string;
  }): Promise<Submission[]> {
    await new Promise((r) => setTimeout(r, 100));
    let list = [...this.submissions];
    if (filters) {
      if (filters.studentId) {
        list = list.filter((s) => s.studentId === filters.studentId);
      }
      if (filters.assessmentId) {
        list = list.filter((s) => s.assessmentId === filters.assessmentId);
      }
      if (filters.questionId) {
        list = list.filter((s) => s.questionId === filters.questionId);
      }
      if (filters.status && filters.status !== 'ALL') {
        list = list.filter((s) => s.status === filters.status);
      }
    }
    return list.sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }

  async getSubmissionById(id: string): Promise<Submission | undefined> {
    await new Promise((r) => setTimeout(r, 80));
    return this.submissions.find((s) => s.id === id);
  }

  async saveSubmission(data: Omit<Submission, 'id' | 'submittedAt'>): Promise<Submission> {
    await new Promise((r) => setTimeout(r, 150));
    const newSubmission: Submission = {
      ...data,
      id: `sub_${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };
    this.submissions.unshift(newSubmission);
    return newSubmission;
  }
}

export const submissionService = new SubmissionService();
