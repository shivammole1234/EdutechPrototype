import { create } from 'zustand';
import { User, UserRole } from '@/types';

export const ALL_DEMO_ACCOUNTS: User[] = [
  // Tier 1: University Admin
  {
    id: 'usr_univ_admin_01',
    name: 'Dr. Arthur Vance',
    email: 'arthur.vance@university.codepulse.edu',
    role: 'UNIVERSITY_ADMIN',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    universityId: 'univ_001',
    universityName: 'Apex Technical University System',
    status: 'ACTIVE',
    joinedDate: '2023-08-01',
    phone: '+1 (555) 010-9900',
    bio: 'Chancellor & University Academic Administrator. Overseeing all constituent colleges, institutional standards, and multi-campus accreditation.',
  },
  {
    id: 'usr_univ_admin_02',
    name: 'Dr. Eleanor Sterling',
    email: 'eleanor.sterling@university.codepulse.edu',
    role: 'UNIVERSITY_ADMIN',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    universityId: 'univ_001',
    universityName: 'Apex Technical University System',
    status: 'ACTIVE',
    joinedDate: '2023-09-10',
    phone: '+1 (555) 010-9901',
    bio: 'Vice Chancellor of Academic Standards & ABET Accreditation.',
  },

  // Tier 2: College Admin / Dean
  {
    id: 'usr_college_admin_01',
    name: 'Dr. Richard Thorne',
    email: 'richard.thorne@eng.codepulse.edu',
    role: 'COLLEGE',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    universityId: 'univ_001',
    universityName: 'Apex Technical University System',
    collegeId: 'college_001',
    collegeName: 'Apex College of Engineering & Technology',
    collegeCode: 'ACET',
    status: 'ACTIVE',
    joinedDate: '2023-11-15',
    phone: '+1 (555) 234-5678',
    bio: 'Dean of Engineering, Apex College of Engineering & Technology (ACET). Overseeing 4 engineering departments and faculty allocations.',
  },
  {
    id: 'usr_college_admin_02',
    name: 'Dr. Maya Patel',
    email: 'maya.patel@comp.codepulse.edu',
    role: 'COLLEGE',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    universityId: 'univ_001',
    universityName: 'Apex Technical University System',
    collegeId: 'college_002',
    collegeName: 'Apex Institute of Advanced Computing',
    collegeCode: 'AIAC',
    status: 'ACTIVE',
    joinedDate: '2023-12-01',
    phone: '+1 (555) 345-6789',
    bio: 'Director & Campus Dean, Apex Institute of Advanced Computing (AIAC).',
  },

  // Tier 3: Department Co-ordinator
  {
    id: 'usr_coord_01',
    name: 'Prof. Marcus Vance',
    email: 'marcus.vance@eng.codepulse.edu',
    role: 'DEPARTMENT_COORDINATOR',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    universityId: 'univ_001',
    universityName: 'Apex Technical University System',
    collegeId: 'college_001',
    collegeName: 'Apex College of Engineering & Technology',
    collegeCode: 'ACET',
    departmentId: 'dept_cse_01',
    departmentName: 'Computer Science & Engineering',
    organizationId: 'org_acme_01',
    organizationName: 'Apex College of Engineering & Technology',
    status: 'ACTIVE',
    joinedDate: '2024-01-15',
    phone: '+1 (555) 019-2834',
    bio: 'Department Co-ordinator for Computer Science & Engineering. Managing faculty, batches, question banks, and live coding assessments.',
  },
  {
    id: 'usr_coord_02',
    name: 'Dr. Sarah Lin',
    email: 'sarah.lin@comp.codepulse.edu',
    role: 'DEPARTMENT_COORDINATOR',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    universityId: 'univ_001',
    universityName: 'Apex Technical University System',
    collegeId: 'college_002',
    collegeName: 'Apex Institute of Advanced Computing',
    collegeCode: 'AIAC',
    departmentId: 'dept_aiml_01',
    departmentName: 'Artificial Intelligence & Machine Learning',
    organizationId: 'org_acme_02',
    organizationName: 'Apex Institute of Advanced Computing',
    status: 'ACTIVE',
    joinedDate: '2024-02-01',
    phone: '+1 (555) 019-2835',
    bio: 'Department Co-ordinator for AI & Machine Learning.',
  },

  // Tier 4: Instructor
  {
    id: 'usr_inst_01',
    name: 'Dr. Elena Rostova',
    email: 'elena.rostova@eng.codepulse.edu',
    role: 'INSTRUCTOR',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    universityId: 'univ_001',
    universityName: 'Apex Technical University System',
    collegeId: 'college_001',
    collegeName: 'Apex College of Engineering & Technology',
    collegeCode: 'ACET',
    departmentId: 'dept_cse_01',
    departmentName: 'Computer Science & Engineering',
    organizationId: 'org_acme_01',
    organizationName: 'Apex College of Engineering & Technology',
    status: 'ACTIVE',
    joinedDate: '2024-03-01',
    phone: '+1 (555) 042-8921',
    bio: 'Senior Algorithms & Full-Stack Systems Lead Instructor. Ex-Staff Engineer.',
    assignedBatchesCount: 4,
    totalStudentsCount: 142,
  },
  {
    id: 'usr_inst_02',
    name: 'Prof. David Kim',
    email: 'david.kim@eng.codepulse.edu',
    role: 'INSTRUCTOR',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    universityId: 'univ_001',
    universityName: 'Apex Technical University System',
    collegeId: 'college_001',
    collegeName: 'Apex College of Engineering & Technology',
    collegeCode: 'ACET',
    departmentId: 'dept_cse_01',
    departmentName: 'Computer Science & Engineering',
    organizationId: 'org_acme_01',
    organizationName: 'Apex College of Engineering & Technology',
    status: 'ACTIVE',
    joinedDate: '2024-04-10',
    phone: '+1 (555) 042-8922',
    bio: 'Systems Programming, C++ and Operating Systems Faculty Lead.',
    assignedBatchesCount: 3,
    totalStudentsCount: 118,
  },

  // Tier 5: Student
  {
    id: 'usr_stud_01',
    name: 'Alex Turner',
    email: 'alex.turner@student.eng.codepulse.edu',
    role: 'STUDENT',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    universityId: 'univ_001',
    universityName: 'Apex Technical University System',
    collegeId: 'college_001',
    collegeName: 'Apex College of Engineering & Technology',
    collegeCode: 'ACET',
    departmentId: 'dept_cse_01',
    departmentName: 'Computer Science & Engineering',
    organizationId: 'org_acme_01',
    organizationName: 'Apex College of Engineering & Technology',
    status: 'ACTIVE',
    joinedDate: '2024-06-10',
    batchIds: ['batch_fsd_2025_01'],
    batchName: 'Full Stack & DSA Accelerator (Cohort 2025-A)',
    performanceScore: 91,
    phone: '+1 (555) 382-9912',
    bio: 'Aspiring Full Stack Engineer passionate about Distributed Systems & Algorithms.',
  },
  {
    id: 'usr_stud_02',
    name: 'Priya Sharma',
    email: 'priya.sharma@student.comp.codepulse.edu',
    role: 'STUDENT',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    universityId: 'univ_001',
    universityName: 'Apex Technical University System',
    collegeId: 'college_002',
    collegeName: 'Apex Institute of Advanced Computing',
    collegeCode: 'AIAC',
    departmentId: 'dept_aiml_01',
    departmentName: 'Artificial Intelligence & Machine Learning',
    organizationId: 'org_acme_02',
    organizationName: 'Apex Institute of Advanced Computing',
    status: 'ACTIVE',
    joinedDate: '2024-07-01',
    batchIds: ['batch_aiml_2026_01'],
    batchName: 'Deep Learning & Python Accelerator (Cohort 2026-B)',
    performanceScore: 88,
    phone: '+1 (555) 382-9913',
    bio: 'AI & Data Science Student focusing on Computer Vision and NLP.',
  },
  {
    id: 'usr_stud_03',
    name: 'Marcus Chen',
    email: 'marcus.chen@student.ssca.codepulse.edu',
    role: 'STUDENT',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    universityId: 'univ_001',
    universityName: 'Apex Technical University System',
    collegeId: 'college_003',
    collegeName: 'School of Software Systems & Cloud Architecture',
    collegeCode: 'SSCA',
    departmentId: 'dept_cloud_01',
    departmentName: 'Cloud Systems & DevOps',
    organizationId: 'org_acme_03',
    organizationName: 'School of Software Systems & Cloud Architecture',
    status: 'ACTIVE',
    joinedDate: '2024-05-15',
    batchIds: ['batch_cloud_2024_01'],
    batchName: 'Cloud Distributed Systems & Kubernetes (Cohort 2024-C)',
    performanceScore: 95,
    phone: '+1 (555) 382-9914',
    bio: 'Final-year Senior passionate about High-Concurrency Microservices.',
  },
];

