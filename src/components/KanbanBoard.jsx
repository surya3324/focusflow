import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Clock, 
  Target, 
  GripVertical,
  Filter,
  Check,
  Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';

const COLUMNS = [
  { id: 'todo', title: 'To Do', badgeColor: 'bg-slate-700/50 text-slate-300' },
  { id: 'in-progress', title: 'In Progress', badgeColor: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' },
  { id: 'completed', title: 'Done', badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' },
];

const PRIORITY_STYLES = {
  urgent: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  high: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  medium: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  low: 'bg-slate-700/50 text-slate-400 border-slate-700',
};

export default function KanbanBoard({ 
  tasks, 
  onUpdateTasks, 
  onSetActiveTask, 
  activeTaskId 
}) {
  const [quickTitle, setQuickTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  // Derive categories
  const categories = ['All', ...new Set(tasks.map((t) => t.category).filter(Boolean))];

  // Add a quick task
  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    const newTask = {
      id: `t-${Date.now()}`,
      title: quickTitle.trim(),
      category: 'General',
      priority: 'medium',
      status: 'todo',
      estimatedPomodoros: 2,
      completedPomodoros: 0,
      createdAt: Date.now(),
    };

    onUpdateTasks([newTask, ...tasks]);
    setQuickTitle('');
  };

  // Move task status
  const moveTask = (taskId, newStatus) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        if (newStatus === 'completed' && t.status !== 'completed') {
          // Trigger celebratory confetti!
          try {
            confetti({
              particleCount: 50,
              spread: 50,
              origin: { y: 0.7 },
              colors: ['#10b981', '#34d399', '#6ee7b7'],
            });
          } catch (err) {}
        }
        return { ...t, status: newStatus };
      }
      return t;
    });
    onUpdateTasks(updated);
  };

  // Delete task
  const deleteTask = (taskId) => {
    onUpdateTasks(tasks.filter((t) => t.id !== taskId));
  };

  // Drag and drop handlers
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      moveTask(taskId, targetStatus);
    }
    setDraggedTaskId(null);
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchCat = selectedCategory === 'All' || t.category === selectedCategory;
    const matchPrio = filterPriority === 'All' || t.priority === filterPriority.toLowerCase();
    return matchCat && matchPrio;
  });

  return (
    <div className="flex flex-col gap-5">
      {/* Top Bar: Quick Add & Filters */}
      <div className="glass-panel rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row gap-4 items-center justify-between border border-slate-800/80 shadow-xl">
        {/* Quick Add Form */}
        <form onSubmit={handleQuickAdd} className="w-full md:w-auto flex-1 flex items-center gap-2">
          <input
            type="text"
            placeholder="Add a new task (e.g. 'Build UI components')..."
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 transition"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center gap-1.5 transition active:scale-95 shadow-md shadow-indigo-600/30 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </form>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
              ))}
            </select>
          </div>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* 3-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {COLUMNS.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className="glass-panel rounded-3xl p-4 sm:p-5 flex flex-col min-h-[460px] border border-slate-800/80 shadow-lg transition-colors hover:border-slate-700/80"
            >
              {/* Column Title */}
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/60">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm tracking-tight text-white">{col.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${col.badgeColor}`}>
                    {colTasks.length}
                  </span>
                </div>
              </div>

              {/* Cards Container */}
              <div className="flex flex-col gap-3 flex-1">
                {colTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center flex-1 border-2 border-dashed border-slate-800/60 rounded-2xl p-6 text-center text-slate-500">
                    <p className="text-xs">Drag tasks here or click arrow to move</p>
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const isSelected = activeTaskId === task.id;
                    const priorityClass = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium;

                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        className={`glass-card rounded-2xl p-4 flex flex-col gap-2.5 cursor-grab active:cursor-grabbing border ${
                          isSelected
                            ? 'ring-2 ring-indigo-500 border-indigo-400/50 bg-slate-900/95'
                            : 'border-slate-800/80 bg-slate-900/60'
                        }`}
                      >
                        {/* Tags & Priority Row */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border uppercase tracking-wider ${priorityClass}`}>
                              {task.priority}
                            </span>
                            {task.category && (
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60">
                                {task.category}
                              </span>
                            )}
                          </div>

                          {/* Focus Button */}
                          <button
                            onClick={() => onSetActiveTask(isSelected ? null : task)}
                            className={`p-1.5 rounded-lg text-xs transition ${
                              isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'text-slate-400 hover:text-indigo-300 hover:bg-slate-800'
                            }`}
                            title={isSelected ? 'Clear from timer' : 'Set as active focus task'}
                          >
                            <Target className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Title */}
                        <p className={`text-sm font-semibold leading-snug ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                          {task.title}
                        </p>

                        {/* Pomodoro sessions count */}
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{task.completedPomodoros} / {task.estimatedPomodoros} pomodoros</span>
                        </div>

                        {/* Card Actions Footer */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 mt-1">
                          {/* Move Left */}
                          {col.id !== 'todo' ? (
                            <button
                              onClick={() => moveTask(task.id, col.id === 'completed' ? 'in-progress' : 'todo')}
                              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                              title="Move back"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                            </button>
                          ) : <div />}

                          {/* Delete */}
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                            title="Delete task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Move Right */}
                          {col.id !== 'completed' ? (
                            <button
                              onClick={() => moveTask(task.id, col.id === 'todo' ? 'in-progress' : 'completed')}
                              className="p-1 rounded-lg text-indigo-400 hover:text-indigo-200 hover:bg-indigo-950/50 transition flex items-center gap-1 text-xs font-medium"
                              title="Advance task"
                            >
                              <span>Next</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Done
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
