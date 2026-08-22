import { Batch, Cohort, StudentBatch } from '@/types';
import { INITIAL_BATCHES, INITIAL_STUDENT_BATCHES } from './mockData';

class BatchService {
  private batches: Batch[] = [...INITIAL_BATCHES];
  private studentBatches: StudentBatch[] = [...INITIAL_STUDENT_BATCHES];

  // Cohort Middleware APIs
  async getCohorts(): Promise<Cohort[]> {
    await new Promise((r) => setTimeout(r, 100));
    return [...this.batches];
  }

  async getBatches(): Promise<Batch[]> {
    return this.getCohorts() as Promise<Batch[]>;
  }

  async getCohortById(id: string): Promise<Cohort | undefined> {
    await new Promise((r) => setTimeout(r, 80));
    return this.batches.find((b) => b.id === id);
  }

  async getBatchById(id: string): Promise<Batch | undefined> {
    return this.getCohortById(id) as Promise<Batch | undefined>;
  }

  async createCohort(data: Partial<Cohort>): Promise<Cohort> {
    await new Promise((r) => setTimeout(r, 180));
    
    // Calculate total student count from assigned batches
    const assignedBatches = this.studentBatches.filter((sb) =>
      data.assignedBatchIds?.includes(sb.id)
    );
    const calculatedStudentCount = assignedBatches.reduce((sum, b) => sum + (b.studentCount || 0), 0);
    const assignedNames = assignedBatches.map((b) => b.name);

    const newCohort: Batch = {
      id: `cohort_${Date.now()}`,
      name: data.name || 'New Academic Cohort',
      code: data.code || `COHORT-${Math.floor(1000 + Math.random() * 9000)}`,
      programTrack: data.programTrack || 'Full Stack & Cloud Architecture',
      academicTerm: data.academicTerm || 'Spring 2025',
      instructorId: data.instructorId || 'usr_inst_01',
      instructorName: data.instructorName || 'Dr. Elena Rostova',
      instructorAvatar: data.instructorAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      instructorEmail: data.instructorEmail || 'faculty@codepulse.io',
      coInstructorId: data.coInstructorId,
      coInstructorName: data.coInstructorName,
      assignedBatchIds: data.assignedBatchIds || [],
      assignedBatchNames: data.assignedBatchNames || assignedNames,
      totalStudentCount: data.totalStudentCount ?? (calculatedStudentCount || 30),
      studentCount: data.totalStudentCount ?? (calculatedStudentCount || 30),
      maxCapacity: data.maxCapacity || 60,
      startDate: data.startDate || new Date().toISOString().split('T')[0],
      endDate: data.endDate || '2025-12-31',
      status: data.status || 'ACTIVE',
      progress: data.progress || 0,
      description: data.description || 'Academic middleware cohort connecting instructors and student batches.',
      topics: data.topics || ['Foundations & Data Structures', 'Applied Algorithms', 'System Architecture'],
      schedule: data.schedule || 'Mon, Wed, Fri • 6:00 PM - 8:30 PM EST',
      virtualRoomId: data.virtualRoomId || `room_${Math.random().toString(36).substring(2, 9)}`,
      meetUrl: data.meetUrl || `https://meet.codepulse.io/live/${(data.code || 'cohort').toLowerCase()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    // Update the linked student batches to reference this new cohort
    if (data.assignedBatchIds && data.assignedBatchIds.length > 0) {
      this.studentBatches = this.studentBatches.map((sb) => {
        if (data.assignedBatchIds?.includes(sb.id)) {
          return {
            ...sb,
            cohortId: newCohort.id,
            cohortName: newCohort.name,
          };
        }
        return sb;
      });
    }

    this.batches.unshift(newCohort);
    return newCohort;
  }

  async createBatch(data: Partial<Batch>): Promise<Batch> {
    return this.createCohort(data) as Promise<Batch>;
  }

  async updateBatch(id: string, updates: Partial<Batch>): Promise<Batch> {
    await new Promise((r) => setTimeout(r, 150));
    const idx = this.batches.findIndex((b) => b.id === id);
    if (idx === -1) throw new Error('Cohort not found');
    this.batches[idx] = { ...this.batches[idx], ...updates };
    return this.batches[idx];
  }

  async archiveBatch(id: string): Promise<Batch> {
    return this.updateBatch(id, { status: 'ARCHIVED' });
  }

  // Student Batches APIs (Group of Students)
  async getStudentBatches(): Promise<StudentBatch[]> {
    await new Promise((r) => setTimeout(r, 80));
    return [...this.studentBatches];
  }

  async getStudentBatchById(id: string): Promise<StudentBatch | undefined> {
    await new Promise((r) => setTimeout(r, 60));
    return this.studentBatches.find((sb) => sb.id === id);
  }

  async createStudentBatch(data: Partial<StudentBatch>): Promise<StudentBatch> {
    await new Promise((r) => setTimeout(r, 150));
    const newStudentBatch: StudentBatch = {
      id: `sbatch_${Date.now()}`,
      name: data.name || 'New Student Batch',
      code: data.code || `BATCH-${Math.floor(100 + Math.random() * 900)}`,
      section: data.section || 'General Section',
      studentIds: data.studentIds || [],
      studentCount: data.studentCount || (data.studentIds ? data.studentIds.length : 20),
      tags: data.tags || ['Active Batch'],
      cohortId: data.cohortId,
      cohortName: data.cohortName,
      description: data.description || 'Group of enrolled students.',
      createdAt: new Date().toISOString().split('T')[0],
    };

    this.studentBatches.unshift(newStudentBatch);
    return newStudentBatch;
  }

  async updateStudentBatch(id: string, updates: Partial<StudentBatch>): Promise<StudentBatch> {
    await new Promise((r) => setTimeout(r, 100));
    const idx = this.studentBatches.findIndex((sb) => sb.id === id);
    if (idx === -1) throw new Error('Student batch not found');
    this.studentBatches[idx] = { ...this.studentBatches[idx], ...updates };
    return this.studentBatches[idx];
  }

  // Assign Student Batches to a Cohort (Bridge connectivity)
  async assignBatchesToCohort(cohortId: string, batchIds: string[]): Promise<Cohort> {
    const cohort = await this.getCohortById(cohortId);
    if (!cohort) throw new Error('Cohort not found');

    const selectedBatches = this.studentBatches.filter((b) => batchIds.includes(b.id));
    const totalStudents = selectedBatches.reduce((acc, b) => acc + (b.studentCount || 0), 0);
    const batchNames = selectedBatches.map((b) => b.name);

    // Update batches
    this.studentBatches = this.studentBatches.map((sb) => {
      if (batchIds.includes(sb.id)) {
        return { ...sb, cohortId, cohortName: cohort.name };
      } else if (sb.cohortId === cohortId) {
        return { ...sb, cohortId: undefined, cohortName: undefined };
      }
      return sb;
    });

    return this.updateBatch(cohortId, {
      assignedBatchIds: batchIds,
      assignedBatchNames: batchNames,
      totalStudentCount: totalStudents,
      studentCount: totalStudents,
    });
  }

  // Assign Instructor to a Cohort
  async assignInstructorToCohort(
    cohortId: string,
    instructorId: string,
    instructorName: string,
    instructorAvatar?: string,
    instructorEmail?: string
  ): Promise<Cohort> {
    return this.updateBatch(cohortId, {
      instructorId,
      instructorName,
      instructorAvatar,
      instructorEmail,
    });
  }
}

export const batchService = new BatchService();
