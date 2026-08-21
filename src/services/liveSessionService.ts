import { LiveSession, LiveStudentState } from '@/types';
import { INITIAL_LIVE_SESSION } from './mockData';

class LiveSessionService {
  private session: LiveSession = { ...INITIAL_LIVE_SESSION };

  async getSessions(): Promise<LiveSession[]> {
    await new Promise((r) => setTimeout(r, 90));
    return [JSON.parse(JSON.stringify(this.session))];
  }

  async getActiveSession(sessionId: string = 'live_sess_01'): Promise<LiveSession> {
    await new Promise((r) => setTimeout(r, 90));
    return JSON.parse(JSON.stringify(this.session));
  }

  async sendInstructorAction(action: {
    type: 'MESSAGE' | 'HIGHLIGHT' | 'FLAG_REVIEW' | 'REFRESH';
    studentId: string;
    payload?: string;
  }): Promise<{ success: boolean; message: string }> {
    await new Promise((r) => setTimeout(r, 120));
    return {
      success: true,
      message: `Action ${action.type} sent to student ${action.studentId}`,
    };
  }

  async updateStudentCode(studentId: string, code: string): Promise<void> {
    const student = this.session.students.find((s) => s.studentId === studentId);
    if (student) {
      student.currentCode = code;
      student.lastPing = 'Just now';
    }
  }
}

export const liveSessionService = new LiveSessionService();
