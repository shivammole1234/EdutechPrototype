import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Video,
  Radio,
  Clock,
  Calendar,
  Users,
  Play,
  Download,
  BookOpen,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useLiveClassStore } from '@/stores/useLiveClassStore';
import { formatDate } from '@/lib/utils';

export const StudentLiveClassesPage: React.FC = () => {
  const { classes, getLiveClasses, getScheduledClasses, getEndedClasses } = useLiveClassStore();
  const [activeTab, setActiveTab] = useState<'all' | 'live' | 'recordings'>('all');

  const liveClasses = getLiveClasses();
  const scheduledClasses = getScheduledClasses();
  const endedClasses = getEndedClasses();
  const activeClass = liveClasses[0];

  return (
    <div className="space-y-8">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Cohort 2025-A</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              DSA & Full-Stack Systems
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight mt-1">
            Live Coding Classes & Lectures
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Join interactive coding lectures with Dr. Elena Rostova, live Monaco editor sync, terminal sandbox & Q&A.
          </p>
        </div>

        {activeClass && (
          <Link to={`/student/live-class/${activeClass.id}`}>
            <Button
              variant="primary"
              size="lg"
              className="bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-950/50 animate-pulse text-white font-bold"
            >
              <Radio className="w-4 h-4 mr-2 text-rose-200" />
              Join Live Class in Session
            </Button>
          </Link>
        )}
      </div>

      {/* Featured Live Class Banner Card (if active) */}
      {activeClass && (
        <div className="relative overflow-hidden rounded-2xl bg-[#18181b] border border-[#27272a] p-6 sm:p-8 shadow-sm">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2.5">
                <Badge variant="danger" size="sm" className="bg-rose-950/90 text-rose-300 border-rose-800 font-mono">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping mr-1.5" />
                  LIVE NOW STREAMING
                </Badge>
                <span className="text-xs font-mono text-[#a1a1aa]">DSA 2025-A Cohort</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-[#fafafa] tracking-tight leading-tight">
                {activeClass.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed">
                {activeClass.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#a1a1aa] pt-1">
                <div className="flex items-center gap-2">
                  <img
                    src={activeClass.instructorAvatar}
                    alt={activeClass.instructorName}
                    className="w-6 h-6 rounded-full object-cover border border-[#27272a]"
                  />
                  <span className="font-semibold text-[#fafafa]">{activeClass.instructorName}</span>
                </div>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono text-emerald-400">
                  <Users className="w-3.5 h-3.5" />
                  {activeClass.participants.length} Students Connected
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono text-[#fafafa]">
                  <Clock className="w-3.5 h-3.5 text-[#fafafa]" />
                  {activeClass.durationMinutes} mins
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 shrink-0">
              <Link to={`/student/live-class/${activeClass.id}`}>
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto font-bold px-8 py-3 shadow-sm"
                >
                  <Play className="w-4 h-4 mr-2 fill-current" />
                  Enter Interactive Classroom
                </Button>
              </Link>
              <p className="text-[11px] text-center text-[#71717a] font-mono">
                Microphone & shared IDE enabled
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeTab === 'all'
              ? 'bg-slate-800 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All Sessions ({classes.length})
        </button>
        <button
          onClick={() => setActiveTab('live')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
            activeTab === 'live'
              ? 'bg-slate-800 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Radio className="w-3 h-3 text-rose-400" />
          Active & Upcoming ({liveClasses.length + scheduledClasses.length})
        </button>
        <button
          onClick={() => setActiveTab('recordings')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
            activeTab === 'recordings'
              ? 'bg-slate-800 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3 h-3 text-blue-400" />
          Class Recordings ({endedClasses.length})
        </button>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes
          .filter((c) => {
            if (activeTab === 'live') return c.status === 'LIVE' || c.status === 'SCHEDULED';
            if (activeTab === 'recordings') return c.status === 'ENDED';
            return true;
          })
          .map((cls) => {
            const isLive = cls.status === 'LIVE';
            const isScheduled = cls.status === 'SCHEDULED';

            return (
              <Card
                key={cls.id}
                className={`p-5 flex flex-col justify-between space-y-4 border transition-all ${
                  isLive
                    ? 'border-blue-700/80 bg-slate-900/90 shadow-xl shadow-blue-950/20'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={isLive ? 'danger' : isScheduled ? 'primary' : 'default'}
                      size="sm"
                    >
                      {isLive ? (
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                          LIVE NOW
                        </span>
                      ) : isScheduled ? (
                        'UPCOMING'
                      ) : (
                        'COMPLETED'
                      )}
                    </Badge>

                    <span className="text-[11px] text-slate-400 font-mono">
                      {cls.scheduledTime}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-100 leading-snug">{cls.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {cls.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {cls.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] text-slate-400 font-mono"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <img
                        src={cls.instructorAvatar}
                        alt={cls.instructorName}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="text-slate-300 truncate max-w-[130px]">{cls.instructorName}</span>
                    </div>
                    <span className="font-mono text-[11px]">{cls.durationMinutes} Mins</span>
                  </div>

                  {isLive ? (
                    <Link to={`/student/live-class/${cls.id}`} className="block">
                      <Button variant="primary" size="sm" className="w-full bg-blue-600 hover:bg-blue-500 font-bold">
                        <Play className="w-3.5 h-3.5 mr-1 fill-white" />
                        Join Live Class
                      </Button>
                    </Link>
                  ) : isScheduled ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => alert(`Reminder set for "${cls.title}" on ${cls.scheduledDate} at ${cls.scheduledTime}`)}
                      className="w-full bg-slate-950 border-slate-800 text-slate-300 hover:text-white text-xs"
                    >
                      <Calendar className="w-3.5 h-3.5 mr-1 text-blue-400" />
                      Set Class Reminder
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => alert('Opening video lecture recording stream...')}
                        className="flex-1 bg-slate-950 border-slate-800 text-slate-300 text-xs"
                      >
                        <Video className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                        Recording
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const blob = new Blob([cls.code], { type: 'text/plain;charset=utf-8' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `lecture_${cls.id}_code.ts`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="p-2 text-slate-400 hover:text-slate-200"
                        title="Download Lecture Code"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
      </div>
    </div>
  );
};
