import React, { useState } from 'react';
import { StudentBatch, Cohort } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Users, Plus, X, Layers, Check } from 'lucide-react';

interface CreateStudentBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  cohorts: Cohort[];
  onBatchCreated: (newBatch: Partial<StudentBatch>) => Promise<void>;
}

export const CreateStudentBatchModal: React.FC<CreateStudentBatchModalProps> = ({
  isOpen,
  onClose,
  cohorts,
  onBatchCreated,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [section, setSection] = useState('Morning Track (9:00 AM - 12:00 PM)');
  const [studentCount, setStudentCount] = useState(25);
  const [cohortId, setCohortId] = useState('');
  const [tags, setTags] = useState<string[]>(['Active Batch', 'Full-Time']);
  const [tagInput, setTagInput] = useState('');
  const [description, setDescription] = useState('');

  const handleAddTag = () => {
    if (!tagInput.trim() || tags.includes(tagInput.trim())) return;
    setTags([...tags, tagInput.trim()]);
    setTagInput('');
  };

  const handleRemoveTag = (idx: number) => {
    setTags(tags.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const selectedCohort = cohorts.find((c) => c.id === cohortId);
      await onBatchCreated({
        name: name.trim(),
        code: code.trim().toUpperCase() || `BATCH-${Math.floor(100 + Math.random() * 900)}`,
        section,
        studentCount,
        tags,
        cohortId: cohortId || undefined,
        cohortName: selectedCohort?.name,
        description,
      });

      // Reset
      setName('');
      setCode('');
      setStudentCount(25);
      setCohortId('');
      setTags(['Active Batch', 'Full-Time']);
      setDescription('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Student Batch"
      description="Create a section of students to connect with academic cohorts."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Batch Group Name"
            placeholder="e.g. Batch Alfa (Morning Core)"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!code) {
                const auto = e.target.value
                  .split(' ')
                  .map((w) => w[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 5);
                if (auto) setCode(`BATCH-${auto}`);
              }
            }}
            required
          />

          <Input
            label="Batch Code"
            placeholder="e.g. BATCH-FSD-ALP"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Class Timing Section
            </label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="w-full bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg px-3.5 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-hover)]"
            >
              <option value="Morning Track (9:00 AM - 12:00 PM)">Morning Track (9:00 AM - 12:00 PM)</option>
              <option value="Afternoon Sprint (1:00 PM - 4:00 PM)">Afternoon Sprint (1:00 PM - 4:00 PM)</option>
              <option value="Evening Track (6:00 PM - 9:00 PM)">Evening Track (6:00 PM - 9:00 PM)</option>
              <option value="Weekend Intensive (10:00 AM - 2:00 PM)">Weekend Intensive (10:00 AM - 2:00 PM)</option>
              <option value="Self-Paced Hybrid Lab">Self-Paced Hybrid Lab</option>
            </select>
          </div>

          <Input
            label="Student Headcount"
            type="number"
            value={studentCount}
            onChange={(e) => setStudentCount(Number(e.target.value))}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Attach to Academic Cohort (Optional)
          </label>
          <select
            value={cohortId}
            onChange={(e) => setCohortId(e.target.value)}
            className="w-full bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg px-3.5 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-hover)]"
          >
            <option value="">-- Leave as Unassigned Batch --</option>
            {cohorts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} — {c.name} ({c.instructorName})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Batch Tags
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="e.g. FastTrack, Campus West"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button type="button" variant="outline" size="sm" onClick={handleAddTag}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] text-[var(--text-primary)]"
              >
                {t}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(i)}
                  className="text-[var(--text-muted)] hover:text-rose-500 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Batch Notes & Goals
          </label>
          <textarea
            rows={2}
            placeholder="Special instructions or student prerequisites for this batch section..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg px-3.5 py-2 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-hover)]"
          />
        </div>

        <div className="pt-3 flex justify-end gap-2 border-t border-[var(--border-default)]">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Batch'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
