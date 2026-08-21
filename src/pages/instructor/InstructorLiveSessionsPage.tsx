import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Video,
  Radio,
  Plus,
  Play,
  Users,
  Calendar,
  Clock,
  CodeXml,
  Sparkles,
  Share2,
  CheckCircle2,
  Download,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useLiveClassStore } from '@/stores/useLiveClassStore';
import { useAuthStore } from '@/stores/useAuthStore';

export const InstructorLiveSessionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { classes, startLiveClass, getLiveClasses, getScheduledClasses, getEndedClasses } = useLiveClassStore();

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState('16:00 EST');
  const [newDuration, setNewDuration] = useState('90');

  const liveClasses = getLiveClasses();
  const scheduledClasses = getScheduledClasses();
  const endedClasses = getEndedClasses();
  const activeClass = liveClasses[0];

  const handleLaunchInstantClass = () => {
    const launched = startLiveClass({
      title: 'Live Lab: Dynamic Programming & Graph Optimization',
      topic: 'Memoization, Tabulation & Bellman-Ford Shortest Path',
      description: 'Live interactive coding lecture with real-time TypeScript sandbox execution and student Q&A.',
      instructorId: user?.id || 'usr_inst_01',
      instructorName: user?.name || 'Dr. Elena Rostova',
      instructorAvatar: user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      durationMinutes: 90,
      tags: ['DP', 'Graphs', 'Algorithms', 'TypeScript'],
    });

    navigate(`/instructor/live-classroom/${launched.id}`);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const launched = startLiveClass({
      title: newTitle.trim(),
      topic: newTopic.trim() || 'Core Algorithm & System Design Workshop',
      description: 'Scheduled live lecture for cohort students with interactive shared Monaco code editor.',
      instructorId: user?.id || 'usr_inst_01',
      instructorName: user?.name || 'Dr. Elena Rostova',
      instructorAvatar: user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      durationMinutes: parseInt(newDuration, 10) || 90,
      tags: ['LiveClass', 'Lecture', 'CodePulse'],
    });

    setShowScheduleModal(false);
    navigate(`/instructor/live-classroom/${launched.id}`);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Faculty Studio</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Live Classroom Management
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight mt-1">
            Live Coding Lab & Classroom Studio
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Host live interactive lectures with HD video stage, Monaco code broadcast, canvas whiteboard, and live quizzes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowScheduleModal(true)}
            className="bg-slate-900 border-slate-700 text-slate-200 text-xs"
          >
            <Calendar className="w-3.5 h-3.5 mr-1 text-blue-400" />
            Schedule Class
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleLaunchInstantClass}
            className="bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-lg shadow-blue-950/40 text-xs"
          >
            <Radio className="w-3.5 h-3.5 mr-1.5 animate-pulse text-rose-300" />
            Launch Instant Live Class
          </Button>
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                  <Video className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-100">Schedule Live Class</h3>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Class Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Masterclass: Dijkstra Algorithm & Min-Heap Optimization"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Key Topic / Subject</label>
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="e.g. Graph Theory, Priority Queues, Greedy Algorithms"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Time & Timezone</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Duration (Minutes)</label>
                <select
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                >
                  <option value="60">60 Minutes (1 Hour)</option>
                  <option value="90">90 Minutes (1.5 Hours)</option>
                  <option value="120">120 Minutes (2 Hours)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowScheduleModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="bg-blue-600 hover:bg-blue-500">
                  Start Broadcast Studio
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Featured Active Live Class Studio Card */}
      {activeClass && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/40 border border-blue-700/60 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="danger" size="sm" className="bg-rose-950/90 text-rose-300 border-rose-800 font-mono">
                <Radio className="w-3 h-3 mr-1 animate-ping text-rose-400" />
                BROADCASTING LIVE
              </Badge>
              <span className="text-xs text-blue-300 font-mono">Batch 2025-A Active Room</span>
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight">{activeClass.title}</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{activeClass.description}</p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1 font-mono text-emerald-400">
                <Users className="w-3.5 h-3.5" />
                {activeClass.participants.length} Active Students Connected
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono text-slate-300">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                {activeClass.durationMinutes} mins scheduled
              </span>
            </div>
          </div>

          <Link to={`/instructor/live-classroom/${activeClass.id}`}>
            <Button
              variant="primary"
              size="lg"
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 font-bold px-8 py-3 shadow-xl shadow-blue-950/60"
            >
              <Video className="w-4 h-4 mr-2" />
              Enter Broadcast Studio
            </Button>
          </Link>
        </div>
      )}

      {/* Scheduled & Past Sessions Section */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-100">Live Lectures & Course Archives</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => {
            const isLive = cls.status === 'LIVE';
            const isScheduled = cls.status === 'SCHEDULED';

            return (
              <Card
                key={cls.id}
                className={`p-5 flex flex-col justify-between space-y-4 border transition-all ${
                  isLive
                    ? 'border-blue-700/80 bg-slate-900/90 shadow-lg'
                    : 'border-slate-800 bg-slate-900/50'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={isLive ? 'danger' : isScheduled ? 'primary' : 'default'}
                      size="sm"
                    >
                      {isLive ? 'LIVE NOW' : isScheduled ? 'SCHEDULED' : 'ENDED'}
                    </Badge>
                    <span className="text-[11px] text-slate-400 font-mono">{cls.scheduledTime}</span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{cls.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">{cls.description}</p>
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

                <div className="space-y-2 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{cls.batchName.split('(')[0]}</span>
                    <span className="font-mono">{cls.durationMinutes}m</span>
                  </div>

                  {isLive ? (
                    <Link to={`/instructor/live-classroom/${cls.id}`} className="block">
                      <Button variant="primary" size="sm" className="w-full bg-blue-600 hover:bg-blue-500 font-bold">
                        <Video className="w-3.5 h-3.5 mr-1" />
                        Host Studio
                      </Button>
                    </Link>
                  ) : isScheduled ? (
                    <Link to={`/instructor/live-classroom/${cls.id}`} className="block">
                      <Button variant="outline" size="sm" className="w-full bg-slate-950 border-slate-800 text-xs">
                        <Play className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                        Start Live Broadcast
                      </Button>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => alert('Opening class archive stream...')}
                        className="flex-1 bg-slate-950 border-slate-800 text-xs text-slate-300"
                      >
                        <Video className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                        Archive
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
    </div>
  );
};

export const InstructorAnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 tracking-tight">Batch Performance Analytics</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Deep-dive student comprehension across specific algorithm topics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="p-5 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Class Average</span>
          <p className="text-3xl font-bold text-blue-400 font-mono">88.4%</p>
          <p className="text-xs text-slate-400">+4.2% higher than curriculum baseline</p>
        </Card>
        <Card className="p-5 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Top Problem Topic</span>
          <p className="text-3xl font-bold text-emerald-400 font-mono">HashMaps</p>
          <p className="text-xs text-slate-400">96% first-pass acceptance rate</p>
        </Card>
        <Card className="p-5 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Needs Review Topic</span>
          <p className="text-3xl font-bold text-amber-400 font-mono">Graph DP</p>
          <p className="text-xs text-slate-400">64% acceptance on memoization tests</p>
        </Card>
      </div>
    </div>
  );
};

export const InstructorReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 tracking-tight">Instructor Gradebooks & Reports</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Download CSV summaries of tests, attendance records, and student submission code archives.
        </p>
      </div>
      <Card className="p-6 text-xs text-slate-300">
        <p>Cohort 2025-A Full Gradebook is ready for export.</p>
        <Button variant="primary" size="sm" className="mt-4" onClick={() => alert('Exporting CSV gradebook...')}>
          Download Gradebook CSV
        </Button>
      </Card>
    </div>
  );
};

export const InstructorNotificationsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 tracking-tight">Instructor Notifications</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Submission alerts, proctor violation notifications, and student questions.
        </p>
      </div>
      <Card className="p-4 space-y-3 text-xs">
        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
          <span className="font-bold text-slate-200 block">Assessment Submission</span>
          <p className="text-slate-400">Alex Turner completed DSA Mid-Term Exam (Score: 92/100).</p>
        </div>
      </Card>
    </div>
  );
};

export const InstructorSettingsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-xl font-bold text-slate-100 tracking-tight">Faculty Preferences</h2>
      </div>
      <Card className="p-6 space-y-4 text-xs">
        <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
          <input type="checkbox" defaultChecked className="rounded bg-slate-950 border-slate-700" />
          Email me when a student submits an assessment
        </label>
        <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
          <input type="checkbox" defaultChecked className="rounded bg-slate-950 border-slate-700" />
          Real-time audible chime on proctor violation
        </label>
      </Card>
    </div>
  );
};
