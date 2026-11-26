import { AudioEngine } from './audio.js';
import { getInstrument, foldToRange } from './instruments.js';
import { arrangeSong, presetTracks, soloParts, makeTrack } from './arrange.js';
import { SONGS } from '../songs/index.js';
import { parseMidiFile, loadImportedSongs, saveImportedSongs } from '../lib/midiParser.js';
import {
  CHORDS,
  MIN_OCTAVE_SHIFT,
  MAX_OCTAVE_SHIFT,
  anchorMidiFor,
  midiToNote,
} from '../lib/music.js';

const LOOKAHEAD_SEC = 0.12;

/**
 * Framework-agnostic piano controller: owns audio, manual voices, sustain,
 * chord helper and the song auto-play scheduler. React subscribes to its
 * immutable snapshots via useSyncExternalStore.
 */
export class PianoController {
  constructor() {
    this.listeners = new Set();
    this.s = {
      status: { mode: 'loading', text: 'Loading piano…' },
      octaveShift: 0,
      rangeMode: 'free', // 'free' (2 octaves) | 'song'
      volumePercent: 82,
      lastNonZeroVolume: 82,
      isMuted: false,
      sustainOn: false,
      showLabels: true,
      selectedChordId: null,
      selectedSongId: null,
      isPlaying: false,
      playbackSpeed: 1,
      songPosBeats: 0,
      importError: null,
      // Instruments & ensemble
      keyboardInstrument: 'piano',
      playMode: 'solo', // 'solo' (one instrument) | 'ensemble' (mixer tracks)
      soloInstrument: 'piano',
      presetId: 'suggested',
      tracks: [],
      preparing: false,
    };
    this.playToken = 0;
    this.attackInst = new Map(); // midi -> instrument id used for the sounding manual note

    this.customSongs = loadImportedSongs();
    this.allSongs = [...this.customSongs, ...SONGS];

    // Independent highlight layers
    this.manualActive = new Map(); // midi -> Set<sourceId>
    this.autoRH = new Set();
    this.autoLH = new Set();

    // Manual voice & sustain tracking
    this.sourceToMidi = new Map();
    this.holdCount = new Map();
    this.sustained = new Set();
    this.chordTimers = [];

    // Scheduler
    this.nextIdx = 0;
    this.lastFrameMs = 0;
    this.rafId = null;

    this.snapshot = this.buildSnapshot();
    this.audio = null;
  }

  /* ---------- store plumbing ---------- */

  subscribe = (fn) => {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  };

  getSnapshot = () => this.snapshot;

  findSong(id) {
    return this.allSongs.find((s) => s.id === id) || null;
  }

  buildSnapshot() {
    const song = this.findSong(this.s.selectedSongId);
    const anchorMidi = anchorMidiFor(this.s.octaveShift);
    const songRange = this.s.rangeMode === 'song' && song;
    const visibleMinMidi = songRange ? song.rangeMinMidi : anchorMidi;
    const visibleMaxMidi = songRange ? song.rangeMaxMidi : anchorMidi + 23;

    const chord = CHORDS.find((c) => c.id === this.s.selectedChordId) || null;
    const chordMidis = chord ? chord.offsets.map((o) => anchorMidi + o) : [];
    const chordSet = new Set(chordMidis);

    const keyClasses = {};
    for (let m = visibleMinMidi; m <= visibleMaxMidi; m += 1) {
      const cls = [];
      if (this.manualActive.get(m)?.size) cls.push('is-manual');
      if (this.autoRH.has(m)) cls.push('is-auto-rh');
      if (this.autoLH.has(m)) cls.push('is-auto-lh');
      if (chordSet.has(m)) cls.push('is-chord');
      keyClasses[m] = cls.join(' ');
    }

    return {
      ...this.s,
      rangeMode: songRange ? 'song' : 'free',
      anchorMidi,
      visibleMinMidi,
      visibleMaxMidi,
      chordNotes: chordMidis.map(midiToNote),
      keyClasses,
      song,
      songs: this.allSongs,
    };
  }

