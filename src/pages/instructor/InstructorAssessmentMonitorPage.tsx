import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Shield,
  Radio,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Eye,
  UserX,
  PlusCircle,
  MessageSquare,
  ArrowLeft,
  Terminal,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { assessmentService } from '@/services/assessmentService';
import { Assessment } from '@/types';

interface LiveCandidate {
  id: string;
  name: string;
  avatar: string;
  currentQuestion: string;
  timeRemainingSec: number;
  tabSwitches: number;
  status: 'ONLINE' | 'FLAGGED' | 'COMPLETED' | 'DISQUALIFIED';
  currentCode: string;
  testsPassed: string;
}

export const InstructorAssessmentMonitorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<Assessment | null>(null);

  const [candidates, setCandidates] = useState<LiveCandidate[]>([
    {
      id: 'usr_03',
      name: 'Alex Turner',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      currentQuestion: 'Q2: Binary Tree Maximum Path Sum',
      timeRemainingSec: 3840,
      tabSwitches: 0,
      status: 'ONLINE',
      currentCode: `function maxPathSum(root: TreeNode | null): number {\n  let maxSum = -Infinity;\n  function dfs(node: TreeNode | null): number {\n    if (!node) return 0;\n    const left = Math.max(0, dfs(node.left));\n    const right = Math.max(0, dfs(node.right));\n    maxSum = Math.max(maxSum, node.val + left + right);\n    return node.val + Math.max(left, right);\n  }\n  dfs(root);\n  return maxSum;\n}`,
      testsPassed: '3/3 Sample Passed',
    },
    {
      id: 'usr_04',
      name: 'Priya Patel',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      currentQuestion: 'Q1: Two Sum & Hash Map',
      timeRemainingSec: 4100,
      tabSwitches: 2,
      status: 'FLAGGED',
      currentCode: `def twoSum(nums, target):\n    lookup = {}\n    for i, num in enumerate(nums):\n        if target - num in lookup:\n            return [lookup[target - num], i]\n        lookup[num] = i`,
      testsPassed: '2/2 Sample Passed',
    },
    {
      id: 'usr_05',
      name: 'Liam Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      currentQuestion: 'Q3: LRU Cache Implementation',
      timeRemainingSec: 1200,
      tabSwitches: 0,
      status: 'ONLINE',
      currentCode: `class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.map = new Map();\n  }\n}`,
      testsPassed: '1/3 Sample Passed',
    },
    {
      id: 'usr_06',
      name: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      currentQuestion: 'All Complete',
      timeRemainingSec: 0,
      tabSwitches: 0,
      status: 'COMPLETED',
      currentCode: `// Submitted early with 100/100 score`,
      testsPassed: 'All Passed (100%)',
    },
  ]);

  const [inspectCandidate, setInspectCandidate] = useState<LiveCandidate | null>(null);
  const [logs, setLogs] = useState<string[]>([
    '14:02:10 — Alex Turner submitted test run for Q1 (Passed 100%)',
    '14:04:22 — Priya Patel triggered focus-lost warning (Tab switch 2/3)',
    '14:06:50 — Liam Chen started working on Q3: LRU Cache',
    '14:08:15 — Sarah Jenkins submitted assessment with 100/100',
  ]);

  useEffect(() => {
    assessmentService.getAssessments().then((list) => {
      const found = list.find((a) => a.id === id) || list[0];
      setAssessment(found);
    });
  }, [id]);

  const handleSendWarning = (cand: LiveCandidate) => {
    alert(`Proctor warning sent to ${cand.name}: "Please return focus to exam screen immediately."`);
    setLogs((prev) => [`${new Date().toLocaleTimeString()} — Proctor warning sent to ${cand.name}`, ...prev]);
  };

  const handleExtendTime = (cand: LiveCandidate) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === cand.id ? { ...c, timeRemainingSec: c.timeRemainingSec + 600 } : c))
    );
    alert(`Added +10 minutes grace time to ${cand.name}.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/instructor/assessments')}>
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-100 tracking-tight">
                {assessment?.title || 'Live Assessment Proctor'}
              </h2>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-semibold">
                <Radio className="w-3 h-3 animate-pulse" /> LIVE STREAM
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live keystroke inspection, anti-cheat detection, and timer management.
            </p>
          </div>
        </div>
      </div>

      {/* Proctor Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <p className="text-xs text-slate-400 uppercase font-semibold">Online Test-Takers</p>
          <p className="text-2xl font-bold text-slate-100 font-mono mt-1">28 / 30</p>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <p className="text-xs text-slate-400 uppercase font-semibold">Violations / Flags</p>
          <p className="text-2xl font-bold text-amber-400 font-mono mt-1">1 Flagged</p>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <p className="text-xs text-slate-400 uppercase font-semibold">Submissions In</p>
          <p className="text-2xl font-bold text-emerald-400 font-mono mt-1">2 Complete</p>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <p className="text-xs text-slate-400 uppercase font-semibold">Avg Test Pace</p>
          <p className="text-2xl font-bold text-blue-400 font-mono mt-1">Q2 of 3</p>
        </div>
      </div>

      {/* Main Proctor Grid & Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Candidates Table */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="p-0 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <CardTitle>Active Candidates ({candidates.length})</CardTitle>
              <Badge variant="primary" size="sm">Auto-refreshing 2s</Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Candidate</th>
                    <th className="py-3 px-4 font-semibold">Progress</th>
                    <th className="py-3 px-4 font-semibold">Flags / Switches</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 text-right font-semibold">Proctor Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {candidates.map((cand) => (
                    <tr key={cand.id} className="hover:bg-slate-850/60 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={cand.avatar}
                            alt={cand.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-700"
                          />
                          <div>
                            <p className="font-semibold text-slate-100">{cand.name}</p>
                            <p className="text-[11px] text-slate-400 font-mono">
                              {Math.floor(cand.timeRemainingSec / 60)}m left
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-200">{cand.currentQuestion}</p>
                        <p className="text-[11px] text-emerald-400 font-mono">{cand.testsPassed}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={cand.tabSwitches > 1 ? 'warning' : 'default'}
                          size="sm"
                        >
                          {cand.tabSwitches} / 3 Switches
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            cand.status === 'ONLINE'
                              ? 'success'
                              : cand.status === 'FLAGGED'
                              ? 'warning'
                              : 'default'
                          }
                          size="sm"
                        >
                          {cand.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setInspectCandidate(cand)}
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          Code
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-amber-400 hover:text-amber-300"
                          onClick={() => handleSendWarning(cand)}
                        >
                          Warn
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-400 hover:text-blue-300"
                          onClick={() => handleExtendTime(cand)}
                        >
                          +10m
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Live Proctor Activity Feed */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-4 space-y-3">
            <CardTitle className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-blue-400" />
              Proctoring Telemetry Feed
            </CardTitle>
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1 text-xs">
              {logs.map((log, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg text-slate-300 font-mono text-[11px]"
                >
                  {log}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Real-Time Live Code Inspection Modal */}
      {inspectCandidate && (
        <Modal
          isOpen={!!inspectCandidate}
          onClose={() => setInspectCandidate(null)}
          title={`Live Code Inspection — ${inspectCandidate.name}`}
          description={`Viewing active buffer for: ${inspectCandidate.currentQuestion}`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400">Current Status: <span className="text-emerald-400 font-semibold">{inspectCandidate.status}</span></span>
              <span className="font-mono text-slate-300">{inspectCandidate.testsPassed}</span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Active Monaco Buffer Snapshot
              </label>
              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-blue-300 overflow-x-auto max-h-80">
                {inspectCandidate.currentCode}
              </pre>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setInspectCandidate(null)}>
                Close Viewer
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
