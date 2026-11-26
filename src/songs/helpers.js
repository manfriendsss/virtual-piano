import { midiToNote, noteToMidi } from '../lib/music.js';

/* ---- Arrangement helpers shared by all songs ---- */
export const transposeNote = (n, semis) => (semis ? midiToNote(noteToMidi(n) + semis) : n);

/** Chord tones (pitch classes `pcs`) below note `n`, at least a minor third apart, never under `floor`. */
export const chordTonesBelow = (n, pcs, count = 1, floor = 60) => {
  const out = [];
  let m = noteToMidi(n) - 3;
  while (out.length < count && m >= floor) {
    if (pcs.includes(((m % 12) + 12) % 12)) {
      out.push(midiToNote(m));
      m -= 3;
    } else {
      m -= 1;
    }
  }
  return out;
};

/** Melody sequencer with optional octave shift and automatic chord-tone harmony. */
export const makeMelody = (add) => (start, items, opt = {}) => {
  const { oct = 0, harm = 0, pcsAt = null, floor = 60, vel = 0.82, hand = 'RH' } = opt;
  let t = start;
  items.forEach(([n, d, v]) => {
    if (n !== null && n !== undefined) {
      const list = (Array.isArray(n) ? n : [n]).map((x) => transposeNote(x, oct));
      if (harm && pcsAt && list.length === 1) {
        list.push(...chordTonesBelow(list[0], pcsAt(t), harm, floor));
      }
      add(t, list, d, hand, v ?? vel);
    }
    t += d;
  });
  return t;
};

export const evenNotes = (notes, d) => notes.map((n) => [n, d]);
