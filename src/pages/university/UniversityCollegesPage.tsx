import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Users,
  GraduationCap,
  Network,
  ExternalLink,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  MapPin,
  Mail,
  Phone,
  Globe,
  Layers,
  ArrowUpRight,
  School,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { universityService } from '@/services/universityService';
import { College } from '@/types';

export const UniversityCollegesPage: React.FC = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    campusLocation: '',
    deanName: '',
    deanEmail: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    departmentsStr: 'Computer Science & Engineering, Information Technology, AI & Machine Learning',
  });

  const loadColleges = async () => {
    try {
      setLoading(true);
      const data = await universityService.getColleges();
      setColleges(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadColleges();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) return;

    const depts = formData.departmentsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingCollege) {
      await universityService.updateCollege(editingCollege.id, {
        name: formData.name,
        code: formData.code.toUpperCase(),
        campusLocation: formData.campusLocation,
        deanName: formData.deanName,
        deanEmail: formData.deanEmail,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        website: formData.website,
        departments: depts,
        departmentsCount: depts.length,
      });
    } else {
      await universityService.createCollege({
        name: formData.name,
        code: formData.code.toUpperCase(),
        campusLocation: formData.campusLocation,
        deanName: formData.deanName,
        deanEmail: formData.deanEmail,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        website: formData.website,
        departments: depts,
        departmentsCount: depts.length,
        studentsCount: 250,
        instructorsCount: 16,
        coordinatorsCount: 1,
        batchesCount: 4,
      });
    }

    setIsCreateModalOpen(false);
    setEditingCollege(null);
    resetForm();
    await loadColleges();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      campusLocation: '',
      deanName: '',
      deanEmail: '',
      contactEmail: '',
      contactPhone: '',
      website: '',
      departmentsStr: 'Computer Science & Engineering, Information Technology, AI & Machine Learning',
    });
  };

  const handleEditClick = (c: College) => {
    setEditingCollege(c);
    setFormData({
      name: c.name,
      code: c.code,
      campusLocation: c.campusLocation,
      deanName: c.deanName,
      deanEmail: c.deanEmail,
      contactEmail: c.contactEmail,
      contactPhone: c.contactPhone,
      website: c.website || '',
      departmentsStr: c.departments.join(', '),
    });
    setIsCreateModalOpen(true);
  };

  const handleToggleStatus = async (id: string) => {
    await universityService.toggleCollegeStatus(id);
    await loadColleges();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this college from the university registry?')) {
      await universityService.deleteCollege(id);
      await loadColleges();
    }
  };

  const filteredColleges = colleges.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.deanName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            Affiliated Colleges & Campuses
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Manage constituent engineering colleges, deans, accreditation telemetry, and academic departments.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            resetForm();
            setEditingCollege(null);
            setIsCreateModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add New College
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search college name, code, or dean..."
            className="w-full pl-9 pr-4 py-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--border-focus)] transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <span className="text-xs text-[var(--text-secondary)]">Status:</span>
          {(['ALL', 'ACTIVE', 'INACTIVE'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                statusFilter === s
                  ? 'bg-[var(--bg-surface-active)] text-[var(--text-primary)] font-bold border border-[var(--border-default)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* College Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-72 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl" />
          ))}
        </div>
      ) : filteredColleges.length === 0 ? (
        <Card className="p-12 text-center">
          <Building2 className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
          <h3 className="font-bold text-[var(--text-primary)]">No colleges match the filter</h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Try adjusting your search criteria or register a new constituent college.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredColleges.map((college) => (
            <Card key={college.id} className="flex flex-col justify-between hover:border-[var(--border-hover)] transition-all">
              <div className="p-5 space-y-4">
                {/* College Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold text-base shrink-0">
                      {college.code.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--bg-surface-secondary)] border border-[var(--border-default)]">
                          {college.code}
                        </span>
                        <Badge variant={college.status === 'ACTIVE' ? 'success' : 'default'} size="sm">
                          {college.status}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-sm text-[var(--text-primary)] mt-1 leading-snug">
                        {college.name}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Location & Dean */}
                <div className="space-y-1.5 text-xs text-[var(--text-secondary)] pt-1 border-t border-[var(--border-default)]">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                    <span className="truncate">{college.campusLocation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <School className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                    <span className="truncate">Dean: <strong className="text-[var(--text-primary)]">{college.deanName}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                    <span className="truncate">{college.contactEmail}</span>
                  </div>
                </div>

                {/* Key Telemetry Stats Grid */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] text-center">
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)]">Students</p>
                    <p className="font-bold text-xs text-[var(--text-primary)] mt-0.5">{college.studentsCount}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)]">Faculty</p>
                    <p className="font-bold text-xs text-[var(--text-primary)] mt-0.5">{college.instructorsCount}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)]">Avg Score</p>
                    <p className="font-bold text-xs text-amber-600 dark:text-amber-400 mt-0.5">{college.avgPerformanceScore}%</p>
                  </div>
                </div>

                {/* Department Tags */}
                <div>
                  <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wider mb-1.5">
                    Departments ({college.departments.length})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {college.departments.slice(0, 3).map((d) => (
                      <span
                        key={d}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-secondary)] truncate max-w-[200px]"
                      >
                        {d}
                      </span>
                    ))}
                    {college.departments.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[var(--bg-surface-secondary)] text-[var(--text-muted)]">
                        +{college.departments.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 border-t border-[var(--border-default)] bg-[var(--bg-surface-secondary)]/50 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEditClick(college)}
                    className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-surface-hover)] transition cursor-pointer"
                    title="Edit College Information"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleToggleStatus(college.id)}
                    className="p-1.5 text-[var(--text-muted)] hover:text-amber-500 rounded-lg hover:bg-[var(--bg-surface-hover)] transition cursor-pointer"
                    title={college.status === 'ACTIVE' ? 'Set Inactive' : 'Activate'}
                  >
                    {college.status === 'ACTIVE' ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
                  </button>
                  <button
                    onClick={() => handleDelete(college.id)}
                    className="p-1.5 text-[var(--text-muted)] hover:text-rose-500 rounded-lg hover:bg-[var(--bg-surface-hover)] transition cursor-pointer"
                    title="Delete College"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <Link to={`/university/colleges/${college.id}`}>
                  <Button variant="primary" size="sm" className="h-7 text-xs">
                    View Profile
                    <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal: Add or Edit College */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[var(--text-primary)]">
                    {editingCollege ? 'Edit College Credentials' : 'Register Constituent College'}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Affiliated institutional layer under Apex University System
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-medium text-[var(--text-secondary)]">College Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Apex College of Technology"
                    className="w-full px-3 py-2 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--border-focus)]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-[var(--text-secondary)]">Code (3-5 letters) *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. ACET"
                    className="w-full px-3 py-2 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-lg text-[var(--text-primary)] font-mono focus:outline-none focus:ring-1 focus:ring-[var(--border-focus)]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-[var(--text-secondary)]">Campus Location</label>
                <input
                  type="text"
                  value={formData.campusLocation}
                  onChange={(e) => setFormData({ ...formData, campusLocation: e.target.value })}
                  placeholder="e.g. North Science & Tech Quarter, Building 4"
                  className="w-full px-3 py-2 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--border-focus)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-[var(--text-secondary)]">Dean Name</label>
                  <input
                    type="text"
                    value={formData.deanName}
                    onChange={(e) => setFormData({ ...formData, deanName: e.target.value })}
                    placeholder="e.g. Dr. Richard Thorne"
                    className="w-full px-3 py-2 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--border-focus)]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-[var(--text-secondary)]">Dean Email</label>
                  <input
                    type="email"
                    value={formData.deanEmail}
                    onChange={(e) => setFormData({ ...formData, deanEmail: e.target.value })}
                    placeholder="e.g. dean@eng.codepulse.edu"
                    className="w-full px-3 py-2 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--border-focus)]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-[var(--text-secondary)]">Departments (comma separated)</label>
                <textarea
                  rows={2}
                  value={formData.departmentsStr}
                  onChange={(e) => setFormData({ ...formData, departmentsStr: e.target.value })}
                  placeholder="Computer Science & Engineering, Information Technology, AI & Machine Learning"
                  className="w-full px-3 py-2 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--border-focus)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-[var(--text-secondary)]">Admissions Email</label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    placeholder="contact@college.codepulse.edu"
                    className="w-full px-3 py-2 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-lg text-[var(--text-primary)]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-[var(--text-secondary)]">Official Website</label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://college.codepulse.edu"
                    className="w-full px-3 py-2 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-lg text-[var(--text-primary)]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[var(--border-default)]">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  {editingCollege ? 'Save Changes' : 'Register College'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
