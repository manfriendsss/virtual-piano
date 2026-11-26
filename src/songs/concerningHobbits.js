import { buildSong } from './buildSong.js';
import { makeMelody } from './helpers.js';

/**
 * Concerning Hobbits (The Lord of the Rings) — Howard Shore (D Major, 104 BPM)
 * Warm Celtic pastoral arrangement: Bag End shimmering intro, Tin Whistle Theme,
 * Playful Fiddle Dance in the upper octave, harmonized Shire Ensemble reprise,
 * and peaceful twilight D-major coda.
 */
const SONG_CONCERNING_HOBBITS = buildSong('concerning-hobbits', 'Concerning Hobbits (LoTR)', 104, ({ add }) => {
  const mel = makeMelody(add);

  const CH = {
    D:  { arp: ['D3', 'A3', 'D4', 'F#3'], pcs: [2, 6, 9] },
    G:  { arp: ['G2', 'D3', 'G3', 'B3'],  pcs: [7, 11, 2] },
    A:  { arp: ['A2', 'E3', 'A3', 'C#4'], pcs: [9, 1, 4] },
    Bm: { arp: ['B2', 'F#3', 'B3', 'D4'], pcs: [11, 2, 6] },
    Em: { arp: ['E2', 'B2', 'E3', 'G3'],  pcs: [4, 7, 11] },
  };

  // Pastoral 2-beat Celtic harp pattern
  const lh2 = (s, name, style = 'arp', v = 0.54) => {
    const c = CH[name];
    if (style === 'lilt') {
      add(s + 0.0, c.arp[0], 0.90, 'LH', v + 0.05);
      add(s + 0.5, c.arp[1], 0.45, 'LH', v);
      add(s + 1.0, [c.arp[2], c.arp[3]], 0.85, 'LH', v + 0.02);
    } else {
      add(s + 0.0, c.arp[0], 1.85, 'LH', v + 0.05);
      add(s + 0.5, c.arp[1], 1.35, 'LH', v);
      add(s + 1.0, c.arp[2], 0.90, 'LH', v + 0.02);
      add(s + 1.5, c.arp[3], 0.45, 'LH', v - 0.02);
    }
  };

  const prog = (s, list, style, v) => {
    list.forEach((c, idx) => lh2(s + idx * 2, c, style, v));
    return (time) => CH[list[Math.min(list.length - 1, Math.floor((time - s + 1e-6) / 2))]].pcs;
  };

  // Intro (8 beats): shimmering D major drone
  prog(0, ['D', 'G', 'D', 'A'], 'arp', 0.48);
  mel(0, [
    ['D5', 1.0], ['A4', 1.0], ['B4', 1.0], ['G4', 1.0],
    ['F#4', 1.0], ['E4', 1.0], ['E4', 1.5], [null, 0.5],
  ], { vel: 0.72 });

  // Main Tin Whistle Theme (32 beats)
  const theme = (s, o = {}) => {
    const chords = [
      'D', 'D', 'G', 'D',
      'Bm', 'G', 'D', 'A',
      'D', 'D', 'G', 'D',
      'Bm', 'G', 'A', 'D',
    ];
    const pcsAt = prog(s, chords, o.lh || 'arp', o.lhVel ?? 0.54);
    mel(s, [
      ['D4', 0.5], ['E4', 0.5], ['F#4', 1.0], ['A4', 2.0],
      ['F#4', 0.5], ['E4', 0.5], ['D4', 2.0], ['F#4', 0.5], ['A4', 0.5],
      ['B4', 1.5], ['D5', 0.5], ['C#5', 1.0], ['A4', 1.0],
      ['F#4', 1.5], ['G4', 0.5], ['E4', 2.0],

      ['D4', 0.5], ['E4', 0.5], ['F#4', 1.0], ['A4', 2.0],
      ['F#4', 0.5], ['E4', 0.5], ['D4', 2.0], ['F#4', 0.5], ['A4', 0.5],
      ['B4', 1.5], ['A4', 0.5], ['F#4', 1.0], ['E4', 1.0],
      ['D4', 3.0], [null, 1.0],
    ], { oct: o.oct || 0, harm: o.harm || 0, pcsAt, floor: 62, vel: o.vel ?? 0.82 });
    return s + 32;
  };

  // Fiddle Dance Section (32 beats, upper octave)
  const fiddle = (s, o = {}) => {
    const chords = [
      'D', 'G', 'D', 'A',
      'Bm', 'G', 'D', 'A',
      'D', 'G', 'A', 'Bm',
      'G', 'Em', 'A', 'D',
    ];
    const pcsAt = prog(s, chords, o.lh || 'lilt', o.lhVel ?? 0.58);
    mel(s, [
      ['D5', 0.5], ['E5', 0.5], ['F#5', 1.0], ['A5', 1.5], ['E5', 0.5],
      ['D5', 0.5], ['E5', 0.5], ['A4', 1.0], ['B4', 1.0], ['C#5', 1.0],
      ['D5', 1.0], ['A4', 1.0], ['F#4', 0.5], ['A4', 0.5], ['E4', 1.0],
      ['D5', 0.5], ['E5', 0.5], ['F#5', 1.0], ['A5', 2.0],

      ['F#5', 0.5], ['E5', 0.5], ['F#5', 0.5], ['E5', 0.5], ['D5', 1.0], ['F#5', 1.0],
      ['D5', 0.5], ['E5', 0.5], ['F#5', 0.5], ['E5', 0.5], ['D5', 0.5], ['E5', 0.5], ['D5', 1.0],
      ['D4', 0.5], ['E4', 0.5], ['F#4', 1.0], ['B4', 0.5], ['C#5', 0.5], ['D5', 0.5], ['C#5', 0.5],
      ['A4', 1.0], ['B4', 0.5], ['A4', 0.5], ['D4', 2.0],
    ], { harm: o.harm || 0, pcsAt, floor: 62, vel: o.vel ?? 0.86 });
    return s + 32;
  };

  let t = 8;
  t = theme(t, { lh: 'arp', vel: 0.80, lhVel: 0.52 });
  t = fiddle(t, { lh: 'lilt', vel: 0.84, lhVel: 0.56 });
  t = theme(t, { oct: 12, harm: 1, lh: 'lilt', vel: 0.88, lhVel: 0.60 });
  t = fiddle(t, { harm: 1, lh: 'lilt', vel: 0.90, lhVel: 0.62 });
  t = theme(t, { lh: 'arp', vel: 0.76, lhVel: 0.50 });

  // Peaceful Shire twilight coda
  add(t, 'D2', 4.8, 'LH', 0.60);
  add(t + 0.15, 'A2', 4.6, 'LH', 0.52);
  add(t + 0.30, 'D3', 4.4, 'LH', 0.52);
  add(t + 0.45, ['F#4', 'A4', 'D5'], 4.2, 'RH', 0.74);
});

export default SONG_CONCERNING_HOBBITS;
