import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, ArrowLeft, Code2, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { questionService } from '@/services/questionService';
import { Difficulty, TestCase } from '@/types';

export const InstructorQuestionCreateEditPage: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('Algorithms');
  const [difficulty, setDifficulty] = useState<Difficulty>('MEDIUM');
  const [points, setPoints] = useState(25);
  const [timeLimit, setTimeLimit] = useState(1.0);
  const [memoryLimit, setMemoryLimit] = useState(256);
  const [description, setDescription] = useState(
    'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.'
  );
  const [constraints, setConstraints] = useState('2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9');

  const [testCases, setTestCases] = useState<TestCase[]>([
    {
      id: 'tc_1',
      input: 'nums = [2, 7, 11, 15], target = 9',
      expectedOutput: '[0, 1]',
      isHidden: false,
      explanation: 'nums[0] + nums[1] == 9, so return [0, 1].',
    },
    {
      id: 'tc_2',
      input: 'nums = [3, 2, 4], target = 6',
      expectedOutput: '[1, 2]',
      isHidden: false,
    },
    {
      id: 'tc_3',
      input: 'nums = [3, 3], target = 6',
      expectedOutput: '[0, 1]',
      isHidden: true,
    },
  ]);

  const [codeTemplates, setCodeTemplates] = useState({
    typescript: `function twoSum(nums: number[], target: number): number[] {\n    // Write your algorithm here\n    \n};`,
    javascript: `function twoSum(nums, target) {\n    // Write your algorithm here\n    \n};`,
    python: `class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        # Write your code here\n        pass`,
    cpp: `#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};`,
    java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}`,
  });

  const handleAddTestCase = () => {
    const newTc: TestCase = {
      id: `tc_${Date.now()}`,
      input: '',
      expectedOutput: '',
      isHidden: false,
    };
    setTestCases([...testCases, newTc]);
  };

  const handleRemoveTestCase = (index: number) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  const handleUpdateTestCase = (index: number, field: keyof TestCase, value: any) => {
    const updated = [...testCases];
    updated[index] = { ...updated[index], [field]: value };
    setTestCases(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert('Please provide a problem title.');
      return;
    }

    await questionService.createQuestion({
      title,
      topic,
      difficulty,
      points: Number(points),
      description,
      constraints: constraints.split('\n').filter(Boolean),
      testCases,
      starterCode: codeTemplates,
      type: 'CODING',
    });

    navigate('/instructor/questions');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate('/instructor/questions')}
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Bank
          </Button>
          <div>
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">
              Create Algorithmic Coding Problem
            </h2>
            <p className="text-xs text-slate-400">
              Configure problem requirements, starter boilerplates, and test suites.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" size="sm" onClick={() => navigate('/instructor/questions')}>
            Discard
          </Button>
          <Button type="submit" variant="primary" size="sm">
            <Save className="w-4 h-4 mr-1.5" />
            Publish Problem
          </Button>
        </div>
      </div>

      {/* Main Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Problem Metadata & Statement */}
        <div className="lg:col-span-7 space-y-5">
          <Card className="p-5 space-y-4">
            <CardHeader className="mb-2">
              <CardTitle>Problem Details & Metadata</CardTitle>
            </CardHeader>

            <Input
              label="Problem Title"
              placeholder="E.g., Two Sum & Hash Map Lookup"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Topic / Tag
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200"
                >
                  <option value="Arrays & HashMaps">Arrays & HashMaps</option>
                  <option value="Two Pointers">Two Pointers</option>
                  <option value="Trees & Graphs">Trees & Graphs</option>
                  <option value="Dynamic Programming">Dynamic Programming</option>
                  <option value="Greedy Algorithms">Greedy Algorithms</option>
                  <option value="System Design">System Design</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200"
                >
                  <option value="EASY">EASY</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HARD">HARD</option>
                </select>
              </div>

              <Input
                label="Points / Weight"
                type="number"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Problem Description (Markdown Supported)
              </label>
              <textarea
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#09090b] border border-[#27272a] rounded-lg p-3 text-xs text-[#fafafa] font-mono focus:outline-none focus:border-[#3f3f46]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Constraints & Bounds
              </label>
              <textarea
                rows={3}
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                className="w-full bg-[#09090b] border border-[#27272a] rounded-lg p-3 text-xs text-[#fafafa] font-mono focus:outline-none focus:border-[#3f3f46]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800 text-xs">
              <Input
                label="Execution Time Limit (Seconds)"
                type="number"
                step="0.1"
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
              />
              <Input
                label="Memory Limit (MB)"
                type="number"
                value={memoryLimit}
                onChange={(e) => setMemoryLimit(Number(e.target.value))}
              />
            </div>
          </Card>
        </div>

        {/* Right Column: Test Case Builder & Code Templates */}
        <div className="lg:col-span-5 space-y-5">
          {/* Test Case Suite */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle>Test Suite Validation</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={handleAddTestCase}>
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Test Case
              </Button>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {testCases.map((tc, idx) => (
                <div
                  key={tc.id || idx}
                  className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">
                      Test Case #{idx + 1} {tc.isHidden && <Badge variant="warning" size="sm">Hidden</Badge>}
                    </span>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tc.isHidden}
                          onChange={(e) => handleUpdateTestCase(idx, 'isHidden', e.target.checked)}
                          className="rounded bg-slate-900 border-slate-700"
                        />
                        Hidden
                      </label>
                      {testCases.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTestCase(idx)}
                          className="text-slate-500 hover:text-rose-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                      Input Arguments (stdin)
                    </span>
                    <input
                      type="text"
                      value={tc.input}
                      onChange={(e) => handleUpdateTestCase(idx, 'input', e.target.value)}
                      placeholder="e.g. nums = [2,7,11,15], target = 9"
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs font-mono text-slate-200"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                      Expected Return / Output (stdout)
                    </span>
                    <input
                      type="text"
                      value={tc.expectedOutput}
                      onChange={(e) => handleUpdateTestCase(idx, 'expectedOutput', e.target.value)}
                      placeholder="e.g. [0, 1]"
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs font-mono text-slate-200"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Starter Boilerplate Code */}
          <Card className="p-5 space-y-3">
            <CardTitle>TypeScript Starter Code</CardTitle>
            <textarea
              rows={6}
              value={codeTemplates.typescript}
              onChange={(e) =>
                setCodeTemplates({ ...codeTemplates, typescript: e.target.value })
              }
              className="w-full bg-[#09090b] border border-[#27272a] rounded-lg p-3 font-mono text-xs text-[#fafafa] focus:outline-none focus:border-[#3f3f46]"
            />
          </Card>
        </div>
      </div>
    </form>
  );
};