  emit() {
    this.snapshot = this.buildSnapshot();
    this.listeners.forEach((fn) => fn());
  }

  set(patch) {
    Object.assign(this.s, patch);
    this.emit();
  }

  /* ---------- audio ---------- */

  initAudio() {
    if (this.audio) return;
    this.audio = new AudioEngine({
      volumePercent: this.s.volumePercent,
      onStatus: (mode, text) => this.set({ status: { mode, text } }),
    });
    this.audio.voice(this.s.keyboardInstrument);
  }

  unlock = () => this.audio?.unlock();

  /* ---------- manual notes & sustain ---------- */

  press(sourceId, midi, velocity = 0.84) {
    if (this.sourceToMidi.has(sourceId)) {
      if (this.sourceToMidi.get(sourceId) === midi) return;
      this.release(sourceId, true);
    }
    this.sustained.delete(midi);
    this.sourceToMidi.set(sourceId, midi);
    if (!this.manualActive.has(midi)) this.manualActive.set(midi, new Set());
    this.manualActive.get(midi).add(sourceId);
    this.holdCount.set(midi, (this.holdCount.get(midi) || 0) + 1);
    const inst = this.s.keyboardInstrument;
    this.attackInst.set(midi, inst);
    this.audio?.attack(inst, midi, velocity);
    this.emit();
  }

  release(sourceId, silent = false) {
    const midi = this.sourceToMidi.get(sourceId);
    if (midi === undefined) return;
    this.sourceToMidi.delete(sourceId);

    const set = this.manualActive.get(midi);
    if (set) {
      set.delete(sourceId);
      if (set.size === 0) this.manualActive.delete(midi);
    }

    const next = Math.max(0, (this.holdCount.get(midi) || 1) - 1);
    if (next === 0) {
      this.holdCount.delete(midi);
      if (this.s.sustainOn) this.sustained.add(midi);
      else this.releaseVoice(midi);
    } else {
      this.holdCount.set(midi, next);
    }
    if (!silent) this.emit();
  }

  releaseVoice(midi) {
    const inst = this.attackInst.get(midi) || this.s.keyboardInstrument;
    this.attackInst.delete(midi);
    this.audio?.release(inst, midi);
  }

  releaseAll() {
    Array.from(this.sourceToMidi.keys()).forEach((id) => this.release(id, true));
    this.emit();
  }

  pressOffset(sourceId, offset) {
    this.press(sourceId, anchorMidiFor(this.s.octaveShift) + offset);
  }

  /* ---------- controls ---------- */

  shiftOctave(delta) {
    const next = this.s.octaveShift + delta;
    if (next < MIN_OCTAVE_SHIFT || next > MAX_OCTAVE_SHIFT) return;
    this.unlock();
    this.releaseAll();
    this.set({ octaveShift: next });
  }

  setVolume(val) {
    this.unlock();
    const patch = { volumePercent: val, isMuted: val <= 0 };
    if (val > 0) patch.lastNonZeroVolume = val;
    this.set(patch);
    this.audio?.setVolume(val);
  }

  toggleMute() {
    this.unlock();
    if (this.s.isMuted || this.s.volumePercent === 0) {
      const v = this.s.lastNonZeroVolume || 82;
      this.set({ isMuted: false, volumePercent: v });
      this.audio?.setVolume(v);
    } else {
      this.set({ isMuted: true, lastNonZeroVolume: this.s.volumePercent });
      this.audio?.setVolume(0);
    }
  }

  toggleSustain() {
    this.unlock();
    const on = !this.s.sustainOn;
    if (!on) {
      this.sustained.forEach((m) => {
        if (!this.holdCount.has(m)) this.releaseVoice(m);
      });
      this.sustained.clear();
    }
    this.set({ sustainOn: on });
  }

