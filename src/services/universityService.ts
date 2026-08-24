import { University, College, Department, User, Assessment } from '@/types';
import { INITIAL_STUDENTS, INITIAL_INSTRUCTORS } from './mockData';

export const DEFAULT_UNIVERSITY: University = {
  id: 'univ_001',
  name: 'Apex Technical University System',
  code: 'ATU',
  domain: 'university.codepulse.edu',
  establishedYear: 1984,
  chancellorName: 'Dr. Arthur Vance',
  location: 'Metropolitan Tech Campus, CA',
  totalCollegesCount: 3,
  totalStudentsCount: 1970,
  totalFacultyCount: 110,
  totalCoordinatorsCount: 7,
  totalAssessmentsCount: 34,
  status: 'ACTIVE',
  createdAt: '2024-01-01',
};

export const INITIAL_COLLEGES: College[] = [
  {
    id: 'college_001',
    universityId: 'univ_001',
    universityName: 'Apex Technical University System',
    name: 'Apex College of Engineering & Technology',
    code: 'ACET',
    slug: 'apex-college-of-engineering',
    campusLocation: 'North Science & Tech Quarter',
    deanName: 'Dr. Richard Thorne',
    deanEmail: 'richard.thorne@eng.codepulse.edu',
    departmentsCount: 3,
    departments: [
      'Computer Science & Engineering',
      'Information Technology',
      'AI & Machine Learning',
    ],
    coordinatorsCount: 3,
    instructorsCount: 48,
    studentsCount: 840,
    batchesCount: 16,
    assessmentsCount: 18,
    avgPerformanceScore: 88.4,
    status: 'ACTIVE',
    establishedYear: 1996,
    contactEmail: 'admissions@eng.codepulse.edu',
    contactPhone: '+1 (555) 234-5678',
    website: 'https://eng.codepulse.edu',
    createdAt: '2024-01-10',
  },
  {
    id: 'college_002',
    universityId: 'univ_001',
    universityName: 'Apex Technical University System',
    name: 'Apex Institute of Advanced Computing & AI',
    code: 'AIAC',
    slug: 'apex-institute-advanced-computing',
    campusLocation: 'South Innovation Hub & Research Park',
    deanName: 'Dr. Samantha Meyers',
    deanEmail: 'samantha.meyers@ai.codepulse.edu',
    departmentsCount: 3,
    departments: [
      'Data Science & Analytics',
      'Applied AI Engineering',
      'Cybersecurity & Cryptography',
    ],
    coordinatorsCount: 2,
    instructorsCount: 34,
    studentsCount: 620,
    batchesCount: 12,
    assessmentsCount: 11,
    avgPerformanceScore: 85.1,
    status: 'ACTIVE',
    establishedYear: 2008,
    contactEmail: 'admissions@ai.codepulse.edu',
    contactPhone: '+1 (555) 345-6789',
    website: 'https://ai.codepulse.edu',
    createdAt: '2024-01-15',
  },
  {
    id: 'college_003',
    universityId: 'univ_001',
    universityName: 'Apex Technical University System',
    name: 'School of Software Systems & Cloud Architecture',
    code: 'SSCA',
    slug: 'school-software-systems',
    campusLocation: 'East Tech Park - Digital Media Wing',
    deanName: 'Prof. Vikram Singhania',
    deanEmail: 'vikram.singhania@cloud.codepulse.edu',
    departmentsCount: 3,
    departments: [
      'Cloud DevOps & Infrastructure',
      'Full-Stack Software Systems',
      'Distributed Systems Architecture',
    ],
    coordinatorsCount: 2,
    instructorsCount: 28,
    studentsCount: 510,
    batchesCount: 10,
    assessmentsCount: 9,
    avgPerformanceScore: 82.6,
    status: 'ACTIVE',
    establishedYear: 2015,
    contactEmail: 'contact@cloud.codepulse.edu',
    contactPhone: '+1 (555) 456-7890',
    website: 'https://cloud.codepulse.edu',
    createdAt: '2024-02-01',
  },
];

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept_cse_01',
    collegeId: 'college_001',
    collegeName: 'Apex College of Engineering & Technology',
    universityId: 'univ_001',
    name: 'Computer Science & Engineering',
    code: 'CSE',
    headOfDepartment: 'Dr. Evelyn Foster',
    hodEmail: 'evelyn.foster@eng.codepulse.edu',
    coordinatorName: 'Prof. Marcus Vance',
    coordinatorEmail: 'marcus.vance@eng.codepulse.edu',
    facultyCount: 22,
    studentCount: 420,
    batchesCount: 8,
    activeAssessmentsCount: 8,
    avgPassRate: 91.2,
    status: 'ACTIVE',
    description: 'Foundational computer science, advanced algorithms, distributed computing, and full-stack software development.',
    createdAt: '2024-01-12',
  },
  {
    id: 'dept_it_01',
    collegeId: 'college_001',
    collegeName: 'Apex College of Engineering & Technology',
    universityId: 'univ_001',
    name: 'Information Technology',
    code: 'IT',
    headOfDepartment: 'Dr. Robert Diaz',
    hodEmail: 'robert.diaz@eng.codepulse.edu',
    coordinatorName: 'Prof. Angela Yu',
    coordinatorEmail: 'angela.yu@eng.codepulse.edu',
    facultyCount: 14,
    studentCount: 240,
    batchesCount: 5,
    activeAssessmentsCount: 5,
    avgPassRate: 86.8,
    status: 'ACTIVE',
    description: 'Enterprise networking, web platforms, cloud virtualization, and database systems administration.',
    createdAt: '2024-01-14',
  },
  {
    id: 'dept_aiml_01',
    collegeId: 'college_001',
    collegeName: 'Apex College of Engineering & Technology',
    universityId: 'univ_001',
    name: 'AI & Machine Learning',
    code: 'AIML',
    headOfDepartment: 'Dr. S. K. Nair',
    hodEmail: 'sk.nair@eng.codepulse.edu',
    coordinatorName: 'Prof. Linda Gomez',
    coordinatorEmail: 'linda.gomez@eng.codepulse.edu',
    facultyCount: 12,
    studentCount: 180,
    batchesCount: 3,
    activeAssessmentsCount: 5,
    avgPassRate: 88.0,
    status: 'ACTIVE',
    description: 'Deep learning architectures, computer vision, natural language processing, and neural heuristics.',
    createdAt: '2024-01-18',
  },
  {
    id: 'dept_ds_02',
    collegeId: 'college_002',
    collegeName: 'Apex Institute of Advanced Computing & AI',
    universityId: 'univ_001',
    name: 'Data Science & Analytics',
    code: 'DSA',
    headOfDepartment: 'Dr. Michelle Obama-Chen',
    hodEmail: 'michelle.chen@ai.codepulse.edu',
    coordinatorName: 'Dr. Kevin Sterling',
    coordinatorEmail: 'kevin.sterling@ai.codepulse.edu',
    facultyCount: 16,
    studentCount: 280,
    batchesCount: 6,
    activeAssessmentsCount: 6,
    avgPassRate: 84.5,
    status: 'ACTIVE',
    description: 'Statistical modeling, big data pipelines, distributed Spark clusters, and business intelligence predictive engines.',
    createdAt: '2024-01-20',
  },
  {
    id: 'dept_cyber_02',
    collegeId: 'college_002',
    collegeName: 'Apex Institute of Advanced Computing & AI',
    universityId: 'univ_001',
    name: 'Cybersecurity & Cryptography',
    code: 'CYBER',
    headOfDepartment: 'Prof. Nathan Reed',
    hodEmail: 'nathan.reed@ai.codepulse.edu',
    coordinatorName: 'Prof. Tariq Al-Mansoor',
    coordinatorEmail: 'tariq.mansoor@ai.codepulse.edu',
    facultyCount: 10,
    studentCount: 180,
    batchesCount: 3,
    activeAssessmentsCount: 3,
    avgPassRate: 85.0,
    status: 'ACTIVE',
    description: 'Network perimeter defense, offensive penetration testing, zero-trust cryptographic protocols, and cloud compliance.',
    createdAt: '2024-01-25',
  },
  {
    id: 'dept_cloud_03',
    collegeId: 'college_003',
    collegeName: 'School of Software Systems & Cloud Architecture',
    universityId: 'univ_001',
    name: 'Cloud DevOps & Infrastructure',
    code: 'CDOPS',
    headOfDepartment: 'Dr. Frank Vance',
    hodEmail: 'frank.vance@cloud.codepulse.edu',
    coordinatorName: 'Prof. Priya Sharma',
    coordinatorEmail: 'priya.sharma@cloud.codepulse.edu',
    facultyCount: 15,
    studentCount: 260,
    batchesCount: 5,
    activeAssessmentsCount: 4,
    avgPassRate: 83.2,
    status: 'ACTIVE',
    description: 'Kubernetes orchestration, Terraform infrastructure as code, CI/CD automation pipelines, and site reliability engineering.',
    createdAt: '2024-02-05',
  },
];

