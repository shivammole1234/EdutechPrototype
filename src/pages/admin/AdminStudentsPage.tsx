import React, { useEffect, useState } from 'react';
import { Search, Plus, UserPlus, Filter, MoreVertical, CheckCircle, XCircle, Mail, Phone } from 'lucide-react';
import { User } from '@/types';
import { userService } from '@/services/userService';
import { batchService } from '@/services/batchService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { formatDate } from '@/lib/utils';

export const AdminStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', email: '', batchName: 'Full Stack & DSA Cohort 2025-A', phone: '' });
  const [loading, setLoading] = useState(true);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await userService.getStudents();
      setStudents(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleToggleStatus = async (student: User) => {
    const nextStatus = student.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await userService.updateStudent(student.id, { status: nextStatus });
    loadStudents();
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.email) return;
    await userService.createStudent({
      ...newStudent,
      role: 'STUDENT',
      performanceScore: 85,
    });
    setIsAddModalOpen(false);
    setNewStudent({ name: '', email: '', batchName: 'Full Stack & DSA Cohort 2025-A', phone: '' });
    loadStudents();
  };

  const filteredStudents = students.filter((st) => {
    const matchesSearch =
      st.name.toLowerCase().includes(search.toLowerCase()) ||
      st.email.toLowerCase().includes(search.toLowerCase()) ||
      (st.batchName && st.batchName.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || st.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Student Directory</h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
            Manage student enrollments, cohort assignments, and activity statuses.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsAddModalOpen(true)}>
          <UserPlus className="w-4 h-4 mr-1.5" />
          Enroll New Student
        </Button>
      </div>

      {/* Filters Bar */}
      <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search by name, email, cohort..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4 text-[var(--text-muted)]" />}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[var(--text-muted)] font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)] cursor-pointer focus:outline-none focus:border-[var(--border-hover)]"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          <span className="text-xs text-[var(--text-muted)] ml-2 font-mono">
            {filteredStudents.length} Students
          </span>
        </div>
      </Card>

      {/* Student Table */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[var(--text-primary)]">
            <thead className="bg-[var(--bg-surface-secondary)] border-b border-[var(--border-default)] text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
              <tr>
                <th className="py-3 px-4 font-semibold">Student Name</th>
                <th className="py-3 px-4 font-semibold">Assigned Cohort</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Performance</th>
                <th className="py-3 px-4 font-semibold">Joined Date</th>
                <th className="py-3 px-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-default)]">
              {filteredStudents.map((st) => (
                <tr key={st.id} className="hover:bg-[var(--bg-surface-hover)] transition duration-150">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={st.avatar}
                        alt={st.name}
                        className="w-8 h-8 rounded-full object-cover border border-[var(--border-default)]"
                      />
                      <div>
                        <p className="font-semibold text-[var(--text-primary)]">{st.name}</p>
                        <p className="text-[11px] text-[var(--text-muted)]">{st.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[var(--text-secondary)] font-medium">{st.batchName || 'General Track'}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={st.status === 'ACTIVE' ? 'success' : 'default'} size="sm">
                      {st.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[var(--text-primary)]">{st.performanceScore || 85}%</span>
                      <div className="w-16 bg-[var(--bg-surface-secondary)] rounded-full h-1.5 overflow-hidden border border-[var(--border-default)]">
                        <div
                          className="bg-emerald-500 h-1.5 rounded-full"
                          style={{ width: `${st.performanceScore || 85}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[var(--text-muted)] font-mono">
                    {formatDate(st.joinedDate)}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedStudent(st)}
                    >
                      View
                    </Button>
                    <Button
                      variant={st.status === 'ACTIVE' ? 'ghost' : 'success'}
                      size="sm"
                      onClick={() => handleToggleStatus(st)}
                    >
                      {st.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <Modal
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          title="Student Profile & Performance"
          description={`Record ID: ${selectedStudent.id}`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-4 pb-4 border-b border-[var(--border-default)]">
              <img
                src={selectedStudent.avatar}
                alt={selectedStudent.name}
                className="w-14 h-14 rounded-full object-cover border border-[var(--border-default)]"
              />
              <div>
                <h4 className="text-base font-bold text-[var(--text-primary)]">{selectedStudent.name}</h4>
                <p className="text-[var(--text-secondary)] flex items-center gap-2 mt-0.5">
                  <Mail className="w-3.5 h-3.5" /> {selectedStudent.email}
                </p>
                {selectedStudent.phone && (
                  <p className="text-[var(--text-secondary)] flex items-center gap-2 mt-0.5">
                    <Phone className="w-3.5 h-3.5" /> {selectedStudent.phone}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-[var(--bg-surface-secondary)] rounded-xl border border-[var(--border-default)]">
                <span className="text-[var(--text-muted)] block mb-1">Assigned Cohort:</span>
                <span className="font-semibold text-[var(--text-primary)]">{selectedStudent.batchName}</span>
              </div>
              <div className="p-3 bg-[var(--bg-surface-secondary)] rounded-xl border border-[var(--border-default)]">
                <span className="text-[var(--text-muted)] block mb-1">Academic Performance:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">{selectedStudent.performanceScore || 85}% Average</span>
              </div>
            </div>

            <div className="p-3 bg-[var(--bg-surface-secondary)] rounded-xl border border-[var(--border-default)]">
              <span className="text-[var(--text-muted)] block mb-1">Bio / Notes:</span>
              <p className="text-[var(--text-secondary)]">{selectedStudent.bio || 'Active participant in daily algorithm challenges.'}</p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedStudent(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Student Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Enroll New Student"
        description="Add a new engineering candidate to an active cohort."
      >
        <form onSubmit={handleCreateStudent} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Jane Doe"
            value={newStudent.name}
            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="jane.doe@student.codepulse.io"
            value={newStudent.email}
            onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
            required
          />
          <Input
            label="Phone Number"
            placeholder="+1 (555) 012-3456"
            value={newStudent.phone}
            onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
          />
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Target Cohort
            </label>
            <select
              value={newStudent.batchName}
              onChange={(e) => setNewStudent({ ...newStudent, batchName: e.target.value })}
              className="w-full bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)]"
            >
              <option value="Full Stack & DSA Accelerator (Cohort 2025-A)">
                Full Stack & DSA Accelerator (Cohort 2025-A)
              </option>
              <option value="Python & Applied AI Engineering">
                Python & Applied AI Engineering
              </option>
              <option value="Advanced Competitive Programming & System Design">
                Advanced Competitive Programming & System Design
              </option>
            </select>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-[var(--border-default)]">
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Complete Enrollment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
