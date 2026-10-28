# FocusFlow — Productivity & Ambient Sound Hub

A modern, highly interactive productivity web application built with **React**, **Vite**, **Tailwind CSS**, and the browser's native **Web Audio API**.

---

## ✨ Features & Interactivity

1. **Circular SVG Pomodoro Timer**
   - 3 Modes: Focus (25m), Short Break (5m), Long Break (15m).
   - Radial progress ring with real-time countdown, completion bell chime, and celebratory confetti.
   - Attach tasks directly from your Kanban board to stay focused on one goal at a time.
   - Quick +1 min / +5 min boosters and custom session length settings.

2. **Interactive Drag-and-Drop Kanban Board**
   - 3 Stages: **To Do** 📝, **In Progress** ⚡, **Done** 🎉.
   - Native HTML5 drag-and-drop support with hover drop zones and keyboard/button quick navigation.
   - Filter by category (*Design, Audio, Study, Health, etc.*) and priority (*Urgent, High, Medium, Low*).
   - Rewarding confetti explosion upon finishing tasks.

3. **Procedural Ambient Sound Generator**
   - Synthesizes 5 relaxing ambient soundscapes using the browser's **Web Audio API** (zero heavy external audio files needed):
     - 🌧️ **Gentle Rain**: Pink noise low-pass filtered with natural droplet dynamics.
     - 🌊 **Ocean Surf**: Rhythmic rolling coastal wave simulation with low-frequency sweep.
     - 🧘 **Deep Focus Drone**: 432Hz binaural drone with sub-harmonics.
     - 🏞️ **Mountain Stream**: Resonant bandpass water ripples.
     - 📻 **White Noise**: Distraction-blocking acoustic mask.
   - Multi-layer sound mixing with individual sliders, master volume, and animated equalizer bars.

4. **Daily Analytics & Streak Tracker**
   - Tracks total focus minutes logged today, completed sessions, and tasks finished.
   - Dynamic progress bar towards daily goal (4 sessions target).
   - Daily active streak flame with automatic date persistence in `localStorage`.

5. **Customization & Offline Ready**
   - Glassmorphism dark mode aesthetic.
   - Fully persistent via `localStorage` (all tasks and preferences stay saved).
   - 100% works offline.

---

## 🚀 Running the App

```bash
# Start development server
npm run dev

# Or build for production
npm run build
```
Local URL: [http://localhost:5173](http://localhost:5173)
