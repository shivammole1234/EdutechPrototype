import React, { useState, useRef, useEffect } from 'react';
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

  const classTextareaRef = useRef<HTMLTextAreaElement>(null);
  const privateTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Dynamically calculate height based on content + 3 extra lines of buffer
  const adjustHeight = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = 'auto';
    const computedLineHeight = parseFloat(window.getComputedStyle(el).lineHeight) || 20;
    const buffer = computedLineHeight * 3;
    el.style.height = `${el.scrollHeight + buffer}px`;
  };

  useEffect(() => {
    if (activeTab === 'class' && classTextareaRef.current) {
      adjustHeight(classTextareaRef.current);
    } else if (activeTab === 'private' && privateTextareaRef.current) {
      adjustHeight(privateTextareaRef.current);
    }
  }, [notes, privateNotes, activeTab]);

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
    <div className="flex flex-col h-full bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-3 bg-[var(--bg-surface)] border-b border-[var(--border-default)] flex items-center justify-between">
        <div className="flex items-center gap-1.5 bg-[var(--bg-muted)] border border-[var(--border-default)] rounded-lg p-0.5">
          <button
            onClick={() => setActiveTab('class')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'class' ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-default)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <BookOpen className="w-3 h-3" />
            Class Lecture Notes
          </button>
          <button
            onClick={() => setActiveTab('private')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'private' ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-default)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Edit3 className="w-3 h-3" />
            My Private Notes
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-[var(--bg-muted)] hover:bg-[var(--border-default)] border border-[var(--border-default)] text-[var(--text-primary)] transition cursor-pointer"
            title="Copy Notes"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg bg-[var(--bg-muted)] hover:bg-[var(--border-default)] border border-[var(--border-default)] text-[var(--text-primary)] transition cursor-pointer"
            title="Download Notes Markdown"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor / Viewer Body */}
      <div className="flex-1 p-3 bg-[var(--bg-canvas)] overflow-y-auto min-h-[300px]">
        {activeTab === 'class' ? (
          isInstructor ? (
            <textarea
              ref={classTextareaRef}
              rows={(notes.split('\n').length || 1) + 3}
              value={notes}
              onChange={(e) => {
                if (onUpdateNotes) onUpdateNotes(e.target.value);
                adjustHeight(e.target);
              }}
              placeholder="Type shared class notes, key takeaways, and definitions..."
              className="w-full bg-transparent font-mono text-xs text-[var(--text-primary)] p-2 focus:outline-none resize-none leading-relaxed transition-[height] duration-75 block"
            />
          ) : (
            <div className="w-full font-mono text-xs text-[var(--text-primary)] p-2 whitespace-pre-wrap leading-relaxed">
              {notes || 'No shared lecture notes added yet by the instructor.'}
            </div>
          )
        ) : (
          <textarea
            ref={privateTextareaRef}
            rows={(privateNotes.split('\n').length || 1) + 3}
            value={privateNotes}
            onChange={(e) => {
              setPrivateNotes(e.target.value);
              adjustHeight(e.target);
            }}
            placeholder="Type your own private reflections, bookmarks, and homework notes..."
            className="w-full bg-transparent font-mono text-xs text-[var(--text-primary)] p-2 focus:outline-none resize-none leading-relaxed transition-[height] duration-75 block"
          />
        )}
      </div>

      <div className="p-2 bg-[var(--bg-surface)] border-t border-[var(--border-default)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
        <span>{activeTab === 'class' ? (isInstructor ? 'Auto-syncing to all student screens' : 'Synced live with faculty') : 'Private to your account'}</span>
        <span className="font-mono">Markdown Supported</span>
      </div>
    </div>
  );
};
