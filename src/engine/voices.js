import * as Tone from 'tone';
import { midiToNote } from '../lib/music.js';
import { drumPieceFor } from './instruments.js';

/* A "voice" is one playable instrument: attack/release for live playing and
 * play() for scheduled song notes. All voices share the same small API. */

const safe = (fn) => {
  try { fn(); } catch (err) { /* overlapping mono triggers / unloaded buffers are dropped */ }
};

function makeFallbackSynth(out) {
  const s = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.012, decay: 0.35, sustain: 0.25, release: 1.1 },
    volume: -8,
  }).connect(out);
  s.maxPolyphony = 48;
  return s;
}

/* ---------- Sampled instruments ---------- */

class SamplerVoice {
  constructor(inst, out) {
    this.out = out;
    this.loaded = false;
    this.failed = false;
    this.fallback = null;
    this.ready = new Promise((resolve) => {
      this.sampler = new Tone.Sampler({
        urls: inst.urls,
        baseUrl: inst.baseUrl,
        release: inst.release ?? 1,
        attack: inst.attack ?? 0,
        onload: () => { this.loaded = true; resolve(true); },
        onerror: (err) => {
          console.warn(`Sample load failed (${inst.id}):`, err);
          this.failed = true;
          resolve(false);
        },
      }).connect(out);
    });
  }

  /** Live notes use a synth until samples arrive; scheduled song notes wait. */
  target(live) {
    if (this.loaded) return this.sampler;
    if (!live && !this.failed) return null;
    if (!this.fallback) this.fallback = makeFallbackSynth(this.out);
    return this.fallback;
  }

  attack(midi, t, vel) {
    const s = this.target(true);
    if (s) safe(() => s.triggerAttack(midiToNote(midi), t, vel));
  }

  release(midi, t) {
    const note = midiToNote(midi);
    if (this.loaded) safe(() => this.sampler.triggerRelease(note, t));
    if (this.fallback) safe(() => this.fallback.triggerRelease(note, t));
  }

  play(midi, dur, t, vel) {
    const s = this.target(false);
    if (s) safe(() => s.triggerAttackRelease(midiToNote(midi), dur, t, vel));
  }

  releaseAll(t) {
    if (this.loaded) safe(() => this.sampler.releaseAll(t));
    if (this.fallback) safe(() => this.fallback.releaseAll(t));
  }
}

/* ---------- Synthesized pitched percussion ---------- */

const SYNTHS = {
  marimba: () => new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'sine' },
    envelope: { attack: 0.002, decay: 0.55, sustain: 0, release: 0.5 },
  }),
  glock: () => new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'fmsine', harmonicity: 3.5, modulationIndex: 1.6 },
    envelope: { attack: 0.001, decay: 1.6, sustain: 0, release: 1.6 },
  }),
  timpani: () => new Tone.PolySynth(Tone.MembraneSynth, {
    pitchDecay: 0.09,
    octaves: 1.4,
    envelope: { attack: 0.003, decay: 1.8, sustain: 0, release: 1.5 },
  }),
};

class SynthVoice {
  constructor(inst, out) {
    this.loaded = true;
    this.ready = Promise.resolve(true);
    this.synth = SYNTHS[inst.synth]().connect(out);
    this.synth.maxPolyphony = 32;
  }

  attack(midi, t, vel) { safe(() => this.synth.triggerAttack(midiToNote(midi), t, vel)); }
  release(midi, t) { safe(() => this.synth.triggerRelease(midiToNote(midi), t)); }
  play(midi, dur, t, vel) { safe(() => this.synth.triggerAttackRelease(midiToNote(midi), dur, t, vel)); }
  releaseAll(t) { safe(() => this.synth.releaseAll(t)); }
}

/* ---------- Synthesized drum kit ---------- */

