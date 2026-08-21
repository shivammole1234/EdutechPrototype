import { create } from 'zustand';
import { User, UserRole } from '@/types';

export const MOCK_USERS: Record<UserRole, User> = {
  ADMIN: {
    id: 'usr_admin_01',
    name: 'Marcus Vance',
    email: 'marcus.vance@codepulse.io',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    organizationId: 'org_acme_01',
    organizationName: 'CodePulse Engineering Academy',
    status: 'ACTIVE',
    joinedDate: '2024-01-15',
    phone: '+1 (555) 019-2834',
    bio: 'Platform Administrator & Head of Academic Technology.',
  },
  INSTRUCTOR: {
    id: 'usr_inst_01',
    name: 'Dr. Elena Rostova',
    email: 'elena.rostova@codepulse.io',
    role: 'INSTRUCTOR',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    organizationId: 'org_acme_01',
    organizationName: 'CodePulse Engineering Academy',
    status: 'ACTIVE',
    joinedDate: '2024-03-01',
    phone: '+1 (555) 042-8921',
    bio: 'Senior Algorithms & Full-Stack Systems Lead Instructor. Ex-Staff Engineer.',
    assignedBatchesCount: 4,
    totalStudentsCount: 142,
  },
  STUDENT: {
    id: 'usr_stud_01',
    name: 'Alex Turner',
    email: 'alex.turner@student.codepulse.io',
    role: 'STUDENT',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    organizationId: 'org_acme_01',
    organizationName: 'CodePulse Engineering Academy',
    status: 'ACTIVE',
    joinedDate: '2024-06-10',
    batchIds: ['batch_fsd_2025_01'],
    batchName: 'Full Stack & DSA Accelerator (Cohort 2025-A)',
    performanceScore: 91,
    phone: '+1 (555) 382-9912',
    bio: 'Aspiring Full Stack Engineer passionate about Distributed Systems & Algorithms.',
  },
};

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (role?: UserRole, email?: string) => Promise<User>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateUserProfile: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Initialize with Student or previously stored role for immediate exploration
  const savedRole = (typeof window !== 'undefined' ? localStorage.getItem('codepulse_active_role') : null) as UserRole | null;
  const initialRole: UserRole = savedRole && MOCK_USERS[savedRole] ? savedRole : 'STUDENT';
  const initialUser = MOCK_USERS[initialRole];

  return {
    user: initialUser,
    isAuthenticated: true,
    token: 'mock_jwt_session_token_xyz_99',

    login: async (role = 'STUDENT', email) => {
      // Simulate network latency
      await new Promise((r) => setTimeout(r, 400));
      let selectedUser = MOCK_USERS[role];
      if (email) {
        selectedUser = { ...selectedUser, email };
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('codepulse_active_role', role);
      }
      set({ user: selectedUser, isAuthenticated: true, token: 'mock_jwt_session_token_xyz_99' });
      return selectedUser;
    },

    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('codepulse_active_role');
      }
      set({ user: null, isAuthenticated: false, token: null });
    },

    switchRole: (role: UserRole) => {
      const newUser = MOCK_USERS[role];
      if (typeof window !== 'undefined') {
        localStorage.setItem('codepulse_active_role', role);
      }
      set({ user: newUser, isAuthenticated: true });
    },

    updateUserProfile: (updates: Partial<User>) => {
      set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null,
      }));
    },
  };
});
