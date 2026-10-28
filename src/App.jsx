import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PomodoroTimer from './components/PomodoroTimer';
import AmbientSoundMixer from './components/AmbientSoundMixer';
import KanbanBoard from './components/KanbanBoard';
import DailyStats from './components/DailyStats';
import SettingsModal from './components/SettingsModal';
import HelpModal from './components/HelpModal';
import { 
  getStoredTasks, 
  saveStoredTasks, 
  getStoredStats, 
  saveStoredStats, 
  getStoredSettings, 
  saveStoredSettings 
} from './utils/storage';

export default function App() {
  const [tasks, setTasks] = useState(getStoredTasks);
  const [stats, setStats] = useState(getStoredStats);
  const [settings, setSettings] = useState(getStoredSettings);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    saveStoredTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    saveStoredStats(stats);
  }, [stats]);

  useEffect(() => {
    saveStoredSettings(settings);
  }, [settings]);

  // Active task object
  const activeTask = tasks.find((t) => t.id === activeTaskId) || null;

  // Handle a completed focus session
  const handleSessionComplete = (minutes) => {
    setStats((prev) => ({
      ...prev,
      totalFocusMinutes: prev.totalFocusMinutes + minutes,
      sessionsCompleted: prev.sessionsCompleted + 1,
    }));

    // If a task is actively linked, increment its completed pomodoro count
    if (activeTaskId) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === activeTaskId
            ? { ...t, completedPomodoros: (t.completedPomodoros || 0) + 1 }
            : t
        )
      );
    }
  };

  // Keyboard shortcut for Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsSettingsOpen(false);
        setIsHelpOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Ambient Background Glow Orbs */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-float" />
      <div className="fixed bottom-10 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* Top Navbar */}
      <Navbar
        streak={stats.streakDays}
        todaySessions={stats.sessionsCompleted}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 sm:py-8 flex flex-col gap-8 flex-1">
        {/* Top Section: Timer & Ambient Audio Mixer Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Pomodoro Timer (7 columns on desktop) */}
          <div className="lg:col-span-7">
            <PomodoroTimer
              settings={settings}
              onSessionComplete={handleSessionComplete}
              activeTask={activeTask}
              onClearActiveTask={() => setActiveTaskId(null)}
            />
          </div>

          {/* Soundscapes Mixer (5 columns on desktop) */}
          <div className="lg:col-span-5">
            <AmbientSoundMixer />
          </div>
        </section>

        {/* Middle Section: Daily Analytics & Streak Activity */}
        <section>
          <DailyStats stats={stats} />
        </section>

        {/* Lower Section: Interactive Kanban Board */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">Focus Task Board</h2>
              <p className="text-xs text-slate-400">Organize and drag your priorities seamlessly</p>
            </div>
          </div>

          <KanbanBoard
            tasks={tasks}
            onUpdateTasks={setTasks}
            onSetActiveTask={(task) => setActiveTaskId(task ? task.id : null)}
            activeTaskId={activeTaskId}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-slate-900 text-center text-xs text-slate-500">
        <p>Built with React & Web Audio API • 100% Offline Capable & Private</p>
      </footer>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