class DrumVoice {
  constructor(out) {
    this.loaded = true;
    this.ready = Promise.resolve(true);
    this.lastT = {};

    const bus = new Tone.Volume(0).connect(out);
    const hp = (freq) => new Tone.Filter(freq, 'highpass').connect(bus);
    const bp = (freq, q = 1) => new Tone.Filter({ frequency: freq, type: 'bandpass', Q: q }).connect(bus);

    this.kick = new Tone.MembraneSynth({
      pitchDecay: 0.045, octaves: 6, volume: 2,
      envelope: { attack: 0.001, decay: 0.42, sustain: 0, release: 0.2 },
    }).connect(bus);
    this.snareBody = new Tone.MembraneSynth({
      pitchDecay: 0.02, octaves: 2, volume: -8,
      envelope: { attack: 0.001, decay: 0.14, sustain: 0, release: 0.05 },
    }).connect(bus);
    this.snare = new Tone.NoiseSynth({
      noise: { type: 'white' }, volume: -8,
      envelope: { attack: 0.001, decay: 0.19, sustain: 0, release: 0.05 },
    }).connect(hp(1400));
    this.clap = new Tone.NoiseSynth({
      noise: { type: 'pink' }, volume: -4,
      envelope: { attack: 0.003, decay: 0.14, sustain: 0, release: 0.05 },
    }).connect(bp(1500, 0.9));
    this.rim = new Tone.NoiseSynth({
      noise: { type: 'white' }, volume: -6,
      envelope: { attack: 0.001, decay: 0.035, sustain: 0, release: 0.02 },
    }).connect(bp(2800, 2.5));
    this.toms = new Tone.PolySynth(Tone.MembraneSynth, {
      pitchDecay: 0.06, octaves: 2.5, volume: -4,
      envelope: { attack: 0.001, decay: 0.5, sustain: 0, release: 0.3 },
    }).connect(bus);
    const metal = (decay, resonance, volume) => new Tone.MetalSynth({
      envelope: { attack: 0.001, decay, release: decay * 0.5 },
      harmonicity: 5.1, modulationIndex: 32, resonance, octaves: 1.5, volume,
    }).connect(hp(6000));
    // Hi-hats are frequent: filtered noise is far lighter on the CPU than MetalSynth
    const hat = (decay, volume) => new Tone.NoiseSynth({
      noise: { type: 'white' }, volume,
      envelope: { attack: 0.001, decay, sustain: 0, release: decay * 0.4 },
    }).connect(hp(7500));
    this.hhc = hat(0.045, -14);
    this.hhp = hat(0.025, -18);
    this.hho = hat(0.32, -16);
    this.crash = metal(1.6, 3800, -22);
    this.ride = metal(0.9, 6500, -26);
  }

  /** Mono synths need strictly increasing start times per piece. */
  at(piece, t) {
    const last = this.lastT[piece] ?? -1;
    const time = t <= last ? last + 0.004 : t;
    this.lastT[piece] = time;
    return time;
  }

  hit(midi, t, vel = 0.8) {
    const piece = drumPieceFor(midi);
    const time = this.at(piece, t);
    const v = Math.max(0.05, Math.min(1, vel));
    safe(() => {
      switch (piece) {
        case 'kick': this.kick.triggerAttackRelease('C1', 0.3, time, v); break;
        case 'snare':
          this.snare.triggerAttackRelease(0.18, time, v);
          this.snareBody.triggerAttackRelease('G2', 0.1, time, v);
          break;
        case 'clap': this.clap.triggerAttackRelease(0.13, time, v); break;
        case 'rim': this.rim.triggerAttackRelease(0.03, time, v); break;
        case 'tomL': this.toms.triggerAttackRelease('F2', 0.4, time, v); break;
        case 'tomM': this.toms.triggerAttackRelease('A2', 0.35, time, v); break;
        case 'tomH': this.toms.triggerAttackRelease('D3', 0.3, time, v); break;
        case 'hhc': this.hhc.triggerAttackRelease(0.04, time, v); break;
        case 'hhp': this.hhp.triggerAttackRelease(0.02, time, v); break;
        case 'hho': this.hho.triggerAttackRelease(0.28, time, v); break;
        case 'crash': this.crash.triggerAttackRelease(300, 1.2, time, v); break;
        case 'ride': this.ride.triggerAttackRelease(420, 0.6, time, v); break;
        default: break;
      }
    });
  }

  attack(midi, t, vel) { this.hit(midi, t, vel); }
  release() {}
  play(midi, dur, t, vel) { this.hit(midi, t, vel); }
  releaseAll() { this.lastT = {}; }
}

export function createVoice(inst, destination) {
  const out = new Tone.Volume(inst.gainDb ?? 0).connect(destination);
  if (inst.kind === 'sampler') return new SamplerVoice(inst, out);
  if (inst.kind === 'drums') return new DrumVoice(out);
  return new SynthVoice(inst, out);
}
