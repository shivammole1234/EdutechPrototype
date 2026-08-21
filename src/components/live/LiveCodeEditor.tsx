import React, { useState, useEffect } from 'react';
import {
  Play,
  Terminal,
  RotateCcw,
  Copy,
  Check,
  CodeXml,
  Sparkles,
  Lock,
  Unlock,
  Download,
  Share2,
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { executionService } from '@/services/executionService';

interface LiveCodeEditorProps {
  initialCode: string;
  language: string;
  isInstructor: boolean;
  onCodeChange?: (code: string) => void;
  onOutputChange?: (output: string) => void;
  instructorOutput?: string;
  readOnly?: boolean;
}

const TEMPLATES: Record<string, { title: string; lang: string; code: string }> = {
  bst: {
    title: 'BST Inorder & Balance',
    lang: 'typescript',
    code: `// BST Inorder Traversal & Balance Verification
class TreeNode {
  val: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;
  constructor(val: number) { this.val = val; }
}

function inorder(root: TreeNode | null): number[] {
  const res: number[] = [];
  function traverse(node: TreeNode | null) {
    if (!node) return;
    traverse(node.left);
    res.push(node.val);
    traverse(node.right);
  }
  traverse(root);
  return res;
}

const root = new TreeNode(4);
root.left = new TreeNode(2);
root.right = new TreeNode(6);
root.left.left = new TreeNode(1);
root.left.right = new TreeNode(3);

console.log("Inorder Result:", inorder(root));
`,
  },
  avl: {
    title: 'AVL Left & Right Rotations',
    lang: 'typescript',
    code: `// AVL Node & Tree Rotations
class AVLNode {
  val: number;
  height: number = 1;
  left: AVLNode | null = null;
  right: AVLNode | null = null;
  constructor(val: number) { this.val = val; }
}

function height(n: AVLNode | null): number {
  return n ? n.height : 0;
}

function rightRotate(y: AVLNode): AVLNode {
  const x = y.left!;
  const T2 = x.right;
  x.right = y;
  y.left = T2;
  y.height = Math.max(height(y.left), height(y.right)) + 1;
  x.height = Math.max(height(x.left), height(x.right)) + 1;
  return x;
}

console.log("AVL Rotation module loaded ready for test.");
`,
  },
  python_bfs: {
    title: 'Python Graph BFS Queue',
    lang: 'python',
    code: `# Graph Breadth-First Search (BFS) Traversal
from collections import deque

def bfs(graph, start_node):
    visited = set()
    queue = deque([start_node])
    visited.add(start_node)
    order = []
    
    while queue:
        vertex = queue.popleft()
        order.append(vertex)
        for neighbor in graph.get(vertex, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return order

sample_graph = {
    'A': ['B', 'C'],
    'B': ['D', 'E'],
    'C': ['F'],
    'D': [], 'E': ['F'], 'F': []
}

print("BFS Order starting at A:", bfs(sample_graph, 'A'))
`,
  },
};

export const LiveCodeEditor: React.FC<LiveCodeEditorProps> = ({
  initialCode,
  language = 'typescript',
  isInstructor,
  onCodeChange,
  onOutputChange,
  instructorOutput = '',
  readOnly = false,
}) => {
  const [code, setCode] = useState(initialCode);
  const [selectedLang, setSelectedLang] = useState(language);
  const [output, setOutput] = useState(instructorOutput);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [syncWithInstructor, setSyncWithInstructor] = useState(!isInstructor);
  const [execTime, setExecTime] = useState<number | null>(null);

  // Sync with incoming instructor code if student opted in
  useEffect(() => {
    if (syncWithInstructor || isInstructor) {
      setCode(initialCode);
    }
  }, [initialCode, syncWithInstructor, isInstructor]);

  useEffect(() => {
    if (instructorOutput) {
      setOutput(instructorOutput);
    }
  }, [instructorOutput]);

  const handleEditorChange = (value: string | undefined) => {
    const val = value || '';
    setCode(val);
    if (isInstructor && onCodeChange) {
      onCodeChange(val);
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    const start = performance.now();
    setOutput('Compiling and executing in sandbox container...');
    try {
      const res = await executionService.executeCode({
        code,
        language: selectedLang,
        testCases: [],
      });
      const end = performance.now();
      setExecTime(Math.round(end - start));
      const resText = res.stdout || res.compilerMessage || res.runtimeError || 'Program finished with return code 0 (no output).';
      setOutput(resText);
      if (isInstructor && onOutputChange) {
        onOutputChange(resText);
      }
    } catch (err: any) {
      const errText = `Execution Error: ${err?.message || 'Sandbox timeout'}`;
      setOutput(errText);
      if (isInstructor && onOutputChange) {
        onOutputChange(errText);
      }
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = selectedLang === 'python' ? 'py' : selectedLang === 'cpp' ? 'cpp' : 'ts';
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `live_session_code.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadTemplate = (key: string) => {
    const tpl = TEMPLATES[key];
    if (!tpl) return;
    setCode(tpl.code);
    setSelectedLang(tpl.lang);
    if (isInstructor && onCodeChange) {
      onCodeChange(tpl.code);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#09090b] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Editor Control Toolbar */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <CodeXml className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-100">
                {isInstructor ? 'Instructor Shared IDE (Broadcast)' : 'Live Interactive Code'}
              </span>
              <Badge variant={isInstructor ? 'primary' : syncWithInstructor ? 'success' : 'warning'} size="sm">
                {isInstructor ? 'Master' : syncWithInstructor ? 'Synced with Faculty' : 'Personal Sandbox'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Language selector */}
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            disabled={!isInstructor && syncWithInstructor}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="typescript">TypeScript</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
          </select>

          {/* Instructor Templates */}
          {isInstructor && (
            <select
              onChange={(e) => {
                if (e.target.value) loadTemplate(e.target.value);
              }}
              defaultValue=""
              className="hidden sm:block bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="" disabled>
                Code Snippets...
              </option>
              <option value="bst">BST Inorder Traversal</option>
              <option value="avl">AVL Tree Rotation</option>
              <option value="python_bfs">Python BFS Queue</option>
            </select>
          )}

          {/* Student Sync Toggle */}
          {!isInstructor && (
            <button
              onClick={() => setSyncWithInstructor(!syncWithInstructor)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition cursor-pointer ${
                syncWithInstructor
                  ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300'
                  : 'bg-amber-950/60 border-amber-700/60 text-amber-300'
              }`}
              title={syncWithInstructor ? 'Click to edit in private sandbox' : 'Click to re-sync with instructor'}
            >
              {syncWithInstructor ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              <span className="hidden sm:inline">{syncWithInstructor ? 'Follow Faculty' : 'My Scratchpad'}</span>
            </button>
          )}

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition cursor-pointer"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition cursor-pointer"
            title="Download Snippet"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Run Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={handleRunCode}
            isLoading={isRunning}
            className="bg-emerald-600 hover:bg-emerald-500 font-semibold text-white shadow-md shadow-emerald-900/30"
          >
            <Play className="w-3.5 h-3.5 mr-1 fill-white" />
            Run Sandbox
          </Button>
        </div>
      </div>

      {/* Monaco Code Editor Area */}
      <div className="flex-1 min-h-[320px] lg:min-h-[420px] bg-slate-950 relative">
        <Editor
          height="100%"
          language={selectedLang === 'cpp' ? 'cpp' : selectedLang}
          value={code}
          theme="vs-dark"
          onChange={handleEditorChange}
          options={{
            fontSize: 13,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            readOnly: !isInstructor && syncWithInstructor,
            wordWrap: 'on',
            lineNumbers: 'on',
            fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
            tabSize: 2,
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>

      {/* Sandboxed Execution Terminal Panel */}
      <div className="bg-slate-950 border-t border-slate-800 p-3 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-slate-400">
          <span className="flex items-center gap-1.5 font-semibold text-slate-200">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            Sandboxed Terminal Output
          </span>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            {execTime !== null && <span className="text-emerald-400">{execTime}ms runtime</span>}
            <span>Node.js v20 • Judge0</span>
          </div>
        </div>

        <pre className="mt-2 text-emerald-400 whitespace-pre-wrap max-h-32 overflow-y-auto leading-relaxed text-xs">
          {output || 'Click "Run Sandbox" to execute and view stdout/stderr results in real time.'}
        </pre>
      </div>
    </div>
  );
};
