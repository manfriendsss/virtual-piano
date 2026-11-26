import { buildSong } from './buildSong.js';
import { transposeNote, makeMelody } from './helpers.js';

/**
 * 4) Ode to Joy — Ludwig van Beethoven (C Major, 112 BPM) — FULL VERSION
 * Full theme form A–A'–B–A'–B–A', then an upper-octave harmonized variation
 * and a chordal finale with closing flourish (~1:45).
 */
const SONG_ODE_TO_JOY = buildSong('ode-to-joy', 'Ode to Joy', 112, ({ add }) => {
  const mel = makeMelody(add);
  const CH = {
    C:  { r: 'C3', dy: ['C3', 'G3'], tri: ['C3', 'E3', 'G3'], alb: ['C3', 'G3', 'E3', 'G3'], pcs: [0, 4, 7] },
    G:  { r: 'G2', dy: ['G2', 'D3'], tri: ['G2', 'B2', 'D3'], alb: ['G2', 'D3', 'B2', 'D3'], pcs: [7, 11, 2] },
    G7: { r: 'G2', dy: ['G2', 'F3'], tri: ['G2', 'B2', 'F3'], alb: ['G2', 'F3', 'B2', 'F3'], pcs: [7, 11, 2, 5] },
  };

  const A = [
    ['E4', 1], ['E4', 1], ['F4', 1], ['G4', 1], ['G4', 1], ['F4', 1], ['E4', 1], ['D4', 1],
    ['C4', 1], ['C4', 1], ['D4', 1], ['E4', 1], ['E4', 1.5], ['D4', 0.5], ['D4', 2],
  ];
  const A2 = [
    ['E4', 1], ['E4', 1], ['F4', 1], ['G4', 1], ['G4', 1], ['F4', 1], ['E4', 1], ['D4', 1],
    ['C4', 1], ['C4', 1], ['D4', 1], ['E4', 1], ['D4', 1.5], ['C4', 0.5], ['C4', 2],
  ];
  const B = [
    ['D4', 1], ['D4', 1], ['E4', 1], ['C4', 1], ['D4', 1], ['E4', 0.5], ['F4', 0.5], ['E4', 1], ['C4', 1],
    ['D4', 1], ['E4', 0.5], ['F4', 0.5], ['E4', 1], ['D4', 1], ['C4', 1], ['D4', 1], ['G3', 2],
  ];
  const A_CH  = ['C', 'C', 'G', 'G7', 'C', 'C', 'G', 'G'];
  const A2_CH = ['C', 'C', 'G', 'G7', 'C', 'C', 'G', 'C'];
  const B_CH  = ['G', 'C', 'G', 'C', 'G', 'G', 'C', 'G'];

  const phrase = (s, notes, chords, o) => {
    chords.forEach((c, i) => {
      const ch = CH[c];
      const b = s + i * 2;
      const v = o.lhVel;
      if (o.lh === 'alb') {
        ch.alb.forEach((n, k) => add(b + k * 0.5, n, 0.45, 'LH', v + (k === 0 ? 0.04 : 0)));
      } else if (o.lh === 'tri') {
        add(b, ch.tri, 1.9, 'LH', v);
      } else if (o.lh === 'oct') {
        add(b, [ch.r, transposeNote(ch.r, 12)], 1.9, 'LH', v + 0.06);
        add(b + 1, ch.tri.slice(1), 0.9, 'LH', v - 0.04);
      } else {
        add(b, ch.dy, 1.9, 'LH', v);
      }
    });
    const pcsAt = (t) => CH[chords[Math.min(7, Math.floor((t - s + 1e-6) / 2))]].pcs;
    mel(s, notes, { oct: o.oct || 0, harm: o.harm || 0, pcsAt, floor: 60, vel: o.vel });
    return s + 16;
  };

  let t = 0;
  // Theme
  t = phrase(t, A,  A_CH,  { lh: 'dyad', vel: 0.80, lhVel: 0.54 });
  t = phrase(t, A2, A2_CH, { lh: 'dyad', vel: 0.82, lhVel: 0.56 });
  t = phrase(t, B,  B_CH,  { lh: 'tri',  vel: 0.82, lhVel: 0.56 });
  t = phrase(t, A2, A2_CH, { lh: 'alb',  vel: 0.84, lhVel: 0.56 });
  t = phrase(t, B,  B_CH,  { lh: 'alb',  vel: 0.82, lhVel: 0.56, harm: 1 });
  t = phrase(t, A2, A2_CH, { lh: 'alb',  vel: 0.84, lhVel: 0.58, harm: 1 });
  // Upper-octave variation
  t = phrase(t, A,  A_CH,  { lh: 'alb', oct: 12, harm: 1, vel: 0.84, lhVel: 0.58 });
  t = phrase(t, A2, A2_CH, { lh: 'alb', oct: 12, harm: 1, vel: 0.86, lhVel: 0.58 });
  t = phrase(t, B,  B_CH,  { lh: 'tri', oct: 12, harm: 1, vel: 0.84, lhVel: 0.60 });
  t = phrase(t, A2, A2_CH, { lh: 'oct', oct: 12, harm: 2, vel: 0.88, lhVel: 0.62 });
  // Finale
  t = phrase(t, B,  B_CH,  { lh: 'oct', oct: 12, harm: 2, vel: 0.90, lhVel: 0.64 });
  t = phrase(t, A2, A2_CH, { lh: 'oct', oct: 12, harm: 2, vel: 0.92, lhVel: 0.66 });

  // Closing flourish
  add(t, ['C3', 'G3', 'C4'], 3.8, 'LH', 0.72);
  mel(t, [['G4', 0.25], ['C5', 0.25], ['E5', 0.25], ['G5', 0.25], [['E5', 'G5', 'C6'], 3.2]], { vel: 0.90 });
});

export default SONG_ODE_TO_JOY;
