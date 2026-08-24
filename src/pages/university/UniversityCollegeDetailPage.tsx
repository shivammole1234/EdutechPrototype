import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  Users,
  GraduationCap,
  Network,
  Layers,
  FileCode2,
  MapPin,
  Mail,
  Phone,
  Globe,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Award,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { universityService } from '@/services/universityService';
import { College, Department, User } from '@/types';

export const UniversityCollegeDetailPage: React.FC = () => {
  const { collegeId } = useParams<{ collegeId: string }>();
  const navigate = useNavigate();
  const [college, setCollege] = useState<College | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [coordinators, setCoordinators] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'departments' | 'coordinators' | 'batches'>('overview');

  useEffect(() => {
    async function load() {
      if (!collegeId) return;
      try {
        setLoading(true);
        const col = await universityService.getCollegeById(collegeId);
        if (!col) {
          navigate('/university/colleges');
          return;
        }
        setCollege(col);
        const [depts, coords] = await Promise.all([
          universityService.getDepartments(collegeId),
          universityService.getCoordinators(collegeId),
        ]);
        setDepartments(depts);
        setCoordinators(coords);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [collegeId, navigate]);

  if (loading || !college) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 w-48 bg-[var(--bg-surface-secondary)] rounded-md" />
        <div className="h-36 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back Link & Breadcrumb */}
      <div>
        <Link
          to="/university/colleges"
          className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-2 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Affiliated Colleges
        </Link>
      </div>

      {/* College Profile Header Banner */}
      <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold text-2xl shrink-0">
            {college.code.slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                {college.name}
              </h1>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[var(--bg-surface-secondary)] border border-[var(--border-default)]">
                {college.code}
              </span>
              <Badge variant={college.status === 'ACTIVE' ? 'success' : 'default'} size="sm">
                {college.status}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)] mt-2 flex-wrap">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                {college.campusLocation}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                Dean: <strong className="text-[var(--text-primary)] font-medium">{college.deanName}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                {college.contactEmail}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Badge variant="warning" size="md" className="px-3 py-1.5 text-xs flex items-center gap-1.5">
            <Award className="w-4 h-4" />
            ABET Tier-1 Accredited
          </Badge>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Enrolled Students"
          value={college.studentsCount}
          change="+12% this cohort"
          changeType="positive"
          icon={<GraduationCap className="w-5 h-5 text-blue-500" />}
          subtitle="Across all departments"
        />
        <StatCard
          title="Faculty Instructors"
          value={college.instructorsCount}
          change="100% certified"
          changeType="positive"
          icon={<Users className="w-5 h-5 text-purple-500" />}
          subtitle="Full-time & adjunct"
        />
        <StatCard
          title="Departments"
          value={college.departmentsCount}
          change="3 specialization tracks"
          changeType="neutral"
          icon={<Network className="w-5 h-5 text-amber-500" />}
          subtitle="Academic units"
        />
        <StatCard
          title="Average Score"
          value={`${college.avgPerformanceScore}%`}
          change="+2.8% vs last month"
          changeType="positive"
          icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
          subtitle="Systemwide benchmark"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[var(--border-default)] gap-6">
        {[
          { key: 'overview', label: 'Institutional Overview' },
          { key: 'departments', label: `Departments (${departments.length})` },
          { key: 'coordinators', label: `Co-ordinators (${coordinators.length})` },
          { key: 'batches', label: 'Active Cohorts & Batches' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`pb-3 text-xs font-semibold transition-colors cursor-pointer relative ${
              activeTab === tab.key
                ? 'text-[var(--text-primary)] border-b-2 border-amber-500 font-bold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Academic Program Matrix</CardTitle>
            </CardHeader>
            <div className="p-4 space-y-4">
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {college.name} is a premier constituent institution under the Apex Technical University System. 
                The campus features advanced cloud-sandboxed computing labs, distributed systems clusters, and dedicated AI development suites.
              </p>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                  Accreditation & Governance Telemetry
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[var(--bg-surface-secondary)] border border-[var(--border-default)]">
                    <p className="text-[10px] text-[var(--text-muted)]">Chancellor Representative</p>
                    <p className="font-semibold text-xs text-[var(--text-primary)] mt-0.5">Dean {college.deanName}</p>
                    <p className="text-[10px] text-[var(--text-secondary)]">{college.deanEmail}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--bg-surface-secondary)] border border-[var(--border-default)]">
                    <p className="text-[10px] text-[var(--text-muted)]">Campus Registry</p>
                    <p className="font-semibold text-xs text-[var(--text-primary)] mt-0.5">{college.campusLocation}</p>
                    <p className="text-[10px] text-[var(--text-secondary)]">Phone: {college.contactPhone}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Institutional Contact</CardTitle>
            </CardHeader>
            <div className="p-4 space-y-3 text-xs text-[var(--text-secondary)]">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[var(--text-muted)]" />
                <a href={college.website} target="_blank" rel="noreferrer" className="text-amber-600 hover:underline">
                  {college.website || 'Official Campus Portal'}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[var(--text-muted)]" />
                <span>{college.contactEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[var(--text-muted)]" />
                <span>{college.contactPhone}</span>
              </div>
              <div className="pt-3 border-t border-[var(--border-default)]">
                <p className="text-[10px] text-[var(--text-muted)]">Established</p>
                <p className="font-semibold text-[var(--text-primary)]">{college.establishedYear || 1996}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: Departments */}
      {activeTab === 'departments' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept) => (
              <Card key={dept.id} className="p-4 space-y-3 hover:border-[var(--border-hover)] transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--bg-surface-secondary)] border border-[var(--border-default)]">
                      {dept.code}
                    </span>
                    <h4 className="font-bold text-sm text-[var(--text-primary)] mt-1">{dept.name}</h4>
                  </div>
                  <Badge variant="success" size="sm">
                    {dept.status}
                  </Badge>
                </div>

                <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                  {dept.description}
                </p>

                <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-[var(--bg-surface-secondary)] text-center text-xs">
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)]">Students</p>
                    <p className="font-bold text-[var(--text-primary)]">{dept.studentCount}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)]">Pass Rate</p>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400">{dept.avgPassRate}%</p>
                  </div>
                </div>

                <div className="text-[11px] text-[var(--text-secondary)] space-y-1 pt-1 border-t border-[var(--border-default)]">
                  <p>HOD: <strong className="text-[var(--text-primary)]">{dept.headOfDepartment}</strong></p>
                  <p>Co-ordinator: <strong className="text-[var(--text-primary)]">{dept.coordinatorName}</strong></p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Coordinators */}
      {activeTab === 'coordinators' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coordinators.map((c) => (
            <Card key={c.id} className="p-4 flex items-start gap-4">
              <img
                src={c.avatar}
                alt={c.name}
                className="w-12 h-12 rounded-xl object-cover border border-[var(--border-default)] shrink-0"
              />
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[var(--text-primary)]">{c.name}</h4>
                  <Badge variant="purple" size="sm">
                    CO-ORDINATOR
                  </Badge>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">{c.departmentName || 'Computer Science & Engineering'}</p>
                <p className="text-xs text-[var(--text-muted)]">{c.email}</p>
                <p className="text-xs text-[var(--text-secondary)] pt-1">{c.bio}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tab 4: Batches */}
      {activeTab === 'batches' && (
        <Card className="p-6 text-center">
          <Layers className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-2" />
          <h3 className="font-bold text-sm text-[var(--text-primary)]">16 Active Cohort Batches Provisioned</h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Managed directly by the assigned Department Co-ordinators in this college.
          </p>
        </Card>
      )}
    </div>
  );
};
