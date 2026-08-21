import { create } from 'zustand';
import {
  LiveClassRoom,
  LiveChatMessage,
  LivePoll,
  LiveHandRaise,
  LiveWhiteboardStroke,
  LiveParticipant,
  User,
} from '@/types';
import { INITIAL_STUDENTS, INITIAL_INSTRUCTORS } from '@/services/mockData';

const SAMPLE_STARTER_CODE = `// Live Lecture: Binary Search Tree Inorder Traversal & Balancing
class TreeNode {
  val: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;
  constructor(val: number) {
    this.val = val;
  }
}

/**
 * Performs iterative and recursive inorder traversal on BST
 * Time Complexity: O(N), Space Complexity: O(H)
 */
function inorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  
  function dfs(node: TreeNode | null) {
    if (!node) return;
    dfs(node.left);
    result.push(node.val);
    dfs(node.right);
  }

  dfs(root);
  return result;
}

// Interactive Live Example
const root = new TreeNode(4);
root.left = new TreeNode(2);
root.right = new TreeNode(6);
root.left.left = new TreeNode(1);
root.left.right = new TreeNode(3);
root.right.left = new TreeNode(5);
root.right.right = new TreeNode(7);

console.log("BST Inorder Sorted Output:", inorderTraversal(root));
`;

