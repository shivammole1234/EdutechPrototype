import React from 'react';
import {
  Users,
  Hand,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  Check,
  X,
  Shield,
  VolumeX,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LiveParticipant, LiveHandRaise, User } from '@/types';

interface LiveRosterAndHandsProps {
  participants: LiveParticipant[];
  raisedHands: LiveHandRaise[];
  currentUser: User;
  onGrantSpeaking?: (studentId: string) => void;
  onLowerHand?: (studentId: string) => void;
  onMuteAll?: () => void;
}

export const LiveRosterAndHands: React.FC<LiveRosterAndHandsProps> = ({
  participants,
  raisedHands,
  currentUser,
  onGrantSpeaking,
  onLowerHand,
  onMuteAll,
}) => {
  const isInstructor = currentUser.role === 'INSTRUCTOR';

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100">Class Roster & Speaking Queue</h4>
            <p className="text-[10px] text-slate-400">{participants.length} Active in Classroom</p>
          </div>
        </div>

        {isInstructor && onMuteAll && (
          <Button variant="outline" size="sm" onClick={onMuteAll} className="bg-slate-900 border-slate-700 text-xs">
            <VolumeX className="w-3.5 h-3.5 mr-1 text-rose-400" />
            Mute All
          </Button>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 p-3 overflow-y-auto space-y-4">
        {/* Raised Hands Priority Queue */}
        {raisedHands.length > 0 && (
          <div className="p-3 bg-amber-950/30 border border-amber-800/50 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Hand className="w-3.5 h-3.5 animate-bounce text-amber-400" />
                Raised Hands ({raisedHands.length})
              </span>
              <span className="text-[10px] text-amber-400 font-mono">Action Needed</span>
            </div>

            <div className="space-y-2">
              {raisedHands.map((hand) => (
                <div
                  key={hand.id}
                  className="p-2 bg-slate-900/90 border border-amber-700/40 rounded-lg flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={hand.studentAvatar}
                      alt={hand.studentName}
                      className="w-7 h-7 rounded-full object-cover shrink-0"
                    />
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-200 truncate">{hand.studentName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">Raised @ {hand.raisedAt}</p>
                    </div>
                  </div>

                  {isInstructor && (
                    <div className="flex items-center gap-1 shrink-0">
                      {onGrantSpeaking && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => onGrantSpeaking(hand.studentId)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-[11px] px-2 py-1 h-7"
                          title="Grant Audio Speaking Permission"
                        >
                          <Volume2 className="w-3 h-3 mr-1" />
                          Allow Mic
                        </Button>
                      )}
                      {onLowerHand && (
                        <button
                          onClick={() => onLowerHand(hand.studentId)}
                          className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                          title="Lower Hand"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Full Participant Roster */}
        <div className="space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1">
            Connected Peers & Faculty
          </div>

          {participants.map((p) => (
            <div
              key={p.id}
              className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-2 hover:border-slate-700 transition"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-700"
                  />
                  {p.isSpeaking && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-ping" />
                  )}
                </div>

                <div className="truncate">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-xs font-bold text-slate-200 truncate">{p.name}</span>
                    {p.id === currentUser.id && (
                      <span className="text-[10px] text-slate-400 font-mono">(You)</span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    {p.role === 'INSTRUCTOR' ? 'Lead Faculty' : 'Student • 2025-A'}
                  </span>
                </div>
              </div>

              {/* Status Icons */}
              <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
                {p.handRaised && (
                  <Badge variant="warning" size="sm" className="px-1.5 py-0">
                    <Hand className="w-2.5 h-2.5" />
                  </Badge>
                )}
                <div className={`p-1 rounded ${p.micOn ? 'text-emerald-400 bg-emerald-950/40' : 'text-slate-500'}`}>
                  {p.micOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                </div>
                <div className={`p-1 rounded ${p.camOn ? 'text-blue-400 bg-blue-950/40' : 'text-slate-500'}`}>
                  {p.camOn ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
