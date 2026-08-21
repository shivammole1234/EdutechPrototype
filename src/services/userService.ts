import { User, UserRole } from '@/types';
import { INITIAL_STUDENTS, INITIAL_INSTRUCTORS } from './mockData';

class UserService {
  private students: User[] = [...INITIAL_STUDENTS];
  private instructors: User[] = [...INITIAL_INSTRUCTORS];

  async getStudents(): Promise<User[]> {
    await new Promise((r) => setTimeout(r, 120));
    return [...this.students];
  }

  async getStudentById(id: string): Promise<User | undefined> {
    await new Promise((r) => setTimeout(r, 80));
    return this.students.find((s) => s.id === id);
  }

  async createStudent(data: Partial<User>): Promise<User> {
    await new Promise((r) => setTimeout(r, 200));
    const newStudent: User = {
      id: `usr_stud_${Date.now()}`,
      name: data.name || 'New Student',
      email: data.email || 'student@codepulse.io',
      role: 'STUDENT',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      status: data.status || 'ACTIVE',
      joinedDate: new Date().toISOString().split('T')[0],
      batchIds: data.batchIds || ['batch_fsd_2025_01'],
      batchName: data.batchName || 'Full Stack & DSA Cohort 2025-A',
      performanceScore: data.performanceScore || 85,
      phone: data.phone || '+1 (555) 000-0000',
      bio: data.bio || 'New learner enrolled in CodePulse.',
    };
    this.students.unshift(newStudent);
    return newStudent;
  }

  async updateStudent(id: string, updates: Partial<User>): Promise<User> {
    await new Promise((r) => setTimeout(r, 150));
    const idx = this.students.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('Student not found');
    this.students[idx] = { ...this.students[idx], ...updates };
    return this.students[idx];
  }

  async deleteStudent(id: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 150));
    this.students = this.students.filter((s) => s.id !== id);
    return true;
  }

  async getInstructors(): Promise<User[]> {
    await new Promise((r) => setTimeout(r, 120));
    return [...this.instructors];
  }

  async getInstructorById(id: string): Promise<User | undefined> {
    await new Promise((r) => setTimeout(r, 80));
    return this.instructors.find((i) => i.id === id);
  }

  async createInstructor(data: Partial<User>): Promise<User> {
    await new Promise((r) => setTimeout(r, 200));
    const newInstructor: User = {
      id: `usr_inst_${Date.now()}`,
      name: data.name || 'New Instructor',
      email: data.email || 'instructor@codepulse.io',
      role: 'INSTRUCTOR',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      status: data.status || 'ACTIVE',
      joinedDate: new Date().toISOString().split('T')[0],
      assignedBatchesCount: 1,
      totalStudentsCount: 30,
      phone: data.phone || '+1 (555) 111-2222',
      bio: data.bio || 'Instructor specializing in Computer Science.',
    };
    this.instructors.unshift(newInstructor);
    return newInstructor;
  }

  async updateInstructor(id: string, updates: Partial<User>): Promise<User> {
    await new Promise((r) => setTimeout(r, 150));
    const idx = this.instructors.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error('Instructor not found');
    this.instructors[idx] = { ...this.instructors[idx], ...updates };
    return this.instructors[idx];
  }
}

export const userService = new UserService();
