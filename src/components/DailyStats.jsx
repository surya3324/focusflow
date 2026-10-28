import React from 'react';
import { Clock, CheckCircle2, Flame, Award, TrendingUp } from 'lucide-react';

export default function DailyStats({ stats }) {
  const goalSessions = 4;
  const progressPercent = Math.min(100, Math.round((stats.sessionsCompleted / goalSessions) * 100));

  const formatHoursMinutes = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hours === 0) return `${mins}m`;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="glass-panel rounded-3xl p-6 border border-slate-800/80 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Daily Focus Activity</h3>
            <p className="text-xs text-slate-400">Keep the momentum going today</p>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
          Target: {goalSessions} Sessions
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium">
          <span>Goal Progress</span>
          <span className="text-indigo-300 font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700 ease-out shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 4 Stat Boxes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Box 1 */}
        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/70 flex flex-col">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Time Focused</span>
          </div>
          <span className="text-lg font-extrabold text-white">
            {formatHoursMinutes(stats.totalFocusMinutes)}
          </span>
        </div>

        {/* Box 2 */}
        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/70 flex flex-col">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Award className="w-3.5 h-3.5 text-purple-400" />
            <span>Sessions</span>
          </div>
          <span className="text-lg font-extrabold text-white">
            {stats.sessionsCompleted}
          </span>
        </div>

        {/* Box 3 */}
        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/70 flex flex-col">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Completed</span>
          </div>
          <span className="text-lg font-extrabold text-white">
            {stats.tasksFinished} Tasks
          </span>
        </div>

        {/* Box 4 */}
        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/70 flex flex-col">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Streak</span>
          </div>
          <span className="text-lg font-extrabold text-amber-300">
            {stats.streakDays} Days 🔥
          </span>
        </div>
      </div>
    </div>
  );
}
