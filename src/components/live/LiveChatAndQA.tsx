import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Pin,
  HelpCircle,
  Sparkles,
  Users,
  Smile,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LiveChatMessage, User } from '@/types';

interface LiveChatAndQAProps {
  messages: LiveChatMessage[];
  currentUser: User;
  onSendMessage: (text: string, isPinned?: boolean) => void;
  onlineCount?: number;
}

export const LiveChatAndQA: React.FC<LiveChatAndQAProps> = ({
  messages,
  currentUser,
  onSendMessage,
  onlineCount = 28,
}) => {
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'qa'>('all');
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInstructor = currentUser.role === 'INSTRUCTOR';

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const pinnedMessage = messages.find((m) => m.isPinned);
  const filteredMessages =
    activeTab === 'qa'
      ? messages.filter((m) => m.text.includes('?') || m.isInstructor)
      : messages;

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Chat Header */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
              activeTab === 'all' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Chat ({messages.length})
          </button>
          <button
            onClick={() => setActiveTab('qa')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
              activeTab === 'qa' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3 h-3" />
            Q&A
          </button>
        </div>

        <Badge variant="primary" size="sm" className="bg-slate-900 border-slate-700 text-blue-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1" />
          {onlineCount} Online
        </Badge>
      </div>

      {/* Pinned Announcement Box */}
      {pinnedMessage && (
        <div className="p-2.5 bg-blue-950/40 border-b border-blue-900/40 flex items-start gap-2 text-xs">
          <Pin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5 fill-blue-400/20" />
          <div className="space-y-0.5 flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Pinned Announcement</span>
            <p className="text-slate-200 text-[11px] truncate">{pinnedMessage.text}</p>
          </div>
        </div>
      )}

      {/* Message List */}
      <div ref={scrollRef} className="flex-1 p-3 space-y-3 overflow-y-auto min-h-[220px]">
        {filteredMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 text-xs">
            <MessageSquare className="w-8 h-8 mb-2 opacity-40 text-blue-400" />
            <p className="font-semibold text-slate-400">No messages in this channel yet</p>
            <p className="text-[11px] mt-0.5">Be the first to post or ask the instructor a question!</p>
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${
                  msg.isInstructor
                    ? 'p-2.5 rounded-xl bg-blue-950/30 border border-blue-900/40'
                    : isMe
                    ? 'p-2.5 rounded-xl bg-slate-900/80 border border-slate-800'
                    : 'p-2 rounded-lg hover:bg-slate-900/40 transition'
                }`}
              >
                <img
                  src={msg.senderAvatar}
                  alt={msg.senderName}
                  className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 border border-slate-700"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="font-bold text-xs text-slate-200 truncate">{msg.senderName}</span>
                      {msg.isInstructor ? (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                          FACULTY
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono">Student</span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0">{msg.time}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed break-words">{msg.text}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Fast Reactions Bar */}
      <div className="px-3 py-1.5 bg-slate-950/80 border-t border-slate-900 flex items-center gap-1.5 overflow-x-auto text-xs">
        <span className="text-[10px] text-slate-500 font-mono">React:</span>
        {['👍 Got it', '🚀 Clear!', '💡 Insight', '❓ Question', '🔥 Super'].map((reaction) => (
          <button
            key={reaction}
            onClick={() => onSendMessage(reaction)}
            className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-full text-[11px] text-slate-300 transition cursor-pointer shrink-0"
          >
            {reaction}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isInstructor ? 'Broadcast message or lecture tip...' : 'Ask question or comment in class...'}
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
        />
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={!inputText.trim()}
          className="bg-blue-600 hover:bg-blue-500 px-3.5 py-2"
        >
          <Send className="w-3.5 h-3.5" />
        </Button>
      </form>
    </div>
  );
};
