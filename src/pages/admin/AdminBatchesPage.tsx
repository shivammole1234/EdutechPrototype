import React, { useEffect, useState } from 'react';
import { Plus, Layers, Calendar, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import { Batch } from '@/types';
import { batchService } from '@/services/batchService';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { formatDate } from '@/lib/utils';

export const AdminBatchesPage: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newBatch, setNewBatch] = useState({
    name: '',
    code: '',
    instructorName: 'Dr. Elena Rostova',
    studentCount: 30,
    startDate: '2025-03-01',
    endDate: '2025-08-30',
    description: '',
  });

  const loadBatches = async () => {
    const data = await batchService.getBatches();
    setBatches(data);
  };

  useEffect(() => {
    loadBatches();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatch.name) return;
    await batchService.createBatch(newBatch);
    setIsCreateOpen(false);
    setNewBatch({
      name: '',
      code: '',
      instructorName: 'Dr. Elena Rostova',
      studentCount: 30,
      startDate: '2025-03-01',
      endDate: '2025-08-30',
      description: '',
    });
    loadBatches();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">Cohorts & Batches</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Configure student cohorts, curriculum pacing, and lead faculty.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Create Cohort
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batches.map((b) => (
          <Card key={b.id} className="p-5 flex flex-col justify-between space-y-4" hoverable>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="purple" size="sm">{b.code}</Badge>
                  <h3 className="font-bold text-slate-100 text-sm mt-1.5">{b.name}</h3>
                </div>
                <Badge variant={b.status === 'ACTIVE' ? 'success' : 'default'} size="sm">
                  {b.status}
                </Badge>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2">{b.description}</p>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Curriculum Progress:</span>
                  <span className="font-mono text-purple-400 font-bold">{b.progress}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${b.progress}%` }} />
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-500" /> Students:
                </span>
                <span className="font-mono font-semibold">{b.studentCount} enrolled</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" /> Duration:
                </span>
                <span>{formatDate(b.startDate)} - {formatDate(b.endDate)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Lead Faculty:</span>
                <span className="text-purple-300 font-medium">{b.instructorName}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Academic Cohort"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Cohort Name"
            placeholder="Go & Cloud Systems Accelerator 2025"
            value={newBatch.name}
            onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })}
            required
          />
          <Input
            label="Cohort Code"
            placeholder="GOCLOUD-2025"
            value={newBatch.code}
            onChange={(e) => setNewBatch({ ...newBatch, code: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              value={newBatch.startDate}
              onChange={(e) => setNewBatch({ ...newBatch, startDate: e.target.value })}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={newBatch.endDate}
              onChange={(e) => setNewBatch({ ...newBatch, endDate: e.target.value })}
              required
            />
          </div>
          <Input
            label="Description"
            placeholder="Curriculum overview and goals..."
            value={newBatch.description}
            onChange={(e) => setNewBatch({ ...newBatch, description: e.target.value })}
          />
          <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
            <Button variant="outline" type="button" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Launch Cohort
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
