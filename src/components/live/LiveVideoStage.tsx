import React, { useEffect, useRef, useState } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Maximize2,
  Minimize2,
  Radio,
  Sparkles,
  Volume2,
  Users,
  Hand,
  MonitorUp,
  Settings2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LiveClassRoom, LiveParticipant, User } from '@/types';

interface LiveVideoStageProps {
  room: LiveClassRoom;
  currentUser: User;
  onToggleCam?: () => void;
  onToggleMic?: () => void;
  isCamOn?: boolean;
  isMicOn?: boolean;
  onRaiseHand?: () => void;
  isHandRaised?: boolean;
  onShareScreen?: () => void;
  isScreenSharing?: boolean;
}

export const LiveVideoStage: React.FC<LiveVideoStageProps> = ({
  room,
  currentUser,
  onToggleCam,
  onToggleMic,
  isCamOn = true,
  isMicOn = true,
  onRaiseHand,
  isHandRaised = false,
  onShareScreen,
  isScreenSharing = false,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [streamActive, setStreamActive] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInstructor = currentUser.role === 'INSTRUCTOR';

  // Request actual camera stream if user is instructor or has camera enabled
  useEffect(() => {
    let localStream: MediaStream | null = null;

    async function initCamera() {
      if (!isCamOn) {
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
          tracks.forEach((t) => t.stop());
          videoRef.current.srcObject = null;
        }
        setStreamActive(false);
        return;
      }

      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false,
          });
          localStream = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
            setStreamActive(true);
            setVideoError(null);
          }
        } else {
          setStreamActive(false);
        }
      } catch (err) {
        // Fallback gracefully to animated studio avatar if browser camera permission is not granted
        setStreamActive(false);
        setVideoError('Camera access denied or unavailable. Studio virtual video active.');
      }
    }

    if (isInstructor) {
      initCamera();
    }

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isCamOn, isInstructor]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const activeParticipantsCount = room.participants.length || 1;
  const speakingStudent = room.participants.find((p) => p.isSpeaking && p.role === 'STUDENT');

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#09090b] border border-[#27272a] rounded-2xl overflow-hidden shadow-sm flex flex-col group min-h-[300px] lg:min-h-[340px]"
    >
      {/* Top Header Overlay */}
      <div className="absolute top-0 inset-x-0 z-20 p-3 bg-gradient-to-b from-[#09090b]/90 via-[#09090b]/50 to-transparent flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2.5">
          <Badge variant="danger" size="sm" className="animate-pulse bg-rose-950/80 text-rose-300 border-rose-800/60 font-mono">
            <Radio className="w-3 h-3 mr-1 animate-ping text-rose-400" />
            LIVE
          </Badge>
          <span className="text-xs font-semibold text-[#fafafa] truncate max-w-[200px] sm:max-w-xs">
            {room.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" size="sm" className="bg-[#18181b]/80 border-[#27272a] text-[#a1a1aa]">
            <Users className="w-3 h-3 mr-1 text-[#fafafa]" />
            {activeParticipantsCount} Connected
          </Badge>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-[#18181b]/80 hover:bg-[#27272a] text-[#a1a1aa] hover:text-[#fafafa] border border-[#27272a] transition cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Video Viewport */}
      <div className="relative flex-1 flex items-center justify-center bg-[#101011] overflow-hidden">
        {/* Real Video element if active */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${streamActive && isCamOn ? 'block' : 'hidden'}`}
        />

        {/* Studio Stream Simulation or Fallback Avatar */}
        {(!streamActive || !isCamOn) && (
          <div className="flex flex-col items-center justify-center p-6 text-center z-10 space-y-4">
            <div className="relative">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border border-[#3f3f46] shadow-xl bg-[#18181b]">
                <img
                  src={room.instructorAvatar}
                  alt={room.instructorName}
                  className="w-full h-full object-cover"
                />
                {/* Audio pulse ring */}
                <div className="absolute inset-0 ring-4 ring-emerald-400/40 rounded-3xl animate-pulse" />
              </div>
              <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-[#27272a] text-[#fafafa] shadow-lg border border-[#3f3f46]">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <h4 className="text-sm sm:text-base font-bold text-[#fafafa]">{room.instructorName}</h4>
                <Badge variant="default" size="sm">Faculty Host</Badge>
              </div>
              <p className="text-xs text-[#a1a1aa] font-mono">Audio High-Definition 48kHz Stereo</p>
            </div>

            {/* Audio Waveform visualizer simulation */}
            <div className="flex items-center gap-1 h-5 pt-1">
              {[40, 75, 90, 50, 85, 100, 60, 45, 80, 95, 60, 30].map((h, i) => (
                <span
                  key={i}
                  className="w-1 bg-emerald-400/80 rounded-full animate-pulse"
                  style={{
                    height: `${h}%`,
                    animationDelay: `${i * 90}ms`,
                    animationDuration: '1.2s',
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Speaking Student Spotlight Overlay (if student was granted microphone) */}
        {speakingStudent && (
          <div className="absolute bottom-16 right-4 z-20 p-2 bg-[#18181b]/95 border border-emerald-500/50 rounded-xl shadow-2xl flex items-center gap-2.5 backdrop-blur-md">
            <img
              src={speakingStudent.avatar}
              alt={speakingStudent.name}
              className="w-8 h-8 rounded-lg object-cover ring-2 ring-emerald-400"
            />
            <div className="text-left text-xs">
              <span className="font-semibold text-[#fafafa] flex items-center gap-1">
                <Volume2 className="w-3 h-3 text-emerald-400 animate-pulse" />
                {speakingStudent.name}
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Live Speaker</span>
            </div>
          </div>
        )}

        {/* Small Peers Strip */}
        <div className="absolute top-14 right-3 z-10 flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
          {room.participants
            .filter((p) => p.id !== room.instructorId)
            .slice(0, 4)
            .map((p) => (
              <div
                key={p.id}
                className="relative w-10 h-10 rounded-xl overflow-hidden border border-[#27272a] bg-[#18181b] shadow-md group/peer"
                title={`${p.name} (${p.role})`}
              >
                <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                {p.handRaised && (
                  <div className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-amber-500 text-slate-950">
                    <Hand className="w-2.5 h-2.5" />
                  </div>
                )}
                {p.isSpeaking && (
                  <div className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-slate-950 animate-ping" />
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Bottom Media Controls Bar */}
      <div className="p-3 bg-[#09090b] border-t border-[#27272a] flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          {/* Mic Button */}
          <Button
            variant={isMicOn ? 'outline' : 'danger'}
            size="sm"
            onClick={onToggleMic}
            className={isMicOn ? 'bg-[#18181b] border-[#27272a] text-[#fafafa] hover:border-[#3f3f46]' : 'bg-rose-600 text-white'}
          >
            {isMicOn ? <Mic className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> : <MicOff className="w-3.5 h-3.5 mr-1.5" />}
            {isMicOn ? 'Mute' : 'Unmuted'}
          </Button>

          {/* Cam Button */}
          <Button
            variant={isCamOn ? 'outline' : 'danger'}
            size="sm"
            onClick={onToggleCam}
            className={isCamOn ? 'bg-[#18181b] border-[#27272a] text-[#fafafa] hover:border-[#3f3f46]' : 'bg-rose-600 text-white'}
          >
            {isCamOn ? <Video className="w-3.5 h-3.5 mr-1.5 text-[#fafafa]" /> : <VideoOff className="w-3.5 h-3.5 mr-1.5" />}
            {isCamOn ? 'Stop Video' : 'Start Video'}
          </Button>

          {/* Screen Share (for instructor) */}
          {isInstructor && onShareScreen && (
            <Button
              variant={isScreenSharing ? 'primary' : 'outline'}
              size="sm"
              onClick={onShareScreen}
              className={isScreenSharing ? 'bg-[#fafafa] text-[#09090b]' : 'bg-[#18181b] border-[#27272a] text-[#fafafa] hover:border-[#3f3f46]'}
            >
              <MonitorUp className="w-3.5 h-3.5 mr-1.5" />
              {isScreenSharing ? 'Sharing Screen' : 'Share Screen'}
            </Button>
          )}

          {/* Raise Hand (for student) */}
          {!isInstructor && onRaiseHand && (
            <Button
              variant={isHandRaised ? 'primary' : 'outline'}
              size="sm"
              onClick={onRaiseHand}
              className={isHandRaised ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-[#18181b] border-[#27272a] text-[#fafafa] hover:border-[#3f3f46]'}
            >
              <Hand className={`w-3.5 h-3.5 mr-1.5 ${isHandRaised ? 'animate-bounce' : ''}`} />
              {isHandRaised ? 'Hand Raised ✋' : 'Raise Hand'}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-[#a1a1aa]">
          <span className="hidden sm:inline font-mono text-[11px] text-[#71717a]">
            HD 1080p • 60 FPS • WebRTC
          </span>
        </div>
      </div>
    </div>
  );
};