export const INITIAL_COORDINATORS: User[] = [
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
    status: 'ACTIVE',
    joinedDate: '2024-01-15',
    phone: '+1 (555) 019-2834',
    bio: 'Lead Department Co-ordinator for Computer Science & Engineering.',
  },
  {
    id: 'usr_coord_02',
    name: 'Dr. Kevin Sterling',
    email: 'kevin.sterling@ai.codepulse.edu',
    role: 'DEPARTMENT_COORDINATOR',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    universityId: 'univ_001',
    universityName: 'Apex Technical University System',
    collegeId: 'college_002',
    collegeName: 'Apex Institute of Advanced Computing & AI',
    collegeCode: 'AIAC',
    departmentId: 'dept_ds_02',
    departmentName: 'Data Science & Analytics',
    status: 'ACTIVE',
    joinedDate: '2024-02-01',
    phone: '+1 (555) 234-9988',
    bio: 'Department Co-ordinator for Advanced Analytics & AI.',
  },
  {
    id: 'usr_coord_03',
    name: 'Prof. Priya Sharma',
    email: 'priya.sharma@cloud.codepulse.edu',
    role: 'DEPARTMENT_COORDINATOR',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    universityId: 'univ_001',
    universityName: 'Apex Technical University System',
    collegeId: 'college_003',
    collegeName: 'School of Software Systems & Cloud Architecture',
    collegeCode: 'SSCA',
    departmentId: 'dept_cloud_03',
    departmentName: 'Cloud DevOps & Infrastructure',
    status: 'ACTIVE',
    joinedDate: '2024-02-10',
    phone: '+1 (555) 345-1122',
    bio: 'Co-ordinator for Cloud Systems and Distributed Infrastructure.',
  },
];

