import React from 'react';
import { X, Keyboard, HelpCircle, Sparkles, CheckCircle } from 'lucide-react';

export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-lg rounded-3xl p-6 border border-slate-700/80 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-white text-base">How FocusFlow Works</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4 py-4 text-xs text-slate-300 leading-relaxed">
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
            <h4 className="font-bold text-indigo-300 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              The Flow Routine
            </h4>
            <p className="text-slate-300">
              Pick or add a task from the Kanban board, hit <strong>Start Focus</strong>, and immerse yourself for 25 minutes. Combine it with ambient rain or deep focus drone sounds to enter deep work state!
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-2 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              Interactive Features
            </h4>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400">
              <li><strong>Drag & Drop:</strong> Drag task cards directly between columns (To Do &rarr; In Progress &rarr; Done).</li>
              <li><strong>Focus Task Binding:</strong> Click the target icon on any task card to link it to the central timer.</li>
              <li><strong>Sound Mixer:</strong> Layer multiple ambient sounds together and adjust volume levels independently.</li>
              <li><strong>Celebration Confetti:</strong> Finishing tasks or timers rewards you with instant confetti animations.</li>
            </ul>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <h4 className="font-bold text-white mb-2 flex items-center gap-1.5">
              <Keyboard className="w-3.5 h-3.5 text-amber-400" />
              Keyboard Shortcuts
            </h4>
            <div className="grid grid-cols-2 gap-2 text-slate-400">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <span>Start / Pause Timer</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[10px]">Space</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <span>Close Modals</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[10px]">Esc</kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition"
          >
            Got it, Let's Focus
          </button>
        </div>
      </div>
    </div>
  );
}
