import { SoundEffectType } from '../types';

class SoundController {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playKeySound(type: SoundEffectType, volume: number = 0.5, isSpace: boolean = false) {
    if (type === 'none' || volume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const gainNode = this.ctx.createGain();
    gainNode.connect(this.ctx.destination);
    gainNode.gain.setValueAtTime(volume * 0.4, now);

    if (type === 'mechanical') {
      // Crisp mechanical click
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      
      const pitch = isSpace ? 280 : 380 + Math.random() * 80;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.4, now + 0.04);

      oscGain.gain.setValueAtTime(volume * 0.3, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);

      // Add high click snap
      const snapOsc = this.ctx.createOscillator();
      const snapGain = this.ctx.createGain();
      snapOsc.type = 'square';
      snapOsc.frequency.setValueAtTime(1400 + Math.random() * 200, now);
      snapGain.gain.setValueAtTime(volume * 0.15, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
      snapOsc.connect(snapGain);
      snapGain.connect(this.ctx.destination);
      snapOsc.start(now);
      snapOsc.stop(now + 0.02);

    } else if (type === 'typewriter') {
      // Deep mechanical thock / clack
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      
      const pitch = isSpace ? 180 : 220 + Math.random() * 60;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.06);

      oscGain.gain.setValueAtTime(volume * 0.35, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);

    } else if (type === 'soft') {
      // Soft gentle bubble pop
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      
      const pitch = isSpace ? 320 : 440 + Math.random() * 50;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.7, now + 0.04);

      oscGain.gain.setValueAtTime(volume * 0.25, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    }
  }

  playErrorSound(volume: number = 0.5) {
    if (volume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(100, now + 0.12);

    gainNode.gain.setValueAtTime(volume * 0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  playComboChime(combo: number, volume: number = 0.5) {
    if (volume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const baseFreq = 523.25; // C5
    const steps = [0, 2, 4, 7, 9, 12];
    const step = steps[Math.min(Math.floor(combo / 10), steps.length - 1)];
    const freq = baseFreq * Math.pow(2, step / 12);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.2, now + 0.2);

    gain.gain.setValueAtTime(volume * 0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);
  }

  playFinishFanfare(volume: number = 0.5) {
    if (volume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const chords = [523.25, 659.25, 783.99, 1046.50]; // C - E - G - C
    chords.forEach((freq, index) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + index * 0.08;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(volume * 0.25, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.55);
    });
  }
}

export const soundManager = new SoundController();