  toggleLabels() {
    this.set({ showLabels: !this.s.showLabels });
  }

  setSpeed(speed) {
    this.set({ playbackSpeed: speed });
  }

  /* ---------- chord helper ---------- */

  selectChord(id) {
    this.unlock();
    this.cancelChordSample();
    this.set({ selectedChordId: this.s.selectedChordId === id ? null : id });
  }

  clearChord() {
    this.cancelChordSample();
    this.set({ selectedChordId: null });
  }

  cancelChordSample() {
    this.chordTimers.forEach(clearTimeout);
    this.chordTimers = [];
    Array.from(this.sourceToMidi.keys())
      .filter((id) => id.startsWith('chord:'))
      .forEach((id) => this.release(id));
  }

  playChordSample() {
    const chord = CHORDS.find((c) => c.id === this.s.selectedChordId);
    if (!chord) return;
    this.unlock();
    this.cancelChordSample();
    const anchor = anchorMidiFor(this.s.octaveShift);
    chord.offsets.forEach((off, idx) => {
      const id = `chord:${idx}`;
      this.chordTimers.push(
        setTimeout(() => this.press(id, anchor + off, 0.78), idx * 28),
        setTimeout(() => this.release(id), idx * 28 + 950),
      );
    });
  }

  /* ---------- song playback ---------- */

  beatsPerSec(song) {
    return (song.bpm / 60) * this.s.playbackSpeed;
  }

  clearAuto() {
    this.autoRH = new Set();
    this.autoLH = new Set();
  }

  syncAutoVisuals(song, beat) {
    const rh = new Set();
    const lh = new Set();
    for (const ev of song.events) {
      if (ev.beat > beat) break;
      // 88% visual hold gives a visible lift between repeated strikes
      if (beat < ev.beat + Math.max(0.08, ev.dur * 0.88)) {
        (ev.hand === 'RH' ? rh : lh).add(ev.midi);
      }
    }
    this.autoRH = rh;
    this.autoLH = lh;
  }

  indexForBeat(song, beat) {
    const { timeline } = arrangeSong(song);
    let i = 0;
    while (i < timeline.length && timeline[i].beat < beat - 1e-4) i += 1;
    return i;
  }

  /* ---------- instruments & ensemble ---------- */

  /** part -> [{ inst, gain }] for the current mode, honouring mute/solo. */
  getRoutes() {
    if (this.routes) return this.routes;
    const routes = {};
    const push = (part, instId, gain) => {
      (routes[part] ||= []).push({ inst: getInstrument(instId), gain });
    };
    if (this.s.playMode === 'solo') {
      soloParts(this.s.soloInstrument).forEach((p) => push(p, this.s.soloInstrument, 1));
    } else {
      // Scale down as tracks pile up so the summed mix keeps headroom
      const audible = this.audibleTracks();
      const scale = 1 / Math.sqrt(Math.max(1, audible.length / 2));
      audible.forEach((t) => push(t.part, t.instrument, (t.volume / 100) * scale));
    }
    this.routes = routes;
    return routes;
  }

  audibleTracks() {
    const tracks = this.s.tracks.filter((t) => t.instrument);
    const anySolo = tracks.some((t) => t.soloed);
    return tracks.filter((t) => (anySolo ? t.soloed : !t.muted) && t.volume > 0);
  }

  neededInstruments() {
    if (this.s.playMode === 'solo') return [this.s.soloInstrument];
    return [...new Set(this.audibleTracks().map((t) => t.instrument))];
  }

  /** Apply an arrangement change; preload any new instrument while playing. */
  setArrangement(patch) {
    this.routes = null;
    this.set(patch);
    if (this.audio) this.audio.ensure(this.neededInstruments());
  }

