import * as Tone from 'tone';
import { getInstrument } from './instruments.js';
import { createVoice } from './voices.js';

/* Multi-instrument audio engine: lazily created voices -> shared reverb -> master volume. */

const percentToDb = (p) => (p <= 0 ? -Infinity : 20 * Math.log10(p / 100));

export class AudioEngine {
  constructor({ volumePercent, onStatus }) {
    this.onStatus = onStatus;
    this.voices = new Map();
    this.pending = new Set();
    this.unlocked = false;
    try {
      // Larger audio buffer: avoids crackles when many sampled voices overlap
      if (Tone.getContext().latencyHint !== 'balanced') {
        Tone.setContext(new Tone.Context({ latencyHint: 'balanced' }));
      }
      this.master = new Tone.Volume(percentToDb(volumePercent)).toDestination();
      this.limiter = new Tone.Limiter(-3).connect(this.master);
      this.reverb = new Tone.Reverb({ decay: 2.4, preDelay: 0.015, wet: 0.2 }).connect(this.limiter);
      // Headroom: every voice sums into a lowered bus, then a gentle compressor tames peaks
      this.compressor = new Tone.Compressor({ threshold: -18, ratio: 3, attack: 0.008, release: 0.25, knee: 8 }).connect(this.reverb);
      this.bus = new Tone.Gain(0.8).connect(this.compressor);
    } catch (err) {
      console.error('Audio initialization error:', err);
      onStatus('fallback', 'Âm thanh không khả dụng');
    }
  }

  now() {
    return Tone.now();
  }

  /** Unlocks Web Audio on a user gesture. */
  unlock() {
    if (this.unlocked && Tone.getContext().state === 'running') return;
    try {
      if (Tone.getContext().state !== 'running') {
        Tone.start().then(() => { this.unlocked = true; }).catch(() => {});
      } else {
        this.unlocked = true;
      }
    } catch (err) {
      console.warn('Audio unlock error:', err);
    }
  }

  reportStatus() {
    if (this.pending.size) {
      const names = Array.from(this.pending).map((id) => getInstrument(id).name);
      const text = names.length > 2 ? `Đang tải ${names.length} nhạc cụ…` : `Đang tải ${names.join(', ')}…`;
      this.onStatus('loading', text);
    } else {
      this.onStatus('ready', 'Sẵn sàng');
    }
  }

  /** Returns (creating on first use) the voice for an instrument id. */
  voice(id) {
    let v = this.voices.get(id);
    if (v || !this.bus) return v;
    const inst = getInstrument(id);
    v = createVoice(inst, this.bus);
    this.voices.set(id, v);
    if (!v.loaded) {
      this.pending.add(id);
      this.reportStatus();
      v.ready.then((ok) => {
        this.pending.delete(id);
        if (!ok) this.onStatus('fallback', `Không tải được ${inst.name}, dùng synth`);
        else this.reportStatus();
      });
    }
    return v;
  }

  isLoaded(ids) {
    return ids.every((id) => this.voice(id)?.loaded || this.voice(id)?.failed);
  }

  /** Resolves once every listed instrument is loaded (or failed over to synth). */
  ensure(ids) {
    return Promise.all(ids.map((id) => this.voice(id)?.ready ?? Promise.resolve(false)));
  }

  attack(id, midi, velocity = 0.82) {
    this.unlock();
    this.voice(id)?.attack(midi, Tone.now(), velocity);
  }

  release(id, midi) {
    this.voices.get(id)?.release(midi, Tone.now());
  }

  play(id, midi, durationSec, time, velocity = 0.8) {
    this.voice(id)?.play(midi, durationSec, time, velocity);
  }

  silence(id) {
    const t = Tone.now();
    if (id) this.voices.get(id)?.releaseAll(t);
    else this.voices.forEach((v) => v.releaseAll(t));
  }

  setVolume(percent) {
    if (!this.master) return;
    if (percent <= 0) {
      this.master.mute = true;
    } else {
      this.master.mute = false;
      this.master.volume.rampTo(percentToDb(percent), 0.04);
    }
  }
}
