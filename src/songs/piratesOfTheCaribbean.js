import { buildSong } from './buildSong.js';
import { transposeNote } from './helpers.js';

/**
 * Pirates of the Caribbean — Hans Zimmer & Klaus Badelt (arr. Jiri)
 * Key: D Minor | Base Tempo: 110 BPM (6/8 = 3.0 beats/bar, accelerating to 120 & 130 BPM at m.102 & m.110)
 * Faithfully transcribed across all 118 measures (6 pages):
 * m.1–21 Opening Theme (low + high) & 3/8 Transition, m.22–41 Sweep Arpeggio Variation,
 * m.42–61 Heroic Stomp, Sea-Shanty Octaves & Running 16th Episode,
 * m.62–84 Grand Anthem & Full-Chord Theme, m.85–101 Chromatic Climb & 5/16 Trill,
 * m.102–118 Accelerando Rolled-Chord Finale (120 -> 130 BPM ff).
 */
const SONG_PIRATES = buildSong('pirates-of-the-caribbean', 'Pirates of the Caribbean', 110, ({ add }) => {
  const seq = (startBeat, items, hand = 'RH', defaultVel = 0.86, oct = 0, scale = 1, rolled = false) => {
    let c = startBeat;
    items.forEach(([n, d, v]) => {
      const sd = d * scale;
      if (n !== null && n !== undefined) {
        const list = (Array.isArray(n) ? n : [n]).map((x) => transposeNote(x, oct));
        if (rolled && list.length > 1) {
          list.forEach((noteName, i) => {
            add(c + i * 0.02 * scale, noteName, Math.max(0.06, sd * 0.92), hand, (v ?? defaultVel) + (i === list.length - 1 ? 0.03 : 0));
          });
        } else {
          add(c, list, Math.max(0.06, sd * 0.92), hand, v ?? defaultVel);
        }
      }
      c += sd;
    });
    return c;
  };

  // Signature 6/8 hemiola octave ostinato: [b1, b1, b2, b2] (0.75 * scale each)
  const lhHemiola = (s, b1, b2, scale = 1, v = 0.62) => {
    const step = 0.75 * scale;
    const o1 = [b1, transposeNote(b1, 12)];
    const o2 = [b2, transposeNote(b2, 12)];
    add(s + 0 * step, o1, step * 0.92, 'LH', v + 0.04);
    add(s + 1 * step, o1, step * 0.92, 'LH', v);
    add(s + 2 * step, o2, step * 0.92, 'LH', v + 0.04);
    add(s + 3 * step, o2, step * 0.92, 'LH', v);
  };

  // 4-note rising sweep arpeggio every 1.5 beats (m.22–36 & m.102–116)
  const SWEEP = {
    Dm: ['D2', 'A2', 'D3', 'F3'],
    Bb: ['Bb1', 'F2', 'Bb2', 'D3'],
    C:  ['C2', 'G2', 'C3', 'E3'],
    F:  ['F1', 'C2', 'F2', 'A2'],
    Gm: ['G1', 'D2', 'G2', 'Bb2'],
    A:  ['A1', 'E2', 'A2', 'C#3'],
  };
  const lhSweep = (s, c1, c2, scale = 1, v = 0.62) => {
    const step = 0.375 * scale;
    SWEEP[c1].forEach((n, i) => add(s + i * step, n, step * 0.94, 'LH', v + (i === 0 ? 0.06 : 0)));
    SWEEP[c2].forEach((n, i) => add(s + 1.5 * scale + i * step, n, step * 0.94, 'LH', v + (i === 0 ? 0.06 : 0)));
  };

  // Driving 6/8 eighth-note pedal in LH
  const lhEighths = (s, b1, b2 = b1, scale = 1, v = 0.62) => {
    const step = 0.5 * scale;
    const o1 = [b1, transposeNote(b1, 12)];
    const o2 = [b2, transposeNote(b2, 12)];
    for (let i = 0; i < 3; i += 1) add(s + i * step, o1, step * 0.88, 'LH', v + (i === 0 ? 0.05 : 0));
    for (let i = 3; i < 6; i += 1) add(s + i * step, o2, step * 0.88, 'LH', v + (i === 3 ? 0.05 : 0));
  };

  // Helper to optionally expand 3-note RH triads to 4-note octave-doubled chords
  const expandChord = (arr, full) => {
    if (!full || !Array.isArray(arr) || arr.length < 3) return arr;
    const lowTop = transposeNote(arr[arr.length - 1], -12);
    return arr.includes(lowTop) ? arr : [lowTop, ...arr];
  };

  // 8-bar Main Theme (reused across m.2–9, m.10–17, m.22–29, m.30–37, m.70–77, m.102–109, m.110–116)
  const mainTheme8Bars = (s, {
    lhStyle = 'hemiola',
    oct = 0,
    fullChords = false,
    rolled = false,
    scale = 1,
    v = 0.86,
    lv = 0.62,
    endPickup = ['A3', 'C4'],
    barsCount = 8,
  } = {}) => {
    const ch = (c) => expandChord(c, fullChords);
    const lhPairs = [
      ['Dm', 'D2', 'Bb', 'Bb1'],
      ['A',  'A1', 'Dm', 'D2'],
      ['Bb', 'Bb1','F',  'F1'],
      ['C',  'C2', 'Dm', 'D2'],
      ['Bb', 'Bb1','C',  'C2'],
      ['Gm', 'G1', 'Dm', 'D2'],
      ['Bb', 'Bb1','C',  'C2'],
      ['A',  'A1', 'A',  'A1'],
    ];

    const rhBars = [
      [[ch(['F3', 'A3', 'D4']), 0.5], [ch(['F3', 'A3', 'D4']), 0.5], ['D4', 0.25], ['E4', 0.25], [ch(['A3', 'D4', 'F4']), 0.5], [ch(['A3', 'D4', 'F4']), 0.5], ['F4', 0.25], ['G4', 0.25]],
      [[ch(['G3', 'C#4', 'E4']), 0.5], [ch(['G3', 'C#4', 'E4']), 0.5], ['D4', 0.25], ['C4', 0.25], ['C4', 0.25], [ch(['F3', 'A3', 'D4']), 0.75], ['A3', 0.25], ['C4', 0.25]],
      [[ch(['F3', 'Bb3', 'D4']), 0.5], [ch(['F3', 'Bb3', 'D4']), 0.5], ['D4', 0.25], ['E4', 0.25], [ch(['A3', 'C4', 'F4']), 0.5], [ch(['A3', 'C4', 'F4']), 0.5], ['F4', 0.25], ['G4', 0.25]],
      [[ch(['G3', 'C4', 'E4']), 0.5], [ch(['G3', 'C4', 'E4']), 0.5], ['D4', 0.25], ['C4', 0.25], [ch(['F3', 'A3', 'D4']), 0.75], [null, 0.25], ['A3', 0.25], ['C4', 0.25]],
      [[ch(['F3', 'Bb3', 'D4']), 0.5], [ch(['F3', 'Bb3', 'D4']), 0.5], ['D4', 0.25], ['F4', 0.25], [ch(['Bb3', 'D4', 'G4']), 0.5], [ch(['Bb3', 'D4', 'G4']), 0.5], ['G4', 0.25], ['A4', 0.25]],
      [[ch(['D4', 'G4', 'Bb4']), 0.5], [ch(['D4', 'G4', 'Bb4']), 0.5], ['A4', 0.25], ['G4', 0.25], ['A4', 0.25], [ch(['F3', 'A3', 'D4']), 0.75], ['D4', 0.25], ['E4', 0.25]],
      [[ch(['A3', 'D4', 'F4']), 0.5], [ch(['A3', 'D4', 'F4']), 0.5], [ch(['Bb3', 'D4', 'G4']), 0.5], ['A4', 0.25], [ch(['F3', 'A3', 'D4']), 0.75], ['D4', 0.25], ['F4', 0.25]],
      [[ch(['A3', 'C#4', 'E4']), 0.5], [ch(['A3', 'C#4', 'E4']), 0.5], ['F4', 0.25], ['D4', 0.25], [ch(['A3', 'C#4', 'E4']), 0.5], [null, 0.5]],
    ];

    let cur = s;
    for (let i = 0; i < barsCount; i += 1) {
      const [c1, b1, c2, b2] = lhPairs[i];
      if (lhStyle === 'sweep') {
        lhSweep(cur, c1, c2, scale, lv);
      } else {
        lhHemiola(cur, b1, b2, scale, lv);
      }
      seq(cur, rhBars[i], 'RH', v, oct, scale, rolled);
      if (i === 7 && endPickup) {
        add(cur + 2.50 * scale, endPickup[0], 0.23 * scale, 'RH', v);
        add(cur + 2.75 * scale, endPickup[1], 0.23 * scale, 'RH', v);
      }
      cur += 3 * scale;
    }
    return cur;
  };

  // 3-bar Transition helper (m.18–20, m.38–40, m.78–80)
  const transition3Bars = (s, v = 0.84, lv = 0.60) => {
    lhHemiola(s, 'D2', 'C2', 1, lv);
    seq(s, [
      [['A3', 'D4', 'F4'], 0.5], [['A3', 'D4', 'F4'], 0.5], [['Bb3', 'D4', 'G4'], 0.5],
      [['C4', 'E4', 'A4'], 0.5], [['C4', 'E4'], 0.5], ['F4', 0.25], ['D4', 0.25],
    ], 'RH', v);

    [0.0, 0.5, 1.0, 1.5, 2.25].forEach((off, idx) => add(s + 3 + off, ['D2', 'D3'], idx >= 3 ? 0.68 : 0.45, 'LH', lv));
    seq(s + 3, [['A3', 1.5], ['D4', 1.0], ['F4', 0.25], ['D4', 0.25]], 'RH', v);

    [0.0, 0.5, 1.0, 1.5, 2.25].forEach((off, idx) => add(s + 6 + off, ['D2', 'D3'], idx >= 3 ? 0.68 : 0.45, 'LH', lv));
    seq(s + 6, [['A3', 1.5], ['A3', 0.75], ['D4', 0.75]], 'RH', v);
    return s + 9;
  };

  // =========================================================================
  // 1. m.1 – m.21: OPENING THEME (LOW + HIGH) & 3/8 TRANSITION (Page 1)
  // =========================================================================
  add(0.00, 'A3', 0.23, 'RH', 0.80);
  add(0.25, 'C4', 0.23, 'RH', 0.82);
  let t = 0.5;

  t = mainTheme8Bars(t, { lhStyle: 'hemiola', oct: 0, v: 0.84, lv: 0.60, endPickup: ['A4', 'C5'] });
  t = mainTheme8Bars(t, { lhStyle: 'hemiola', oct: 12, v: 0.88, lv: 0.62, endPickup: ['D4', 'E4'] });
  t = transition3Bars(t, 0.82, 0.60);

  // m.21 (3/8 bar = 1.5 beats)
  add(t, ['A1', 'A2'], 0.45, 'LH', 0.62);
  add(t + 0.0, 'E4', 0.46, 'RH', 0.82);
  add(t + 1.0, 'A3', 0.23, 'RH', 0.80);
  add(t + 1.25, 'C4', 0.23, 'RH', 0.82);
  t += 1.5;

  // =========================================================================
  // 2. m.22 – m.41: SWEEP ARPEGGIO VARIATION (Page 2)
  // =========================================================================
  t = mainTheme8Bars(t, { lhStyle: 'sweep', oct: 0, v: 0.84, lv: 0.60, endPickup: ['A4', 'C5'] });
  t = mainTheme8Bars(t, { lhStyle: 'sweep', oct: 12, v: 0.88, lv: 0.62, endPickup: ['D4', 'E4'] });
  t = transition3Bars(t, 0.84, 0.62);

  // m.41 (6/8 build into m.42)
  lhHemiola(t, 'D2', 'D2', 1, 0.62);
  seq(t, [
    ['A3', 0.5], [['A3', 'D4'], 0.25], [['C4', 'E4'], 0.25], [['D4', 'F4'], 0.5],
    [['D4', 'F4', 'A4'], 0.5], [['D4', 'F4', 'A4'], 0.5], [['D4', 'F4', 'A4'], 0.5],
  ], 'RH', 0.86);
  t += 3;

  // =========================================================================
  // 3. m.42 – m.61: HEROIC STOMP, OCTAVES & RUNNING 16TH EPISODE (Page 3)
  // =========================================================================
  // m.42–44
  lhHemiola(t, 'D2', 'F1', 1, 0.62);
  seq(t, [[['D4', 'F4', 'A4'], 0.5], [null, 0.5], [['A3', 'C4', 'F4'], 0.5], [['A3', 'C4', 'F4'], 0.5], [['A3', 'C4', 'F4'], 0.5], [['A3', 'C4', 'F4'], 0.5]], 'RH', 0.86);
  t += 3;

  lhHemiola(t, 'Bb1', 'C2', 1, 0.62);
  seq(t, [[['Bb3', 'D4', 'F4'], 0.5], [['Bb3', 'D4', 'F4'], 0.25], [['C4', 'E4', 'G4'], 0.25], [['C4', 'E4', 'G4'], 0.5], [['C4', 'E4', 'G4'], 0.5], [['C4', 'E4', 'G4'], 0.5], [['C4', 'E4', 'G4'], 0.5]], 'RH', 0.86);
  t += 3;

  lhHemiola(t, 'D2', 'C2', 1, 0.62);
  seq(t, [[['D4', 'F4', 'A4'], 0.5], [null, 0.5], ['F4', 0.5], ['E4', 0.5], ['D4', 0.5], ['C4', 0.5]], 'RH', 0.84);
  t += 3;

  // m.45–48: Lyrical single-line melody
  lhHemiola(t, 'F1', 'C2', 1, 0.58);
  seq(t, [['C4', 0.5], ['B3', 0.25], ['C4', 0.25], ['D4', 0.5], ['E4', 1.0], ['F4', 0.25], ['G4', 0.25]], 'RH', 0.84);
  t += 3;

  lhHemiola(t, 'D2', 'A1', 1, 0.58);
  seq(t, [['A4', 0.5], ['G4', 0.5], ['F4', 0.5], ['E4', 0.5], ['F4', 0.5], ['G4', 0.5]], 'RH', 0.84);
  t += 3;

  lhHemiola(t, 'Bb1', 'F1', 1, 0.58);
  seq(t, [['A4', 0.5], ['G4', 0.25], ['A4', 0.25], ['Bb4', 0.5], ['A4', 1.0], ['G4', 0.5]], 'RH', 0.84);
  t += 3;

  lhHemiola(t, 'C2', 'D2', 1, 0.58);
  seq(t, [['F4', 0.5], ['G4', 0.5], ['F4', 0.5], ['E4', 1.0], ['A3', 0.5]], 'RH', 0.82);
  t += 3;

  // m.49–52: Soaring RH octaves
  lhHemiola(t, 'D2', 'C2', 1, 0.62);
  seq(t, [['A3', 0.5], [['D4', 'D5'], 0.25], [['E4', 'E5'], 0.25], [['F4', 'F5'], 0.5], [['G4', 'G5'], 1.0], [['A4', 'A5'], 0.5]], 'RH', 0.88);
  t += 3;

  lhHemiola(t, 'Bb1', 'F1', 1, 0.62);
  seq(t, [[['Bb4', 'Bb5'], 0.5], [['A4', 'A5'], 0.5], [['G4', 'G5'], 0.5], [['F4', 'F5'], 0.5], [['E4', 'E5'], 0.5], [['D4', 'D5'], 0.5]], 'RH', 0.88);
  t += 3;

  lhHemiola(t, 'G1', 'D2', 1, 0.62);
  seq(t, [[['E4', 'E5'], 0.5], [['F4', 'F5'], 0.5], [['G4', 'G5'], 0.5], [['A4', 'A5'], 1.0], [['Bb4', 'Bb5'], 0.5]], 'RH', 0.88);
  t += 3;

  lhHemiola(t, 'Bb1', 'A1', 1, 0.62);
  seq(t, [[['A4', 'A5'], 0.5], [['G4', 'G5'], 0.5], [['F4', 'F5'], 0.5], [['E4', 'E5'], 0.5], [['D4', 'D5'], 0.5], [['C#4', 'C#5'], 0.5]], 'RH', 0.88);
  t += 3;

  // m.53–60: Running 16th Episode (two 4-bar passes)
  for (let pass = 0; pass < 2; pass += 1) {
    lhHemiola(t, 'D2', 'Bb1', 1, 0.60);
    seq(t, [[['F4', 'D5'], 0.75], [['E4', 'C5'], 0.75], ['Bb4', 0.25], ['A4', 0.25], ['G4', 0.25], ['F4', 0.25], ['E4', 0.25], ['D4', 0.25]], 'RH', 0.86);
    t += 3;

    lhHemiola(t, 'F1', 'C2', 1, 0.60);
    seq(t, [['C4', 0.25], ['D4', 0.25], ['E4', 0.25], ['F4', 0.25], ['G4', 0.25], ['A4', 0.25], [['F4', 'A4'], 0.5], [['E4', 'G4'], 0.5], [['F4', 'A4'], 0.5]], 'RH', 0.86);
    t += 3;

    lhHemiola(t, 'G1', 'D2', 1, 0.60);
    seq(t, [['Bb4', 0.25], ['A4', 0.25], ['G4', 0.25], ['F4', 0.25], ['E4', 0.25], ['D4', 0.25], ['G4', 0.25], ['F4', 0.25], ['E4', 0.25], ['D4', 0.25], ['E4', 0.25], ['F4', 0.25]], 'RH', 0.86);
    t += 3;

    lhHemiola(t, 'Bb1', 'A1', 1, 0.60);
    seq(t, [['G4', 0.25], ['F4', 0.25], ['E4', 0.25], ['D4', 0.25], ['C#4', 0.25], ['D4', 0.25], [['C#4', 'E4'], 0.5], [['D4', 'F4'], 0.5], [['C#4', 'E4'], 0.5]], 'RH', 0.86);
    t += 3;
  }

  // m.61: breath + octave pickup
  add(t + 2.50, ['A3', 'A4'], 0.23, 'RH', 0.86);
  add(t + 2.75, ['C4', 'C5'], 0.23, 'RH', 0.88);
  t += 3;

  // =========================================================================
  // 4. m.62 – m.84: GRAND ANTHEM & FULL-CHORD THEME (Page 4)
  // =========================================================================
  lhHemiola(t, 'D2', 'C2', 1, 0.64);
  seq(t, [[['D4', 'F4', 'A4', 'D5'], 1.0], [['E4', 'G4', 'E5'], 0.5], [['F4', 'A4', 'D5', 'F5'], 1.0], [['G4', 'C5', 'E5', 'G5'], 0.5]], 'RH', 0.90);
  t += 3;

  lhHemiola(t, 'Bb1', 'F1', 1, 0.64);
  seq(t, [[['A4', 'D5', 'F5', 'A5'], 1.0], [['G4', 'D5', 'G5'], 0.5], [['F4', 'A4', 'C5', 'F5'], 1.0], [['D4', 'D5'], 0.25], [['E4', 'E5'], 0.25]], 'RH', 0.90);
  t += 3;

  lhHemiola(t, 'G1', 'D2', 1, 0.64);
  seq(t, [[['G4', 'Bb4', 'D5', 'G5'], 1.0], [['A4', 'D5', 'A5'], 0.5], [['Bb4', 'D5', 'G5', 'Bb5'], 1.0], [['A4', 'D5', 'A5'], 0.5]], 'RH', 0.92);
  t += 3;

  lhHemiola(t, 'C2', 'D2', 1, 0.64);
  seq(t, [[['G4', 'C5', 'E5', 'G5'], 1.0], [['F4', 'C5', 'F5'], 0.5], [['F4', 'A4', 'D5', 'F5'], 1.0], [['D4', 'D5'], 0.25], [['E4', 'E5'], 0.25]], 'RH', 0.90);
  t += 3;

  // m.66–69: Anthem second half
  lhHemiola(t, 'Bb1', 'C2', 1, 0.64);
  seq(t, [[['F4', 'Bb4', 'D5', 'F5'], 1.0], [['G4', 'D5', 'G5'], 0.5], [['A4', 'D5', 'F5', 'A5'], 1.0], [['Bb4', 'E5', 'G5', 'Bb5'], 0.5]], 'RH', 0.92);
  t += 3;

  lhHemiola(t, 'G1', 'D2', 1, 0.64);
  seq(t, [[['A4', 'D5', 'F5', 'A5'], 1.0], [['G4', 'D5', 'G5'], 0.5], [['F4', 'A4', 'D5', 'F5'], 1.0], [['E4', 'C5', 'E5'], 0.5]], 'RH', 0.90);
  t += 3;

  lhHemiola(t, 'Bb1', 'C2', 1, 0.64);
  seq(t, [[['D4', 'F4', 'Bb4', 'D5'], 1.0], [['E4', 'C5', 'E5'], 0.5], [['F4', 'A4', 'D5', 'F5'], 1.0], [['G4', 'C5', 'E5', 'G5'], 0.5]], 'RH', 0.90);
  t += 3;

  lhHemiola(t, 'A1', 'A1', 1, 0.64);
  seq(t, [[['A4', 'C#5', 'E5', 'A5'], 1.5], [null, 1.0], [['A4', 'A5'], 0.25], [['C5', 'C6'], 0.25]], 'RH', 0.92);
  t += 3;

  // m.70–77: Full-chord upper-octave Main Theme
  t = mainTheme8Bars(t, { lhStyle: 'hemiola', oct: 12, fullChords: true, v: 0.92, lv: 0.66, endPickup: ['D4', 'E4'] });

  // m.78–84: Transition + 4-bar chord build-up
  t = transition3Bars(t, 0.86, 0.62);
  for (let i = 0; i < 4; i += 1) {
    lhHemiola(t, 'D2', 'D2', 1, 0.60 + i * 0.02);
    seq(t, [
      [['F4', 'A4', 'D5', 'F5'], 0.5], [['F4', 'A4', 'D5', 'F5'], 0.5], [['E4', 'G4', 'C5', 'E5'], 0.5],
      [['D4', 'F4', 'A4', 'D5'], 0.5], [['D4', 'F4', 'A4', 'D5'], 0.5], [['D4', 'F4', 'A4', 'D5'], 0.5],
    ], 'RH', 0.84 + i * 0.02);
    t += 3;
  }

  // =========================================================================
  // 5. m.85 – m.101: CHROMATIC CLIMB, OCTAVE DUET & 5/16 TRILL (Page 5)
  // =========================================================================
  // m.85–88 (mp -> f)
  lhEighths(t, 'D2', 'D2', 1, 0.56);
  seq(t, [[['D4', 'D5'], 1.5], [['E4', 'E5'], 0.5], [['F4', 'F5'], 0.5], [['G4', 'G5'], 0.5]], 'RH', 0.78);
  t += 3;

  lhEighths(t, 'D2', 'D2', 1, 0.58);
  seq(t, [[['A4', 'A5'], 0.5], [['Bb4', 'Bb5'], 0.5], [['A4', 'A5'], 0.5], [['G4', 'G5'], 0.5], [['F4', 'F5'], 0.5], [['E4', 'E5'], 0.5]], 'RH', 0.82);
  t += 3;

  lhEighths(t, 'D2', 'D2', 1, 0.60);
  seq(t, [[['F4', 'F5'], 0.75], [['G4', 'G5'], 0.75], [['A4', 'A5'], 0.5], [['G4', 'G5'], 0.5], [['F4', 'F5'], 0.5]], 'RH', 0.84);
  t += 3;

  lhEighths(t, 'D2', 'D2', 1, 0.62);
  seq(t, [[['E4', 'E5'], 0.5], [['F4', 'F5'], 0.5], [['D4', 'D5'], 1.0], [['A4', 'A5'], 0.5], [['C5', 'C6'], 0.5]], 'RH', 0.86);
  t += 3;

  // m.89–91: High octave & chromatic climb
  lhEighths(t, 'D2', 'D2', 1, 0.64);
  seq(t, [[['D5', 'D6'], 1.0], [['E5', 'E6'], 0.5], [['F5', 'F6'], 0.5], [['G5', 'G6'], 0.5], [['A5', 'A6'], 0.5]], 'RH', 0.90);
  t += 3;

  lhEighths(t, 'D2', 'D2', 1, 0.66);
  seq(t, [[['D5', 'D6'], 0.5], [['D#5', 'D#6'], 0.5], [['E5', 'E6'], 0.5], [['F5', 'F6'], 0.5], [['E5', 'E6'], 0.5], [['D5', 'D6'], 0.5]], 'RH', 0.92);
  t += 3;

  lhEighths(t, 'D2', 'D2', 1, 0.66);
  seq(t, [[['C#5', 'C#6'], 0.5], [['D5', 'D6'], 0.5], [['E5', 'E6'], 0.5], [['F5', 'F6'], 0.5], [['G5', 'G6'], 0.5], [['A5', 'A6'], 0.5]], 'RH', 0.92);
  t += 3;

  // m.92–93: High cascade
  lhEighths(t, 'D2', 'D2', 1, 0.66);
  seq(t, [[['Bb5', 'Bb6'], 0.25], [['A5', 'A6'], 0.25], [['G5', 'G6'], 0.25], [['F5', 'F6'], 0.25], [['E5', 'E6'], 0.25], [['D5', 'D6'], 0.25], [['E5', 'E6'], 0.75], [['F5', 'F6'], 0.75]], 'RH', 0.92);
  t += 3;

  lhEighths(t, 'D2', 'D2', 1, 0.66);
  seq(t, [[['D5', 'D6'], 1.0], [['A3', 'A4'], 0.5], [['D4', 'D5'], 0.5], [['E4', 'E5'], 0.5], [['F4', 'F5'], 0.5]], 'RH', 0.90);
  t += 3;

  // m.94–100: Syncopated octave motif across Dm - Bb - C - Dm
  const octaveBars = [
    ['Bb1', 'Bb1', [['G4', 'G5'], 0.5], [['A4', 'A5'], 0.5], [['Bb4', 'Bb5'], 0.5], [['A4', 'A5'], 0.5], [['G4', 'G5'], 0.5], [['F4', 'F5'], 0.5]],
    ['C2',  'C2',  [['E4', 'E5'], 0.5], [['F4', 'F5'], 0.5], [['G4', 'G5'], 0.5], [['F4', 'F5'], 0.5], [['E4', 'E5'], 0.5], [['D4', 'D5'], 0.5]],
    ['D2',  'D2',  [['F4', 'F5'], 0.5], [['G4', 'G5'], 0.5], [['A4', 'A5'], 1.0], [['D4', 'D5'], 0.5], [['E4', 'E5'], 0.5]],
    ['Bb1', 'C2',  [['F4', 'F5'], 0.5], [['G4', 'G5'], 0.5], [['A4', 'A5'], 0.5], [['Bb4', 'Bb5'], 0.5], [['A4', 'A5'], 0.5], [['G4', 'G5'], 0.5]],
    ['D2',  'C2',  [['F4', 'F5'], 0.5], [['E4', 'E5'], 0.5], [['D4', 'D5'], 0.5], [['E4', 'E5'], 0.5], [['F4', 'F5'], 0.5], [['G4', 'G5'], 0.5]],
    ['Bb1', 'A1',  [['A4', 'A5'], 0.5], [['G4', 'G5'], 0.5], [['F4', 'F5'], 0.5], [['E4', 'E5'], 0.5], [['D4', 'D5'], 0.5], [['C#4', 'C#5'], 0.5]],
    ['D2',  'D2',  [['D4', 'D5'], 0.5], [['E4', 'E5'], 0.5], [['F4', 'F5'], 0.5], [['G4', 'G5'], 0.5], [['A4', 'A5'], 0.5], [['Bb4', 'Bb5'], 0.5]],
  ];
  octaveBars.forEach(([b1, b2, ...items]) => {
    lhEighths(t, b1, b2, 1, 0.66);
    seq(t, items, 'RH', 0.90);
    t += 3;
  });

  // m.101 (5/16 measure = 1.25 beats: rapid trill + pickup)
  add(t, ['D2', 'D3'], 0.48, 'LH', 0.68);
  seq(t, [['D5', 0.125], ['E5', 0.125], ['D5', 0.125], ['E5', 0.125], ['D5', 0.25], [['A3', 'A4'], 0.25], [['C4', 'C5'], 0.25]], 'RH', 0.90);
  t += 1.25;

  // =========================================================================
  // 6. m.102 – m.118: ACCELERANDO ROLLED-CHORD FINALE (120 -> 130 BPM ff)
  // =========================================================================
  // m.102–109 (quarter = 120)
  const sc120 = 110 / 120;
  t = mainTheme8Bars(t, {
    lhStyle: 'sweep',
    oct: 0,
    fullChords: true,
    rolled: true,
    scale: sc120,
    v: 0.90,
    lv: 0.66,
    endPickup: ['A4', 'C5'],
  });

  // m.110–116 (quarter = 130 ff, first 7 bars of upper-octave rolled Main Theme)
  const sc130 = 110 / 130;
  t = mainTheme8Bars(t, {
    lhStyle: 'sweep',
    oct: 12,
    fullChords: true,
    rolled: true,
    scale: sc130,
    v: 0.95,
    lv: 0.70,
    barsCount: 7,
  });

  // m.117: Dramatic rolled A7 cadence
  ['A1', 'C#2', 'E2', 'A2'].forEach((n, i) => add(t + i * 0.75 * sc130, n, 0.70 * sc130, 'LH', 0.70));
  seq(t, [
    [['A4', 'C#5', 'E5', 'A5'], 0.75],
    [['Bb4', 'D5', 'G5', 'Bb5'], 0.75],
    [['A4', 'C#5', 'E5', 'A5'], 0.75],
    [['G4', 'C#5', 'E5', 'A5'], 0.75],
  ], 'RH', 0.96, 0, sc130, true);
  t += 3 * sc130;

  // m.118: Final stinger bar
  add(t, ['D2', 'A2', 'D3'], 0.44 * sc130, 'LH', 0.74);
  add(t, ['F4', 'A4', 'D5', 'A5'], 0.44 * sc130, 'RH', 0.96);

  const fin = t + 0.5 * sc130;
  add(fin, ['D2', 'D3'], 3.2, 'LH', 0.78);
  ['D5', 'F5', 'A5', 'D6'].forEach((n, i) => add(fin + i * 0.03, n, 3.2, 'RH', 0.98));
});

export default SONG_PIRATES;
