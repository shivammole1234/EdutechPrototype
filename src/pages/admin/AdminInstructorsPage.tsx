import React, { useEffect, useState } from 'react';
import { Search, UserPlus, Mail, Phone, BookOpen, Users } from 'lucide-react';
import { User } from '@/types';
import { userService } from '@/services/userService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { formatDate } from '@/lib/utils';

export const AdminInstructorsPage: React.FC = () => {
  const [instructors, setInstructors] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState<User | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newInst, setNewInst] = useState({ name: '', email: '', bio: '', phone: '' });

  const loadInstructors = async () => {
    const data = await userService.getInstructors();
    setInstructors(data);
  };

  useEffect(() => {
    loadInstructors();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInst.name || !newInst.email) return;
    await userService.createInstructor(newInst);
    setIsAddModalOpen(false);
    setNewInst({ name: '', email: '', bio: '', phone: '' });
    loadInstructors();
  };

  const filtered = instructors.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">Faculty & Instructors</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Manage academic instructors, assigned cohorts, and teaching allocations.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsAddModalOpen(true)}>
          <UserPlus className="w-4 h-4 mr-1.5" />
          Add Instructor
        </Button>
      </div>

      <Card className="p-4 flex items-center justify-between">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search instructors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4 text-slate-500" />}
          />
        </div>
        <span className="text-xs text-slate-400 font-mono">{filtered.length} Faculty Members</span>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((inst) => (
          <Card key={inst.id} className="p-5 flex flex-col justify-between space-y-4" hoverable>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={inst.avatar}
                    alt={inst.name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm">{inst.name}</h4>
                    <p className="text-xs text-slate-400">{inst.email}</p>
                  </div>
                </div>
                <Badge variant="success" size="sm">Active</Badge>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2">
                {inst.bio || 'Lead Faculty & Systems Specialist.'}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800">
                <span className="text-slate-400 flex items-center gap-1.5 mb-1">
                  <BookOpen className="w-3.5 h-3.5 text-blue-400" /> Batches
                </span>
                <span className="font-bold text-slate-200 font-mono">{inst.assignedBatchesCount || 2} Active</span>
              </div>
              <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800">
                <span className="text-slate-400 flex items-center gap-1.5 mb-1">
                  <Users className="w-3.5 h-3.5 text-purple-400" /> Students
                </span>
                <span className="font-bold text-slate-200 font-mono">{inst.totalStudentsCount || 60} Learners</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">Joined {formatDate(inst.joinedDate)}</span>
              <Button variant="outline" size="sm" onClick={() => setSelectedInstructor(inst)}>
                View Profile
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {selectedInstructor && (
        <Modal
          isOpen={!!selectedInstructor}
          onClose={() => setSelectedInstructor(null)}
          title="Faculty Profile & Teaching Load"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
              <img
                src={selectedInstructor.avatar}
                alt={selectedInstructor.name}
                className="w-14 h-14 rounded-full object-cover border border-slate-700"
              />
              <div>
                <h4 className="text-base font-bold text-slate-100">{selectedInstructor.name}</h4>
                <p className="text-slate-400">{selectedInstructor.email}</p>
                <p className="text-slate-400">{selectedInstructor.phone}</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm">{selectedInstructor.bio}</p>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
              <span className="font-semibold text-slate-200">Permissions & Access:</span>
              <p className="text-slate-400">Full authoring rights for Question Bank, Live Coding Rooms, and Assessment Grading.</p>
            </div>
          </div>
        </Modal>
      )}

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Faculty Member"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Dr. Samantha Reed"
            value={newInst.name}
            onChange={(e) => setNewInst({ ...newInst, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="samantha.reed@codepulse.io"
            value={newInst.email}
            onChange={(e) => setNewInst({ ...newInst, email: e.target.value })}
            required
          />
          <Input
            label="Phone"
            placeholder="+1 (555) 345-6789"
            value={newInst.phone}
            onChange={(e) => setNewInst({ ...newInst, phone: e.target.value })}
          />
          <Input
            label="Specialization / Bio"
            placeholder="Distributed Systems & Database Internals"
            value={newInst.bio}
            onChange={(e) => setNewInst({ ...newInst, bio: e.target.value })}
          />
          <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Instructor
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