  setPlayMode(mode) {
    if (mode === this.s.playMode) return;
    this.unlock();
    this.audio?.silence();
    const patch = { playMode: mode };
    if (mode === 'ensemble' && !this.s.tracks.length) patch.tracks = presetTracks(this.s.presetId, this.findSong(this.s.selectedSongId));
    this.setArrangement(patch);
  }

  setSoloInstrument(id) {
    this.unlock();
    if (this.s.isPlaying) this.audio?.silence(this.s.soloInstrument);
    this.setArrangement({ soloInstrument: id, playMode: 'solo' });
  }

  applyPreset(presetId) {
    this.unlock();
    this.audio?.silence();
    this.setArrangement({ presetId, playMode: 'ensemble', tracks: presetTracks(presetId, this.findSong(this.s.selectedSongId)) });
  }

  updateTrack(key, patch) {
    const prev = this.s.tracks.find((t) => t.key === key);
    if (prev && patch.instrument !== undefined && prev.instrument && this.s.isPlaying) this.audio?.silence(prev.instrument);
    this.setArrangement({ tracks: this.s.tracks.map((t) => (t.key === key ? { ...t, ...patch } : t)) });
  }

  addTrack(part = 'melody', instrument = 'piano') {
    this.setArrangement({ tracks: [...this.s.tracks, makeTrack(part, part === 'drums' ? 'drums' : instrument)] });
  }

  removeTrack(key) {
    this.setArrangement({ tracks: this.s.tracks.filter((t) => t.key !== key) });
  }

  setKeyboardInstrument(id) {
    this.unlock();
    this.releaseAll();
    this.sustained.forEach((m) => this.releaseVoice(m));
    this.sustained.clear();
    this.audio?.voice(id);
    this.set({ keyboardInstrument: id });
  }

  tick = (nowMs) => {
    if (!this.s.isPlaying) return;
    const song = this.findSong(this.s.selectedSongId);
    if (!song) {
      this.pause();
      return;
    }

    const dt = Math.min(0.1, Math.max(0, (nowMs - this.lastFrameMs) / 1000));
    this.lastFrameMs = nowMs;
    const bps = this.beatsPerSec(song);
    let pos = this.s.songPosBeats + dt * bps;

    // Schedule upcoming audio within the lookahead window on the Web Audio clock
    if (this.audio) {
      const { timeline } = arrangeSong(song);
      const routes = this.getRoutes();
      const ahead = LOOKAHEAD_SEC * bps;
      const audioNow = this.audio.now();
      while (this.nextIdx < timeline.length && timeline[this.nextIdx].beat <= pos + ahead) {
        const ev = timeline[this.nextIdx];
        const targets = routes[ev.part];
        if (targets) {
          const delay = Math.max(0, (ev.beat - pos) / bps);
          const dur = Math.max(0.06, (ev.dur / bps) * 0.94);
          // Sustained instruments tie into the next note with a slight overlap and an evened-out dynamic
          const tied = Math.max(0.12, ((ev.legatoDur ?? ev.dur) / bps) * 1.06);
          for (const r of targets) {
            const midi = foldToRange(ev.midi, r.inst);
            const legato = r.inst.legato;
            const vel = legato ? 0.42 + 0.38 * ev.vel : ev.vel;
            this.audio.play(r.inst.id, midi, legato ? tied : dur, audioNow + delay, Math.min(1, vel * r.gain));
          }
        }
        this.nextIdx += 1;
      }
    }

    if (pos >= song.totalBeats) {
      pos = song.totalBeats;
      this.rafId = null;
      this.clearAuto();
      this.set({ isPlaying: false, songPosBeats: pos });
      return;
    }

    this.syncAutoVisuals(song, pos);
    this.s.songPosBeats = pos;
    this.emit();
    this.rafId = requestAnimationFrame(this.tick);
  };

