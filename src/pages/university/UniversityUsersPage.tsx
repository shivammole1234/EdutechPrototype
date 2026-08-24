import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  GraduationCap,
  Building2,
  Network,
  Mail,
  Phone,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';

interface UniversityFacultyMember {
  id: string;
  name: string;
  role: 'DEAN' | 'COORDINATOR' | 'INSTRUCTOR';
  email: string;
  collegeName: string;
  collegeCode: string;
  departmentName: string;
  avatar: string;
  specialization: string;
  status: 'ACTIVE' | 'ON_LEAVE';
  studentsCount?: number;
}

const SYSTEM_FACULTY: UniversityFacultyMember[] = [
  {
    id: 'f_01',
    name: 'Dr. Arthur Vance',
    role: 'DEAN',
    email: 'arthur.vance@university.codepulse.edu',
    collegeName: 'University System HQ',
    collegeCode: 'HQ',
    departmentName: 'Chancellor Academic Board',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    specialization: 'Distributed Architecture & Academic Accreditation',
    status: 'ACTIVE',
  },
  {
    id: 'f_02',
    name: 'Dr. Richard Thorne',
    role: 'DEAN',
    email: 'richard.thorne@eng.codepulse.edu',
    collegeName: 'Apex College of Engineering & Technology',
    collegeCode: 'ACET',
    departmentName: 'Office of the Dean',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    specialization: 'High Performance Computing & VLSI',
    status: 'ACTIVE',
  },
  {
    id: 'f_03',
    name: 'Dr. Samantha Meyers',
    role: 'DEAN',
    email: 'samantha.meyers@ai.codepulse.edu',
    collegeName: 'Apex Institute of Advanced Computing & AI',
    collegeCode: 'AIAC',
    departmentName: 'Office of the Dean',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    specialization: 'Deep Neural Networks & Machine Cognition',
    status: 'ACTIVE',
  },
  {
    id: 'f_04',
    name: 'Prof. Vikram Singhania',
    role: 'DEAN',
    email: 'vikram.singhania@cloud.codepulse.edu',
    collegeName: 'School of Software Systems & Cloud Architecture',
    collegeCode: 'SSCA',
    departmentName: 'Office of the Dean',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    specialization: 'Cloud Infrastructure & SRE Protocols',
    status: 'ACTIVE',
  },
  {
    id: 'f_05',
    name: 'Prof. Marcus Vance',
    role: 'COORDINATOR',
    email: 'marcus.vance@eng.codepulse.edu',
    collegeName: 'Apex College of Engineering & Technology',
    collegeCode: 'ACET',
    departmentName: 'Computer Science & Engineering',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    specialization: 'Data Structures, Algorithms & Full Stack Cohorts',
    status: 'ACTIVE',
    studentsCount: 420,
  },
  {
    id: 'f_06',
    name: 'Dr. Kevin Sterling',
    role: 'COORDINATOR',
    email: 'kevin.sterling@ai.codepulse.edu',
    collegeName: 'Apex Institute of Advanced Computing & AI',
    collegeCode: 'AIAC',
    departmentName: 'Data Science & Analytics',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    specialization: 'Big Data Streams & Spark Architecture',
    status: 'ACTIVE',
    studentsCount: 280,
  },
  {
    id: 'f_07',
    name: 'Prof. Priya Sharma',
    role: 'COORDINATOR',
    email: 'priya.sharma@cloud.codepulse.edu',
    collegeName: 'School of Software Systems & Cloud Architecture',
    collegeCode: 'SSCA',
    departmentName: 'Cloud DevOps & Infrastructure',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    specialization: 'Kubernetes Orchestration & CI/CD Pipelines',
    status: 'ACTIVE',
    studentsCount: 260,
  },
  {
    id: 'f_08',
    name: 'Dr. Elena Rostova',
    role: 'INSTRUCTOR',
    email: 'elena.rostova@eng.codepulse.edu',
    collegeName: 'Apex College of Engineering & Technology',
    collegeCode: 'ACET',
    departmentName: 'Computer Science & Engineering',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    specialization: 'Advanced Graph Algorithms & Memory Optimization',
    status: 'ACTIVE',
    studentsCount: 142,
  },
];

export const UniversityUsersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'DEAN' | 'COORDINATOR' | 'INSTRUCTOR'>('ALL');
  const [collegeFilter, setCollegeFilter] = useState<string>('ALL');

  const filtered = SYSTEM_FACULTY.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.departmentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || f.role === roleFilter;
    const matchesCollege = collegeFilter === 'ALL' || f.collegeCode === collegeFilter;
    return matchesSearch && matchesRole && matchesCollege;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            University Faculty & Leadership Registry
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Governing deans, department co-ordinators, and instructional faculty across all campuses.
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Campus Deans"
          value="4"
          change="Institutional heads"
          changeType="neutral"
          icon={<Award className="w-5 h-5 text-amber-500" />}
          subtitle="Constituent leaders"
        />
        <StatCard
          title="Dept. Co-ordinators"
          value="7"
          change="Curriculum controllers"
          changeType="positive"
          icon={<Network className="w-5 h-5 text-purple-500" />}
          subtitle="Cohort managers"
        />
        <StatCard
          title="Total Faculty"
          value="110"
          change="100% active standing"
          changeType="positive"
          icon={<Users className="w-5 h-5 text-blue-500" />}
          subtitle="Systemwide educators"
        />
        <StatCard
          title="Accreditation Verified"
          value="100%"
          change="Tier-1 compliance"
          changeType="positive"
          icon={<ShieldCheck className="w-5 h-5 text-emerald-500" />}
          subtitle="Academic credentials"
        />
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search faculty, specialty, email..."
            className="w-full pl-9 pr-4 py-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--border-focus)] transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          <Filter className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <span className="text-xs text-[var(--text-secondary)]">Role:</span>
          {(['ALL', 'DEAN', 'COORDINATOR', 'INSTRUCTOR'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                roleFilter === r
                  ? 'bg-[var(--bg-surface-active)] text-[var(--text-primary)] font-bold border border-[var(--border-default)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
              }`}
            >
              {r === 'ALL' ? 'All Roles' : r === 'COORDINATOR' ? 'Co-ordinators' : r === 'DEAN' ? 'Deans' : 'Instructors'}
            </button>
          ))}
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((fac) => (
          <Card key={fac.id} className="p-5 flex flex-col justify-between hover:border-[var(--border-hover)] transition-all space-y-4">
            <div className="flex items-start gap-3.5">
              <img
                src={fac.avatar}
                alt={fac.name}
                className="w-12 h-12 rounded-2xl object-cover border border-[var(--border-default)] shrink-0"
              />
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-sm text-[var(--text-primary)] truncate">{fac.name}</h3>
                  <Badge
                    variant={
                      fac.role === 'DEAN' ? 'warning' : fac.role === 'COORDINATOR' ? 'purple' : 'primary'
                    }
                    size="sm"
                  >
                    {fac.role}
                  </Badge>
                </div>
                <p className="text-xs text-[var(--text-muted)] truncate">{fac.email}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[var(--text-secondary)] pt-2 border-t border-[var(--border-default)]">
              <div className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="truncate">{fac.collegeName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Network className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                <span className="truncate">{fac.departmentName}</span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] italic pt-1 line-clamp-2">
                "{fac.specialization}"
              </p>
            </div>

            <div className="pt-3 border-t border-[var(--border-default)] flex items-center justify-between text-xs">
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {fac.status}
              </span>
              {fac.studentsCount && (
                <span className="text-[10px] text-[var(--text-muted)] font-mono">
                  {fac.studentsCount} Students Overseen
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
