// Web Audio API Procedural Ambient Sound Engine & Chimes

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.sounds = {};
    this.initialized = false;
  }

  init() {
    if (this.initialized && this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      console.warn('Web Audio API is not supported in this browser.');
      return;
    }

    this.ctx = new AudioContextClass();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
    this.initialized = true;
  }

  setMasterVolume(val) {
    if (!this.initialized) this.init();
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime);
    }
  }

  // Generate a buffer of white noise
  createWhiteNoiseBuffer(seconds = 5) {
    const bufferSize = this.ctx.sampleRate * seconds;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // Generate pink noise buffer
  createPinkNoiseBuffer(seconds = 5) {
    const bufferSize = this.ctx.sampleRate * seconds;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  // Play a specific ambient sound
  startSound(soundId, volume = 0.5) {
    this.init();
    if (this.sounds[soundId]?.active) {
      this.setSoundVolume(soundId, volume);
      return;
    }

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
    gainNode.connect(this.masterGain);

    let nodes = [];

    switch (soundId) {
      case 'rain': {
        const noiseBuffer = this.createPinkNoiseBuffer(5);
        const noiseSrc = this.ctx.createBufferSource();
        noiseSrc.buffer = noiseBuffer;
        noiseSrc.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, this.ctx.currentTime);

        noiseSrc.connect(filter);
        filter.connect(gainNode);
        noiseSrc.start();
        nodes = [noiseSrc, filter];
        break;
      }

      case 'ocean': {
        const noiseBuffer = this.createPinkNoiseBuffer(6);
        const noiseSrc = this.ctx.createBufferSource();
        noiseSrc.buffer = noiseBuffer;
        noiseSrc.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.Q.setValueAtTime(2, this.ctx.currentTime);
        filter.frequency.setValueAtTime(400, this.ctx.currentTime);

        // LFO for surf wave rhythm
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // ~8 sec wave period
        lfoGain.gain.setValueAtTime(250, this.ctx.currentTime);

        lfo.connect(filter.frequency);
        lfo.start();

        noiseSrc.connect(filter);
        filter.connect(gainNode);
        noiseSrc.start();
        nodes = [noiseSrc, filter, lfo, lfoGain];
        break;
      }

      case 'deepFocus': {
        // Binaural / Warm drone (432Hz + 438Hz = 6Hz Theta wave beat)
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const droneGain = this.ctx.createGain();
        droneGain.gain.setValueAtTime(0.25, this.ctx.currentTime);

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(108, this.ctx.currentTime); // Deep root
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(114, this.ctx.currentTime); // 6Hz binaural beat

        const sub = this.ctx.createOscillator();
        sub.type = 'triangle';
        sub.frequency.setValueAtTime(54, this.ctx.currentTime);

        osc1.connect(droneGain);
        osc2.connect(droneGain);
        sub.connect(droneGain);
        droneGain.connect(gainNode);

        osc1.start();
        osc2.start();
        sub.start();
        nodes = [osc1, osc2, sub, droneGain];
        break;
      }

      case 'stream': {
        const noiseBuffer = this.createWhiteNoiseBuffer(4);
        const noiseSrc = this.ctx.createBufferSource();
        noiseSrc.buffer = noiseBuffer;
        noiseSrc.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(900, this.ctx.currentTime);
        filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

        noiseSrc.connect(filter);
        filter.connect(gainNode);
        noiseSrc.start();
        nodes = [noiseSrc, filter];
        break;
      }

      case 'whiteNoise': {
        const noiseBuffer = this.createWhiteNoiseBuffer(5);
        const noiseSrc = this.ctx.createBufferSource();
        noiseSrc.buffer = noiseBuffer;
        noiseSrc.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, this.ctx.currentTime);

        noiseSrc.connect(filter);
        filter.connect(gainNode);
        noiseSrc.start();
        nodes = [noiseSrc, filter];
        break;
      }

      default:
        return;
    }

    this.sounds[soundId] = {
      active: true,
      gainNode,
      nodes,
      volume,
    };
  }

  stopSound(soundId) {
    const item = this.sounds[soundId];
    if (item && item.active) {
      item.nodes.forEach(node => {
        try {
          if (node.stop) node.stop();
          if (node.disconnect) node.disconnect();
        } catch (e) {
          // Ignore already stopped
        }
      });
      item.gainNode.disconnect();
      item.active = false;
    }
  }

  setSoundVolume(soundId, volume) {
    const item = this.sounds[soundId];
    if (item && item.gainNode && this.ctx) {
      item.volume = volume;
      item.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime);
    }
  }

  // Pleasant bell chime when a timer completes
  playCompletionChime() {
    this.init();
    if (!this.ctx) return;

    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 major chord
    const now = this.ctx.currentTime;

    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.8);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 2.0);
    });
  }
}

export const audioEngine = new AudioEngine();