const INITIAL_LIVE_CLASSES: LiveClassRoom[] = [
  {
    id: 'live_cls_01',
    batchId: 'batch_fsd_2025_01',
    batchName: 'Full Stack & DSA Accelerator (Cohort 2025-A)',
    title: 'Live Lab: Advanced Tree Traversals & AVL Rotations',
    topic: 'Binary Search Trees, Heaps & AVL Self-Balancing Trees',
    description: 'Master in-depth pointer manipulations, left/right AVL rotations, and iterative inorder traversal with custom stack frames.',
    instructorId: 'usr_inst_01',
    instructorName: 'Dr. Elena Rostova',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'LIVE',
    startedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '14:00 EST',
    durationMinutes: 90,
    tags: ['Trees', 'Algorithms', 'DSA', 'TypeScript'],
    code: SAMPLE_STARTER_CODE,
    language: 'typescript',
    instructorOutput: `Compiling and executing TypeScript AST sandbox...
BST Inorder Sorted Output: [ 1, 2, 3, 4, 5, 6, 7 ]
Execution finished successfully in 48ms.`,
    notes: `## Lecture Notes: Binary Search Trees & AVL Rotations
- **BST Invariant:** Left subtree keys < root key < right subtree keys.
- **Inorder Traversal:** In BST, inorder traversal yields keys in strictly ascending sorted order.
- **Balance Factor (AVL):** Height(Left) - Height(Right) must be in {-1, 0, 1}.
- **Rotations:**
  - LL Imbalance -> Single Right Rotation
  - RR Imbalance -> Single Left Rotation
  - LR Imbalance -> Left Rotation on child, then Right on root.`,
    chatMessages: [
      {
        id: 'msg_01',
        senderId: 'usr_inst_01',
        senderName: 'Dr. Elena Rostova',
        senderRole: 'INSTRUCTOR',
        senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        text: 'Welcome to today’s Live Coding Lab! We will code AVL balancing from scratch in TypeScript.',
        time: '14:00',
        isInstructor: true,
        isPinned: true,
      },
      {
        id: 'msg_02',
        senderId: 'usr_stud_02',
        senderName: 'Sophia Chen',
        senderRole: 'STUDENT',
        senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        text: 'Does iterative traversal avoid recursion stack overflow for skewed trees?',
        time: '14:04',
      },
      {
        id: 'msg_03',
        senderId: 'usr_inst_01',
        senderName: 'Dr. Elena Rostova',
        senderRole: 'INSTRUCTOR',
        senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        text: 'Great question Sophia! Yes, an explicit heap stack won’t breach the V8 call-stack size limits.',
        time: '14:05',
        isInstructor: true,
      },
      {
        id: 'msg_04',
        senderId: 'usr_stud_03',
        senderName: 'Liam Martinez',
        senderRole: 'STUDENT',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        text: 'Code runs very clean in sandbox! 🚀',
        time: '14:12',
      },
    ],
    polls: [
      {
        id: 'poll_01',
        question: 'What is the worst-case time complexity of lookup in an UNBALANCED BST?',
        options: [
          { id: 'opt_1', text: 'O(1)', votes: 1 },
          { id: 'opt_2', text: 'O(log N)', votes: 4 },
          { id: 'opt_3', text: 'O(N)', votes: 21 },
          { id: 'opt_4', text: 'O(N log N)', votes: 0 },
        ],
        status: 'ACTIVE',
        totalVotes: 26,
        correctOptionId: 'opt_3',
        createdAt: '14:10',
      },
    ],
    raisedHands: [
      {
        id: 'hr_01',
        studentId: 'usr_stud_02',
        studentName: 'Sophia Chen',
        studentAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        raisedAt: '14:15',
        status: 'WAITING',
      },
    ],
    whiteboardStrokes: [],
    participants: [
      {
        id: 'usr_inst_01',
        name: 'Dr. Elena Rostova',
        email: 'elena.rostova@codepulse.io',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        role: 'INSTRUCTOR',
        isSpeaking: true,
        micOn: true,
        camOn: true,
        joinedAt: '13:58',
      },
      {
        id: 'usr_stud_01',
        name: 'Alex Turner',
        email: 'alex.turner@student.codepulse.io',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        role: 'STUDENT',
        micOn: false,
        camOn: true,
        handRaised: false,
        joinedAt: '14:01',
      },
      {
        id: 'usr_stud_02',
        name: 'Sophia Chen',
        email: 'sophia.chen@student.codepulse.io',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        role: 'STUDENT',
        micOn: false,
        camOn: true,
        handRaised: true,
        joinedAt: '14:00',
      },
      {
        id: 'usr_stud_03',
        name: 'Liam Martinez',
        email: 'liam.martinez@student.codepulse.io',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        role: 'STUDENT',
        micOn: false,
        camOn: false,
        joinedAt: '14:02',
      },
      {
        id: 'usr_stud_04',
        name: 'Amara Okafor',
        email: 'amara.okafor@student.codepulse.io',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'STUDENT',
        micOn: false,
        camOn: true,
        joinedAt: '14:03',
      },
      {
        id: 'usr_stud_06',
        name: 'Zara Patel',
        email: 'zara.patel@student.codepulse.io',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        role: 'STUDENT',
        micOn: false,
        camOn: false,
        joinedAt: '14:05',
      },
    ],
  },
  {
    id: 'live_cls_02',
    batchId: 'batch_fsd_2025_01',
    batchName: 'Full Stack & DSA Accelerator (Cohort 2025-A)',
    title: 'Upcoming: Graph Shortest Path (Dijkstra vs. Bellman-Ford)',
    topic: 'Graph Algorithms, Priority Queues & Dynamic Programming',
    description: 'Deep dive into greedy vertex selection, negative weight cycles detection, and spatial graph representation.',
    instructorId: 'usr_inst_01',
    instructorName: 'Dr. Elena Rostova',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'SCHEDULED',
    scheduledDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    scheduledTime: '18:00 EST',
    durationMinutes: 90,
    tags: ['Graphs', 'Dijkstra', 'PriorityQueue'],
    code: `// Graph Adjacency List Starter Code\nclass Graph {\n  adjList: Map<string, { node: string; weight: number }[]> = new Map();\n}`,
    language: 'typescript',
    instructorOutput: '',
    notes: 'Prerequisites: Review MinHeap and Adjacency Matrix representations.',
    chatMessages: [],
    polls: [],
    raisedHands: [],
    whiteboardStrokes: [],
    participants: [],
  },
  {
    id: 'live_cls_03',
    batchId: 'batch_fsd_2025_01',
    batchName: 'Full Stack & DSA Accelerator (Cohort 2025-A)',
    title: 'Completed: System Design: Rate Limiter & Leaky Bucket Algorithm',
    topic: 'Distributed Systems, Redis Locks & Sliding Window Counter',
    description: 'Production implementation of Token Bucket, Leaky Bucket, and Fixed Window rate limiters.',
    instructorId: 'usr_inst_01',
    instructorName: 'Dr. Elena Rostova',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'ENDED',
    scheduledDate: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    scheduledTime: '14:00 EST',
    durationMinutes: 120,
    tags: ['SystemDesign', 'Redis', 'RateLimiter'],
    code: `// Rate Limiter implementation\nclass TokenBucketRateLimiter {\n  private capacity: number;\n  private tokens: number;\n  private refillRate: number;\n}`,
    language: 'typescript',
    instructorOutput: 'Rate limiter benchmark passed: 10,000 req/sec handled.',
    notes: 'Key Takeaways: Token Bucket allows bursts, Leaky Bucket enforces constant egress rate.',
    chatMessages: [],
    polls: [],
    raisedHands: [],
    whiteboardStrokes: [],
    participants: [],
    recordingUrl: 'https://cdn.codepulse.io/recordings/sd-rate-limiting.mp4',
  },
];