  play() {
    const song = this.findSong(this.s.selectedSongId);
    if (!song) {
      if (this.allSongs.length) this.selectSong(this.allSongs[0].id);
      return;
    }
    this.unlock();
    const token = ++this.playToken;
    const needed = this.neededInstruments();
    if (this.audio && !this.audio.isLoaded(needed)) {
      this.set({ preparing: true, rangeMode: 'song' });
      this.audio.ensure(needed).then(() => {
        if (token !== this.playToken) return;
        this.set({ preparing: false });
        this.startPlayback(song);
      });
      return;
    }
    this.startPlayback(song);
  }

  startPlayback(song) {
    let pos = this.s.songPosBeats;
    if (pos >= song.totalBeats - 0.05) pos = 0;
    this.nextIdx = this.indexForBeat(song, pos);
    this.lastFrameMs = performance.now();
    this.set({ rangeMode: 'song', isPlaying: true, songPosBeats: pos });
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(this.tick);
  }

  pause() {
    this.playToken += 1;
    if (this.s.preparing) this.s.preparing = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.audio?.silence();
    this.clearAuto();
    this.set({ isPlaying: false });
  }

  togglePlay() {
    if (this.s.isPlaying || this.s.preparing) this.pause();
    else this.play();
  }

  stop() {
    this.pause();
    this.nextIdx = 0;
    this.set({ songPosBeats: 0 });
  }

  seek(ratio) {
    const song = this.findSong(this.s.selectedSongId);
    if (!song) return;
    const pos = Math.max(0, Math.min(1, ratio)) * song.totalBeats;
    this.audio?.silence();
    this.clearAuto();
    this.nextIdx = this.indexForBeat(song, pos);
    this.lastFrameMs = performance.now();
    if (this.s.isPlaying) this.syncAutoVisuals(song, pos);
    this.set({ songPosBeats: pos });
  }

  selectSong(id, autoStart = true) {
    this.unlock();
    // Clicking the current song toggles play/pause
    if (this.s.selectedSongId === id && this.s.rangeMode === 'song') {
      this.togglePlay();
      return;
    }
    this.pause();
    this.cancelChordSample();
    this.nextIdx = 0;
    this.routes = null;
    this.set({
      selectedSongId: id,
      songPosBeats: 0,
      rangeMode: 'song',
      tracks: presetTracks(this.s.presetId, this.findSong(id)),
    });
    if (autoStart) this.play();
  }

  playRandom() {
    const others = this.allSongs.filter((s) => s.id !== this.s.selectedSongId);
    const pool = others.length ? others : this.allSongs;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (pick.id === this.s.selectedSongId) this.stop();
    this.selectSong(pick.id);
  }

  async importMidiFiles(fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    this.unlock();

    const added = [];
    let lastErr = null;
    for (const file of files) {
      try {
        const buf = await file.arrayBuffer();
        const song = parseMidiFile(buf, file.name);
        added.push(song);
      } catch (err) {
        lastErr = err?.message || 'Không thể đọc file MIDI.';
      }
    }

    if (added.length > 0) {
      this.customSongs = [...added, ...this.customSongs];
      this.allSongs = [...this.customSongs, ...SONGS];
      saveImportedSongs(this.customSongs);
      this.s.importError = lastErr;
      this.selectSong(added[0].id, true);
    } else if (lastErr) {
      this.set({ importError: lastErr });
    }
  }

  clearImportError() {
    if (this.s.importError) this.set({ importError: null });
  }

  removeImportedSong(id) {
    const next = this.customSongs.filter((s) => s.id !== id);
    if (next.length === this.customSongs.length) return;
    this.customSongs = next;
    this.allSongs = [...this.customSongs, ...SONGS];
    saveImportedSongs(this.customSongs);
    if (this.s.selectedSongId === id) {
      this.freePlay();
    } else {
      this.emit();
    }
  }

  freePlay() {
    this.pause();
    this.nextIdx = 0;
    this.set({ rangeMode: 'free', selectedSongId: null, songPosBeats: 0 });
  }
}
