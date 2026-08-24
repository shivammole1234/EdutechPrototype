import React, { useEffect, useState } from 'react';
import {
  Network,
  Plus,
  Search,
  Filter,
  Users,
  GraduationCap,
  Building2,
  FileCode2,
  CheckCircle,
  TrendingUp,
  School,
  ArrowUpRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { universityService } from '@/services/universityService';
import { Department, College } from '@/types';

export const UniversityDepartmentsPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    collegeId: '',
    name: '',
    code: '',
    headOfDepartment: '',
    hodEmail: '',
    coordinatorName: '',
    coordinatorEmail: '',
    description: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [depts, cols] = await Promise.all([
        universityService.getDepartments(),
        universityService.getColleges(),
      ]);
      setDepartments(depts);
      setColleges(cols);
      if (cols.length > 0 && !formData.collegeId) {
        setFormData((prev) => ({ ...prev, collegeId: cols[0].id }));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) return;

    await universityService.createDepartment({
      collegeId: formData.collegeId,
      name: formData.name,
      code: formData.code.toUpperCase(),
      headOfDepartment: formData.headOfDepartment,
      hodEmail: formData.hodEmail,
      coordinatorName: formData.coordinatorName,
      coordinatorEmail: formData.coordinatorEmail,
      description: formData.description,
      studentCount: 140,
      facultyCount: 10,
      batchesCount: 3,
    });

    setIsCreateModalOpen(false);
    setFormData({
      collegeId: colleges[0]?.id || '',
      name: '',
      code: '',
      headOfDepartment: '',
      hodEmail: '',
      coordinatorName: '',
      coordinatorEmail: '',
      description: '',
    });
    await loadData();
  };

  const filteredDepts = departments.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.collegeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.headOfDepartment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCollege = selectedCollegeId === 'ALL' || d.collegeId === selectedCollegeId;
    return matchesSearch && matchesCollege;
  });

  const totalStudents = departments.reduce((acc, d) => acc + d.studentCount, 0);
  const totalFaculty = departments.reduce((acc, d) => acc + d.facultyCount, 0);
  const avgPass = Math.round((departments.reduce((acc, d) => acc + d.avgPassRate, 0) / (departments.length || 1)) * 10) / 10;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            Academic Departments Directory
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Systemwide academic departments across all constituent technical colleges.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Department
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Departments"
          value={departments.length}
          change="Across 3 colleges"
          changeType="neutral"
          icon={<Network className="w-5 h-5 text-amber-500" />}
          subtitle="Specialization units"
        />
        <StatCard
          title="Department Students"
          value={totalStudents.toLocaleString()}
          change="+18% YoY"
          changeType="positive"
          icon={<GraduationCap className="w-5 h-5 text-blue-500" />}
          subtitle="Active undergraduates"
        />
        <StatCard
          title="Department Faculty"
          value={totalFaculty}
          change="100% Ph.D / Master"
          changeType="positive"
          icon={<Users className="w-5 h-5 text-purple-500" />}
          subtitle="Instructional leads"
        />
        <StatCard
          title="Avg Pass Benchmark"
          value={`${avgPass}%`}
          change="+2.4% standard delta"
          changeType="positive"
          icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
          subtitle="Code evaluation score"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search department, college, or HOD..."
            className="w-full pl-9 pr-4 py-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--border-focus)] transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          <Filter className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <span className="text-xs text-[var(--text-secondary)]">College:</span>
          <button
            onClick={() => setSelectedCollegeId('ALL')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              selectedCollegeId === 'ALL'
                ? 'bg-[var(--bg-surface-active)] text-[var(--text-primary)] font-bold border border-[var(--border-default)]'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
            }`}
          >
            All Colleges
          </button>
          {colleges.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCollegeId(c.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                selectedCollegeId === c.id
                  ? 'bg-[var(--bg-surface-active)] text-[var(--text-primary)] font-bold border border-[var(--border-default)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
              }`}
            >
              {c.code}
            </button>
          ))}
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepts.map((dept) => (
          <Card key={dept.id} className="p-5 flex flex-col justify-between hover:border-[var(--border-hover)] transition-all space-y-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--bg-surface-secondary)] border border-[var(--border-default)]">
                    {dept.code}
                  </span>
                  <h3 className="font-bold text-sm text-[var(--text-primary)] mt-1">{dept.name}</h3>
                </div>
                <Badge variant="success" size="sm">
                  {dept.status}
                </Badge>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                <Building2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="font-medium text-[var(--text-primary)] truncate">{dept.collegeName}</span>
              </div>

              <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                {dept.description}
              </p>

              {/* Stats Strip */}
              <div className="grid grid-cols-3 gap-2 p-2 rounded-xl bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] text-center text-xs">
                <div>
                  <p className="text-[10px] text-[var(--text-muted)]">Students</p>
                  <p className="font-bold text-[var(--text-primary)]">{dept.studentCount}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[var(--text-muted)]">Faculty</p>
                  <p className="font-bold text-[var(--text-primary)]">{dept.facultyCount}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[var(--text-muted)]">Pass Rate</p>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">{dept.avgPassRate}%</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border-default)] text-xs text-[var(--text-secondary)] space-y-1">
              <p>Head of Dept: <strong className="text-[var(--text-primary)]">{dept.headOfDepartment}</strong></p>
              <p>Co-ordinator: <strong className="text-purple-600 dark:text-purple-400">{dept.coordinatorName}</strong></p>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal: Add Department */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Network className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[var(--text-primary)]">
                    Create Academic Department
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Assign to a constituent technical college
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-[var(--text-secondary)]">Affiliated College *</label>
                <select
                  value={formData.collegeId}
                  onChange={(e) => setFormData({ ...formData, collegeId: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--border-focus)]"
                >
                  {colleges.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-medium text-[var(--text-secondary)]">Department Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Cybersecurity & Cryptography"
                    className="w-full px-3 py-2 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-lg text-[var(--text-primary)] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-[var(--text-secondary)]">Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. CYBER"
                    className="w-full px-3 py-2 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-lg text-[var(--text-primary)] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-[var(--text-secondary)]">Head of Department (HOD)</label>
                  <input
                    type="text"
                    value={formData.headOfDepartment}
                    onChange={(e) => setFormData({ ...formData, headOfDepartment: e.target.value })}
                    placeholder="Dr. Nathan Reed"
                    className="w-full px-3 py-2 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-lg text-[var(--text-primary)]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-[var(--text-secondary)]">Department Co-ordinator</label>
                  <input
                    type="text"
                    value={formData.coordinatorName}
                    onChange={(e) => setFormData({ ...formData, coordinatorName: e.target.value })}
                    placeholder="Prof. Tariq Al-Mansoor"
                    className="w-full px-3 py-2 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-lg text-[var(--text-primary)]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-[var(--text-secondary)]">Curriculum Focus / Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Focus areas, specialized lab compute infrastructure, and target competencies..."
                  className="w-full px-3 py-2 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-lg text-[var(--text-primary)]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[var(--border-default)]">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Create Department
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
