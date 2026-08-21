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
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">Student Directory</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
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
            icon={<Search className="w-4 h-4 text-slate-500" />}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-200 cursor-pointer focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          <span className="text-xs text-slate-400 ml-2 font-mono">
            {filteredStudents.length} Students
          </span>
        </div>
      </Card>

      {/* Student Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3 px-4 font-semibold">Student Name</th>
                <th className="py-3 px-4 font-semibold">Assigned Cohort</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Performance</th>
                <th className="py-3 px-4 font-semibold">Joined Date</th>
                <th className="py-3 px-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredStudents.map((st) => (
                <tr key={st.id} className="hover:bg-slate-850/60 transition duration-150">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={st.avatar}
                        alt={st.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <p className="font-semibold text-slate-100">{st.name}</p>
                        <p className="text-[11px] text-slate-400">{st.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-slate-300 font-medium">{st.batchName || 'General Track'}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={st.status === 'ACTIVE' ? 'success' : 'default'} size="sm">
                      {st.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-200">{st.performanceScore || 85}%</span>
                      <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-1.5 rounded-full"
                          style={{ width: `${st.performanceScore || 85}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono">
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
            <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
              <img
                src={selectedStudent.avatar}
                alt={selectedStudent.name}
                className="w-14 h-14 rounded-full object-cover border border-slate-700"
              />
              <div>
                <h4 className="text-base font-bold text-slate-100">{selectedStudent.name}</h4>
                <p className="text-slate-400 flex items-center gap-2 mt-0.5">
                  <Mail className="w-3.5 h-3.5" /> {selectedStudent.email}
                </p>
                {selectedStudent.phone && (
                  <p className="text-slate-400 flex items-center gap-2 mt-0.5">
                    <Phone className="w-3.5 h-3.5" /> {selectedStudent.phone}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400 block mb-1">Assigned Cohort:</span>
                <span className="font-semibold text-slate-200">{selectedStudent.batchName}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400 block mb-1">Academic Performance:</span>
                <span className="font-semibold text-emerald-400 font-mono">{selectedStudent.performanceScore || 85}% Average</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400 block mb-1">Bio / Notes:</span>
              <p className="text-slate-300">{selectedStudent.bio || 'Active participant in daily algorithm challenges.'}</p>
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Target Cohort
            </label>
            <select
              value={newStudent.batchName}
              onChange={(e) => setNewStudent({ ...newStudent, batchName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-200"
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

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
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
