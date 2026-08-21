import React, { useEffect, useState } from 'react';
import { Search, Mail, TrendingUp, CheckCircle, Award, BookOpen } from 'lucide-react';
import { User } from '@/types';
import { userService } from '@/services/userService';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatDate } from '@/lib/utils';

export const InstructorStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  useEffect(() => {
    userService.getStudents().then(setStudents);
  }, []);

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 tracking-tight">Student Academic Profiles</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Monitor individual coding progress, test submission histories, and concept mastery.
        </p>
      </div>

      <Card className="p-4">
        <Input
          placeholder="Search by student name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search className="w-4 h-4 text-slate-500" />}
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((st) => (
          <Card key={st.id} className="p-5 flex flex-col justify-between space-y-4" hoverable>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={st.avatar}
                  alt={st.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-700"
                />
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">{st.name}</h4>
                  <p className="text-xs text-slate-400">{st.email}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Cohort:</span>
                  <span className="font-semibold text-slate-200">{st.batchName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Overall Score:</span>
                  <span className="font-mono text-emerald-400 font-bold">{st.performanceScore || 85}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full"
                    style={{ width: `${st.performanceScore || 85}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">Enrolled {formatDate(st.joinedDate)}</span>
              <Button variant="outline" size="sm" onClick={() => setSelectedStudent(st)}>
                View Report
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <Modal
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          title={`Performance Audit — ${selectedStudent.name}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Algorithms & Data Structures:</span>
                <span className="font-mono text-emerald-400 font-bold">92% Mastery</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Dynamic Programming:</span>
                <span className="font-mono text-amber-400 font-bold">78% Mastery</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">System Design & Databases:</span>
                <span className="font-mono text-blue-400 font-bold">88% Mastery</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="font-semibold text-slate-200 block mb-1">Faculty Feedback:</span>
              <p className="text-slate-300">
                Strong understanding of time complexity. Recommended to practice more multi-state DP and graph shortest path algorithms.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelectedStudent(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export const InstructorQuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">Question Bank & Problem Builder</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Create algorithmic tasks, custom test cases, and hidden benchmark suites.
          </p>
        </div>
        <a href="#/instructor/questions/new">
          <Button variant="primary" size="sm">
            Create Coding Problem
          </Button>
        </a>
      </div>

      <InstructorQuestionList />
    </div>
  );
};

const InstructorQuestionList: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    import('@/services/questionService').then((m) => {
      m.questionService.getQuestions().then(setQuestions);
    });
  }, []);

  const filtered = questions.filter(
    (q) =>
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.topic.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <Input
          placeholder="Search question bank..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search className="w-4 h-4 text-slate-500" />}
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((q) => (
          <Card key={q.id} className="p-5 flex flex-col justify-between space-y-4" hoverable>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
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
                <span className="font-mono text-blue-400 text-xs font-bold">{q.points} PTS</span>
              </div>
              <h3 className="font-bold text-slate-100 text-sm">{q.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2">{q.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Topic: <span className="text-slate-200 font-semibold">{q.topic}</span></span>
              <span className="text-slate-400">{q.testCases.length} Test cases</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