interface LiveClassState {
  classes: LiveClassRoom[];
  activeRoomId: string | null;

  // Selectors
  getActiveRoom: () => LiveClassRoom | undefined;
  getLiveClasses: () => LiveClassRoom[];
  getScheduledClasses: () => LiveClassRoom[];
  getEndedClasses: () => LiveClassRoom[];
  getClassById: (id: string) => LiveClassRoom | undefined;

  // Actions
  setActiveRoomId: (id: string | null) => void;
  startLiveClass: (newClass: Partial<LiveClassRoom>) => LiveClassRoom;
  endLiveClass: (classId: string) => void;
  joinLiveClass: (classId: string, user: User) => void;
  leaveLiveClass: (classId: string, userId: string) => void;
  updateLiveCode: (classId: string, code: string, language?: string) => void;
  updateInstructorOutput: (classId: string, output: string) => void;
  sendChatMessage: (classId: string, message: { text: string; sender: User; isPinned?: boolean }) => void;
  createPoll: (classId: string, poll: { question: string; options: string[]; correctOptionIndex?: number }) => void;
  votePoll: (classId: string, pollId: string, optionId: string, userId: string) => void;
  closePoll: (classId: string, pollId: string) => void;
  raiseHand: (classId: string, user: User) => void;
  lowerHand: (classId: string, studentId: string) => void;
  grantSpeaking: (classId: string, studentId: string) => void;
  addWhiteboardStroke: (classId: string, stroke: LiveWhiteboardStroke) => void;
  clearWhiteboard: (classId: string) => void;
  updateNotes: (classId: string, notes: string) => void;
  toggleParticipantMedia: (classId: string, userId: string, type: 'cam' | 'mic') => void;
}