export interface UniversityAnalyticsOverview {
  university: University;
  totalColleges: number;
  totalStudents: number;
  totalInstructors: number;
  totalCoordinators: number;
  totalAssessments: number;
  totalBatches: number;
  overallAverageScore: number;
  overallPassRate: number;
  activeLiveSessions: number;
  collegePerformance: {
    collegeId: string;
    collegeName: string;
    collegeCode: string;
    studentsCount: number;
    instructorsCount: number;
    avgScore: number;
    passRate: number;
    submissionsCount: number;
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  }[];
  departmentDistribution: {
    department: string;
    college: string;
    students: number;
    faculty: number;
    avgScore: number;
  }[];
  monthlyPerformanceTrend: {
    month: string;
    ACET: number;
    AIAC: number;
    SSCA: number;
    average: number;
  }[];
  recentActivity: {
    id: string;
    timestamp: string;
    collegeName: string;
    action: string;
    details: string;
    type: 'ASSESSMENT' | 'COLLEGE' | 'USER' | 'SYSTEM' | 'SECURITY';
  }[];
}

class UniversityService {
  private university: University = { ...DEFAULT_UNIVERSITY };
  private colleges: College[] = [...INITIAL_COLLEGES];
  private departments: Department[] = [...INITIAL_DEPARTMENTS];
  private coordinators: User[] = [...INITIAL_COORDINATORS];

  async getUniversity(): Promise<University> {
    await new Promise((r) => setTimeout(r, 60));
    return {
      ...this.university,
      totalCollegesCount: this.colleges.length,
      totalStudentsCount: this.colleges.reduce((acc, c) => acc + c.studentsCount, 0),
      totalFacultyCount: this.colleges.reduce((acc, c) => acc + c.instructorsCount, 0),
      totalCoordinatorsCount: this.colleges.reduce((acc, c) => acc + c.coordinatorsCount, 0),
    };
  }

