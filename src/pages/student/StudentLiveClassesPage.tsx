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
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Cohort 2025-A</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-[var(--bg-surface-secondary)] text-[var(--text-primary)] border border-[var(--border-default)]">
              DSA & Full-Stack Systems
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight mt-1">
            Live Coding Classes & Lectures
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
            Join interactive coding lectures with Dr. Elena Rostova, live Monaco editor sync, terminal sandbox & Q&A.
          </p>
        </div>

        {activeClass && (
          <Link to={`/student/live-class/${activeClass.id}`}>
            <Button
              variant="danger"
              size="lg"
              className="shadow-sm font-bold"
            >
              <Radio className="w-4 h-4 mr-2" />
              Join Live Class in Session
            </Button>
          </Link>
        )}
      </div>

      {/* Featured Live Class Banner Card (if active) */}
      {activeClass && (
        <div className="relative overflow-hidden rounded-2xl bg-[var(--bg-surface)] border border-rose-500/30 p-6 sm:p-8 shadow-[var(--card-shadow)]">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2.5">
                <Badge variant="danger" size="sm" className="font-mono">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping mr-1.5" />
                  LIVE NOW STREAMING
                </Badge>
                <span className="text-xs font-mono text-[var(--text-muted)]">DSA 2025-A Cohort</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight leading-tight">
                {activeClass.title}
              </h3>

              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                {activeClass.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-secondary)] pt-1">
                <div className="flex items-center gap-2">
                  <img
                    src={activeClass.instructorAvatar}
                    alt={activeClass.instructorName}
                    className="w-6 h-6 rounded-full object-cover border border-[var(--border-default)]"
                  />
                  <span className="font-semibold text-[var(--text-primary)]">{activeClass.instructorName}</span>
                </div>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono text-emerald-600 dark:text-emerald-400">
                  <Users className="w-3.5 h-3.5" />
                  {activeClass.participants.length} Students Connected
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono text-[var(--text-primary)]">
                  <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
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
              <p className="text-[11px] text-center text-[var(--text-muted)] font-mono">
                Microphone & shared IDE enabled
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-[var(--border-default)] pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeTab === 'all'
              ? 'bg-[var(--bg-surface-secondary)] text-[var(--text-primary)] border border-[var(--border-default)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          All Sessions ({classes.length})
        </button>
        <button
          onClick={() => setActiveTab('live')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
            activeTab === 'live'
              ? 'bg-[var(--bg-surface-secondary)] text-[var(--text-primary)] border border-[var(--border-default)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Radio className="w-3 h-3 text-rose-500" />
          Active & Upcoming ({liveClasses.length + scheduledClasses.length})
        </button>
        <button
          onClick={() => setActiveTab('recordings')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
            activeTab === 'recordings'
              ? 'bg-[var(--bg-surface-secondary)] text-[var(--text-primary)] border border-[var(--border-default)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <BookOpen className="w-3 h-3 text-[var(--text-muted)]" />
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
                className={`p-5 flex flex-col justify-between space-y-4 transition-all ${
                  isLive
                    ? 'border-rose-500/40 bg-[var(--bg-surface)]'
                    : 'bg-[var(--bg-surface)]'
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
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                          LIVE NOW
                        </span>
                      ) : isScheduled ? (
                        'UPCOMING'
                      ) : (
                        'COMPLETED'
                      )}
                    </Badge>

                    <span className="text-[11px] text-[var(--text-muted)] font-mono">
                      {cls.scheduledTime}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-[var(--text-primary)] leading-snug">{cls.title}</h4>
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mt-1 leading-relaxed">
                      {cls.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {cls.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-md bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] text-[10px] text-[var(--text-secondary)] font-mono"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-[var(--border-default)]">
                  <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                    <div className="flex items-center gap-2">
                      <img
                        src={cls.instructorAvatar}
                        alt={cls.instructorName}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="text-[var(--text-primary)] truncate max-w-[130px] font-medium">{cls.instructorName}</span>
                    </div>
                    <span className="font-mono text-[11px]">{cls.durationMinutes} Mins</span>
                  </div>

                  {isLive ? (
                    <Link to={`/student/live-class/${cls.id}`} className="block">
                      <Button variant="primary" size="sm" className="w-full font-bold">
                        <Play className="w-3.5 h-3.5 mr-1 fill-white" />
                        Join Live Class
                      </Button>
                    </Link>
                  ) : isScheduled ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => alert(`Reminder set for "${cls.title}" on ${cls.scheduledDate} at ${cls.scheduledTime}`)}
                      className="w-full text-xs"
                    >
                      <Calendar className="w-3.5 h-3.5 mr-1 text-[var(--text-muted)]" />
                      Set Class Reminder
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => alert('Opening video lecture recording stream...')}
                        className="flex-1 text-xs"
                      >
                        <Video className="w-3.5 h-3.5 mr-1 text-emerald-600 dark:text-emerald-400" />
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
                        className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
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
