import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Video,
  CodeXml,
  Pencil,
  BarChart2,
  Users,
  MessageSquare,
  FileText,
  Radio,
  ArrowLeft,
  Share2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  StopCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useLiveClassStore } from '@/stores/useLiveClassStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { attendanceService } from '@/services/attendanceService';
import { LiveVideoStage } from '@/components/live/LiveVideoStage';
import { LiveCodeEditor } from '@/components/live/LiveCodeEditor';
import { LiveWhiteboard } from '@/components/live/LiveWhiteboard';
import { LiveChatAndQA } from '@/components/live/LiveChatAndQA';
import { LivePollsWidget } from '@/components/live/LivePollsWidget';
import { LiveRosterAndHands } from '@/components/live/LiveRosterAndHands';
import { LiveNotesPanel } from '@/components/live/LiveNotesPanel';

export const InstructorLiveClassroomPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    classes,
    getClassById,
    getActiveRoom,
    updateLiveCode,
    updateInstructorOutput,
    sendChatMessage,
    createPoll,
    votePoll,
    closePoll,
    lowerHand,
    grantSpeaking,
    addWhiteboardStroke,
    clearWhiteboard,
    updateNotes,
    endLiveClass,
  } = useLiveClassStore();

  const room = id ? getClassById(id) : getActiveRoom();
  const [activeMainTab, setActiveMainTab] = useState<'editor' | 'whiteboard' | 'notes'>('editor');
  const [activeSideTab, setActiveSideTab] = useState<'chat' | 'polls' | 'roster'>('chat');
  const [isCamOn, setIsCamOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(1520); // starts ~25 mins in
  const [copiedLink, setCopiedLink] = useState(false);

  // Timer counter
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndClass = () => {
    if (!room) return;
    if (confirm('Are you sure you want to end this Live Session? All attendance records will be saved.')) {
      endLiveClass(room.id);
      navigate('/instructor/live-sessions');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!room || !user) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Live Classroom Not Found</h2>
        <p className="text-xs text-[var(--text-muted)]">The requested live class session is inactive or has expired.</p>
        <Link to="/instructor/live-sessions">
          <Button variant="primary" size="sm">
            Back to Live Sessions
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 min-h-screen pb-12">
      {/* Top Instructor Broadcast Header Bar */}
      <div className="p-3 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            to="/instructor/live-sessions"
            className="p-1.5 rounded-lg bg-[var(--bg-muted)] hover:bg-[var(--border-default)] text-[var(--text-primary)] transition"
            title="Return to Schedule"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <Badge variant="danger" size="sm" className="bg-rose-950/80 text-rose-300 border-rose-800 font-mono">
                <Radio className="w-3 h-3 mr-1 animate-ping text-rose-400" />
                BROADCASTING LIVE
              </Badge>
              <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)] truncate max-w-sm sm:max-w-md">
                {room.title}
              </h2>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
              {room.batchName} • Host: <span className="text-[var(--text-primary)] font-semibold">{room.instructorName}</span>
            </p>
          </div>
        </div>

        {/* Right Session Stats & End Session Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-muted)] border border-[var(--border-default)] rounded-xl text-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            <span className="text-[var(--text-primary)] font-bold">{formatTimer(sessionSeconds)}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="bg-[var(--bg-muted)] border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[var(--border-default)] text-xs"
          >
            <Share2 className="w-3.5 h-3.5 mr-1" />
            {copiedLink ? 'Link Copied!' : 'Invite Link'}
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={handleEndClass}
            className="bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-md shadow-rose-950/40"
          >
            <StopCircle className="w-3.5 h-3.5 mr-1" />
            End Live Class
          </Button>
        </div>
      </div>

      {/* Main Grid: Left Stage/Workspace (8 cols) & Right Chat/Roster/Polls (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Video Stage + Interactive Workspace Tabs */}
        <div className="lg:col-span-8 space-y-4">
          {/* Top Video Stage */}
          <LiveVideoStage
            room={room}
            currentUser={user}
            isCamOn={isCamOn}
            isMicOn={isMicOn}
            onToggleCam={() => setIsCamOn(!isCamOn)}
            onToggleMic={() => setIsMicOn(!isMicOn)}
            isScreenSharing={isScreenSharing}
            onShareScreen={() => setIsScreenSharing(!isScreenSharing)}
          />

          {/* Workspace Tab Switcher Bar */}
          <div className="flex items-center justify-between p-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl overflow-x-auto gap-2">
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setActiveMainTab('editor')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
                  activeMainTab === 'editor'
                    ? 'bg-[var(--bg-muted)] text-[var(--text-primary)] border border-[var(--border-default)] shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]'
                }`}
              >
                <CodeXml className="w-3.5 h-3.5" />
                Shared Code Editor
              </button>

              <button
                onClick={() => setActiveMainTab('whiteboard')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
                  activeMainTab === 'whiteboard'
                    ? 'bg-[var(--bg-muted)] text-[var(--text-primary)] border border-[var(--border-default)] shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]'
                }`}
              >
                <Pencil className="w-3.5 h-3.5" />
                Interactive Whiteboard
              </button>

              <button
                onClick={() => setActiveMainTab('notes')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
                  activeMainTab === 'notes'
                    ? 'bg-[var(--bg-muted)] text-[var(--text-primary)] border border-[var(--border-default)] shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Lecture Notes
              </button>
            </div>

            <span className="text-[11px] text-[var(--text-muted)] font-mono hidden md:inline shrink-0">
              Broadcast Active • Auto-Sync Enabled
            </span>
          </div>

          {/* Tab Content Display */}
          <div className="min-h-[460px]">
            {activeMainTab === 'editor' && (
              <LiveCodeEditor
                initialCode={room.code}
                language={room.language}
                isInstructor={true}
                instructorOutput={room.instructorOutput}
                onCodeChange={(code) => updateLiveCode(room.id, code)}
                onOutputChange={(output) => updateInstructorOutput(room.id, output)}
              />
            )}

            {activeMainTab === 'whiteboard' && (
              <LiveWhiteboard
                isInstructor={true}
                strokes={room.whiteboardStrokes}
                onAddStroke={(stroke) => addWhiteboardStroke(room.id, stroke)}
                onClear={() => clearWhiteboard(room.id)}
              />
            )}

            {activeMainTab === 'notes' && (
              <LiveNotesPanel
                notes={room.notes}
                isInstructor={true}
                currentUser={user}
                onUpdateNotes={(notes) => updateNotes(room.id, notes)}
              />
            )}
          </div>
        </div>

        {/* Right Column: Chat, Polls, and Student Roster */}
        <div className="lg:col-span-4 flex flex-col space-y-4 min-h-[600px]">
          {/* Side Tab Switcher */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl">
            <button
              onClick={() => setActiveSideTab('chat')}
              className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                activeSideTab === 'chat'
                  ? 'bg-[var(--bg-muted)] text-[var(--text-primary)] border border-[var(--border-default)] shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Chat
            </button>

            <button
              onClick={() => setActiveSideTab('polls')}
              className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                activeSideTab === 'polls'
                  ? 'bg-[var(--bg-muted)] text-[var(--text-primary)] border border-[var(--border-default)] shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              Polls ({room.polls.length})
            </button>

            <button
              onClick={() => setActiveSideTab('roster')}
              className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                activeSideTab === 'roster'
                  ? 'bg-[var(--bg-muted)] text-[var(--text-primary)] border border-[var(--border-default)] shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Roster ({room.participants.length})
            </button>
          </div>

          {/* Selected Side Tab View */}
          <div className="flex-1 flex flex-col min-h-[500px]">
            {activeSideTab === 'chat' && (
              <LiveChatAndQA
                messages={room.chatMessages}
                currentUser={user}
                onlineCount={room.participants.length}
                onSendMessage={(text) =>
                  sendChatMessage(room.id, {
                    text,
                    sender: user,
                    isPinned: text.toLowerCase().includes('important') || text.toLowerCase().includes('welcome'),
                  })
                }
              />
            )}

            {activeSideTab === 'polls' && (
              <LivePollsWidget
                polls={room.polls}
                currentUser={user}
                onCreatePoll={(poll) => createPoll(room.id, poll)}
                onVotePoll={(pollId, optId) => votePoll(room.id, pollId, optId, user.id)}
                onClosePoll={(pollId) => closePoll(room.id, pollId)}
              />
            )}

            {activeSideTab === 'roster' && (
              <LiveRosterAndHands
                participants={room.participants}
                raisedHands={room.raisedHands}
                currentUser={user}
                onGrantSpeaking={(studentId) => grantSpeaking(room.id, studentId)}
                onLowerHand={(studentId) => lowerHand(room.id, studentId)}
                onMuteAll={() => alert('All student microphones have been muted.')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
