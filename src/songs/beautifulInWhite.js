import { buildSong } from './buildSong.js';
import { transposeNote } from './helpers.js';

/**
 * Beautiful in White — Westlife / Shane Filan (C -> D -> E Major, 76 BPM)
 * Faithfully transcribed from the 6-page Piano/Vocal sheet:
 * Intro (C major), Verse 1 (with 2/4 bar), Chorus 1, 1st Ending,
 * Verse 2, Chorus 2, D-major Interlude + "Na na na" + Father-Daughter Bridge,
 * E-major Climax, Final Chorus, & Fermata E-major Outro.
 */
const SONG_BEAUTIFUL_IN_WHITE = buildSong('beautiful-in-white', 'Beautiful in White', 76, ({ add }) => {
  const tr = (n, semi) => {
    if (!semi) return n;
    return Array.isArray(n) ? n.map((x) => transposeNote(x, semi)) : transposeNote(n, semi);
  };

  const seq = (startBeat, items, hand = 'RH', defaultVel = 0.82, semi = 0) => {
    let c = startBeat;
    items.forEach(([n, d, v]) => {
      if (n !== null && n !== undefined) {
        add(c, tr(n, semi), Math.max(0.08, d * 0.94), hand, v ?? defaultVel);
      }
      c += d;
    });
    return c;
  };

  // Continuous Con pedale 1 - 5 - 8 - 5 eighth-note LH pattern (2 beats)
  const lhHalf = (s, root, semi = 0, v = 0.54) => {
    add(s + 0.0, tr(root, semi), 1.90, 'LH', v + 0.05);
    add(s + 0.5, tr(root, semi + 7), 0.46, 'LH', v);
    add(s + 1.0, tr(root, semi + 12), 0.46, 'LH', v + 0.02);
    add(s + 1.5, tr(root, semi + 7), 0.46, 'LH', v - 0.02);
  };

  // "You look so beautiful in..." bar (F -> C in C major, transposed by semi)
  const beautifulBar = (s, semi = 0, v = 0.86) => {
    lhHalf(s + 0, 'F2', semi, 0.58);
    lhHalf(s + 2, 'C2', semi, 0.58);
    seq(s, [['F4', 0.5], ['A4', 0.5], ['C5', 0.5], ['F5', 0.5]], 'RH', v, semi);
    add(s + 2, tr(['E4', 'G4'], semi), 1.90, 'RH', v - 0.06);
    seq(s + 2, [['E5', 0.5], ['F5', 0.25], ['E5', 0.5], ['C5', 0.25], ['D5', 0.75]], 'RH', v, semi);
  };

  // Verse (Page 1 Systems 2–3 + Page 2 System 1: 7 bars 4/4 + 1 bar 2/4 + 1 bar 4/4 = 34 beats)
  const verse = (s, v = 0.80) => {
    const cgPair = (st) => {
      lhHalf(st + 0, 'C3', 0, 0.54);
      lhHalf(st + 2, 'G2', 0, 0.54);
      add(st + 0.0, ['E4', 'G4'], 1.90, 'RH', v - 0.06);
      seq(st + 0.0, [['C5', 0.5], ['C5', 0.5], ['C5', 0.5], ['C5', 0.5]], 'RH', v);
      add(st + 2.0, 'D4', 1.90, 'RH', v - 0.06);
      seq(st + 2.0, [['B4', 1.0], ['G4', 1.0]], 'RH', v);
    };
    const fcPair = (st) => {
      lhHalf(st + 0, 'F2', 0, 0.54);
      lhHalf(st + 2, 'C2', 0, 0.54);
      add(st + 0.0, 'F4', 1.90, 'RH', v - 0.06);
      seq(st + 0.5, [['A4', 0.5], ['B4', 0.5], ['C5', 0.5]], 'RH', v);
      add(st + 2.0, ['C4', 'E4', 'G4'], 0.95, 'RH', v);
      add(st + 3.0, 'E4', 0.95, 'RH', v - 0.04);
    };

    cgPair(s + 0);
    fcPair(s + 4);
    fcPair(s + 8);

    // Bar +12: F - G
    lhHalf(s + 12, 'F2', 0, 0.54);
    lhHalf(s + 14, 'G2', 0, 0.54);
    add(s + 12, 'F4', 1.90, 'RH', v - 0.06);
    seq(s + 12.5, [['A4', 0.5], ['B4', 0.5], ['C5', 0.5]], 'RH', v);
    add(s + 14, ['G4', 'B4', 'D5'], 1.90, 'RH', v);

    cgPair(s + 16);
    fcPair(s + 20);
    fcPair(s + 24);

    // Bar +28: 2/4 bar (2 beats, F)
    lhHalf(s + 28, 'F2', 0, 0.56);
    add(s + 28, 'F4', 1.90, 'RH', v - 0.06);
    seq(s + 28, [['A4', 1.0], ['B4', 0.5], ['C5', 0.5]], 'RH', v);

    // Bar +30: 4/4 bar (4 beats, G -> Chorus pickup)
    add(s + 30.0, 'G2', 3.80, 'LH', 0.58);
    seq(s + 30.5, [['D3', 0.5], ['G3', 0.5], ['B3', 0.5], ['D4', 2.0]], 'LH', 0.52);
    add(s + 30.0, ['G4', 'B4', 'D5'], 2.85, 'RH', v);
    add(s + 33.0, 'C5', 0.46, 'RH', v + 0.02);
    add(s + 33.5, 'D5', 0.46, 'RH', v + 0.02);

    return s + 34;
  };

  // Chorus 8-bar block (32 beats, transposable via semi = 0 for C major or semi = 4 for E major)
  const chorus8 = (s, semi = 0, { modulateUp = false, v = 0.86 } = {}) => {
    const cgChorus = (st) => {
      lhHalf(st + 0, 'C3', semi, 0.58);
      lhHalf(st + 2, 'G2', semi, 0.58);
      seq(st, [
        [['G4', 'C5', 'E5'], 0.5], ['E5', 0.5], ['E5', 0.25], ['E5', 0.25],
        [['G4', 'C5', 'F5'], 0.25], ['G5', 0.25],
        [['B4', 'D5', 'G5'], 1.0], [['G4', 'B4', 'D5'], 1.0],
      ], 'RH', v, semi);
    };
    const amEmChorus = (st) => {
      lhHalf(st + 0, 'A2', semi, 0.58);
      lhHalf(st + 2, 'E2', semi, 0.58);
      seq(st, [
        ['E4', 0.5], ['C5', 0.5], [['E4', 'C5'], 0.5], ['D5', 0.25], ['E5', 0.25],
        [['G4', 'B4', 'E5'], 1.0], [['E4', 'G4', 'B4'], 1.0],
      ], 'RH', v, semi);
    };

    cgChorus(s + 0);
    amEmChorus(s + 4);
    beautifulBar(s + 8, semi, v);

    lhHalf(s + 12, 'G2', semi, 0.58);
    lhHalf(s + 14, 'G2', semi, 0.58);
    add(s + 12.25, tr(['G4', 'C5'], semi), 1.65, 'RH', v);
    seq(s + 14.0, [[['G4', 'B4'], 1.0], ['C5', 0.5], ['D5', 0.5]], 'RH', v, semi);

    cgChorus(s + 16);
    amEmChorus(s + 20);
    beautifulBar(s + 24, semi, v);

    lhHalf(s + 28, 'G2', semi, 0.58);
    lhHalf(s + 30, 'G2', semi, 0.58);
    add(s + 28.25, tr(['G4', 'C5'], semi), 1.65, 'RH', v);
    add(s + 30.0, tr(['G4', 'B4'], semi), 1.20, 'RH', v);

    if (modulateUp) {
      // Pivot into D major (+2)
      seq(s + 31.25, [['D5', 0.25], ['C#5', 0.25], ['D5', 0.25]], 'RH', v + 0.02, 0);
    } else {
      seq(s + 31.25, [['C5', 0.25], ['B4', 0.25], ['C5', 0.25]], 'RH', v, semi);
    }

    return s + 32;
  };

  // =========================================================================
  // 1. INTRO (Page 1 System 1: 4 bars = 16 beats, C Major)
  // =========================================================================
  let t = 0;
  lhHalf(t + 0, 'C3', 0, 0.52); lhHalf(t + 2, 'G2', 0, 0.52);
  add(t + 0, ['G4', 'C5', 'E5'], 1.90, 'RH', 0.78);
  add(t + 2, ['G4', 'B4', 'D5'], 1.90, 'RH', 0.78);
  t += 4;

  lhHalf(t + 0, 'A2', 0, 0.52); lhHalf(t + 2, 'E2', 0, 0.52);
  add(t + 0, ['E4', 'A4', 'C5'], 1.90, 'RH', 0.78);
  add(t + 2, ['E4', 'G4', 'B4'], 1.90, 'RH', 0.78);
  t += 4;

  lhHalf(t + 0, 'F2', 0, 0.52); lhHalf(t + 2, 'C2', 0, 0.52);
  add(t + 0, ['C4', 'F4', 'A4'], 1.90, 'RH', 0.76);
  add(t + 2, ['C4', 'E4', 'G4'], 1.90, 'RH', 0.76);
  t += 4;

  ['G2', 'D3', 'G3'].forEach((n, i) => add(t + i * 0.04, n, 3.80, 'LH', 0.54));
  add(t + 0.0, 'C4', 1.90, 'RH', 0.74);
  seq(t + 0.5, [['G4', 0.5], ['C5', 0.5], ['D5', 0.5]], 'RH', 0.78);
  add(t + 2.0, ['D4', 'G4', 'B4', 'G5'], 1.90, 'RH', 0.80);
  t += 4;

  // =========================================================================
  // 2. VERSE 1 -> CHORUS 1 -> 1st ENDING (74 beats)
  // =========================================================================
  t = verse(t, 0.80);
  t = chorus8(t, 0, { modulateUp: false, v: 0.86 });

  // 1st Ending (Page 3 System 1 bars 1–2: 8 beats)
  lhHalf(t + 0, 'C3', 0, 0.54); lhHalf(t + 2, 'G2', 0, 0.54);
  add(t + 0, ['E4', 'G4', 'C5'], 1.90, 'RH', 0.82);
  seq(t + 2, [[['G4', 'B4'], 0.5], ['C5', 0.5], ['D5', 0.5], ['B4', 0.5]], 'RH', 0.80);
  t += 4;

  lhHalf(t + 0, 'F2', 0, 0.54);
  add(t + 2, 'F2', 1.90, 'LH', 0.52);
  add(t + 0, ['F4', 'A4', 'C5'], 3.40, 'RH', 0.80);
  t += 4;

  // =========================================================================
  // 3. VERSE 2 -> CHORUS 2 (modulating up to D Major)
  // =========================================================================
  t = verse(t, 0.82);
  t = chorus8(t, 0, { modulateUp: true, v: 0.88 });

  // =========================================================================
  // 4. D-MAJOR INTERLUDE + "NA NA NA" + FATHER-DAUGHTER BRIDGE (64 beats, semi = +2)
  // =========================================================================
  // Bar D1: D - A
  lhHalf(t + 0, 'D2', 0, 0.58); lhHalf(t + 2, 'A2', 0, 0.58);
  add(t + 0, ['F#4', 'A4', 'D5'], 1.90, 'RH', 0.88);
  seq(t + 2, [[['A4', 'C#5'], 0.5], ['D5', 0.5], ['E5', 0.5], ['C#5', 0.5]], 'RH', 0.86);
  t += 4;

  // Bar D2: Bm - F#m
  lhHalf(t + 0, 'B2', 0, 0.58); lhHalf(t + 2, 'F#2', 0, 0.58);
  seq(t, [[['F#4', 'B4', 'D5'], 1.0], [['B4', 'D5', 'F#5'], 1.0], [['C#5', 'F#5', 'A5'], 0.5], ['F#5', 0.5], ['E5', 0.5], ['F#5', 0.5]], 'RH', 0.88);
  t += 4;

  // Bar D3: G - D
  beautifulBar(t, 2, 0.88);
  t += 4;

  // Bar D4: Asus4 - A
  lhHalf(t + 0, 'A2', 0, 0.58); lhHalf(t + 2, 'A2', 0, 0.58);
  add(t + 0.25, ['A4', 'D5'], 1.65, 'RH', 0.86);
  add(t + 2.00, ['A4', 'C#5'], 1.90, 'RH', 0.86);
  t += 4;

  // Bar D5: D - A
  lhHalf(t + 0, 'D2', 0, 0.58); lhHalf(t + 2, 'A2', 0, 0.58);
  add(t + 0, ['F#4', 'A4', 'D5'], 1.90, 'RH', 0.86);
  seq(t + 2, [[['A4', 'C#5'], 0.5], ['D5', 0.5], ['E5', 0.5], ['C#5', 0.5]], 'RH', 0.86);
  t += 4;

  // Bar D6: Bm - F#m ("Na na na na")
  lhHalf(t + 0, 'B2', 0, 0.58); lhHalf(t + 2, 'F#2', 0, 0.58);
  seq(t, [[['F#4', 'B4', 'D5'], 1.0], [['B4', 'D5', 'F#5'], 1.0], ['A4', 0.5], ['F#5', 0.5], ['E5', 0.25], ['F#5', 0.75]], 'RH', 0.88);
  t += 4;

  // Bar D7: G - D
  beautifulBar(t, 2, 0.88);
  t += 4;

  // Bar D8: Asus4 - A
  lhHalf(t + 0, 'A2', 0, 0.58); lhHalf(t + 2, 'A2', 0, 0.58);
  add(t + 0.25, ['A4', 'D5'], 1.65, 'RH', 0.86);
  add(t + 2.00, ['A4', 'C#5'], 1.20, 'RH', 0.86);
  seq(t + 3.25, [['D5', 0.25], ['C#5', 0.25], ['D5', 0.25]], 'RH', 0.86);
  t += 4;

  // Father-Daughter Bridge (Bars D9–D16)
  // D9: Bm
  lhHalf(t + 0, 'B2', 0, 0.56); lhHalf(t + 2, 'B2', 0, 0.56);
  add(t + 0, ['F#4', 'B4', 'D5'], 3.10, 'RH', 0.86);
  seq(t + 3.25, [['D5', 0.25], ['E5', 0.25], ['F#5', 0.25]], 'RH', 0.84);
  t += 4;

  // D10: G
  lhHalf(t + 0, 'G2', 0, 0.56); lhHalf(t + 2, 'G2', 0, 0.56);
  seq(t, [[['B4', 'D5', 'G5'], 0.5], ['F#5', 0.5], ['E5', 0.5], ['D5', 0.5], [['G4', 'B4', 'D5'], 0.5], ['E5', 0.5], ['D5', 1.0]], 'RH', 0.86);
  t += 4;

  // D11: D
  lhHalf(t + 0, 'D2', 0, 0.56); lhHalf(t + 2, 'D2', 0, 0.56);
  seq(t, [['F#4', 0.5], ['A4', 0.5], ['F#5', 0.5], ['E5', 0.5], [['A4', 'D5', 'F#5'], 0.5], ['E5', 0.5], ['D5', 1.0]], 'RH', 0.86);
  t += 4;

  // D12: A
  lhHalf(t + 0, 'A2', 0, 0.56); lhHalf(t + 2, 'A2', 0, 0.56);
  seq(t, [['E4', 0.5], ['A4', 0.5], ['E5', 0.5], ['E5', 0.5], [['A4', 'C#5', 'F#5'], 0.5], ['E5', 0.5], ['C#5', 0.25], ['D5', 0.75]], 'RH', 0.86);
  t += 4;

  // D13: Bm
  lhHalf(t + 0, 'B2', 0, 0.56); lhHalf(t + 2, 'B2', 0, 0.56);
  add(t + 0, ['F#4', 'B4', 'D5'], 2.15, 'RH', 0.86);
  seq(t + 2.25, [['F#4', 0.5], ['D5', 0.25], ['D5', 0.25], ['E5', 0.25], ['F#5', 0.25]], 'RH', 0.86);
  t += 4;

  // D14: G
  lhHalf(t + 0, 'G2', 0, 0.58); lhHalf(t + 2, 'G2', 0, 0.58);
  seq(t, [[['B4', 'D5', 'G5'], 0.5], ['F#5', 0.5], ['E5', 0.5], ['D5', 0.5], [['G4', 'B4', 'D5'], 0.5], ['E5', 0.5], ['B4', 1.0]], 'RH', 0.88);
  t += 4;

  // D15: D
  lhHalf(t + 0, 'D2', 0, 0.58); lhHalf(t + 2, 'D2', 0, 0.58);
  seq(t + 0.25, [['A4', 0.25], ['A4', 0.5], ['B4', 0.5], [['F#4', 'A4', 'D5'], 0.5], [['A4', 'D5', 'F#5'], 0.5], ['E5', 0.5], ['A5', 0.5], ['F#5', 0.5]], 'RH', 0.88);
  t += 4;

  // D16: A -> B pivot into E Major (+4)
  lhHalf(t + 0, 'A2', 0, 0.60); lhHalf(t + 2, 'B2', 0, 0.62);
  seq(t, [['E4', 0.5], ['E5', 0.5], ['E5', 0.5], ['E5', 0.5], [['F#4', 'B4', 'F#5'], 0.5], ['E5', 0.5], ['D#5', 0.5], ['E5', 0.5]], 'RH', 0.90);
  t += 4;

  // =========================================================================
  // 5. E-MAJOR CLIMAX, FINAL CHORUS & FERMATA OUTRO (68 beats, semi = +4)
  // =========================================================================
  // E1: E - B ("white...")
  lhHalf(t + 0, 'E2', 0, 0.62); lhHalf(t + 2, 'B2', 0, 0.62);
  seq(t, [[['G#4', 'B4', 'E5'], 1.0], ['B5', 1.0], [['F#4', 'B4', 'D#5', 'B5'], 1.95]], 'RH', 0.92);
  t += 4;

  // E2: C#m - G#m
  lhHalf(t + 0, 'C#3', 0, 0.62); lhHalf(t + 2, 'G#2', 0, 0.62);
  seq(t, [[['G#4', 'C#5', 'E5'], 0.5], ['F#5', 0.5], ['G#5', 0.5], ['E5', 0.5], [['G#4', 'B4', 'D#5'], 1.95]], 'RH', 0.92);
  t += 4;

  // E3: A - E
  beautifulBar(t, 4, 0.92);
  t += 4;

  // E4: Bsus4 - B
  lhHalf(t + 0, 'B2', 0, 0.62); lhHalf(t + 2, 'B2', 0, 0.62);
  add(t + 0.25, ['B4', 'E5'], 1.65, 'RH', 0.90);
  seq(t + 2.00, [[['B4', 'D#5'], 1.0], ['E5', 0.5], ['F#5', 0.5]], 'RH', 0.90);
  t += 4;

  // E5–E12: Final Chorus in E Major
  t = chorus8(t, 4, { modulateUp: false, v: 0.92 });

  // E13–E17: Outro (Page 6 Systems 3–4)
  lhHalf(t + 0, 'E2', 0, 0.58); lhHalf(t + 2, 'B2', 0, 0.58);
  seq(t, [[['G#4', 'B4', 'E5'], 1.5], ['F#5', 0.5], [['F#4', 'B4', 'F#5'], 0.5], ['G#5', 0.5], ['F#5', 0.5], ['E5', 0.5]], 'RH', 0.88);
  t += 4;

  lhHalf(t + 0, 'C#3', 0, 0.58); lhHalf(t + 2, 'G#2', 0, 0.58);
  seq(t, [[['G#4', 'C#5', 'E5'], 1.5], ['F#5', 0.5], [['G#4', 'B4', 'G#5'], 0.5], ['F#5', 0.5], ['E5', 0.5], ['D#5', 0.5]], 'RH', 0.88);
  t += 4;

  beautifulBar(t, 4, 0.86);
  t += 4;

  lhHalf(t + 0, 'B1', 0, 0.54); lhHalf(t + 2, 'B1', 0, 0.52);
  add(t + 0.25, ['B4', 'E5'], 1.65, 'RH', 0.84);
  add(t + 2.00, ['B4', 'D#5'], 1.20, 'RH', 0.82);
  seq(t + 3.25, [['E5', 0.25], ['D#5', 0.25], ['E5', 0.25]], 'RH', 0.80);
  t += 4;

  // Final Fermata E Major Chord
  add(t, ['E2', 'B2', 'E3'], 4.5, 'LH', 0.58);
  ['G#3', 'B3', 'E4', 'G#4', 'E5'].forEach((n, i) => add(t + i * 0.04, n, 4.5, 'RH', 0.84));
});

export default SONG_BEAUTIFUL_IN_WHITE;
