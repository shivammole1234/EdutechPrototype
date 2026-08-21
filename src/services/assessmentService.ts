import { Assessment } from '@/types';
import { INITIAL_ASSESSMENTS } from './mockData';

class AssessmentService {
  private assessments: Assessment[] = [...INITIAL_ASSESSMENTS];

  async getAssessments(batchId?: string): Promise<Assessment[]> {
    await new Promise((r) => setTimeout(r, 100));
    if (batchId) {
      return this.assessments.filter((a) => a.batchIds.includes(batchId));
    }
    return [...this.assessments];
  }

  async getAssessmentById(id: string): Promise<Assessment | undefined> {
    await new Promise((r) => setTimeout(r, 80));
    return this.assessments.find((a) => a.id === id);
  }

  async createAssessment(data: Partial<Assessment>): Promise<Assessment> {
    await new Promise((r) => setTimeout(r, 200));
    const newAssessment: Assessment = {
      id: `asm_${Date.now()}`,
      title: data.title || 'New Assessment',
      description: data.description || 'Assessment description here.',
      batchIds: data.batchIds || ['batch_fsd_2025_01'],
      batchNames: data.batchNames || ['Full Stack & DSA Accelerator (Cohort 2025-A)'],
      questionIds: data.questionIds || ['q_01_two_sum'],
      durationMinutes: data.durationMinutes || 60,
      startTime: data.startTime || new Date().toISOString(),
      endTime: data.endTime || new Date(Date.now() + 7 * 86400000).toISOString(),
      status: data.status || 'UPCOMING',
      totalPoints: data.totalPoints || 100,
      passPercentage: data.passPercentage || 70,
      settings: data.settings || {
        shuffleQuestions: false,
        shuffleOptions: true,
        negativeMarking: false,
        sectionTiming: false,
        allowedLanguages: ['javascript', 'typescript', 'python', 'cpp', 'java'],
        proctoring: {
          enableWebcam: true,
          fullscreenRequired: true,
          tabSwitchLimit: 3,
          blockCopyPaste: true,
          trackAudio: false,
        },
      },
      questionsCount: data.questionIds ? data.questionIds.length : 1,
      submissionsCount: 0,
      createdAt: new Date().toISOString(),
      authorName: data.authorName || 'Dr. Elena Rostova',
    };
    this.assessments.unshift(newAssessment);
    return newAssessment;
  }

  async updateAssessment(id: string, updates: Partial<Assessment>): Promise<Assessment> {
    await new Promise((r) => setTimeout(r, 150));
    const idx = this.assessments.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Assessment not found');
    this.assessments[idx] = { ...this.assessments[idx], ...updates };
    return this.assessments[idx];
  }
}

export const assessmentService = new AssessmentService();
