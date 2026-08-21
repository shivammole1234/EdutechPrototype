import React, { useEffect, useState } from 'react';
import { Plus, FileText, Calendar, Users, CheckCircle2, Clock } from 'lucide-react';
import { Assignment } from '@/types';
import { assignmentService } from '@/services/assignmentService';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { formatDate } from '@/lib/utils';

export const InstructorAssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newAsg, setNewAsg] = useState({
    title: '',
    description: '',
    dueDate: '2025-03-10',
    totalPoints: 100,
    batchId: 'batch_01',
  });

  const loadAssignments = async () => {
    const list = await assignmentService.getAssignments();
    setAssignments(list);
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsg.title) return;
    await assignmentService.createAssignment({
      ...newAsg,
      submissionsCount: 0,
    });
    setIsCreateOpen(false);
    setNewAsg({
      title: '',
      description: '',
      dueDate: '2025-03-10',
      totalPoints: 100,
      batchId: 'batch_01',
    });
    loadAssignments();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">Assignments & Weekly Labs</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Create homework tasks, code submissions, and grade rubrics.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Create Assignment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((asg) => (
          <Card key={asg.id} className="p-5 flex flex-col justify-between space-y-4" hoverable>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <Badge variant="primary" size="sm">Homework Lab</Badge>
                <span className="font-mono text-xs font-bold text-blue-400">{asg.totalPoints} PTS</span>
              </div>
              <h3 className="font-bold text-slate-100 text-sm">{asg.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2">{asg.description}</p>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Due Date:</span>
                <span>{formatDate(asg.dueDate)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Submissions Received:</span>
                <span className="font-mono font-bold text-slate-200">{asg.submissionsCount} / 30</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Assignment"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Assignment Title"
            placeholder="E.g., Graph Dijkstra & Shortest Paths Lab"
            value={newAsg.title}
            onChange={(e) => setNewAsg({ ...newAsg, title: e.target.value })}
            required
          />
          <Input
            label="Description & Instructions"
            placeholder="Deliverables..."
            value={newAsg.description}
            onChange={(e) => setNewAsg({ ...newAsg, description: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Due Date"
              type="date"
              value={newAsg.dueDate}
              onChange={(e) => setNewAsg({ ...newAsg, dueDate: e.target.value })}
              required
            />
            <Input
              label="Total Points"
              type="number"
              value={newAsg.totalPoints}
              onChange={(e) => setNewAsg({ ...newAsg, totalPoints: Number(e.target.value) })}
              required
            />
          </div>
          <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
            <Button variant="outline" type="button" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Publish Assignment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export const InstructorAttendancePage: React.FC = () => {
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    import('@/services/attendanceService').then((m) => {
      m.attendanceService.getAttendanceRecords().then(setRecords);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">Class Attendance & Session Ledger</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Log student attendance, track absence rates, and export attendance records.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
            <tr>
              <th className="py-3 px-4 font-semibold">Student</th>
              <th className="py-3 px-4 font-semibold">Cohort</th>
              <th className="py-3 px-4 font-semibold">Session Topic</th>
              <th className="py-3 px-4 font-semibold">Date</th>
              <th className="py-3 px-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {records.map((rec) => (
              <tr key={rec.id} className="hover:bg-slate-850/60 transition">
                <td className="py-3.5 px-4 font-semibold text-slate-100">{rec.studentName}</td>
                <td className="py-3.5 px-4 text-slate-400">Full Stack 2025-A</td>
                <td className="py-3.5 px-4 text-slate-200">{rec.sessionTitle}</td>
                <td className="py-3.5 px-4 font-mono text-slate-400">{formatDate(rec.date)}</td>
                <td className="py-3.5 px-4">
                  <Badge variant={rec.status === 'PRESENT' ? 'success' : 'danger'} size="sm">
                    {rec.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
