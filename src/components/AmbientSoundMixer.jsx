import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  CloudRain, 
  Waves, 
  Zap, 
  Radio, 
  Sparkles,
  Sliders
} from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

const SOUND_LIST = [
  {
    id: 'rain',
    title: 'Gentle Rain',
    desc: 'Soft steady rainfall on leaves',
    icon: CloudRain,
    color: 'from-blue-500/20 to-indigo-500/10',
    accent: 'text-blue-400',
    defaultVol: 0.6,
  },
  {
    id: 'ocean',
    title: 'Ocean Surf',
    desc: 'Rhythmic rolling coastal waves',
    icon: Waves,
    color: 'from-cyan-500/20 to-blue-500/10',
    accent: 'text-cyan-400',
    defaultVol: 0.5,
  },
  {
    id: 'deepFocus',
    title: 'Deep Focus Drone',
    desc: 'Theta wave 432Hz binaural drone',
    icon: Zap,
    color: 'from-purple-500/20 to-indigo-500/10',
    accent: 'text-purple-400',
    defaultVol: 0.35,
  },
  {
    id: 'stream',
    title: 'Mountain Stream',
    desc: 'Fresh flowing creek water',
    icon: Sparkles,
    color: 'from-emerald-500/20 to-teal-500/10',
    accent: 'text-emerald-400',
    defaultVol: 0.5,
  },
  {
    id: 'whiteNoise',
    title: 'White Noise',
    desc: 'Blocks outside voices & chatter',
    icon: Radio,
    color: 'from-slate-500/20 to-slate-700/10',
    accent: 'text-slate-300',
    defaultVol: 0.4,
  },
];

export default function AmbientSoundMixer() {
  const [activeSounds, setActiveSounds] = useState({});
  const [volumes, setVolumes] = useState({
    rain: 0.6,
    ocean: 0.5,
    deepFocus: 0.35,
    stream: 0.5,
    whiteNoise: 0.4,
  });
  const [masterMuted, setMasterMuted] = useState(false);
  const [masterVolume, setMasterVolume] = useState(0.7);

  const toggleSound = (soundId) => {
    audioEngine.init();
    const isCurrentlyActive = !!activeSounds[soundId];
    if (isCurrentlyActive) {
      audioEngine.stopSound(soundId);
      setActiveSounds((prev) => ({ ...prev, [soundId]: false }));
    } else {
      const vol = volumes[soundId] || 0.5;
      audioEngine.startSound(soundId, vol);
      setActiveSounds((prev) => ({ ...prev, [soundId]: true }));
    }
  };

  const handleVolumeChange = (soundId, newVol) => {
    setVolumes((prev) => ({ ...prev, [soundId]: newVol }));
    if (activeSounds[soundId]) {
      audioEngine.setSoundVolume(soundId, newVol);
    }
  };

  const handleMasterVolumeChange = (newVol) => {
    setMasterVolume(newVol);
    if (!masterMuted) {
      audioEngine.setMasterVolume(newVol);
    }
  };

  const toggleMasterMute = () => {
    if (masterMuted) {
      audioEngine.setMasterVolume(masterVolume);
      setMasterMuted(false);
    } else {
      audioEngine.setMasterVolume(0);
      setMasterMuted(true);
    }
  };

  const muteAll = () => {
    Object.keys(activeSounds).forEach((id) => {
      if (activeSounds[id]) {
        audioEngine.stopSound(id);
      }
    });
    setActiveSounds({});
  };

  const anyActive = Object.values(activeSounds).some(Boolean);

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800/80">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Ambient Soundscapes</h2>
            <p className="text-xs text-slate-400">Procedural audio mixer to boost focus</p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3">
          {anyActive && (
            <button
              onClick={muteAll}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20 hover:bg-rose-500/20 transition"
            >
              Stop All
            </button>
          )}

          <button
            onClick={toggleMasterMute}
            className={`p-2 rounded-xl border transition ${
              masterMuted
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
            }`}
            title={masterMuted ? 'Unmute' : 'Mute Sound'}
          >
            {masterMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Master Volume Bar */}
      <div className="mb-5 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/70 flex items-center gap-3">
        <span className="text-xs font-semibold text-slate-400 min-w-16">Master:</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={masterMuted ? 0 : masterVolume}
          onChange={(e) => handleMasterVolumeChange(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
        <span className="text-xs font-mono text-slate-400 w-8 text-right">
          {Math.round((masterMuted ? 0 : masterVolume) * 100)}%
        </span>
      </div>

      {/* Sound Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
        {SOUND_LIST.map((sound) => {
          const Icon = sound.icon;
          const isActive = !!activeSounds[sound.id];
          const volume = volumes[sound.id] ?? sound.defaultVol;

          return (
            <div
              key={sound.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                isActive
                  ? 'bg-slate-900/90 border-indigo-500/40 shadow-lg shadow-indigo-500/5'
                  : 'bg-slate-900/40 border-slate-800/60 hover:border-slate-700/60'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                {/* Icon & Title Button */}
                <button
                  onClick={() => toggleSound(sound.id)}
                  className="flex items-center gap-3 text-left flex-1 group"
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400/30'
                        : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold transition ${isActive ? 'text-white' : 'text-slate-300'}`}>
                        {sound.title}
                      </span>
                      {isActive && (
                        <div className="flex items-end gap-0.5 h-3">
                          <span className="w-0.5 h-full bg-indigo-400 animate-pulse" />
                          <span className="w-0.5 h-2 bg-indigo-300 animate-pulse delay-75" />
                          <span className="w-0.5 h-3 bg-indigo-500 animate-pulse delay-150" />
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{sound.desc}</p>
                  </div>
                </button>

                {/* State Tag */}
                <button
                  onClick={() => toggleSound(sound.id)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition ${
                    isActive
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-white'
                  }`}
                >
                  {isActive ? 'Playing' : 'Play'}
                </button>
              </div>

              {/* Slider appears when active or hovered */}
              {isActive && (
                <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center gap-3">
                  <span className="text-[11px] text-slate-400 font-medium min-w-12">Volume:</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => handleVolumeChange(sound.id, parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <span className="text-[11px] font-mono text-slate-400 w-7 text-right">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
