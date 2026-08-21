import { Batch } from '@/types';
import { INITIAL_BATCHES } from './mockData';

class BatchService {
  private batches: Batch[] = [...INITIAL_BATCHES];

  async getBatches(): Promise<Batch[]> {
    await new Promise((r) => setTimeout(r, 100));
    return [...this.batches];
  }

  async getBatchById(id: string): Promise<Batch | undefined> {
    await new Promise((r) => setTimeout(r, 80));
    return this.batches.find((b) => b.id === id);
  }

  async createBatch(data: Partial<Batch>): Promise<Batch> {
    await new Promise((r) => setTimeout(r, 180));
    const newBatch: Batch = {
      id: `batch_${Date.now()}`,
      name: data.name || 'New Cohort',
      code: data.code || `COHORT-${Math.floor(1000 + Math.random() * 9000)}`,
      instructorId: data.instructorId || 'usr_inst_01',
      instructorName: data.instructorName || 'Dr. Elena Rostova',
      startDate: data.startDate || new Date().toISOString().split('T')[0],
      endDate: data.endDate || '2025-12-31',
      studentCount: data.studentCount || 0,
      status: data.status || 'ACTIVE',
      progress: data.progress || 0,
      description: data.description || 'New academic training cohort.',
      topics: data.topics || ['Foundations', 'Algorithms', 'Project Lab'],
      schedule: data.schedule || 'Mon, Wed • 6:00 PM EST',
    };
    this.batches.unshift(newBatch);
    return newBatch;
  }

  async updateBatch(id: string, updates: Partial<Batch>): Promise<Batch> {
    await new Promise((r) => setTimeout(r, 150));
    const idx = this.batches.findIndex((b) => b.id === id);
    if (idx === -1) throw new Error('Batch not found');
    this.batches[idx] = { ...this.batches[idx], ...updates };
    return this.batches[idx];
  }

  async archiveBatch(id: string): Promise<Batch> {
    return this.updateBatch(id, { status: 'ARCHIVED' });
  }
}

export const batchService = new BatchService();