export const useLiveClassStore = create<LiveClassState>((set, get) => ({
  classes: INITIAL_LIVE_CLASSES,
  activeRoomId: 'live_cls_01',

  getActiveRoom: () => {
    const { classes, activeRoomId } = get();
    return classes.find((c) => c.id === activeRoomId) || classes.find((c) => c.status === 'LIVE');
  },

  getLiveClasses: () => {
    return get().classes.filter((c) => c.status === 'LIVE');
  },

  getScheduledClasses: () => {
    return get().classes.filter((c) => c.status === 'SCHEDULED');
  },

  getEndedClasses: () => {
    return get().classes.filter((c) => c.status === 'ENDED');
  },

  getClassById: (id: string) => {
    return get().classes.find((c) => c.id === id);
  },

  setActiveRoomId: (id) => set({ activeRoomId: id }),

  startLiveClass: (newClassData) => {
    const id = newClassData.id || `live_cls_${Date.now()}`;
    const newClass: LiveClassRoom = {
      id,
      batchId: newClassData.batchId || 'batch_fsd_2025_01',
      batchName: newClassData.batchName || 'Full Stack & DSA Accelerator (Cohort 2025-A)',
      title: newClassData.title || 'Live Coding Masterclass',
      topic: newClassData.topic || 'Interactive Algorithm Workshop',
      description: newClassData.description || 'Live interactive lecture with code editor, sandbox execution and real-time Q&A.',
      instructorId: newClassData.instructorId || 'usr_inst_01',
      instructorName: newClassData.instructorName || 'Dr. Elena Rostova',
      instructorAvatar: newClassData.instructorAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      status: 'LIVE',
      startedAt: new Date().toISOString(),
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      durationMinutes: newClassData.durationMinutes || 90,
      tags: newClassData.tags || ['LiveClass', 'CodePulse', 'DSA'],
      code: newClassData.code || SAMPLE_STARTER_CODE,
      language: newClassData.language || 'typescript',
      instructorOutput: 'Live session initialized. Ready for code execution.',
      notes: `## Lecture: ${newClassData.title || 'Live Class'}\n- Welcome everyone!\n- Follow along in the shared editor.`,
      chatMessages: [
        {
          id: `msg_welcome_${Date.now()}`,
          senderId: newClassData.instructorId || 'usr_inst_01',
          senderName: newClassData.instructorName || 'Dr. Elena Rostova',
          senderRole: 'INSTRUCTOR',
          senderAvatar: newClassData.instructorAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          text: `Live class started: "${newClassData.title || 'Live Coding Masterclass'}". Feel free to ask questions in the chat!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isInstructor: true,
          isPinned: true,
        },
      ],
      polls: [],
      raisedHands: [],
      whiteboardStrokes: [],
      participants: [
        {
          id: newClassData.instructorId || 'usr_inst_01',
          name: newClassData.instructorName || 'Dr. Elena Rostova',
          avatar: newClassData.instructorAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          role: 'INSTRUCTOR',
          isSpeaking: true,
          micOn: true,
          camOn: true,
          joinedAt: 'Just now',
        },
      ],
    };

    set((state) => {
      // If it existed as scheduled, update it to live
      const existingIndex = state.classes.findIndex((c) => c.id === id);
      if (existingIndex >= 0) {
        const updated = [...state.classes];
        updated[existingIndex] = { ...updated[existingIndex], ...newClass, status: 'LIVE', startedAt: new Date().toISOString() };
        return { classes: updated, activeRoomId: id };
      }
      return { classes: [newClass, ...state.classes], activeRoomId: id };
    });

    return newClass;
  },

  endLiveClass: (classId: string) => {
    set((state) => ({
      classes: state.classes.map((c) =>
        c.id === classId
          ? {
              ...c,
              status: 'ENDED',
              recordingUrl: `https://cdn.codepulse.io/recordings/${classId}.mp4`,
            }
          : c
      ),
    }));
  },

  joinLiveClass: (classId: string, user: User) => {
    set((state) => {
      return {
        classes: state.classes.map((c) => {
          if (c.id !== classId) return c;
          const exists = c.participants.some((p) => p.id === user.id);
          if (exists) return c;
          const newParticipant: LiveParticipant = {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            micOn: user.role === 'INSTRUCTOR',
            camOn: true,
            handRaised: false,
            joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          return {
            ...c,
            participants: [...c.participants, newParticipant],
          };
        }),
      };
    });
  },

  leaveLiveClass: (classId: string, userId: string) => {
    set((state) => ({
      classes: state.classes.map((c) => {
        if (c.id !== classId) return c;
        return {
          ...c,
          participants: c.participants.filter((p) => p.id !== userId),
          raisedHands: c.raisedHands.filter((h) => h.studentId !== userId),
        };
      }),
    }));
  },

  updateLiveCode: (classId: string, code: string, language?: string) => {
    set((state) => ({
      classes: state.classes.map((c) =>
        c.id === classId ? { ...c, code, ...(language ? { language } : {}) } : c
      ),
    }));
  },

  updateInstructorOutput: (classId: string, instructorOutput: string) => {
    set((state) => ({
      classes: state.classes.map((c) => (c.id === classId ? { ...c, instructorOutput } : c)),
    }));
  },

  sendChatMessage: (classId, { text, sender, isPinned }) => {
    const newMsg: LiveChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      senderId: sender.id,
      senderName: sender.name,
      senderRole: sender.role,
      senderAvatar: sender.avatar,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isInstructor: sender.role === 'INSTRUCTOR',
      isPinned: isPinned || false,
    };

    set((state) => ({
      classes: state.classes.map((c) =>
        c.id === classId ? { ...c, chatMessages: [...c.chatMessages, newMsg] } : c
      ),
    }));
  },

  createPoll: (classId, { question, options, correctOptionIndex }) => {
    const newPoll: LivePoll = {
      id: `poll_${Date.now()}`,
      question,
      options: options.map((opt, idx) => ({
        id: `opt_${idx + 1}`,
        text: opt,
        votes: 0,
      })),
      status: 'ACTIVE',
      totalVotes: 0,
      correctOptionId: correctOptionIndex !== undefined ? `opt_${correctOptionIndex + 1}` : undefined,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    set((state) => ({
      classes: state.classes.map((c) =>
        c.id === classId ? { ...c, polls: [newPoll, ...c.polls] } : c
      ),
    }));
  },

  votePoll: (classId, pollId, optionId, userId) => {
    set((state) => ({
      classes: state.classes.map((c) => {
        if (c.id !== classId) return c;
        return {
          ...c,
          polls: c.polls.map((p) => {
            if (p.id !== pollId) return p;
            return {
              ...p,
              totalVotes: p.totalVotes + 1,
              userVotedOptionId: optionId,
              options: p.options.map((opt) =>
                opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
              ),
            };
          }),
        };
      }),
    }));
  },

  closePoll: (classId, pollId) => {
    set((state) => ({
      classes: state.classes.map((c) => {
        if (c.id !== classId) return c;
        return {
          ...c,
          polls: c.polls.map((p) => (p.id === pollId ? { ...p, status: 'CLOSED' } : p)),
        };
      }),
    }));
  },

  raiseHand: (classId, user) => {
    set((state) => ({
      classes: state.classes.map((c) => {
        if (c.id !== classId) return c;
        const already = c.raisedHands.some((h) => h.studentId === user.id && h.status !== 'RESOLVED');
        if (already) return c;
        const newHand: LiveHandRaise = {
          id: `hr_${Date.now()}`,
          studentId: user.id,
          studentName: user.name,
          studentAvatar: user.avatar,
          raisedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'WAITING',
        };
        return {
          ...c,
          raisedHands: [...c.raisedHands, newHand],
          participants: c.participants.map((p) => (p.id === user.id ? { ...p, handRaised: true } : p)),
        };
      }),
    }));
  },

  lowerHand: (classId, studentId) => {
    set((state) => ({
      classes: state.classes.map((c) => {
        if (c.id !== classId) return c;
        return {
          ...c,
          raisedHands: c.raisedHands.filter((h) => h.studentId !== studentId),
          participants: c.participants.map((p) =>
            p.id === studentId ? { ...p, handRaised: false, isSpeaking: false } : p
          ),
        };
      }),
    }));
  },

  grantSpeaking: (classId, studentId) => {
    set((state) => ({
      classes: state.classes.map((c) => {
        if (c.id !== classId) return c;
        return {
          ...c,
          raisedHands: c.raisedHands.map((h) =>
            h.studentId === studentId ? { ...h, status: 'SPEAKING' } : h
          ),
          participants: c.participants.map((p) =>
            p.id === studentId ? { ...p, micOn: true, isSpeaking: true } : p
          ),
        };
      }),
    }));
  },

  addWhiteboardStroke: (classId, stroke) => {
    set((state) => ({
      classes: state.classes.map((c) =>
        c.id === classId ? { ...c, whiteboardStrokes: [...c.whiteboardStrokes, stroke] } : c
      ),
    }));
  },

  clearWhiteboard: (classId) => {
    set((state) => ({
      classes: state.classes.map((c) => (c.id === classId ? { ...c, whiteboardStrokes: [] } : c)),
    }));
  },

  updateNotes: (classId, notes) => {
    set((state) => ({
      classes: state.classes.map((c) => (c.id === classId ? { ...c, notes } : c)),
    }));
  },

  toggleParticipantMedia: (classId, userId, type) => {
    set((state) => ({
      classes: state.classes.map((c) => {
        if (c.id !== classId) return c;
        return {
          ...c,
          participants: c.participants.map((p) => {
            if (p.id !== userId) return p;
            if (type === 'cam') return { ...p, camOn: !p.camOn };
            if (type === 'mic') return { ...p, micOn: !p.micOn, isSpeaking: !p.micOn };
            return p;
          }),
        };
      }),
    }));
  },
}));
