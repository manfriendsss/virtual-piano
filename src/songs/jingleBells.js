import { buildSong } from './buildSong.js';
import { makeMelody } from './helpers.js';

/**
 * 5) Jingle Bells — James Lord Pierpont (C Major, 136 BPM) — FULL VERSION
 * Intro, chorus, verse 1, chorus (upper octave), verse 2 (upper octave),
 * harmonized chorus and big final chorus with festive outro (~2:55).
 */
const SONG_JINGLE_BELLS = buildSong('jingle-bells', 'Jingle Bells', 136, ({ add }) => {
  const mel = makeMelody(add);
  const C_CHORD = ['E3', 'G3', 'C4'];
  const F_CHORD = ['F3', 'A3', 'C4'];
  const G7_CHORD = ['F3', 'G3', 'B3'];
  const CH = {
    C:  { b1: 'C3', b2: 'G2', big: ['C2', 'C3'], tri: C_CHORD, pcs: [0, 4, 7] },
    F:  { b1: 'F2', b2: 'C3', big: ['F2', 'F3'], tri: F_CHORD, pcs: [5, 9, 0] },
    G7: { b1: 'G2', b2: 'D3', big: ['G2', 'G3'], tri: G7_CHORD, pcs: [7, 11, 2, 5] },
  };

  const oomPah = (s, bass1, chord, bass2, v) => {
    add(s + 0, bass1, 0.85, 'LH', v + 0.06);
    add(s + 1, chord, 0.55, 'LH', v - 0.04);
    add(s + 2, bass2, 0.85, 'LH', v + 0.04);
    add(s + 3, chord, 0.55, 'LH', v - 0.04);
  };

  // Lower chord voicings keep the keys under a low-register melody free
  const VOICINGS = {
    full:   { C: C_CHORD, F: F_CHORD, G7: G7_CHORD },
    chorus: { C: ['E3', 'G3'], F: ['F3', 'A3'], G7: G7_CHORD },
    verse:  { C: ['C3', 'E3'], F: ['C3', 'F3'], G7: ['F3', 'G3'] },
  };
  const lhBar = (s, c, big, v, voicing = 'full') => {
    const V = VOICINGS[voicing];
    const cTri = V.C;
    if (c === 'END') {
      add(s, big ? CH.C.big : 'C3', 0.85, 'LH', v + 0.06);
      add(s + 1, cTri, 0.55, 'LH', v - 0.02);
      add(s + 2, ['C3', 'G3'], 1.8, 'LH', v + 0.06);
    } else if (c === 'CG') {
      add(s, big ? CH.C.big : 'C3', 0.85, 'LH', v + 0.02);
      add(s + 1, cTri, 0.55, 'LH', v - 0.04);
      add(s + 2, 'G2', 0.85, 'LH', v + 0.04);
      add(s + 3, V.G7, 0.55, 'LH', v);
    } else {
      const ch = CH[c];
      oomPah(s, big ? ch.big : ch.b1, V[c], ch.b2, v);
    }
  };

  const pcsFor = (chords, s) => (t) => {
    const rel = t - s + 1e-6;
    const c = chords[Math.min(15, Math.floor(rel / 4))];
    if (c === 'END') return CH.C.pcs;
    if (c === 'CG') return (rel % 4) < 2 ? CH.C.pcs : CH.G7.pcs;
    return CH[c].pcs;
  };

  const CHORUS = [
    ['E4', 1.0], ['E4', 1.0], ['E4', 2.0],
    ['E4', 1.0], ['E4', 1.0], ['E4', 2.0],
    ['E4', 1.0], ['G4', 1.0], ['C4', 1.5], ['D4', 0.5],
    ['E4', 3.6], [null, 0.4],
    ['F4', 1.0], ['F4', 1.0], ['F4', 1.0], ['F4', 1.0],
    ['F4', 1.0], ['E4', 1.0], ['E4', 1.0], ['E4', 0.5], ['E4', 0.5],
    ['D4', 1.0], ['D4', 1.0], ['E4', 1.0], ['D4', 1.0],
    ['G4', 2.0], [null, 1.0], ['G4', 1.0],
    ['E4', 1.0], ['E4', 1.0], ['E4', 2.0],
    ['E4', 1.0], ['E4', 1.0], ['E4', 2.0],
    ['E4', 1.0], ['G4', 1.0], ['C4', 1.5], ['D4', 0.5],
    ['E4', 3.6], [null, 0.4],
    ['F4', 1.0], ['F4', 1.0], ['F4', 1.0], ['F4', 1.0],
    ['F4', 1.0], ['E4', 1.0], ['E4', 1.0], ['E4', 0.5], ['E4', 0.5],
    ['G4', 1.0], ['G4', 1.0], ['F4', 1.0], ['D4', 1.0],
    ['C4', 3.6], [null, 0.4],
  ];

  const cE = ['G4', 'C5', 'E5'];
  const cG = ['B4', 'D5', 'G5'];
  const cC = ['E4', 'G4', 'C5'];
  const cD = ['F4', 'A4', 'D5'];
  const cF = ['A4', 'C5', 'F5'];
  const cB = ['F4', 'B4', 'D5'];
  const CHORUS_H = [
    [cE, 1.0], [cE, 1.0], [cE, 2.0],
    [cE, 1.0], [cE, 1.0], [cE, 2.0],
    [cE, 1.0], [cG, 1.0], [cC, 1.5], [cD, 0.5],
    [cE, 3.6], [null, 0.4],
    [cF, 1.0], [cF, 1.0], [cF, 1.0], [cF, 1.0],
    [cF, 1.0], [cE, 1.0], [cE, 1.0], [cE, 0.5], [cE, 0.5],
    [cB, 1.0], [cB, 1.0], [cE, 1.0], [cB, 1.0],
    [cG, 2.0], [null, 1.0], [cG, 1.0],
    [cE, 1.0], [cE, 1.0], [cE, 2.0],
    [cE, 1.0], [cE, 1.0], [cE, 2.0],
    [cE, 1.0], [cG, 1.0], [cC, 1.5], [cD, 0.5],
    [cE, 3.6], [null, 0.4],
    [cF, 1.0], [cF, 1.0], [cF, 1.0], [cF, 1.0],
    [cF, 1.0], [cE, 1.0], [cE, 1.0], [cE, 0.5], [cE, 0.5],
    [cG, 1.0], [cG, 1.0], [cF, 1.0], [cB, 1.0],
    [['E5', 'G5', 'C6'], 3.6], [null, 0.4],
  ];

  const VERSE = [
    ['G3', 1.0], ['E4', 1.0], ['D4', 1.0], ['C4', 1.0],
    ['G3', 2.5], [null, 0.5], ['G3', 0.5], ['G3', 0.5],
    ['E4', 1.0], ['D4', 1.0], ['C4', 1.0], ['A3', 1.0],
    ['A3', 3.0], [null, 1.0],
    ['A3', 1.0], ['F4', 1.0], ['E4', 1.0], ['D4', 1.0],
    ['B3', 3.0], [null, 1.0],
    ['G4', 1.0], ['G4', 1.0], ['F4', 1.0], ['D4', 1.0],
    ['E4', 3.0], [null, 1.0],
    ['G3', 1.0], ['E4', 1.0], ['D4', 1.0], ['C4', 1.0],
    ['G3', 2.5], [null, 0.5], ['G3', 0.5], ['G3', 0.5],
    ['E4', 1.0], ['D4', 1.0], ['C4', 1.0], ['A3', 1.0],
    ['A3', 3.0], [null, 1.0],
    ['A3', 1.0], ['F4', 1.0], ['E4', 1.0], ['D4', 1.0],
    ['G4', 1.0], ['G4', 1.0], ['G4', 1.0], ['G4', 1.0],
    ['A4', 1.0], ['G4', 1.0], ['F4', 1.0], ['D4', 1.0],
    ['C4', 2.0], [null, 0.5], ['G4', 1.5, 0.88],
  ];

  const CHORUS_CH = ['C', 'C', 'C', 'C', 'F', 'C', 'G7', 'G7', 'C', 'C', 'C', 'C', 'F', 'C', 'G7', 'END'];
  const VERSE_CH  = ['C', 'C', 'C', 'F', 'F', 'G7', 'G7', 'C', 'C', 'C', 'C', 'F', 'F', 'G7', 'G7', 'CG'];

  const section = (s, melody, chords, o) => {
    chords.forEach((c, i) => lhBar(s + i * 4, c, o.big, o.lhVel, o.oct ? 'full' : (melody === VERSE ? 'verse' : (melody === CHORUS ? 'chorus' : 'full'))));
    mel(s, melody, { oct: o.oct || 0, harm: o.harm || 0, pcsAt: pcsFor(chords, s), floor: 62, vel: o.vel });
    return s + 64;
  };

  // ---- Sleigh-bell intro (4 beats) ----
  add(0, ['C3', 'G3'], 3.6, 'LH', 0.62);
  add(0.0, 'E5', 0.4, 'RH', 0.85);
  add(0.5, 'G5', 0.4, 'RH', 0.85);
  add(1.0, 'E5', 0.4, 'RH', 0.85);
  add(1.5, 'G5', 0.4, 'RH', 0.85);
  add(2.0, ['C5', 'E5'], 0.9, 'RH', 0.88);
  add(3.0, ['D5', 'G5'], 0.9, 'RH', 0.88);

  let t = 4;
  t = section(t, CHORUS,   CHORUS_CH, { vel: 0.82, lhVel: 0.58 });
  t = section(t, VERSE,    VERSE_CH,  { vel: 0.80, lhVel: 0.54 });
  t = section(t, CHORUS,   CHORUS_CH, { oct: 12, harm: 1, vel: 0.84, lhVel: 0.60 });
  t = section(t, VERSE,    VERSE_CH,  { oct: 12, harm: 1, vel: 0.82, lhVel: 0.56 });
  t = section(t, CHORUS_H, CHORUS_CH, { vel: 0.88, lhVel: 0.62 });
  t = section(t, CHORUS_H, CHORUS_CH, { big: true, vel: 0.92, lhVel: 0.66 });

  // ---- Festive outro & chimes ----
  add(t, ['C2', 'G2', 'C3'], 3.8, 'LH', 0.74);
  add(t, ['C5', 'E5', 'G5', 'C6'], 1.8, 'RH', 0.94);
  add(t + 2.0, 'E5', 0.45, 'RH', 0.86);
  add(t + 2.5, 'G5', 0.45, 'RH', 0.88);
  add(t + 3.0, ['C5', 'E5', 'G5', 'C6'], 1.0, 'RH', 0.95);
});

export default SONG_JINGLE_BELLS;
