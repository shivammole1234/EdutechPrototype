import { BatchInterview, InterviewCandidateSlot, InterviewType, InterviewStatus } from '@/types';
import { INITIAL_STUDENTS, INITIAL_BATCHES } from './mockData';

const INITIAL_BATCH_INTERVIEWS: BatchInterview[] = [
  {
    id: 'int_01',
    title: 'Round 1: DSA & Complex Problem Solving Screening',
    type: 'MOCK_TECHNICAL',
    batchId: 'batch_fsd_2025_01',
    batchName: 'Full Stack & DSA Accelerator (Cohort 2025-A)',
    batchCode: 'FSD-2025-A',
    instructorId: 'usr_inst_01',
    instructorName: 'Dr. Elena Rostova',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    instructorEmail: 'elena.rostova@codepulse.io',
    scheduledDate: '2025-04-18',
    startTime: '14:00',
    endTime: '17:00',
    durationPerSlotMinutes: 45,
    status: 'SCHEDULED',
    description: '1-on-1 mock technical round covering Graph Traversals (BFS/DFS), Dynamic Programming (0/1 Knapsack & Longest Subsequence), and time complexity analysis.',
    meetingUrl: 'https://meet.codepulse.io/interview/fsd-2025-dsa-round',
    targetTopics: ['Graphs & Trees', 'Dynamic Programming', 'Complexity Optimization', 'Clean Code'],
    candidateSlots: [
      {
        id: 'slot_01_01',
        studentId: 'usr_stud_01',
        studentName: 'Alex Turner',
        studentEmail: 'alex.turner@student.codepulse.io',
        studentAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        scheduledTime: '14:00 - 14:45',
        durationMinutes: 45,
        status: 'CONFIRMED',
        meetingUrl: 'https://meet.codepulse.io/interview/fsd-2025-dsa-round?slot=1',
        notes: 'Targeting FAANG interview questions on topological sort.',
      },
      {
        id: 'slot_01_02',
        studentId: 'usr_stud_02',
        studentName: 'Sophia Chen',
        studentEmail: 'sophia.chen@student.codepulse.io',
        studentAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        scheduledTime: '14:45 - 15:30',
        durationMinutes: 45,
        status: 'CONFIRMED',
        meetingUrl: 'https://meet.codepulse.io/interview/fsd-2025-dsa-round?slot=2',
        notes: 'Prepared for LRU Cache & Graph Optimization.',
      },
      {
        id: 'slot_01_03',
        studentId: 'usr_stud_03',
        studentName: 'Liam Martinez',
        studentEmail: 'liam.martinez@student.codepulse.io',
        studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        scheduledTime: '15:30 - 16:15',
        durationMinutes: 45,
        status: 'CONFIRMED',
        meetingUrl: 'https://meet.codepulse.io/interview/fsd-2025-dsa-round?slot=3',
      },
      {
        id: 'slot_01_04',
        studentId: 'usr_stud_06',
        studentName: 'Zara Patel',
        studentEmail: 'zara.patel@student.codepulse.io',
        studentAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        scheduledTime: '16:15 - 17:00',
        durationMinutes: 45,
        status: 'CONFIRMED',
        meetingUrl: 'https://meet.codepulse.io/interview/fsd-2025-dsa-round?slot=4',
      },
    ],
    totalSlots: 4,
    bookedSlots: 4,
    completedSlots: 0,
    instructions: 'Please be in a quiet room with IDE and screen sharing enabled. 15 mins for problem 1, 20 mins for problem 2, 10 mins for evaluation.',
    createdAt: '2025-04-10',
  },
  {
    id: 'int_02',
    title: 'System Design & Distributed Architecture Assessment',
    type: 'SYSTEM_DESIGN',
    batchId: 'batch_fsd_2025_01',
    batchName: 'Full Stack & DSA Accelerator (Cohort 2025-A)',
    batchCode: 'FSD-2025-A',
    instructorId: 'usr_inst_01',
    instructorName: 'Dr. Elena Rostova',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    instructorEmail: 'elena.rostova@codepulse.io',
    scheduledDate: '2025-04-12',
    startTime: '10:00',
    endTime: '13:00',
    durationPerSlotMinutes: 60,
    status: 'COMPLETED',
    description: 'High-level and low-level system design interview. Design a real-time collaborative whiteboarding & code compilation engine with horizontal scaling.',
    meetingUrl: 'https://meet.codepulse.io/interview/sys-design-eval',
    targetTopics: ['Microservices', 'Redis Caching', 'Database Sharding', 'WebSockets', 'Rate Limiting'],
    candidateSlots: [
      {
        id: 'slot_02_01',
        studentId: 'usr_stud_01',
        studentName: 'Alex Turner',
        studentEmail: 'alex.turner@student.codepulse.io',
        studentAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        scheduledTime: '10:00 - 11:00',
        durationMinutes: 60,
        status: 'COMPLETED',
        score: 92,
        rubricScores: {
          problemSolving: 5,
          codeQuality: 4,
          communication: 5,
          csFundamentals: 5,
        },
        feedback: 'Outstanding breakdown of distributed caching using Redis clusters. Demonstrated deep knowledge of CAP theorem trade-offs and message broker queues.',
        meetingUrl: 'https://meet.codepulse.io/interview/sys-design-eval?slot=1',
        evaluatedAt: '2025-04-12',
      },
      {
        id: 'slot_02_02',
        studentId: 'usr_stud_02',
        studentName: 'Sophia Chen',
        studentEmail: 'sophia.chen@student.codepulse.io',
        studentAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        scheduledTime: '11:00 - 12:00',
        durationMinutes: 60,
        status: 'COMPLETED',
        score: 96,
        rubricScores: {
          problemSolving: 5,
          codeQuality: 5,
          communication: 5,
          csFundamentals: 5,
        },
        feedback: 'Exceptional architectural clarity. Clear diagrams with load balancing, database read replicas, and optimistic locking mechanisms.',
        meetingUrl: 'https://meet.codepulse.io/interview/sys-design-eval?slot=2',
        evaluatedAt: '2025-04-12',
      },
      {
        id: 'slot_02_03',
        studentId: 'usr_stud_03',
        studentName: 'Liam Martinez',
        studentEmail: 'liam.martinez@student.codepulse.io',
        studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        scheduledTime: '12:00 - 13:00',
        durationMinutes: 60,
        status: 'COMPLETED',
        score: 82,
        rubricScores: {
          problemSolving: 4,
          codeQuality: 4,
          communication: 4,
          csFundamentals: 4,
        },
        feedback: 'Good fundamental design for database schema. Recommend strengthening understanding of distributed consensus protocols (Raft/Paxos).',
        meetingUrl: 'https://meet.codepulse.io/interview/sys-design-eval?slot=3',
        evaluatedAt: '2025-04-12',
      },
    ],
    totalSlots: 3,
    bookedSlots: 3,
    completedSlots: 3,
    avgScore: 90,
    instructions: 'Have drawing tool ready (Excalidraw or canvas). 45 mins design presentation + 15 mins deep-dive questions.',
    createdAt: '2025-04-05',
  },
  {
    id: 'int_03',
    title: 'AI Engineering & Python Pipeline Live Coding',
    type: 'CODING_ROUND',
    batchId: 'batch_ml_2025_01',
    batchName: 'Python & Applied AI Engineering',
    batchCode: 'AI-2025-M',
    instructorId: 'usr_inst_02',
    instructorName: 'Devon Bradley',
    instructorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    instructorEmail: 'devon.bradley@codepulse.io',
    scheduledDate: '2025-04-22',
    startTime: '15:00',
    endTime: '17:00',
    durationPerSlotMinutes: 60,
    status: 'SCHEDULED',
    description: 'Live coding session implementing a custom Transformer attention mechanism and fine-tuning pipeline in PyTorch.',
    meetingUrl: 'https://meet.codepulse.io/interview/ai-eng-live-round',
    targetTopics: ['PyTorch', 'Vector Embeddings', 'RAG Pipeline', 'FastAPI Serving'],
    candidateSlots: [
      {
        id: 'slot_03_01',
        studentId: 'usr_stud_04',
        studentName: 'Amara Okafor',
        studentEmail: 'amara.okafor@student.codepulse.io',
        studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        scheduledTime: '15:00 - 16:00',
        durationMinutes: 60,
        status: 'CONFIRMED',
        meetingUrl: 'https://meet.codepulse.io/interview/ai-eng-live-round?slot=1',
      },
    ],
    totalSlots: 2,
    bookedSlots: 1,
    completedSlots: 0,
    instructions: 'Ensure Jupyter / VSCode environment with PyTorch and CUDA enabled.',
    createdAt: '2025-04-12',
  },
];

