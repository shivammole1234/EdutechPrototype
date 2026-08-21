import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Download,
  BookOpen,
  Edit3,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { User } from '@/types';

interface LiveNotesPanelProps {
  notes: string;
  isInstructor: boolean;
  onUpdateNotes?: (notes: string) => void;
  currentUser: User;
}

export const LiveNotesPanel: React.FC<LiveNotesPanelProps> = ({
  notes,
  isInstructor,
  onUpdateNotes,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState<'class' | 'private'>('class');
  const [privateNotes, setPrivateNotes] = useState(
    `# My Personal Class Notes (${new Date().toLocaleDateString()})\n\n- Key algorithm insights:\n- Questions I want to practice:\n- Follow up on BST balancing complexity.`
  );
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = activeTab === 'class' ? notes : privateNotes;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const textToDownload = activeTab === 'class' ? notes : privateNotes;
    const blob = new Blob([textToDownload], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab === 'class' ? 'lecture_notes' : 'my_notes'}_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
          <button
            onClick={() => setActiveTab('class')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'class' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3 h-3" />
            Class Lecture Notes
          </button>
          <button
            onClick={() => setActiveTab('private')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'private' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Edit3 className="w-3 h-3" />
            My Private Notes
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition cursor-pointer"
            title="Copy Notes"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition cursor-pointer"
            title="Download Notes Markdown"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor / Viewer Body */}
      <div className="flex-1 p-3 bg-[#09090b]">
        {activeTab === 'class' ? (
          isInstructor ? (
            <textarea
              value={notes}
              onChange={(e) => onUpdateNotes && onUpdateNotes(e.target.value)}
              placeholder="Type shared class notes, key takeaways, and definitions..."
              className="w-full h-full bg-transparent font-mono text-xs text-slate-200 p-2 focus:outline-none resize-none leading-relaxed"
            />
          ) : (
            <div className="w-full h-full font-mono text-xs text-slate-200 p-2 overflow-y-auto whitespace-pre-wrap leading-relaxed">
              {notes || 'No shared lecture notes added yet by the instructor.'}
            </div>
          )
        ) : (
          <textarea
            value={privateNotes}
            onChange={(e) => setPrivateNotes(e.target.value)}
            placeholder="Type your own private reflections, bookmarks, and homework notes..."
            className="w-full h-full bg-transparent font-mono text-xs text-slate-200 p-2 focus:outline-none resize-none leading-relaxed"
          />
        )}
      </div>

      <div className="p-2 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>{activeTab === 'class' ? (isInstructor ? 'Auto-syncing to all student screens' : 'Synced live with faculty') : 'Private to your account'}</span>
        <span className="font-mono">Markdown Supported</span>
      </div>
    </div>
  );
};
