import React, { useEffect, useState } from 'react';
import { Search, HelpCircle, Code2, Check, Tag } from 'lucide-react';
import { Question } from '@/types';
import { questionService } from '@/services/questionService';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

export const AdminQuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    questionService.getQuestions().then(setQuestions);
  }, []);

  const filtered = questions.filter(
    (q) =>
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.topic.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Master Question Repository</h2>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5">
          Global database of algorithmic problems, test cases, and difficulty distributions.
        </p>
      </div>

      <Card className="p-4">
        <Input
          placeholder="Filter questions by title, algorithm pattern, or data structure..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search className="w-4 h-4 text-[var(--text-muted)]" />}
        />
      </Card>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs text-[var(--text-secondary)]">
          <thead className="bg-[var(--bg-muted)] border-b border-[var(--border-default)] text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
            <tr>
              <th className="py-3 px-4 font-semibold">Problem Statement</th>
              <th className="py-3 px-4 font-semibold">Topic</th>
              <th className="py-3 px-4 font-semibold">Difficulty</th>
              <th className="py-3 px-4 font-semibold">Type</th>
              <th className="py-3 px-4 font-semibold">Test Cases</th>
              <th className="py-3 px-4 font-semibold">Points</th>
              <th className="py-3 px-4 font-semibold">Acceptance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-default)]">
            {filtered.map((q) => (
              <tr key={q.id} className="hover:bg-[var(--bg-muted)]/50 transition">
                <td className="py-3.5 px-4 font-semibold text-[var(--text-primary)]">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-[var(--primary)]" />
                    <span>{q.title}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-[var(--text-secondary)]">{q.topic}</td>
                <td className="py-3.5 px-4">
                  <Badge
                    variant={
                      q.difficulty === 'EASY'
                        ? 'success'
                        : q.difficulty === 'MEDIUM'
                        ? 'warning'
                        : 'danger'
                    }
                    size="sm"
                  >
                    {q.difficulty}
                  </Badge>
                </td>
                <td className="py-3.5 px-4 font-mono text-[var(--text-muted)]">{q.type}</td>
                <td className="py-3.5 px-4 font-mono text-[var(--text-secondary)]">{q.testCases.length} Tests</td>
                <td className="py-3.5 px-4 font-mono text-[var(--primary)] font-bold">{q.points}</td>
                <td className="py-3.5 px-4 font-mono text-[var(--text-secondary)]">{q.acceptanceRate || 85}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
