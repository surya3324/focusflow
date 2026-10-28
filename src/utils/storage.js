// LocalStorage helpers for FocusFlow

const STORAGE_KEYS = {
  TASKS: 'focusflow_tasks',
  STATS: 'focusflow_stats',
  SETTINGS: 'focusflow_settings',
};

const DEFAULT_TASKS = [
  {
    id: 't-1',
    title: 'Design initial wireframe & UI layout',
    category: 'Design',
    priority: 'high',
    status: 'in-progress',
    estimatedPomodoros: 2,
    completedPomodoros: 1,
    createdAt: Date.now() - 3600000,
  },
  {
    id: 't-2',
    title: 'Implement ambient sound synthesizer',
    category: 'Audio',
    priority: 'urgent',
    status: 'completed',
    estimatedPomodoros: 3,
    completedPomodoros: 3,
    createdAt: Date.now() - 7200000,
  },
  {
    id: 't-3',
    title: 'Write technical documentation & guide',
    category: 'Study',
    priority: 'medium',
    status: 'todo',
    estimatedPomodoros: 2,
    completedPomodoros: 0,
    createdAt: Date.now(),
  },
  {
    id: 't-4',
    title: 'Drink water & stretch 5 minutes',
    category: 'Health',
    priority: 'low',
    status: 'todo',
    estimatedPomodoros: 1,
    completedPomodoros: 0,
    createdAt: Date.now(),
  },
];

const DEFAULT_STATS = {
  totalFocusMinutes: 75,
  sessionsCompleted: 3,
  tasksFinished: 1,
  streakDays: 4,
  lastActiveDate: new Date().toISOString().split('T')[0],
};

const DEFAULT_SETTINGS = {
  pomodoroMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  autoStartBreaks: false,
  autoStartPomodoro: false,
  soundAlert: true,
  theme: 'dark',
};

export const getStoredTasks = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    return raw ? JSON.parse(raw) : DEFAULT_TASKS;
  } catch {
    return DEFAULT_TASKS;
  }
};

export const saveStoredTasks = (tasks) => {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks', e);
  }
};

export const getStoredStats = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS);
    if (!raw) return DEFAULT_STATS;
    const stats = JSON.parse(raw);
    const today = new Date().toISOString().split('T')[0];
    // Check if new day for streak calculation
    if (stats.lastActiveDate !== today) {
      const last = new Date(stats.lastActiveDate);
      const curr = new Date(today);
      const diffTime = Math.abs(curr - last);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        stats.streakDays += 1;
      } else if (diffDays > 1) {
        stats.streakDays = 1;
      }
      stats.lastActiveDate = today;
      saveStoredStats(stats);
    }
    return stats;
  } catch {
    return DEFAULT_STATS;
  }
};

export const saveStoredStats = (stats) => {
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats', e);
  }
};

export const getStoredSettings = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveStoredSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
};
