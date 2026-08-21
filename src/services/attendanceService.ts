import { AttendanceRecord, ClassSession } from '@/types';
import { INITIAL_ATTENDANCE, INITIAL_CLASSES, INITIAL_STUDENTS } from './mockData';

class AttendanceService {
  private classes: ClassSession[] = [...INITIAL_CLASSES];
  private records: AttendanceRecord[] = [...INITIAL_ATTENDANCE];

  async getAttendanceRecords(): Promise<AttendanceRecord[]> {
    await new Promise((r) => setTimeout(r, 80));
    return [...this.records];
  }

  async getClasses(batchId?: string): Promise<ClassSession[]> {
    await new Promise((r) => setTimeout(r, 80));
    if (batchId) {
      return this.classes.filter((c) => c.batchId === batchId);
    }
    return [...this.classes];
  }

  async getClassById(id: string): Promise<ClassSession | undefined> {
    await new Promise((r) => setTimeout(r, 60));
    return this.classes.find((c) => c.id === id);
  }

  async getAttendanceForClass(classId: string): Promise<AttendanceRecord[]> {
    await new Promise((r) => setTimeout(r, 90));
    const existing = this.records.filter((r) => r.classId === classId);
    // If empty, generate default list from students
    if (existing.length === 0) {
      const cls = this.classes.find((c) => c.id === classId);
      return INITIAL_STUDENTS.map((st) => ({
        id: `att_${st.id}_${classId}`,
        studentId: st.id,
        studentName: st.name,
        studentEmail: st.email,
        batchId: cls?.batchId || 'batch_fsd_2025_01',
        classId,
        classTitle: cls?.title || 'Class Session',
        date: cls?.date || new Date().toISOString().split('T')[0],
        status: 'PRESENT',
        durationMinutes: 90,
      }));
    }
    return existing;
  }

  async updateAttendance(recordId: string, status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'): Promise<void> {
    await new Promise((r) => setTimeout(r, 80));
    const rec = this.records.find((r) => r.id === recordId);
    if (rec) {
      rec.status = status;
    }
  }

  async getStudentAttendance(studentId: string): Promise<AttendanceRecord[]> {
    await new Promise((r) => setTimeout(r, 80));
    return this.records.filter((r) => r.studentId === studentId);
  }
}

export const attendanceService = new AttendanceService();
