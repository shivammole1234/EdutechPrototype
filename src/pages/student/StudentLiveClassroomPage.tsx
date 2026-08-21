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
  Hand,
  Clock,
  LogOut,
  Sparkles,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useLiveClassStore } from '@/stores/useLiveClassStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { LiveVideoStage } from '@/components/live/LiveVideoStage';
import { LiveCodeEditor } from '@/components/live/LiveCodeEditor';
import { LiveWhiteboard } from '@/components/live/LiveWhiteboard';
import { LiveChatAndQA } from '@/components/live/LiveChatAndQA';
import { LivePollsWidget } from '@/components/live/LivePollsWidget';
import { LiveRosterAndHands } from '@/components/live/LiveRosterAndHands';
import { LiveNotesPanel } from '@/components/live/LiveNotesPanel';

export const StudentLiveClassroomPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    classes,
    getClassById,
    getActiveRoom,
    joinLiveClass,
    leaveLiveClass,
    sendChatMessage,
    votePoll,
    raiseHand,
    lowerHand,
  } = useLiveClassStore();

  const room = id ? getClassById(id) : getActiveRoom();
  const [activeMainTab, setActiveMainTab] = useState<'editor' | 'whiteboard' | 'notes'>('editor');
  const [activeSideTab, setActiveSideTab] = useState<'chat' | 'polls' | 'roster'>('chat');
  const [isCamOn, setIsCamOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(1520);

  // Auto-join room when component mounts
  useEffect(() => {
    if (room && user) {
      joinLiveClass(room.id, user);
    }
  }, [room?.id, user?.id]);

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

  const isHandRaised = room?.raisedHands.some(
    (h) => h.studentId === user?.id && h.status !== 'RESOLVED'
  );

  const handleToggleHand = () => {
    if (!room || !user) return;
    if (isHandRaised) {
      lowerHand(room.id, user.id);
    } else {
      raiseHand(room.id, user);
    }
  };

  const handleLeaveClass = () => {
    if (!room || !user) return;
    if (confirm('Are you sure you want to leave the live class?')) {
      leaveLiveClass(room.id, user.id);
      navigate('/student/classes');
    }
  };

  if (!room || !user) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-100">Live Classroom Not Found</h2>
        <p className="text-xs text-slate-400">There is currently no live broadcast in session for this batch.</p>
        <Link to="/student/classes">
          <Button variant="primary" size="sm">
            Back to My Classes
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 min-h-screen pb-12">
      {/* Top Header Bar */}
      <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <Link
            to="/student/classes"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Back to Classes"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <Badge variant="danger" size="sm" className="bg-rose-950/80 text-rose-300 border-rose-800 font-mono">
                <Radio className="w-3 h-3 mr-1 animate-ping text-rose-400" />
                LIVE CLASS
              </Badge>
              <h2 className="text-sm sm:text-base font-bold text-slate-100 truncate max-w-sm sm:max-w-md">
                {room.title}
              </h2>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Led by <span className="text-blue-400 font-semibold">{room.instructorName}</span> • {room.batchName}
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-200 font-bold">{formatTimer(sessionSeconds)}</span>
          </div>

          <Button
            variant={isHandRaised ? 'primary' : 'outline'}
            size="sm"
            onClick={handleToggleHand}
            className={`text-xs ${
              isHandRaised
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-200'
            }`}
          >
            <Hand className={`w-3.5 h-3.5 mr-1 ${isHandRaised ? 'animate-bounce' : ''}`} />
            {isHandRaised ? 'Hand Raised ✋' : 'Raise Hand'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLeaveClass}
            className="bg-slate-800 hover:bg-rose-950 border-slate-700 hover:border-rose-700 text-slate-300 hover:text-rose-300 text-xs"
          >
            <LogOut className="w-3.5 h-3.5 mr-1" />
            Leave Class
          </Button>
        </div>
      </div>

      {/* Main Grid: Left Stage (8 cols) & Right Chat/Roster/Polls (4 cols) */}
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
            onRaiseHand={handleToggleHand}
            isHandRaised={isHandRaised}
          />

          {/* Workspace Tab Switcher Bar */}
          <div className="flex items-center justify-between p-2 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveMainTab('editor')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeMainTab === 'editor'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <CodeXml className="w-3.5 h-3.5" />
                Live Code & Sandbox
              </button>

              <button
                onClick={() => setActiveMainTab('whiteboard')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeMainTab === 'whiteboard'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Pencil className="w-3.5 h-3.5" />
                Faculty Whiteboard
              </button>

              <button
                onClick={() => setActiveMainTab('notes')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeMainTab === 'notes'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Lecture & My Notes
              </button>
            </div>

            <span className="text-[11px] text-emerald-400 font-mono hidden sm:flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
              Real-Time Code Sync
            </span>
          </div>

          {/* Tab Content Display */}
          <div className="min-h-[460px]">
            {activeMainTab === 'editor' && (
              <LiveCodeEditor
                initialCode={room.code}
                language={room.language}
                isInstructor={false}
                instructorOutput={room.instructorOutput}
              />
            )}

            {activeMainTab === 'whiteboard' && (
              <LiveWhiteboard
                isInstructor={false}
                strokes={room.whiteboardStrokes}
              />
            )}

            {activeMainTab === 'notes' && (
              <LiveNotesPanel
                notes={room.notes}
                isInstructor={false}
                currentUser={user}
              />
            )}
          </div>
        </div>

        {/* Right Column: Chat, Polls, and Student Roster */}
        <div className="lg:col-span-4 flex flex-col space-y-4 min-h-[600px]">
          {/* Side Tab Switcher */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setActiveSideTab('chat')}
              className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                activeSideTab === 'chat'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Chat
            </button>

            <button
              onClick={() => setActiveSideTab('polls')}
              className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                activeSideTab === 'polls'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              Live Quiz ({room.polls.length})
            </button>

            <button
              onClick={() => setActiveSideTab('roster')}
              className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                activeSideTab === 'roster'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Peers ({room.participants.length})
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
                  })
                }
              />
            )}

            {activeSideTab === 'polls' && (
              <LivePollsWidget
                polls={room.polls}
                currentUser={user}
                onVotePoll={(pollId, optId) => votePoll(room.id, pollId, optId, user.id)}
              />
            )}

            {activeSideTab === 'roster' && (
              <LiveRosterAndHands
                participants={room.participants}
                raisedHands={room.raisedHands}
                currentUser={user}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
