import React, { useState } from 'react';
import { Video, Mic, MicOff, VideoOff, MessageSquare, Play, Users, Terminal, Share2, CodeXml } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { executionService } from '@/services/executionService';

export const InstructorLiveSessionsPage: React.FC = () => {
  const [inRoom, setInRoom] = useState(false);
  const [code, setCode] = useState(
    `// Live Collaborative Demo: Binary Search Tree Inorder Traversal\nclass TreeNode {\n  val: number;\n  left: TreeNode | null = null;\n  right: TreeNode | null = null;\n  constructor(val: number) {\n    this.val = val;\n  }\n}\n\nfunction inorder(root: TreeNode | null): number[] {\n  const result: number[] = [];\n  function traverse(node: TreeNode | null) {\n    if (!node) return;\n    traverse(node.left);\n    result.push(node.val);\n    traverse(node.right);\n  }\n  traverse(root);\n  return result;\n}\n\nconst root = new TreeNode(4);\nroot.left = new TreeNode(2);\nroot.right = new TreeNode(6);\n\nconsole.log("Inorder Traversal Output:", inorder(root));`
  );
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  const [chatMessages, setChatMessages] = useState([
    { sender: 'Dr. Elena Rostova', text: 'Welcome everyone! Today we are tackling recursive tree traversals.', time: '14:00' },
    { sender: 'Alex Turner', text: 'Does this run in O(N) time complexity?', time: '14:02' },
    { sender: 'Dr. Elena Rostova', text: 'Yes, exactly! Each node is visited exactly once.', time: '14:03' },
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('Compiling and executing in sandbox container...');
    try {
      const res = await executionService.executeCode({
        code,
        language: 'typescript',
        testCases: [],
      });
      setOutput(res.stdout || res.compilerMessage || res.runtimeError || 'Execution finished (no stdout).');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput) return;
    setChatMessages([
      ...chatMessages,
      { sender: 'Dr. Elena Rostova', text: chatInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);
    setChatInput('');
  };

  if (!inRoom) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">Live Coding Lab & Classroom</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Conduct interactive programming lectures with shared Monaco editor, terminal, and classroom chat.
          </p>
        </div>

        <Card className="p-8 text-center max-w-xl mx-auto space-y-5 bg-slate-900 border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-blue-950/80 border border-blue-800 text-blue-400 flex items-center justify-center mx-auto shadow-lg shadow-blue-950/50">
            <Video className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Batch 2025-A: Live Algorithmic Lab</h3>
            <p className="text-xs text-slate-400 mt-1">28 students currently in waiting room</p>
          </div>
          <Button variant="primary" size="lg" onClick={() => setInRoom(true)} className="w-full">
            <Video className="w-4 h-4 mr-2" />
            Enter Live Classroom Room
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Session Control Bar */}
      <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-3">
          <Badge variant="success" size="sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1" />
            LIVE LAB IN SESSION
          </Badge>
          <span className="text-xs font-semibold text-slate-200">DSA 2025-A • Tree Traversals</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMicOn(!micOn)}
            className={micOn ? 'text-slate-300' : 'text-rose-400'}
          >
            {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCamOn(!camOn)}
            className={camOn ? 'text-slate-300' : 'text-rose-400'}
          >
            {camOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
          </Button>
          <Button variant="danger" size="sm" onClick={() => setInRoom(false)}>
            End Session
          </Button>
        </div>
      </div>

      {/* Main Classroom Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Editor & Terminal (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="p-0 overflow-hidden">
            <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <CodeXml className="w-4 h-4 text-blue-400" />
                <span>live_session_demo.ts (Shared Workspace)</span>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={handleRun}
                isLoading={isRunning}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Play className="w-3.5 h-3.5 mr-1" />
                Run Code
              </Button>
            </div>

            <textarea
              rows={16}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-slate-950 p-4 font-mono text-xs text-blue-300 focus:outline-none leading-relaxed resize-none"
            />
          </Card>

          {/* Terminal Console */}
          <Card className="p-4 bg-slate-950 font-mono text-xs space-y-2 border-slate-800">
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Sandboxed Terminal Output
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Node.js v20 • Judge0</span>
            </div>
            <pre className="text-emerald-400 whitespace-pre-wrap min-h-16 max-h-40 overflow-y-auto">
              {output || 'Click "Run Code" to execute interactive code on all student screens.'}
            </pre>
          </Card>
        </div>

        {/* Live Chat & Student List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-4 flex flex-col h-[560px] justify-between">
            <CardHeader className="mb-2 pb-2 border-b border-slate-800">
              <CardTitle className="text-xs flex items-center justify-between w-full">
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-400" /> Classroom Chat
                </span>
                <Badge variant="primary" size="sm">28 Online</Badge>
              </CardTitle>
            </CardHeader>

            <div className="flex-1 space-y-3 overflow-y-auto pr-1 text-xs">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{msg.sender}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{msg.time}</span>
                  </div>
                  <p className="text-slate-300">{msg.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="mt-3 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask or reply to class..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200"
              />
              <Button type="submit" variant="primary" size="sm">
                Send
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export const InstructorAnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 tracking-tight">Batch Performance Analytics</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Deep-dive student comprehension across specific algorithm topics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="p-5 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Class Average</span>
          <p className="text-3xl font-bold text-blue-400 font-mono">88.4%</p>
          <p className="text-xs text-slate-400">+4.2% higher than curriculum baseline</p>
        </Card>
        <Card className="p-5 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Top Problem Topic</span>
          <p className="text-3xl font-bold text-emerald-400 font-mono">HashMaps</p>
          <p className="text-xs text-slate-400">96% first-pass acceptance rate</p>
        </Card>
        <Card className="p-5 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Needs Review Topic</span>
          <p className="text-3xl font-bold text-amber-400 font-mono">Graph DP</p>
          <p className="text-xs text-slate-400">64% acceptance on memoization tests</p>
        </Card>
      </div>
    </div>
  );
};

export const InstructorReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 tracking-tight">Instructor Gradebooks & Reports</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Download CSV summaries of tests, attendance records, and student submission code archives.
        </p>
      </div>
      <Card className="p-6 text-xs text-slate-300">
        <p>Cohort 2025-A Full Gradebook is ready for export.</p>
        <Button variant="primary" size="sm" className="mt-4" onClick={() => alert('Exporting CSV gradebook...')}>
          Download Gradebook CSV
        </Button>
      </Card>
    </div>
  );
};

export const InstructorNotificationsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 tracking-tight">Instructor Notifications</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Submission alerts, proctor violation notifications, and student questions.
        </p>
      </div>
      <Card className="p-4 space-y-3 text-xs">
        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
          <span className="font-bold text-slate-200 block">Assessment Submission</span>
          <p className="text-slate-400">Alex Turner completed DSA Mid-Term Exam (Score: 92/100).</p>
        </div>
      </Card>
    </div>
  );
};

export const InstructorSettingsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-xl font-bold text-slate-100 tracking-tight">Faculty Preferences</h2>
      </div>
      <Card className="p-6 space-y-4 text-xs">
        <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
          <input type="checkbox" defaultChecked className="rounded bg-slate-950 border-slate-700" />
          Email me when a student submits an assessment
        </label>
        <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
          <input type="checkbox" defaultChecked className="rounded bg-slate-950 border-slate-700" />
          Real-time audible chime on proctor violation
        </label>
      </Card>
    </div>
  );
};
