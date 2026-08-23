import React, { useState, useEffect } from 'react';
import {
  Play,
  Terminal,
  Copy,
  Check,
  CodeXml,
  Lock,
  Unlock,
  Download,
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useThemeStore } from '@/stores/useThemeStore';
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
    title: 'AVL Rotation Algorithm',
    lang: 'typescript',
    code: `// AVL Self-Balancing Tree Node & Right Rotation
interface AVLNode {
  key: number;
  height: number;
  left: AVLNode | null;
  right: AVLNode | null;
}

function getHeight(node: AVLNode | null): number {
  return node ? node.height : 0;
}

function rightRotate(y: AVLNode): AVLNode {
  const x = y.left!;
  const T2 = x.right;

  // Perform rotation
  x.right = y;
  y.left = T2;

  // Update heights
  y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
  x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;

  return x;
}

console.log("AVL Right Rotate Function Defined & Validated.");
`,
  },
  python_bfs: {
    title: 'Python BFS Graph Queue',
    lang: 'python',
    code: `# Breadth First Search using collections.deque
from collections import deque

def bfs(graph, start_node):
    visited = set([start_node])
    queue = deque([start_node])
    traversal_order = []
    
    while queue:
        vertex = queue.popleft()
        traversal_order.append(vertex)
        
        for neighbor in graph.get(vertex, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
                
    return traversal_order

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
  const { theme } = useThemeStore();
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
    try {
      const res = await executionService.execute(code, selectedLang);
      const formatted = res.error
        ? `[Runtime Error]\n${res.error}`
        : `${res.stdout || 'Program executed successfully with no stdout output.'}`;
      setOutput(formatted);
      setExecTime(Math.round(performance.now() - start));
      if (onOutputChange) {
        onOutputChange(formatted);
      }
    } catch (err: any) {
      const errTxt = `[Execution Failure]: ${err.message || 'Sandbox engine timeout'}`;
      setOutput(errTxt);
      if (onOutputChange) onOutputChange(errTxt);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownload = () => {
    const extMap: Record<string, string> = {
      typescript: 'ts',
      javascript: 'js',
      python: 'py',
      cpp: 'cpp',
    };
    const ext = extMap[selectedLang] || 'txt';
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
    <div className="flex flex-col h-full bg-[var(--bg-canvas)] border border-[var(--border-default)] rounded-2xl overflow-hidden shadow-[var(--card-shadow)]">
      {/* Editor Control Toolbar */}
      <div className="p-3 bg-[var(--bg-surface)] border-b border-[var(--border-default)] flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[var(--bg-surface-secondary)] text-[var(--text-primary)] border border-[var(--border-default)]">
            <CodeXml className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[var(--text-primary)]">
                {isInstructor ? 'Instructor Shared IDE (Broadcast)' : 'Live Interactive Code'}
              </span>
              <Badge variant={isInstructor ? 'default' : syncWithInstructor ? 'success' : 'warning'} size="sm">
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
            className="bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] focus:border-[var(--border-focus)] rounded-lg px-2.5 py-1 text-xs text-[var(--text-primary)] focus:outline-none cursor-pointer"
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
              className="hidden sm:block bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] focus:border-[var(--border-focus)] rounded-lg px-2.5 py-1 text-xs text-[var(--text-primary)] focus:outline-none cursor-pointer"
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
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-300'
                  : 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-300'
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
            className="p-1.5 rounded-lg bg-[var(--bg-surface-secondary)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-default)] hover:border-[var(--border-hover)] text-[var(--text-primary)] transition cursor-pointer"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg bg-[var(--bg-surface-secondary)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-default)] hover:border-[var(--border-hover)] text-[var(--text-primary)] transition cursor-pointer"
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
            className="bg-emerald-600 hover:bg-emerald-500 font-semibold text-white shadow-sm shadow-emerald-600/20"
          >
            <Play className="w-3.5 h-3.5 mr-1 fill-white" />
            Run Sandbox
          </Button>
        </div>
      </div>

      {/* Monaco Code Editor Area */}
      <div className="flex-1 min-h-[320px] lg:min-h-[420px] bg-[var(--bg-canvas)] relative">
        <Editor
          height="100%"
          language={selectedLang === 'cpp' ? 'cpp' : selectedLang}
          value={code}
          theme={theme === 'dark' ? 'vs-dark' : 'vs'}
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
      <div className="bg-[var(--bg-surface)] border-t border-[var(--border-default)] p-3 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-[var(--border-default)] text-[var(--text-secondary)]">
          <span className="flex items-center gap-1.5 font-semibold text-[var(--text-primary)]">
            <Terminal className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Sandboxed Terminal Output
          </span>
          <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
            {execTime !== null && <span className="text-emerald-600 dark:text-emerald-400 font-mono">{execTime}ms runtime</span>}
            <span>Node.js v20 • Judge0</span>
          </div>
        </div>

        <pre className="mt-2 text-emerald-600 dark:text-emerald-400 whitespace-pre-wrap max-h-32 overflow-y-auto leading-relaxed text-xs font-mono">
          {output || 'Click "Run Sandbox" to execute and view stdout/stderr results in real time.'}
        </pre>
      </div>
    </div>
  );
};