export const MOCK_USERS: Record<string, User> = {
  UNIVERSITY_ADMIN: ALL_DEMO_ACCOUNTS[0],
  COLLEGE: ALL_DEMO_ACCOUNTS[2],
  DEPARTMENT_COORDINATOR: ALL_DEMO_ACCOUNTS[4],
  ADMIN: ALL_DEMO_ACCOUNTS[4],
  INSTRUCTOR: ALL_DEMO_ACCOUNTS[6],
  STUDENT: ALL_DEMO_ACCOUNTS[8],
};

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  notificationMessage: string | null;
  login: (role?: UserRole, email?: string) => Promise<User>;
  logout: () => void;
  switchRole: (role: UserRole) => User;
  switchAccount: (accountOrId: User | string) => User;
  clearNotification: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => {
  // Initialize with saved user ID, saved role, or Student
  let initialUser: User = ALL_DEMO_ACCOUNTS[8]; // Alex Turner (Student) default

  if (typeof window !== 'undefined') {
    const savedUserId = localStorage.getItem('codepulse_active_user_id');
    const savedRole = localStorage.getItem('codepulse_active_role') as UserRole | null;

    if (savedUserId) {
      const found = ALL_DEMO_ACCOUNTS.find((u) => u.id === savedUserId);
      if (found) initialUser = found;
    } else if (savedRole && MOCK_USERS[savedRole]) {
      initialUser = MOCK_USERS[savedRole];
    }
  }

  return {
    user: initialUser,
    isAuthenticated: true,
    token: 'mock_jwt_session_token_xyz_99',
    notificationMessage: null,

    login: async (role = 'STUDENT', email) => {
      await new Promise((r) => setTimeout(r, 200));
      const normalizedRole = role === 'ADMIN' ? 'DEPARTMENT_COORDINATOR' : role;
      let selectedUser =
        (email && ALL_DEMO_ACCOUNTS.find((u) => u.email.toLowerCase() === email.toLowerCase())) ||
        MOCK_USERS[normalizedRole] ||
        MOCK_USERS[role] ||
        ALL_DEMO_ACCOUNTS[8];

      if (email && !ALL_DEMO_ACCOUNTS.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        selectedUser = { ...selectedUser, email };
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('codepulse_active_user_id', selectedUser.id);
        localStorage.setItem('codepulse_active_role', selectedUser.role);
      }

      set({
        user: selectedUser,
        isAuthenticated: true,
        token: 'mock_jwt_session_token_xyz_99',
        notificationMessage: `Logged in as ${selectedUser.name}`,
      });
      return selectedUser;
    },

    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('codepulse_active_user_id');
        localStorage.removeItem('codepulse_active_role');
      }
      set({ user: null, isAuthenticated: false, token: null, notificationMessage: null });
    },

    switchRole: (role: UserRole) => {
      const normalizedRole = role === 'ADMIN' ? 'DEPARTMENT_COORDINATOR' : role;
      const newUser = MOCK_USERS[normalizedRole] || MOCK_USERS[role] || ALL_DEMO_ACCOUNTS[8];

      if (typeof window !== 'undefined') {
        localStorage.setItem('codepulse_active_user_id', newUser.id);
        localStorage.setItem('codepulse_active_role', newUser.role);
      }

      set({
        user: newUser,
        isAuthenticated: true,
        notificationMessage: `Switched active persona to ${newUser.name}`,
      });
      return newUser;
    },

    switchAccount: (accountOrId: User | string) => {
      let targetUser: User | undefined;
      if (typeof accountOrId === 'string') {
        targetUser = ALL_DEMO_ACCOUNTS.find((u) => u.id === accountOrId);
        if (!targetUser) {
          // Check by role key if passed
          targetUser = MOCK_USERS[accountOrId];
        }
      } else {
        targetUser = accountOrId;
      }

      if (!targetUser) {
        targetUser = ALL_DEMO_ACCOUNTS[8]; // Fallback
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('codepulse_active_user_id', targetUser.id);
        localStorage.setItem('codepulse_active_role', targetUser.role);
      }

      set({
        user: targetUser,
        isAuthenticated: true,
        notificationMessage: `Switched account to ${targetUser.name}`,
      });
      return targetUser;
    },

    clearNotification: () => set({ notificationMessage: null }),

    updateUserProfile: (updates: Partial<User>) => {
      set((state) => {
        if (!state.user) return { user: null };
        const updated = { ...state.user, ...updates };
        return { user: updated };
      });
    },
  };
});

