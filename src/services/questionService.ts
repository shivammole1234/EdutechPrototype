import { Question, QuestionType, Difficulty } from '@/types';
import { INITIAL_QUESTIONS } from './mockData';

export interface QuestionFilters {
  search?: string;
  topic?: string;
  difficulty?: Difficulty | 'ALL';
  type?: QuestionType | 'ALL';
  language?: string;
  status?: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED' | 'ALL';
}

class QuestionService {
  private questions: Question[] = [...INITIAL_QUESTIONS];

  async getQuestions(filters?: QuestionFilters): Promise<Question[]> {
    await new Promise((r) => setTimeout(r, 100));
    let list = [...this.questions];

    if (filters) {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(
          (item) =>
            item.title.toLowerCase().includes(q) ||
            item.topic.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q)
        );
      }
      if (filters.topic && filters.topic !== 'ALL') {
        list = list.filter((item) => item.topic.toLowerCase() === filters.topic!.toLowerCase());
      }
      if (filters.difficulty && filters.difficulty !== 'ALL') {
        list = list.filter((item) => item.difficulty === filters.difficulty);
      }
      if (filters.type && filters.type !== 'ALL') {
        list = list.filter((item) => item.type === filters.type);
      }
      if (filters.language && filters.language !== 'ALL') {
        list = list.filter((item) => item.languages.includes(filters.language!));
      }
      if (filters.status && filters.status !== 'ALL') {
        list = list.filter((item) => item.status === filters.status);
      }
    }

    return list;
  }

  async getQuestionById(id: string): Promise<Question | undefined> {
    await new Promise((r) => setTimeout(r, 60));
    return this.questions.find((q) => q.id === id || q.slug === id);
  }

  async createQuestion(data: Partial<Question>): Promise<Question> {
    await new Promise((r) => setTimeout(r, 200));
    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      title: data.title || 'Untitled Problem',
      slug: (data.title || 'untitled-problem')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
      type: data.type || 'CODING',
      topic: data.topic || 'General Algorithms',
      subtopic: data.subtopic,
      difficulty: data.difficulty || 'MEDIUM',
      languages: data.languages || ['javascript', 'typescript', 'python'],
      points: data.points || 100,
      status: data.status || 'PUBLISHED',
      description: data.description || 'Provide problem description here.',
      examples: data.examples || [],
      constraints: data.constraints || ['1 <= n <= 10^5'],
      testCases: data.testCases || [],
      starterCode: data.starterCode || {
        javascript: 'function solution() {\n  // your code here\n}',
        typescript: 'function solution(): void {\n  // your code here\n}',
        python: 'def solution():\n    pass',
      },
      options: data.options,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      acceptanceRate: 100,
      submissionsCount: 0,
      authorName: data.authorName || 'Dr. Elena Rostova',
    };

    this.questions.unshift(newQuestion);
    return newQuestion;
  }

  async updateQuestion(id: string, updates: Partial<Question>): Promise<Question> {
    await new Promise((r) => setTimeout(r, 150));
    const idx = this.questions.findIndex((q) => q.id === id);
    if (idx === -1) throw new Error('Question not found');
    this.questions[idx] = {
      ...this.questions[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.questions[idx];
  }

  async duplicateQuestion(id: string): Promise<Question> {
    const original = await this.getQuestionById(id);
    if (!original) throw new Error('Original question not found');
    return this.createQuestion({
      ...original,
      title: `${original.title} (Copy)`,
      status: 'DRAFT',
    });
  }

  async deleteQuestion(id: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 150));
    this.questions = this.questions.filter((q) => q.id !== id);
    return true;
  }
}

export const questionService = new QuestionService();