  async updateUniversity(updates: Partial<University>): Promise<University> {
    await new Promise((r) => setTimeout(r, 100));
    this.university = { ...this.university, ...updates };
    return this.university;
  }

  async getColleges(): Promise<College[]> {
    await new Promise((r) => setTimeout(r, 80));
    return [...this.colleges];
  }

  async getCollegeById(id: string): Promise<College | undefined> {
    await new Promise((r) => setTimeout(r, 50));
    return this.colleges.find((c) => c.id === id);
  }

  async createCollege(data: Partial<College>): Promise<College> {
    await new Promise((r) => setTimeout(r, 150));
    const newCollege: College = {
      id: `college_00${this.colleges.length + 1}_${Date.now().toString().slice(-4)}`,
      universityId: 'univ_001',
      universityName: this.university.name,
      name: data.name || 'New Technical College',
      code: (data.code || 'NTC').toUpperCase(),
      slug: (data.name || 'new-college').toLowerCase().replace(/\s+/g, '-'),
      campusLocation: data.campusLocation || 'Tech Innovation Wing',
      deanName: data.deanName || 'Dr. Interim Dean',
      deanEmail: data.deanEmail || 'dean@codepulse.edu',
      departmentsCount: data.departments?.length || 2,
      departments: data.departments || ['Computer Science & Engineering', 'Software Systems'],
      coordinatorsCount: data.coordinatorsCount || 1,
      instructorsCount: data.instructorsCount || 12,
      studentsCount: data.studentsCount || 200,
      batchesCount: data.batchesCount || 4,
      assessmentsCount: 0,
      avgPerformanceScore: 80.0,
      status: data.status || 'ACTIVE',
      establishedYear: data.establishedYear || new Date().getFullYear(),
      contactEmail: data.contactEmail || 'contact@college.codepulse.edu',
      contactPhone: data.contactPhone || '+1 (555) 123-4567',
      website: data.website || 'https://college.codepulse.edu',
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.colleges.push(newCollege);
    return newCollege;
  }

  async updateCollege(id: string, updates: Partial<College>): Promise<College> {
    await new Promise((r) => setTimeout(r, 120));
    const idx = this.colleges.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('College not found');
    this.colleges[idx] = { ...this.colleges[idx], ...updates };
    return this.colleges[idx];
  }

  async toggleCollegeStatus(id: string): Promise<College> {
    await new Promise((r) => setTimeout(r, 100));
    const idx = this.colleges.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('College not found');
    const newStatus = this.colleges[idx].status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    this.colleges[idx] = { ...this.colleges[idx], status: newStatus };
    return this.colleges[idx];
  }

  async deleteCollege(id: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 120));
    this.colleges = this.colleges.filter((c) => c.id !== id);
    return true;
  }

  async getDepartments(collegeId?: string): Promise<Department[]> {
    await new Promise((r) => setTimeout(r, 60));
    if (collegeId) {
      return this.departments.filter((d) => d.collegeId === collegeId);
    }
    return [...this.departments];
  }

  async createDepartment(data: Partial<Department>): Promise<Department> {
    await new Promise((r) => setTimeout(r, 120));
    const college = this.colleges.find((c) => c.id === data.collegeId) || this.colleges[0];
    const newDept: Department = {
      id: `dept_${Date.now().toString().slice(-6)}`,
      collegeId: college.id,
      collegeName: college.name,
      universityId: 'univ_001',
      name: data.name || 'New Engineering Department',
      code: (data.code || 'ENG').toUpperCase(),
      headOfDepartment: data.headOfDepartment || 'Dr. Faculty Lead',
      hodEmail: data.hodEmail || 'hod@eng.codepulse.edu',
      coordinatorName: data.coordinatorName || 'Prof. Department Co-ordinator',
      coordinatorEmail: data.coordinatorEmail || 'coord@eng.codepulse.edu',
      facultyCount: data.facultyCount || 8,
      studentCount: data.studentCount || 120,
      batchesCount: data.batchesCount || 2,
      activeAssessmentsCount: 2,
      avgPassRate: 85.0,
      status: data.status || 'ACTIVE',
      description: data.description || 'Academic & laboratory computing curriculum.',
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.departments.push(newDept);
    return newDept;
  }

  async getCoordinators(collegeId?: string): Promise<User[]> {
    await new Promise((r) => setTimeout(r, 60));
    if (collegeId) {
      return this.coordinators.filter((c) => c.collegeId === collegeId);
    }
    return [...this.coordinators];
  }

  async getUniversityAnalytics(): Promise<UniversityAnalyticsOverview> {
    await new Promise((r) => setTimeout(r, 100));

    const totalStudents = this.colleges.reduce((acc, c) => acc + c.studentsCount, 0);
    const totalInstructors = this.colleges.reduce((acc, c) => acc + c.instructorsCount, 0);
    const totalCoordinators = this.colleges.reduce((acc, c) => acc + c.coordinatorsCount, 0);
    const totalAssessments = this.colleges.reduce((acc, c) => acc + c.assessmentsCount, 0);
    const totalBatches = this.colleges.reduce((acc, c) => acc + c.batchesCount, 0);

    const collegePerformance = this.colleges.map((c) => ({
      collegeId: c.id,
      collegeName: c.name,
      collegeCode: c.code,
      studentsCount: c.studentsCount,
      instructorsCount: c.instructorsCount,
      avgScore: c.avgPerformanceScore,
      passRate: Math.round(c.avgPerformanceScore * 0.96 * 10) / 10,
      submissionsCount: c.studentsCount * 14,
      status: c.status,
    }));

    const departmentDistribution = this.departments.map((d) => ({
      department: d.name,
      college: d.collegeName,
      students: d.studentCount,
      faculty: d.facultyCount,
      avgScore: d.avgPassRate,
    }));

    const monthlyPerformanceTrend = [
      { month: 'Mar', ACET: 82.4, AIAC: 80.1, SSCA: 78.5, average: 80.3 },
      { month: 'Apr', ACET: 84.1, AIAC: 82.0, SSCA: 79.4, average: 81.8 },
      { month: 'May', ACET: 85.9, AIAC: 83.5, SSCA: 80.8, average: 83.4 },
      { month: 'Jun', ACET: 87.2, AIAC: 84.6, SSCA: 81.5, average: 84.4 },
      { month: 'Jul', ACET: 88.0, AIAC: 85.0, SSCA: 82.0, average: 85.0 },
      { month: 'Aug', ACET: 88.4, AIAC: 85.1, SSCA: 82.6, average: 85.4 },
    ];

    const recentActivity = [
      {
        id: 'act_01',
        timestamp: '10 mins ago',
        collegeName: 'Apex College of Engineering & Technology',
        action: 'Assessment Evaluated',
        details: '142 students completed "Midterm DSA & Algorithms Master Test". Average score: 89.2%',
        type: 'ASSESSMENT' as const,
      },
      {
        id: 'act_02',
        timestamp: '45 mins ago',
        collegeName: 'Apex Institute of Advanced Computing & AI',
        action: 'New Batch Launched',
        details: 'Batch "Cohort 2025-Applied-AI" provisioned with 34 enrolled engineers.',
        type: 'COLLEGE' as const,
      },
      {
        id: 'act_03',
        timestamp: '2 hours ago',
        collegeName: 'School of Software Systems & Cloud Architecture',
        action: 'Proctoring Security Audit',
        details: 'AI Proctoring telemetry analyzed: 99.8% compliance rate across 68 IDE sessions.',
        type: 'SECURITY' as const,
      },
      {
        id: 'act_04',
        timestamp: '5 hours ago',
        collegeName: 'Apex College of Engineering & Technology',
        action: 'Faculty Onboarded',
        details: 'Dr. Elena Rostova designated as Lead Systems Algorithms Instructor.',
        type: 'USER' as const,
      },
      {
        id: 'act_05',
        timestamp: '1 day ago',
        collegeName: 'University Systemwide',
        action: 'Standardized Accreditation Report',
        details: 'Generated Fall 2025 ABET & Academic Progress compliance package.',
        type: 'SYSTEM' as const,
      },
    ];

    return {
      university: this.university,
      totalColleges: this.colleges.length,
      totalStudents,
      totalInstructors,
      totalCoordinators,
      totalAssessments,
      totalBatches,
      overallAverageScore: 85.4,
      overallPassRate: 91.8,
      activeLiveSessions: 8,
      collegePerformance,
      departmentDistribution,
      monthlyPerformanceTrend,
      recentActivity,
    };
  }
}

export const universityService = new UniversityService();