class InterviewService {
  private interviews: BatchInterview[] = [...INITIAL_BATCH_INTERVIEWS];

  async getInterviews(): Promise<BatchInterview[]> {
    await new Promise((r) => setTimeout(r, 60));
    return [...this.interviews];
  }

  async getInterviewsByBatch(batchId: string): Promise<BatchInterview[]> {
    await new Promise((r) => setTimeout(r, 60));
    return this.interviews.filter((item) => item.batchId === batchId);
  }

  async getInterviewsByInstructor(instructorId: string): Promise<BatchInterview[]> {
    await new Promise((r) => setTimeout(r, 60));
    return this.interviews.filter((item) => item.instructorId === instructorId);
  }

  async getInterviewById(id: string): Promise<BatchInterview | undefined> {
    await new Promise((r) => setTimeout(r, 50));
    return this.interviews.find((item) => item.id === id);
  }

  async createInterview(data: Partial<BatchInterview>): Promise<BatchInterview> {
    await new Promise((r) => setTimeout(r, 120));

    const totalSlots = data.candidateSlots?.length || data.totalSlots || 3;
    const bookedSlots = data.candidateSlots?.filter((s) => s.studentId).length || 0;
    const completedSlots = data.candidateSlots?.filter((s) => s.status === 'COMPLETED').length || 0;

    const newInterview: BatchInterview = {
      id: `int_${Date.now()}`,
      title: data.title || 'Technical Mock Interview',
      type: data.type || 'MOCK_TECHNICAL',
      batchId: data.batchId || 'batch_fsd_2025_01',
      batchName: data.batchName || 'Full Stack & DSA Accelerator (Cohort 2025-A)',
      batchCode: data.batchCode || 'BATCH-2025',
      instructorId: data.instructorId || 'usr_inst_01',
      instructorName: data.instructorName || 'Dr. Elena Rostova',
      instructorAvatar: data.instructorAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      instructorEmail: data.instructorEmail || 'faculty@codepulse.io',
      scheduledDate: data.scheduledDate || new Date().toISOString().split('T')[0],
      startTime: data.startTime || '14:00',
      endTime: data.endTime || '17:00',
      durationPerSlotMinutes: data.durationPerSlotMinutes || 45,
      status: data.status || 'SCHEDULED',
      description: data.description || 'Batch targeted technical interview round.',
      meetingUrl: data.meetingUrl || `https://meet.codepulse.io/interview/room_${Math.random().toString(36).substring(2, 8)}`,
      targetTopics: data.targetTopics || ['Data Structures', 'Algorithms', 'System Architecture'],
      candidateSlots: data.candidateSlots || [],
      totalSlots,
      bookedSlots,
      completedSlots,
      instructions: data.instructions || 'Be on time with camera & audio test completed.',
      createdAt: new Date().toISOString().split('T')[0],
    };

    this.interviews.unshift(newInterview);
    return newInterview;
  }

