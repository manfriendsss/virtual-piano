import { buildSong } from './buildSong.js';
import { makeMelody } from './helpers.js';

/**
 * 2) Bella Ciao — Traditional Italian (A Minor, 118 BPM) — FULL VERSION
 * Intro + 7 verses (plain, harmonized, upper octave, quiet breakdown, full
 * finale) + repeated last line and final "ciao!" chord (~2:10).
 */
const SONG_BELLA_CIAO = buildSong('bella-ciao', 'Bella Ciao', 118, ({ add }) => {
  const mel = makeMelody(add);
  const CH = {
    Am: { b1: 'A2', b2: 'E3', tri: ['E3', 'A3', 'C4'], pcs: [9, 0, 4] },
    A7: { b1: 'A2', b2: 'E3', tri: ['E3', 'G3', 'C#4'], pcs: [9, 1, 4, 7] },
    Dm: { b1: 'D3', b2: 'A2', tri: ['F3', 'A3', 'D4'], pcs: [2, 5, 9] },
    E:  { b1: 'E2', b2: 'B2', tri: ['G#3', 'B3', 'D4'], pcs: [4, 8, 11, 2] },
  };

  const lhBar = (s, c, style, v) => {
    const ch = CH[c];
    if (style === 'sustain') {
      add(s, ch.b1, 3.8, 'LH', v + 0.04);
      add(s + 0.1, ch.tri, 3.6, 'LH', v - 0.04);
    } else if (style === 'arp') {
      add(s, ch.b1, 1.9, 'LH', v + 0.06);
      add(s + 0.5, ch.tri[0], 0.45, 'LH', v);
      add(s + 1.0, ch.tri[1], 0.45, 'LH', v);
      add(s + 1.5, ch.tri[2], 0.45, 'LH', v - 0.02);
      add(s + 2.0, ch.b2, 0.45, 'LH', v + 0.04);
      add(s + 2.5, ch.tri[0], 0.45, 'LH', v);
      add(s + 3.0, ch.tri[1], 0.45, 'LH', v);
      add(s + 3.5, ch.tri[2], 0.45, 'LH', v - 0.02);
    } else if (style === 'drive') {
      add(s, ch.b1, 0.9, 'LH', v + 0.08);
      add(s + 1, ch.tri, 0.45, 'LH', v);
      add(s + 1.5, ch.tri, 0.45, 'LH', v - 0.04);
      add(s + 2, ch.b2, 0.9, 'LH', v + 0.06);
      add(s + 3, ch.tri, 0.45, 'LH', v);
      add(s + 3.5, ch.tri, 0.45, 'LH', v - 0.04);
    } else { // oom-pah
      add(s + 0, ch.b1, 0.85, 'LH', v + 0.06);
      add(s + 1, ch.tri, 0.55, 'LH', v - 0.03);
      add(s + 2, ch.b2, 0.85, 'LH', v + 0.02);
      add(s + 3, ch.tri, 0.55, 'LH', v - 0.04);
    }
  };

  const BARS = [
    ['Am', [['C5', 0.5], ['A4', 2.0], ['E4', 0.5], ['A4', 0.5], ['B4', 0.5]]],
    ['Am', [['C5', 0.5], ['A4', 2.0], ['E4', 0.5], ['A4', 0.5], ['B4', 0.5]]],
    ['Am', [['C5', 1.0], ['B4', 0.5], ['A4', 0.5], ['C5', 1.0], ['B4', 0.5], ['A4', 0.5]]],
    ['A7', [['E5', 1.0], ['E5', 1.0], ['E5', 1.0], ['D5', 0.5], ['E5', 0.5]]],
    ['Dm', [['F5', 0.5], ['F5', 2.0], ['F5', 0.5], ['E5', 0.5], ['D5', 0.5]]],
    ['Am', [['F5', 0.5], ['E5', 2.0], ['E5', 0.5], ['D5', 0.5], ['C5', 0.5]]],
    ['E',  [['B4', 1.0], ['E5', 1.0], ['B4', 1.0], ['C5', 1.0]]],
    ['Am', [['A4', 2.0], [null, 2.0]]],
  ];

  // One verse (or its last line when fromBar = 4). Pickup notes go before `s`.
  const verse = (s, o, fromBar = 0) => {
    const base = { oct: o.oct, harm: o.harm, floor: 62, vel: o.vel };
    if (fromBar === 0) {
      mel(s - 1.5, [['E4', 0.5], ['A4', 0.5], ['B4', 0.5]], { ...base, pcsAt: () => CH.Am.pcs });
    } else {
      mel(s - 1, [['D5', 0.5], ['E5', 0.5]], { ...base, pcsAt: () => CH.A7.pcs });
    }
    for (let i = fromBar; i < 8; i++) {
      const st = s + (i - fromBar) * 4;
      const [c, items] = BARS[i];
      lhBar(st, c, o.lh, o.lhVel);
      mel(st, items, { ...base, pcsAt: () => CH[c].pcs });
    }
    return s + (8 - fromBar) * 4;
  };

  // Intro (4 bars): accompaniment, then the "bella ciao" tail as a lead-in
  lhBar(0, 'Am', 'oompah', 0.54);
  lhBar(4, 'Am', 'oompah', 0.54);
  lhBar(8, 'E', 'oompah', 0.56);
  lhBar(12, 'Am', 'oompah', 0.56);
  mel(8, [['B4', 1], ['E5', 1], ['B4', 1], ['C5', 1], ['A4', 2]], { vel: 0.78 });

  let t = 16;
  const verses = [
    { oct: 0,  harm: 0, lh: 'oompah',  vel: 0.80, lhVel: 0.56 },
    { oct: 0,  harm: 1, lh: 'oompah',  vel: 0.82, lhVel: 0.58 },
    { oct: 12, harm: 0, lh: 'arp',     vel: 0.80, lhVel: 0.54 },
    { oct: 12, harm: 1, lh: 'arp',     vel: 0.84, lhVel: 0.58 },
    { oct: 0,  harm: 0, lh: 'sustain', vel: 0.70, lhVel: 0.48 },
    { oct: 0,  harm: 2, lh: 'oompah',  vel: 0.86, lhVel: 0.62 },
    { oct: 12, harm: 2, lh: 'drive',   vel: 0.90, lhVel: 0.66 },
  ];
  verses.forEach((o) => { t = verse(t, o); });

  // Last line once more, fortissimo
  t = verse(t, { oct: 12, harm: 2, lh: 'drive', vel: 0.94, lhVel: 0.68 }, 4);

  // Final "ciao!"
  add(t, ['A2', 'E3', 'A3'], 2.6, 'LH', 0.74);
  add(t, ['A4', 'C5', 'E5', 'A5'], 2.6, 'RH', 0.92);
});

export default SONG_BELLA_CIAO;
