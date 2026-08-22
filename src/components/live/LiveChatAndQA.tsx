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
    <div className="flex flex-col h-full bg-[#18181b] border border-[#27272a] rounded-2xl overflow-hidden shadow-sm">
      {/* Chat Header */}
      <div className="p-3 bg-[#18181b] border-b border-[#27272a] flex items-center justify-between">
        <div className="flex items-center gap-1.5 bg-[#09090b] border border-[#27272a] rounded-lg p-0.5">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
              activeTab === 'all' ? 'bg-[#27272a] text-[#fafafa] border border-[#3f3f46] shadow-xs' : 'text-[#a1a1aa] hover:text-[#fafafa]'
            }`}
          >
            Chat ({messages.length})
          </button>
          <button
            onClick={() => setActiveTab('qa')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
              activeTab === 'qa' ? 'bg-[#27272a] text-[#fafafa] border border-[#3f3f46] shadow-xs' : 'text-[#a1a1aa] hover:text-[#fafafa]'
            }`}
          >
            <HelpCircle className="w-3 h-3" />
            Q&A
          </button>
        </div>

        <Badge variant="outline" size="sm" className="bg-[#09090b] border-[#27272a] text-[#a1a1aa]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1" />
          {onlineCount} Online
        </Badge>
      </div>

      {/* Pinned Announcement Box */}
      {pinnedMessage && (
        <div className="p-2.5 bg-[#09090b] border-b border-[#27272a] flex items-start gap-2 text-xs">
          <Pin className="w-3.5 h-3.5 text-[#fafafa] shrink-0 mt-0.5 fill-[#fafafa]/20" />
          <div className="space-y-0.5 flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#a1a1aa]">Pinned Announcement</span>
            <p className="text-[#fafafa] text-[11px] truncate">{pinnedMessage.text}</p>
          </div>
        </div>
      )}

      {/* Message List */}
      <div ref={scrollRef} className="flex-1 p-3 space-y-3 overflow-y-auto min-h-[220px]">
        {filteredMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#71717a] text-xs">
            <MessageSquare className="w-8 h-8 mb-2 opacity-40 text-[#a1a1aa]" />
            <p className="font-semibold text-[#a1a1aa]">No messages in this channel yet</p>
            <p className="text-[11px] mt-0.5 text-[#71717a]">Be the first to post or ask the instructor a question!</p>
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${
                  msg.isInstructor
                    ? 'p-2.5 rounded-xl bg-[#27272a]/60 border border-[#3f3f46]'
                    : isMe
                    ? 'p-2.5 rounded-xl bg-[#09090b] border border-[#27272a]'
                    : 'p-2 rounded-lg hover:bg-[#27272a]/40 transition'
                }`}
              >
                <img
                  src={msg.senderAvatar}
                  alt={msg.senderName}
                  className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 border border-[#27272a]"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="font-bold text-xs text-[#fafafa] truncate">{msg.senderName}</span>
                      {msg.isInstructor ? (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#27272a] text-[#fafafa] font-bold border border-[#3f3f46]">
                          FACULTY
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#71717a] font-mono">Student</span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#71717a] font-mono shrink-0">{msg.time}</span>
                  </div>
                  <p className="text-xs text-[#a1a1aa] leading-relaxed break-words">{msg.text}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Fast Reactions Bar */}
      <div className="px-3 py-1.5 bg-[#09090b] border-t border-[#27272a] flex items-center gap-1.5 overflow-x-auto text-xs">
        <span className="text-[10px] text-[#71717a] font-mono">React:</span>
        {['👍 Got it', '🚀 Clear!', '💡 Insight', '❓ Question', '🔥 Super'].map((reaction) => (
          <button
            key={reaction}
            onClick={() => onSendMessage(reaction)}
            className="px-2 py-0.5 bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] hover:border-[#3f3f46] rounded-full text-[11px] text-[#fafafa] transition cursor-pointer shrink-0"
          >
            {reaction}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-3 bg-[#18181b] border-t border-[#27272a] flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isInstructor ? 'Broadcast message or lecture tip...' : 'Ask question or comment in class...'}
          className="flex-1 bg-[#09090b] border border-[#27272a] rounded-xl px-3.5 py-2 text-xs text-[#fafafa] placeholder:text-[#71717a] focus:outline-none focus:border-[#3f3f46] transition"
        />
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={!inputText.trim()}
          className="px-3.5 py-2"
        >
          <Send className="w-3.5 h-3.5" />
        </Button>
      </form>
    </div>
  );
};
