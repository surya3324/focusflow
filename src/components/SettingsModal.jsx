import React from 'react';
import { X, Sliders, Bell, Sparkles, RotateCcw } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, settings, onSaveSettings }) {
  if (!isOpen) return null;

  const handleChange = (key, val) => {
    onSaveSettings({ ...settings, [key]: val });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-slate-700/80 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-white text-base">Timer & App Preferences</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <div className="flex flex-col gap-5 py-5">
          {/* Pomodoro Duration */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-200">Focus Duration</p>
              <p className="text-xs text-slate-400">Minutes per focus block</p>
            </div>
            <select
              value={settings.pomodoroMinutes}
              onChange={(e) => handleChange('pomodoroMinutes', parseInt(e.target.value))}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-indigo-300 font-bold focus:outline-none"
            >
              <option value={15}>15 mins</option>
              <option value={20}>20 mins</option>
              <option value={25}>25 mins (Standard)</option>
              <option value={30}>30 mins</option>
              <option value={45}>45 mins</option>
              <option value={50}>50 mins (Deep Work)</option>
            </select>
          </div>

          {/* Short Break Duration */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-200">Short Break</p>
              <p className="text-xs text-slate-400">Rest between focus sessions</p>
            </div>
            <select
              value={settings.shortBreakMinutes}
              onChange={(e) => handleChange('shortBreakMinutes', parseInt(e.target.value))}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-emerald-300 font-bold focus:outline-none"
            >
              <option value={3}>3 mins</option>
              <option value={5}>5 mins (Standard)</option>
              <option value={10}>10 mins</option>
            </select>
          </div>

          {/* Long Break Duration */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-200">Long Break</p>
              <p className="text-xs text-slate-400">Extended rest after 4 focus blocks</p>
            </div>
            <select
              value={settings.longBreakMinutes}
              onChange={(e) => handleChange('longBreakMinutes', parseInt(e.target.value))}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-blue-300 font-bold focus:outline-none"
            >
              <option value={10}>10 mins</option>
              <option value={15}>15 mins (Standard)</option>
              <option value={20}>20 mins</option>
              <option value={30}>30 mins</option>
            </select>
          </div>

          {/* Sound Alert Toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
            <div>
              <p className="text-sm font-semibold text-slate-200">Session Sound Chime</p>
              <p className="text-xs text-slate-400">Play pleasant bell on completion</p>
            </div>
            <input
              type="checkbox"
              checked={settings.soundAlert}
              onChange={(e) => handleChange('soundAlert', e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700"
            />
          </div>

          {/* Auto Start Breaks */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-200">Auto-start Breaks</p>
              <p className="text-xs text-slate-400">Automatically roll into break timer</p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoStartBreaks}
              onChange={(e) => handleChange('autoStartBreaks', e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md shadow-indigo-600/30"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
}
