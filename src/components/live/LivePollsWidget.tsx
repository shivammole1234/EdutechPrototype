import React, { useState } from 'react';
import {
  HelpCircle,
  Plus,
  CheckCircle2,
  BarChart2,
  Clock,
  Sparkles,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LivePoll, User } from '@/types';

interface LivePollsWidgetProps {
  polls: LivePoll[];
  currentUser: User;
  onCreatePoll?: (poll: { question: string; options: string[]; correctOptionIndex?: number }) => void;
  onVotePoll?: (pollId: string, optionId: string) => void;
  onClosePoll?: (pollId: string) => void;
}

export const LivePollsWidget: React.FC<LivePollsWidgetProps> = ({
  polls,
  currentUser,
  onCreatePoll,
  onVotePoll,
  onClosePoll,
}) => {
  const isInstructor = currentUser.role === 'INSTRUCTOR';
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '']);
  const [correctIndex, setCorrectIndex] = useState<number | undefined>(undefined);

  const activePoll = polls.find((p) => p.status === 'ACTIVE') || polls[0];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    const validOptions = options.map((o) => o.trim()).filter(Boolean);
    if (validOptions.length < 2) return;

    if (onCreatePoll) {
      onCreatePoll({
        question: newQuestion.trim(),
        options: validOptions,
        correctOptionIndex: correctIndex,
      });
    }

    setNewQuestion('');
    setOptions(['', '', '']);
    setCorrectIndex(undefined);
    setShowCreateModal(false);
  };

  const handleOptionTextChange = (idx: number, text: string) => {
    const next = [...options];
    next[idx] = text;
    setOptions(next);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Poll Header */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <BarChart2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100">Live Knowledge Check & Polls</h4>
            <p className="text-[10px] text-slate-400">Interactive class comprehension checks</p>
          </div>
        </div>

        {isInstructor && onCreatePoll && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-600 hover:bg-purple-500 text-xs shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Launch Quiz
          </Button>
        )}
      </div>

      {/* Main Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* Create Modal if open */}
        {showCreateModal && (
          <form
            onSubmit={handleCreateSubmit}
            className="p-4 bg-slate-900 border border-purple-500/40 rounded-xl space-y-3 animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-300">Create Live Concept Check</span>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <div>
              <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                Question / Algorithm Riddle
              </label>
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="e.g. What is the average search complexity in an AVL Tree?"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-300 font-semibold block">Options (Min 2)</label>
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correctOption"
                    checked={correctIndex === idx}
                    onChange={() => setCorrectIndex(idx)}
                    title="Mark as correct answer (optional)"
                    className="accent-purple-500 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                    placeholder={`Option ${idx + 1}`}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              ))}
            </div>

            <Button type="submit" variant="primary" size="sm" className="w-full bg-purple-600 hover:bg-purple-500">
              Broadcast Poll to All Students
            </Button>
          </form>
        )}

        {/* Display Current Poll */}
        {activePoll ? (
          <div className="space-y-3">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant={activePoll.status === 'ACTIVE' ? 'success' : 'default'} size="sm">
                  {activePoll.status === 'ACTIVE' ? 'Live Quiz in Progress' : 'Closed Poll'}
                </Badge>
                <span className="text-[10px] text-slate-400 font-mono">
                  {activePoll.totalVotes} Total Votes
                </span>
              </div>
              <h5 className="text-sm font-bold text-slate-100">{activePoll.question}</h5>
            </div>

            {/* Options Voting / Results */}
            <div className="space-y-2">
              {activePoll.options.map((option) => {
                const percentage =
                  activePoll.totalVotes > 0
                    ? Math.round((option.votes / activePoll.totalVotes) * 100)
                    : 0;
                const isUserSelected = activePoll.userVotedOptionId === option.id;
                const isCorrect = activePoll.correctOptionId === option.id;

                return (
                  <div
                    key={option.id}
                    onClick={() => {
                      if (!isInstructor && activePoll.status === 'ACTIVE' && onVotePoll && !activePoll.userVotedOptionId) {
                        onVotePoll(activePoll.id, option.id);
                      }
                    }}
                    className={`relative overflow-hidden p-3 rounded-xl border transition cursor-pointer ${
                      isUserSelected
                        ? 'border-purple-500 bg-purple-950/30'
                        : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    {/* Background fill bar representing percentage */}
                    <div
                      className={`absolute top-0 bottom-0 left-0 transition-all duration-500 ${
                        isCorrect && activePoll.userVotedOptionId
                          ? 'bg-emerald-500/20'
                          : 'bg-purple-500/15'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />

                    <div className="relative z-10 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-200">{option.text}</span>
                        {isUserSelected && (
                          <Badge variant="primary" size="sm" className="bg-purple-500/20 text-purple-300">
                            Your Vote
                          </Badge>
                        )}
                        {isCorrect && activePoll.userVotedOptionId && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 font-mono">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Correct
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-400 font-bold">{percentage}%</span>
                        <span className="text-[10px] text-slate-500 font-mono">({option.votes})</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Instructor Controls */}
            {isInstructor && activePoll.status === 'ACTIVE' && onClosePoll && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onClosePoll(activePoll.id)}
                className="w-full bg-slate-900 border-slate-700 text-xs text-slate-300"
              >
                Close Poll & Lock Results
              </Button>
            )}
          </div>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center text-center p-4 text-slate-500 text-xs">
            <HelpCircle className="w-8 h-8 mb-2 opacity-30 text-purple-400" />
            <p className="font-semibold text-slate-400">No active polls right now</p>
            <p className="text-[11px] mt-0.5">The instructor will launch interactive quiz questions during lecture.</p>
          </div>
        )}
      </div>
    </div>
  );
};
