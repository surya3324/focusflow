import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, FastForward, Bell, Volume2, Sparkles, Check, Coffee, Target } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../utils/audioEngine';

export default function PomodoroTimer({ 
  settings, 
  onSessionComplete, 
  activeTask, 
  onClearActiveTask 
}) {
  const [mode, setMode] = useState('pomodoro'); // 'pomodoro' | 'shortBreak' | 'longBreak'
  const [timeLeft, setTimeLeft] = useState(settings.pomodoroMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);

  // Derive total duration for current mode
  const getTotalSeconds = () => {
    switch (mode) {
      case 'shortBreak':
        return settings.shortBreakMinutes * 60;
      case 'longBreak':
        return settings.longBreakMinutes * 60;
      case 'pomodoro':
      default:
        return settings.pomodoroMinutes * 60;
    }
  };

  const totalSeconds = getTotalSeconds();

  // Reset timer whenever mode or settings change
  useEffect(() => {
    setIsRunning(false);
    setTimeLeft(getTotalSeconds());
  }, [mode, settings.pomodoroMinutes, settings.shortBreakMinutes, settings.longBreakMinutes]);

  // Timer interval countdown
  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Completed!
      setIsRunning(false);
      handleComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Completion Handler
  const handleComplete = () => {
    // Sound chime
    if (settings.soundAlert) {
      audioEngine.playCompletionChime();
    }

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: mode === 'pomodoro' ? ['#6366f1', '#a855f7', '#ec4899', '#3b82f6'] : ['#10b981', '#34d399', '#6ee7b7'],
      });
    } catch (e) {
      // safe fallback
    }

    if (mode === 'pomodoro') {
      onSessionComplete(settings.pomodoroMinutes);
      // Auto transition to short break or alert
      if (settings.autoStartBreaks) {
        setMode('shortBreak');
        setIsRunning(true);
      }
    } else {
      if (settings.autoStartPomodoro) {
        setMode('pomodoro');
        setIsRunning(true);
      }
    }
  };

  const toggleRunning = () => {
    // Make sure audio context is unlocked on user interaction
    audioEngine.init();
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(totalSeconds);
  };

  const skipTimer = () => {
    if (mode === 'pomodoro') {
      setMode('shortBreak');
    } else {
      setMode('pomodoro');
    }
  };

  const addMinutes = (mins) => {
    setTimeLeft((prev) => Math.max(0, prev + mins * 60));
  };

  // Format time MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // SVG Progress circle calculations
  const progressPercent = totalSeconds > 0 ? (totalSeconds - timeLeft) / totalSeconds : 0;
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressPercent * circumference;

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col items-center relative overflow-hidden shadow-2xl border border-slate-800/80">
      {/* Background ambient radial glow */}
      <div 
        className={`absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700 ${
          mode === 'pomodoro' 
            ? 'bg-indigo-500' 
            : mode === 'shortBreak' 
            ? 'bg-emerald-500' 
            : 'bg-blue-500'
        }`} 
      />

      {/* Mode Switcher Tabs */}
      <div className="inline-flex p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 mb-6 z-10 shadow-inner">
        <button
          onClick={() => setMode('pomodoro')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            mode === 'pomodoro'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          Focus
        </button>

        <button
          onClick={() => setMode('shortBreak')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            mode === 'shortBreak'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Coffee className="w-3.5 h-3.5" />
          Short Break
        </button>

        <button
          onClick={() => setMode('longBreak')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            mode === 'longBreak'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Long Break
        </button>
      </div>

      {/* Circular SVG Timer */}
      <div className="relative my-2 flex items-center justify-center">
        <svg className="w-64 h-64 sm:w-72 sm:h-72 transform -rotate-90">
          {/* Track Circle */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            className="stroke-slate-800/80"
            strokeWidth="10"
            fill="transparent"
          />
          {/* Progress Animated Circle */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            className={`transition-all duration-500 ease-out ${
              mode === 'pomodoro' 
                ? 'stroke-indigo-500' 
                : mode === 'shortBreak' 
                ? 'stroke-emerald-400' 
                : 'stroke-blue-400'
            }`}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Countdown Display */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="font-mono text-5xl sm:text-6xl font-black tracking-tight text-white drop-shadow-md">
            {formattedTime}
          </span>
          <span className="mt-1 text-xs uppercase tracking-widest text-slate-400 font-semibold">
            {mode === 'pomodoro' ? 'Stay Locked In' : 'Take a breath & relax'}
          </span>
          
          {/* Percentage small pill */}
          <span className="mt-2 text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/50">
            {Math.round(progressPercent * 100)}% complete
          </span>
        </div>
      </div>

      {/* Linked Task Indicator */}
      {activeTask ? (
        <div className="my-3 px-4 py-2 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-300 flex items-center gap-2 max-w-sm truncate">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
          <span className="truncate">Working on: <strong className="text-white">{activeTask.title}</strong></span>
          <button 
            onClick={onClearActiveTask}
            className="ml-auto text-slate-400 hover:text-white"
            title="Detach active task"
          >
            ✕
          </button>
        </div>
      ) : (
        <p className="my-3 text-xs text-slate-500 italic">Select a task from the board to track it here</p>
      )}

      {/* Main Interactive Controls */}
      <div className="flex items-center gap-4 mt-2 z-10">
        {/* Reset Button */}
        <button
          onClick={resetTimer}
          className="p-3.5 rounded-2xl bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition active:scale-95 shadow-sm"
          title="Reset Timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Play / Pause Primary Button */}
        <button
          onClick={toggleRunning}
          className={`px-8 py-4 rounded-2xl flex items-center gap-3 text-base font-bold shadow-xl transition-all duration-200 active:scale-95 ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
              : 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white shadow-indigo-500/30 ring-2 ring-indigo-400/30'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current translate-x-0.5" />
              <span>Start Focus</span>
            </>
          )}
        </button>

        {/* Skip to Next Mode */}
        <button
          onClick={skipTimer}
          className="p-3.5 rounded-2xl bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition active:scale-95 shadow-sm"
          title="Skip to next session"
        >
          <FastForward className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Time Adjusters */}
      <div className="flex items-center gap-2 mt-4 text-xs text-slate-400">
        <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Quick Add:</span>
        <button 
          onClick={() => addMinutes(1)} 
          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 hover:text-indigo-300 border border-slate-800 transition text-[11px]"
        >
          +1 min
        </button>
        <button 
          onClick={() => addMinutes(5)} 
          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 hover:text-indigo-300 border border-slate-800 transition text-[11px]"
        >
          +5 min
        </button>
      </div>
    </div>
  );
}
