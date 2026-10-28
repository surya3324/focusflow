import React from 'react';
import { Sparkles, Flame, Volume2, HelpCircle, Settings as SettingsIcon, CheckCircle2 } from 'lucide-react';

export default function Navbar({ streak, onOpenSettings, onOpenHelp, todaySessions }) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
            <Sparkles className="w-5 h-5 animate-pulse-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                FocusFlow
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Deep Work & Ambient Sound Hub</p>
          </div>
        </div>

        {/* Right Action Badges */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Daily Streak Badge */}
          <div 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold shadow-inner transition hover:scale-105 cursor-default"
            title={`${streak} Day Streak! Keep the momentum going.`}
          >
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400/30 animate-bounce" />
            <span>{streak} Day Streak</span>
          </div>

          {/* Today's Focus Session Count */}
          <div 
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium"
            title="Focus sessions completed today"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{todaySessions} / 4 Goals</span>
          </div>

          {/* Help Button */}
          <button
            onClick={onOpenHelp}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700/60 transition"
            title="Keyboard shortcuts & Quick Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700/60 transition"
            title="Timer Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
