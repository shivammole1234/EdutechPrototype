import { Assignment, AssignmentSubmission } from '@/types';
import { INITIAL_ASSIGNMENTS } from './mockData';

class AssignmentService {
  private assignments: Assignment[] = [...INITIAL_ASSIGNMENTS];
  private submissions: AssignmentSubmission[] = [
    {
      id: 'asub_01',
      assignmentId: 'asg_01_tree_traversals',
      studentId: 'usr_stud_01',
      studentName: 'Alex Turner',
      studentEmail: 'alex.turner@student.codepulse.io',
      submittedAt: '2025-02-20T16:20:00Z',
      status: 'GRADED',
      grade: 95,
      maxGrade: 100,
      feedback: 'Excellent recursive solution and clean time-complexity analysis.',
      content: '// Binary tree inversion implementation\n// Time complexity: O(N)\n// Space complexity: O(H)',
      fileName: 'TreeTraversal_Solution.ts',
    },
  ];

  async getAssignments(batchId?: string): Promise<Assignment[]> {
    await new Promise((r) => setTimeout(r, 100));
    if (batchId) {
      return this.assignments.filter((a) => a.batchId === batchId);
    }
    return [...this.assignments];
  }

  async getAssignmentById(id: string): Promise<Assignment | undefined> {
    await new Promise((r) => setTimeout(r, 80));
    return this.assignments.find((a) => a.id === id);
  }

  async createAssignment(data: Partial<Assignment>): Promise<Assignment> {
    await new Promise((r) => setTimeout(r, 150));
    const newAsg: Assignment = {
      id: `asg_${Date.now()}`,
      batchId: data.batchId || 'batch_fsd_2025_01',
      batchName: data.batchName || 'Full Stack & DSA Accelerator',
      title: data.title || 'New Assignment',
      description: data.description || 'Assignment details and rubric.',
      dueDate: data.dueDate || new Date(Date.now() + 7 * 86400000).toISOString(),
      totalPoints: data.totalPoints || 100,
      status: data.status || 'ACTIVE',
      submissionsCount: 0,
      totalStudents: 48,
      tags: data.tags || ['Homework', 'Coding'],
      createdAt: new Date().toISOString(),
      attachments: data.attachments || [],
    };
    this.assignments.unshift(newAsg);
    return newAsg;
  }

  async submitAssignment(data: Omit<AssignmentSubmission, 'id' | 'submittedAt' | 'status'>): Promise<AssignmentSubmission> {
    await new Promise((r) => setTimeout(r, 180));
    const newSub: AssignmentSubmission = {
      ...data,
      id: `asub_${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'SUBMITTED',
    };
    this.submissions.unshift(newSub);
    // increment count
    const asg = this.assignments.find((a) => a.id === data.assignmentId);
    if (asg) asg.submissionsCount++;
    return newSub;
  }

  async getSubmissionsForAssignment(assignmentId: string): Promise<AssignmentSubmission[]> {
    await new Promise((r) => setTimeout(r, 90));
    return this.submissions.filter((s) => s.assignmentId === assignmentId);
  }

  async getStudentSubmission(assignmentId: string, studentId: string): Promise<AssignmentSubmission | undefined> {
    await new Promise((r) => setTimeout(r, 80));
    return this.submissions.find((s) => s.assignmentId === assignmentId && s.studentId === studentId);
  }
}

export const assignmentService = new AssignmentService();