  async updateInterview(id: string, updates: Partial<BatchInterview>): Promise<BatchInterview> {
    await new Promise((r) => setTimeout(r, 100));
    const idx = this.interviews.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error('Interview not found');

    const updated = { ...this.interviews[idx], ...updates };

    if (updated.candidateSlots) {
      updated.totalSlots = updated.candidateSlots.length;
      updated.bookedSlots = updated.candidateSlots.filter((s) => s.studentId).length;
      updated.completedSlots = updated.candidateSlots.filter((s) => s.status === 'COMPLETED').length;

      const scoredSlots = updated.candidateSlots.filter((s) => typeof s.score === 'number');
      if (scoredSlots.length > 0) {
        const sum = scoredSlots.reduce((acc, s) => acc + (s.score || 0), 0);
        updated.avgScore = Math.round(sum / scoredSlots.length);
      }
    }

    this.interviews[idx] = updated;
    return updated;
  }

  async deleteInterview(id: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 80));
    const initialLen = this.interviews.length;
    this.interviews = this.interviews.filter((i) => i.id !== id);
    return this.interviews.length < initialLen;
  }

  async updateCandidateSlot(
    interviewId: string,
    slotId: string,
    updates: Partial<InterviewCandidateSlot>
  ): Promise<BatchInterview> {
    await new Promise((r) => setTimeout(r, 100));
    const interview = this.interviews.find((i) => i.id === interviewId);
    if (!interview) throw new Error('Interview not found');

    const slotIdx = interview.candidateSlots.findIndex((s) => s.id === slotId);
    if (slotIdx === -1) throw new Error('Slot not found');

    interview.candidateSlots[slotIdx] = {
      ...interview.candidateSlots[slotIdx],
      ...updates,
    };

    return this.updateInterview(interviewId, { candidateSlots: [...interview.candidateSlots] });
  }

  async addSlotToInterview(
    interviewId: string,
    slot: Omit<InterviewCandidateSlot, 'id'>
  ): Promise<BatchInterview> {
    const interview = this.interviews.find((i) => i.id === interviewId);
    if (!interview) throw new Error('Interview not found');

    const newSlot: InterviewCandidateSlot = {
      ...slot,
      id: `slot_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    };

    interview.candidateSlots.push(newSlot);
    return this.updateInterview(interviewId, { candidateSlots: [...interview.candidateSlots] });
  }
}

export const interviewService = new InterviewService();
