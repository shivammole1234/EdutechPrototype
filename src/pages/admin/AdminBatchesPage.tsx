import React, { useEffect, useState } from 'react';
import {
  Plus,
  Layers,
  Calendar,
  Users,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Search,
  BookOpen,
  Clock,
  ArrowRightLeft,
  X,
} from 'lucide-react';
import { Batch, Cohort, StudentBatch, User } from '@/types';
import { batchService } from '@/services/batchService';
import { userService } from '@/services/userService';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { formatDate } from '@/lib/utils';
import { CohortConnectivityMap } from '@/components/cohorts/CohortConnectivityMap';
import { CreateCohortModal } from '@/components/cohorts/CreateCohortModal';
import { CreateStudentBatchModal } from '@/components/cohorts/CreateStudentBatchModal';
import { CohortDetailModal } from '@/components/cohorts/CohortDetailModal';

export const AdminBatchesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'COHORTS' | 'STUDENT_BATCHES' | 'TOPOLOGY'>('COHORTS');
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [studentBatches, setStudentBatches] = useState<StudentBatch[]>([]);
  const [instructors, setInstructors] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCohortDetail, setSelectedCohortDetail] = useState<Cohort | null>(null);
  const [selectedBatchDetail, setSelectedBatchDetail] = useState<StudentBatch | null>(null);

  // Modals
  const [isCreateCohortOpen, setIsCreateCohortOpen] = useState(false);
  const [isCreateBatchOpen, setIsCreateBatchOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cohortsData, batchesData, instructorsData] = await Promise.all([
        batchService.getCohorts(),
        batchService.getStudentBatches(),
        userService.getInstructors(),
      ]);
      setCohorts(cohortsData);
      setStudentBatches(batchesData);
      setInstructors(instructorsData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCohort = async (newCohortData: Partial<Cohort>) => {
    await batchService.createCohort(newCohortData);
    await loadData();
  };

  const handleCreateStudentBatch = async (newBatchData: Partial<StudentBatch>) => {
    await batchService.createStudentBatch(newBatchData);
    await loadData();
  };

  const filteredCohorts = cohorts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.programTrack?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBatches = studentBatches.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.cohortName && b.cohortName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Aggregated Stats
  const totalEnrolledStudents = cohorts.reduce((acc, c) => acc + (c.totalStudentCount || c.studentCount || 0), 0);
  const totalActiveBatches = studentBatches.length;
  const totalInstructorsCount = instructors.length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#101011] border border-[#27272a]">
        <div>
          <h2 className="text-xl font-bold text-[#fafafa] tracking-tight">Academic Cohorts & Batches</h2>
          <p className="text-xs sm:text-sm text-[#a1a1aa] mt-0.5">
            Manage academic cohorts, faculty allocations, and assigned student batches.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={() => setIsCreateBatchOpen(true)}>
            <Users className="w-4 h-4 mr-1.5 text-[#fafafa]" />
            Add Batch
          </Button>
          <Button variant="primary" size="sm" onClick={() => setIsCreateCohortOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Create Cohort
          </Button>
        </div>
      </div>

      {/* Tabs & Search Bar Card */}
      <Card className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#18181b] border border-[#27272a] rounded-2xl shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('COHORTS')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 border cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#3f3f46] select-none ${
              activeTab === 'COHORTS'
                ? 'bg-[#27272a] text-[#fafafa] border-[#3f3f46] shadow-xs'
                : 'bg-transparent text-[#a1a1aa] border-transparent hover:text-[#fafafa] hover:bg-[#27272a]/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#fafafa]" />
            Cohorts ({cohorts.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('STUDENT_BATCHES')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 border cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#3f3f46] select-none ${
              activeTab === 'STUDENT_BATCHES'
                ? 'bg-[#27272a] text-[#fafafa] border-[#3f3f46] shadow-xs'
                : 'bg-transparent text-[#a1a1aa] border-transparent hover:text-[#fafafa] hover:bg-[#27272a]/60'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#fafafa]" />
            Student Batches ({studentBatches.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('TOPOLOGY')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 border cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#3f3f46] select-none ${
              activeTab === 'TOPOLOGY'
                ? 'bg-[#27272a] text-[#fafafa] border-[#3f3f46] shadow-xs'
                : 'bg-transparent text-[#a1a1aa] border-transparent hover:text-[#fafafa] hover:bg-[#27272a]/60'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-[#fafafa]" />
            Topology
          </button>
        </div>

        {activeTab !== 'TOPOLOGY' && (
          <div className="w-full sm:w-80">
            <Input
              placeholder={activeTab === 'COHORTS' ? 'Search cohorts...' : 'Search batches...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4 text-[#71717a]" />}
            />
          </div>
        )}
      </Card>

      {/* TAB 1: Academic Cohorts */}
      {activeTab === 'COHORTS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCohorts.map((cohort) => {
              const assignedBatches = studentBatches.filter((b) =>
                cohort.assignedBatchIds?.includes(b.id)
              );

              const isActive = cohort.status === 'ACTIVE';

              return (
                <div
                  key={cohort.id}
                  className={`p-5 flex flex-col justify-between space-y-4 bg-[#18181b] border rounded-2xl transition-all duration-200 shadow-sm group hover:border-[#3f3f46] hover:bg-[#18181b]/95 ${
                    isActive
                      ? 'border-[#3f3f46] ring-1 ring-[#3f3f46]/50 shadow-md shadow-black/40'
                      : 'border-[#27272a] opacity-90'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={cohort.instructorAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'}
                          alt={cohort.instructorName}
                          className="w-12 h-12 rounded-full object-cover border border-[#27272a] group-hover:border-[#3f3f46] transition-colors shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-[#fafafa] text-sm truncate group-hover:text-white transition-colors">{cohort.name}</h4>
                          <p className="text-xs text-[#a1a1aa] truncate font-mono">
                            <span className="text-[#fafafa] font-semibold">{cohort.code}</span> • <span className="text-[#71717a]">{cohort.instructorName}</span>
                          </p>
                        </div>
                      </div>
                      <Badge variant={isActive ? 'success' : 'default'} size="sm">
                        {isActive ? 'Active' : cohort.status}
                      </Badge>
                    </div>

                    <p className="text-xs text-[#a1a1aa] line-clamp-2 leading-relaxed">
                      {cohort.description || 'Comprehensive curriculum track and live lecture routing.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#27272a] grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 bg-[#09090b] rounded-xl border border-[#27272a] space-y-1">
                      <span className="text-[#71717a] flex items-center gap-1.5 text-[11px]">
                        <BookOpen className="w-3.5 h-3.5 text-[#fafafa]" /> Batches
                      </span>
                      <span className="font-bold text-[#fafafa] font-mono text-sm block">
                        {assignedBatches.length} {assignedBatches.length === 1 ? 'Batch' : 'Batches'}
                      </span>
                    </div>
                    <div className="p-3 bg-[#09090b] rounded-xl border border-[#27272a] space-y-1">
                      <span className="text-[#71717a] flex items-center gap-1.5 text-[11px]">
                        <Users className="w-3.5 h-3.5 text-[#fafafa]" /> Students
                      </span>
                      <span className="font-bold text-[#fafafa] font-mono text-sm block">
                        {cohort.totalStudentCount || cohort.studentCount} Learners
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#09090b] rounded-xl border border-[#27272a] space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#71717a]">Curriculum Progress</span>
                      <span className="font-mono font-bold text-[#fafafa]">{cohort.progress}%</span>
                    </div>
                    <div className="w-full bg-[#18181b] rounded-full h-1.5 overflow-hidden border border-[#27272a]">
                      <div
                        className="bg-[#fafafa] h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${cohort.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#27272a] flex items-center justify-between">
                    <span className="text-[11px] text-[#71717a] font-mono">
                      {formatDate(cohort.startDate)} - {formatDate(cohort.endDate)}
                    </span>
                    <Button
                      variant={isActive ? 'secondary' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCohortDetail(cohort)}
                    >
                      View Cohort
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Student Batches */}
      {activeTab === 'STUDENT_BATCHES' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBatches.map((batch) => {
              const connectedCohort = cohorts.find(
                (c) => c.id === batch.cohortId || c.assignedBatchIds?.includes(batch.id)
              );

              return (
                <div
                  key={batch.id}
                  className="p-5 flex flex-col justify-between space-y-4 bg-[#18181b] border border-[#27272a] rounded-2xl transition-all duration-200 shadow-sm group hover:border-[#3f3f46] hover:bg-[#18181b]/95"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="font-bold text-[#fafafa] text-sm truncate group-hover:text-white transition-colors">{batch.name}</h4>
                        <p className="text-xs text-[#a1a1aa] truncate font-mono">
                          <span className="text-[#fafafa] font-semibold">{batch.code}</span> • <span className="text-[#71717a]">{batch.section}</span>
                        </p>
                      </div>
                      <Badge variant="success" size="sm">Active</Badge>
                    </div>

                    <p className="text-xs text-[#a1a1aa] line-clamp-2 leading-relaxed">
                      {batch.description || 'Enrolled student group for scheduled live lectures.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#27272a] grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 bg-[#09090b] rounded-xl border border-[#27272a] space-y-1">
                      <span className="text-[#71717a] flex items-center gap-1.5 text-[11px]">
                        <Layers className="w-3.5 h-3.5 text-[#fafafa]" /> Cohort
                      </span>
                      <span className="font-bold text-[#fafafa] text-xs truncate block">
                        {connectedCohort ? connectedCohort.name : 'Unassigned'}
                      </span>
                    </div>
                    <div className="p-3 bg-[#09090b] rounded-xl border border-[#27272a] space-y-1">
                      <span className="text-[#71717a] flex items-center gap-1.5 text-[11px]">
                        <Users className="w-3.5 h-3.5 text-[#fafafa]" /> Students
                      </span>
                      <span className="font-bold text-[#fafafa] font-mono text-sm block">
                        {batch.studentCount} Learners
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#27272a] flex items-center justify-between">
                    <span className="text-[11px] text-[#71717a] font-mono">
                      Created {formatDate(batch.createdAt)}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => setSelectedBatchDetail(batch)}>
                      View Batch
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Topology Map */}
      {activeTab === 'TOPOLOGY' && (
        <CohortConnectivityMap
          cohorts={cohorts}
          studentBatches={studentBatches}
          instructors={instructors}
        />
      )}

      {/* Cohort Profile Detail Modal */}
      <CohortDetailModal
        isOpen={!!selectedCohortDetail}
        onClose={() => setSelectedCohortDetail(null)}
        cohort={selectedCohortDetail}
        studentBatches={studentBatches}
        instructors={instructors}
        onOpenBatchDetail={(batch) => {
          setSelectedCohortDetail(null);
          setSelectedBatchDetail(batch);
        }}
      />

      {/* Student Batch Detail Modal */}
      {selectedBatchDetail && (
        <Modal
          isOpen={!!selectedBatchDetail}
          onClose={() => setSelectedBatchDetail(null)}
          title="Student Batch Profile"
        >
          <div className="space-y-4 text-xs">
            <div className="pb-4 border-b border-[#27272a]">
              <h4 className="text-base font-bold text-[#fafafa]">{selectedBatchDetail.name}</h4>
              <p className="text-[#a1a1aa] font-mono">{selectedBatchDetail.code} • {selectedBatchDetail.section}</p>
            </div>

            <p className="text-[#a1a1aa] text-sm leading-relaxed">
              {selectedBatchDetail.description || 'Discrete cohort group participating in scheduled live lectures and assignments.'}
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-[#09090b] rounded-xl border border-[#27272a] space-y-1">
                <span className="text-[#71717a] block text-[11px]">Enrolled Learners</span>
                <span className="font-semibold text-[#fafafa] font-mono">{selectedBatchDetail.studentCount} Students</span>
              </div>
              <div className="p-3 bg-[#09090b] rounded-xl border border-[#27272a] space-y-1">
                <span className="text-[#71717a] block text-[11px]">Assigned Cohort</span>
                <span className="font-semibold text-[#fafafa] truncate block">
                  {selectedBatchDetail.cohortName || 'Unassigned'}
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Cohort Modal */}
      <CreateCohortModal
        isOpen={isCreateCohortOpen}
        onClose={() => setIsCreateCohortOpen(false)}
        instructors={instructors}
        studentBatches={studentBatches}
        onCohortCreated={handleCreateCohort}
        onOpenCreateBatch={() => {
          setIsCreateCohortOpen(false);
          setIsCreateBatchOpen(true);
        }}
      />

      {/* Create Student Batch Modal */}
      <CreateStudentBatchModal
        isOpen={isCreateBatchOpen}
        onClose={() => setIsCreateBatchOpen(false)}
        cohorts={cohorts}
        onBatchCreated={handleCreateStudentBatch}
      />
    </div>
  );
};

