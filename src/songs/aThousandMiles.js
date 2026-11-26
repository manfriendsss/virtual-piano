import { buildSong } from './buildSong.js';

/**
 * A Thousand Miles — Vanessa Carlton (B Major, 100 BPM)
 * Faithfully transcribed from the 7-page Piano/Vocal sheet:
 * Intro, Verse 1, Pre-Chorus 1, Chorus 1, 1st Ending Riff, Verse 2,
 * Pre-Chorus 2, Chorus 2, 2nd Ending Riff, Bridge, D.S. Reprise,
 * 2/4 Coda, Final Chorus, "If I could just hold you tonight" Tag, & F#7sus Outro.
 */
const SONG_A_THOUSAND_MILES = buildSong('a-thousand-miles', 'A Thousand Miles', 100, ({ add }) => {
  const seq = (startBeat, items, hand = 'RH', defaultVel = 0.84) => {
    let c = startBeat;
    items.forEach(([n, d, v]) => {
      if (n !== null && n !== undefined) {
        add(c, n, Math.max(0.08, d * 0.94), hand, v ?? defaultVel);
      }
      c += d;
    });
    return c;
  };

  // High-register Intro LH syncopation (Page 1)
  const lhIntro = (s, v = 0.56) => {
    add(s + 0.00, 'E4', 0.70, 'LH', v + 0.04);
    add(s + 0.75, 'F#4', 0.70, 'LH', v);
    add(s + 1.50, 'D#4', 1.40, 'LH', v + 0.02);
    add(s + 3.00, 'E4', 0.90, 'LH', v);
  };

  // Octave-bass Riff LH syncopation (Page 2 / Page 4)
  const lhRiffOct = (s, v = 0.62) => {
    add(s + 0.00, ['E2', 'E3'], 0.70, 'LH', v + 0.06);
    add(s + 0.75, ['F#2', 'F#3'], 0.70, 'LH', v + 0.02);
    add(s + 1.50, ['D#2', 'D#3'], 1.40, 'LH', v + 0.04);
    add(s + 3.00, ['E2', 'E3'], 0.90, 'LH', v + 0.02);
  };

  // Intro / Ending Riff RH Bars 1 & 2 (Page 1)
  const rhRiffA = (s, v = 0.84) => {
    seq(s, [
      ['B5', 0.25], ['B4', 0.25], ['B5', 0.25], ['A#5', 0.25],
      ['B4', 0.25], ['F#5', 0.25], ['A#5', 0.50],
      ['F#5', 1.00],
      ['E5', 0.25], ['D#5', 0.25], ['E5', 0.25], ['B4', 0.25],
    ], 'RH', v);
  };

  const rhRiffB = (s, v = 0.84) => {
    seq(s, [
      ['B5', 0.25], ['B4', 0.25], ['B5', 0.25], ['A#5', 0.25],
      ['B4', 0.25], ['F#5', 0.25], ['A#5', 0.25], ['F#5', 0.25],
      ['G#5', 0.25], ['B4', 0.25], ['G#5', 0.25], ['B4', 0.25],
      ['E5', 0.25], ['F#5', 0.25], ['E5', 0.25], ['D#5', 0.25],
    ], 'RH', v);
  };

  const rhRiffTurn = (s, v = 0.84) => {
    seq(s, [
      ['D#5', 0.25], ['E5', 0.25], ['F#5', 0.50],
      ['D#5', 0.25], ['E5', 0.25], ['F#5', 0.50],
      ['D#5', 0.25], ['E5', 0.25], ['G#5', 1.00],
      [['C#5', 'E5', 'F#5'], 1.00],
    ], 'RH', v);
  };

  // Middle-register Verse Riff (Page 2 Systems 1 & 3)
  const verseRiff2Bars = (s, octaveBass = false, v = 0.82) => {
    const lhFn = octaveBass
      ? (st) => lhRiffOct(st, 0.60)
      : (st) => {
          add(st + 0.00, 'E3', 0.70, 'LH', 0.54);
          add(st + 0.75, 'F#3', 0.70, 'LH', 0.52);
          add(st + 1.50, 'D#3', 1.40, 'LH', 0.54);
          add(st + 3.00, 'E3', 0.88, 'LH', 0.52);
        };

    lhFn(s);
    seq(s, [
      ['F#5', 0.25], ['B4', 0.25], ['F#5', 0.25], ['E5', 0.25],
      ['B4', 0.25], ['F#5', 0.25], ['E5', 0.25], ['D#5', 0.25],
      ['B4', 0.25], ['D#5', 0.25], ['B4', 0.25], ['C#5', 0.25],
      ['D#5', 0.25], ['C#5', 0.25], ['B4', 0.25], ['F#4', 0.25],
    ], 'RH', v);

    lhFn(s + 4);
    seq(s + 4, [
      ['F#5', 0.25], ['B4', 0.25], ['F#5', 0.25], ['E5', 0.25],
      ['B4', 0.25], ['F#5', 0.25], ['E5', 0.25], ['D#5', 0.25],
      ['B4', 0.25], ['D#5', 0.25], ['B4', 0.25], ['C#5', 0.25],
      ['D#5', 0.25], ['C#5', 0.25], ['B4', 0.50],
    ], 'RH', v);
  };

  // Verse staccato LH punches
  const lhVersePunch = (s, v = 0.58) => {
    add(s + 0.00, ['E2', 'B2'], 0.68, 'LH', v + 0.04);
    add(s + 0.75, ['F#2', 'C#3'], 0.22, 'LH', v);
    add(s + 2.00, ['D#2', 'B2'], 0.68, 'LH', v + 0.04);
    add(s + 2.75, ['E2', 'B2'], 0.22, 'LH', v);
  };

  // Verse Vocal Bars A ("Makin' my way downtown, walkin' fast, faces pass and I'm homebound")
  const versePartA = (s, v = 0.84) => {
    lhVersePunch(s, 0.58);
    seq(s, [
      [['F#4', 'B4'], 0.25], ['D#4', 0.25], ['F#4', 0.25], [['D#4', 'A#4'], 0.50],
      ['C#4', 0.50], ['B3', 0.75], ['F#4', 0.50], ['D#4', 0.50], ['C#4', 1.00],
    ], 'RH', v);

    lhVersePunch(s + 4, 0.58);
    seq(s + 4.5, [
      ['F#4', 0.25], ['D#4', 0.25], ['F#4', 0.25], ['D#4', 0.25],
      ['C#4', 0.25], ['B3', 0.25], ['C#4', 0.50], ['B3', 1.25], ['B4', 0.25],
    ], 'RH', v);
  };

  // Verse Vocal Bars B ("Starin' blankly ahead, just makin' my way, makin' a way through the crowd")
  const versePartB = (s, v = 0.84) => {
    lhVersePunch(s, 0.58);
    seq(s, [
      [['F#4', 'B4'], 0.25], ['D#4', 0.25], ['F#4', 0.50], ['D#4', 0.25], ['C#4', 0.75],
      ['B3', 0.25], ['F#4', 0.25], ['D#4', 0.25], ['F#4', 0.25], ['D#4', 0.50], ['C#4', 1.00],
    ], 'RH', v);

    lhVersePunch(s + 4, 0.58);
    seq(s + 4.5, [
      ['F#4', 0.50], ['D#4', 0.25], ['C#4', 0.25], ['B3', 1.00],
      ['D#4', 0.50], ['C#4', 0.50], ['C#4', 0.50], ['B3', 0.25],
    ], 'RH', v);
  };

  // Pre-Chorus rhythmic chord burst (beats 1–2 of bars 13, 14, 15)
  const preChorusBurst = (s, v = 0.86, lv = 0.62) => {
    add(s + 0.00, ['E2', 'E3'], 0.70, 'LH', lv + 0.04);
    add(s + 0.75, ['F#2', 'F#3'], 0.70, 'LH', lv);
    add(s + 1.50, ['D#2', 'D#3'], 0.42, 'LH', lv + 0.02);

    add(s + 0.00, ['E4', 'F#4', 'B4'], 0.22, 'RH', v);
    add(s + 0.25, ['E4', 'F#4', 'B4'], 0.22, 'RH', v - 0.02);
    add(s + 0.50, ['E4', 'F#4', 'B4'], 0.22, 'RH', v);
    add(s + 0.75, ['E4', 'F#4', 'C#5'], 0.22, 'RH', v);
    add(s + 1.00, ['E4', 'F#4', 'C#5'], 0.45, 'RH', v + 0.02);
    add(s + 1.50, ['D#4', 'F#4', 'B4'], 0.42, 'RH', v + 0.02);
  };

  // Pre-Chorus (4 bars = 16 beats)
  const preChorus = (s, v = 0.86) => {
    // "And I need you,"
    preChorusBurst(s, v);
    seq(s + 2.5, [['B3', 0.25], ['B3', 0.25], ['F#4', 0.50], ['D#4', 0.50]], 'RH', v);

    // "and I miss you,"
    preChorusBurst(s + 4, v);
    seq(s + 6.5, [['B3', 0.25], ['B3', 0.25], ['F#4', 0.50], ['D#4', 0.50]], 'RH', v);

    // "and now I"
    preChorusBurst(s + 8, v);
    seq(s + 10.5, [['D#4', 0.50], ['E4', 0.50], ['F#4', 0.50]], 'RH', v);

    // "wonder... If"
    add(s + 12, 'E2', 1.9, 'LH', 0.58);
    add(s + 14, 'F#2', 1.9, 'LH', 0.58);
    add(s + 12, ['B3', 'E4', 'G#4'], 1.9, 'RH', 0.80);
    add(s + 14, ['A#3', 'C#4', 'F#4'], 1.4, 'RH', 0.80);
    add(s + 15.5, 'B4', 0.46, 'RH', 0.84);
    return s + 16;
  };

  // Chorus (8 bars = 32 beats)
  const chorus = (s, { quietFirstHalf = false, isCoda = false } = {}) => {
    const lh8 = (st, notes, lv = 0.60) => {
      notes.forEach((n, i) => add(st + i * 0.5, n, 0.46, 'LH', lv + (i === 0 ? 0.05 : 0)));
    };
    const lhDrive = (st, b1, b2, lv = 0.66) => {
      [0.00, 0.75, 1.50].forEach((off, idx) => add(st + off, b1, idx === 2 ? 0.45 : 0.70, 'LH', lv));
      [2.00, 2.75, 3.50].forEach((off, idx) => add(st + off, b2, idx === 2 ? 0.45 : 0.70, 'LH', lv));
    };

    const arpPair1 = (st) => {
      if (quietFirstHalf) {
        add(st + 0, ['E2', 'B2'], 1.9, 'LH', 0.56);
        add(st + 2, ['F#2', 'C#3'], 1.9, 'LH', 0.56);
      } else {
        lh8(st + 0, ['E2', 'B2', 'E3', 'G#3'], 0.58);
        lh8(st + 2, ['F#2', 'C#3', 'F#3', 'A#3'], 0.58);
      }
    };
    const arpPair2 = (st) => {
      if (quietFirstHalf) {
        add(st + 0, ['D#2', 'B2'], 1.9, 'LH', 0.56);
        add(st + 2, ['E2', 'B2'], 1.9, 'LH', 0.56);
      } else {
        lh8(st + 0, ['D#2', 'B2', 'D#3', 'F#3'], 0.58);
        lh8(st + 2, ['E2', 'B2', 'E3', 'G#3'], 0.58);
      }
    };

    // Bar 1: "I could fall into"
    arpPair1(s);
    seq(s, [[['G#4', 'D#5'], 0.50], [['G#4', 'E5'], 0.75], ['B4', 0.25], [['A#4', 'F#5'], 1.50], ['B4', 0.50]], 'RH', 0.88);

    // Bar 2: "the sky, do"
    arpPair2(s + 4);
    seq(s + 4, [[['F#4', 'D#5'], 0.50], [['F#4', 'E5'], 0.75], ['B4', 0.25], [['B4', 'G#5'], 1.50], ['B4', 0.50]], 'RH', 0.88);

    // Bar 3: "you think time would"
    arpPair1(s + 8);
    seq(s + 8, [[['G#4', 'D#5'], 0.50], ['E5', 0.50], ['F#5', 0.50], ['B4', 0.50], [['A#4', 'F#5'], 1.50], ['B4', 0.50]], 'RH', 0.88);

    // Bar 4: "pass me by? 'Cause you"
    arpPair2(s + 12);
    seq(s + 12, [[['F#4', 'D#5'], 0.50], ['E5', 0.75], ['B4', 0.25], [['G#4', 'E5'], 1.50], ['B4', 0.25], ['C#5', 0.25]], 'RH', 0.88);

    // Bar 5: "know I'd walk a"
    lhDrive(s + 16, ['E2', 'E3'], ['F#2', 'F#3'], 0.66);
    seq(s + 16, [[['G#4', 'D#5'], 0.50], ['E5', 0.50], ['F#5', 0.50], ['B4', 0.50], [['A#4', 'F#5'], 1.00], ['D#5', 0.50], ['E5', 0.50]], 'RH', 0.90);

    // Bar 6: "thousand miles if I could"
    lhDrive(s + 20, ['D#2', 'D#3'], ['E2', 'E3'], 0.66);
    seq(s + 20, [[['B4', 'F#5'], 0.50], ['D#5', 0.75], ['B4', 0.25], [['G#4', 'E5'], 1.00], ['D#5', 0.50], ['C#5', 0.25], ['B4', 0.50], ['C#5', 0.25]], 'RH', 0.90);

    // Bar 7–8: "just see you... tonight."
    add(s + 24.0, 'G#2', 1.45, 'LH', 0.64);
    add(s + 25.5, 'A#2', 1.45, 'LH', 0.64);
    add(s + 27.0, 'F#2', 0.95, 'LH', 0.64);
    add(s + 28.0, ['F#2', 'C#3'], 3.80, 'LH', 0.62);

    add(s + 24.0, ['B4', 'D#5', 'G#5'], 1.45, 'RH', 0.92);
    add(s + 25.5, ['C#5', 'F#5', 'A#5'], 1.45, 'RH', 0.92);
    add(s + 27.0, ['A#4', 'C#5', 'F#5'], 3.40, 'RH', 0.90);

    if (!isCoda) {
      add(s + 30.50, 'C#5', 0.24, 'RH', 0.84);
      add(s + 30.75, 'D#5', 0.72, 'RH', 0.84);
      add(s + 31.75, 'B4', 0.24, 'RH', 0.84);
    }

    return s + 32;
  };

  // Bridge 2-beat syncopated groove helper (Pages 4–5)
  const bridgeHalf = (s, lhDyad, rhChord, lv = 0.64, rv = 0.76) => {
    add(s + 0.00, lhDyad, 0.70, 'LH', lv + 0.04);
    add(s + 0.75, lhDyad, 0.70, 'LH', lv);
    add(s + 1.50, lhDyad, 0.44, 'LH', lv);
    add(s + 0.75, rhChord, 0.68, 'RH', rv);
    add(s + 1.50, rhChord, 0.44, 'RH', rv);
  };

  // =========================================================================
  // 1. INTRO (Pickup + Bars 1–4 = 16.25 beats)
  // =========================================================================
  add(0.0, 'B4', 0.24, 'RH', 0.82);
  let t = 0.25;

  lhIntro(t);      rhRiffA(t, 0.82);    t += 4;
  lhIntro(t);      rhRiffB(t, 0.82);    t += 4;
  lhIntro(t);      rhRiffA(t, 0.84);    t += 4;
  lhIntro(t);      rhRiffTurn(t, 0.84); t += 4;

  // =========================================================================
  // 2. VERSE 1 (Bars 5–12 = 32 beats)
  // =========================================================================
  versePartA(t, 0.84);        t += 8;
  verseRiff2Bars(t, false);   t += 8;
  versePartB(t, 0.84);        t += 8;
  verseRiff2Bars(t, true);    t += 8;

  // =========================================================================
  // 3. PRE-CHORUS 1 & CHORUS 1 (48 beats)
  // =========================================================================
  t = preChorus(t, 0.86);
  t = chorus(t, { quietFirstHalf: false, isCoda: false });

  // =========================================================================
  // 4. 1st ENDING RIFF (2 bars) -> VERSE 2 (4 bars) -> PRE-CHORUS 2 -> CHORUS 2
  // =========================================================================
  lhRiffOct(t); rhRiffA(t, 0.86); t += 4;
  lhRiffOct(t); rhRiffB(t, 0.86); t += 4;

  versePartA(t, 0.84);        t += 8;
  verseRiff2Bars(t, true);    t += 8;

  t = preChorus(t, 0.88);
  t = chorus(t, { quietFirstHalf: false, isCoda: false });

  // =========================================================================
  // 5. 2nd ENDING INTERLUDE (4 bars = 16 beats) -> BRIDGE PICKUP
  // =========================================================================
  lhRiffOct(t); rhRiffA(t, 0.86); t += 4;
  lhRiffOct(t); rhRiffB(t, 0.86); t += 4;
  lhRiffOct(t); rhRiffA(t, 0.88); t += 4;
  lhRiffOct(t); rhRiffB(t, 0.88);
  add(t + 3.75, 'D#4', 0.24, 'RH', 0.84); // "And"
  t += 4;

  // =========================================================================
  // 6. BRIDGE (Pages 4–5: 8 bars = 32 beats)
  // =========================================================================
  const Gm11  = ['B3', 'C#4', 'F#4', 'B4'];
  const FsAs  = ['A#3', 'C#4', 'F#4'];
  const Bmaj9 = ['B3', 'C#4', 'D#4', 'F#4'];
  const FsCs  = ['A#3', 'C#4', 'F#4'];

  // Bar 1: "I, I"
  bridgeHalf(t, ['G#2', 'G#3'], Gm11);
  bridgeHalf(t + 2, ['A#2', 'A#3'], FsAs);
  add(t + 0.00, 'F#5', 0.72, 'RH', 0.88);
  add(t + 0.75, 'D#5', 0.72, 'RH', 0.88);
  add(t + 2.00, 'F#5', 0.72, 'RH', 0.88);
  add(t + 2.75, 'D#5', 0.72, 'RH', 0.88);
  t += 4;

  // Bar 2: "don't want to let you know"
  bridgeHalf(t, ['B2', 'B3'], Bmaj9);
  bridgeHalf(t + 2, ['C#3', 'C#4'], FsCs);
  seq(t + 0.5, [['D#5', 0.50], ['E5', 0.50], ['D#5', 0.50], ['F#5', 0.50], ['D#5', 0.50], ['C#5', 1.00]], 'RH', 0.88);
  t += 4;

  // Bar 3: "I, I"
  bridgeHalf(t, ['G#2', 'G#3'], Gm11);
  bridgeHalf(t + 2, ['A#2', 'A#3'], FsAs);
  add(t + 0.00, 'F#5', 0.72, 'RH', 0.88);
  add(t + 0.75, 'D#5', 0.72, 'RH', 0.88);
  add(t + 2.00, 'F#5', 0.72, 'RH', 0.88);
  add(t + 2.75, 'D#5', 0.72, 'RH', 0.88);
  t += 4;

  // Bar 4: "drown in your mem-o-ry"
  bridgeHalf(t, ['B2', 'B3'], Bmaj9);
  bridgeHalf(t + 2, ['C#3', 'C#4'], FsCs);
  seq(t + 0.5, [['F#5', 0.75], ['E5', 0.25], ['D#5', 0.50], ['D#5', 0.50], ['C#5', 0.50], ['B4', 1.00]], 'RH', 0.88);
  t += 4;

  // Bar 5: "I, I"
  bridgeHalf(t, ['G#2', 'G#3'], Gm11);
  bridgeHalf(t + 2, ['A#2', 'A#3'], FsAs);
  add(t + 0.00, 'F#5', 0.72, 'RH', 0.88);
  add(t + 0.75, 'D#5', 0.72, 'RH', 0.88);
  add(t + 2.00, 'F#5', 0.72, 'RH', 0.88);
  add(t + 2.75, 'D#5', 0.72, 'RH', 0.88);
  t += 4;

  // Bar 6: "don't want to let this go"
  bridgeHalf(t, ['B2', 'B3'], Bmaj9);
  bridgeHalf(t + 2, ['C#3', 'C#4'], FsCs);
  seq(t + 0.5, [['D#5', 0.50], ['E5', 0.50], ['D#5', 0.50], ['F#5', 0.50], ['D#5', 0.50], ['C#5', 1.00]], 'RH', 0.88);
  t += 4;

  // Bars 7–8: "I, I don't." (F#sus whole-bar hold, D.S. al Coda)
  add(t + 0.00, ['G#2', 'G#3'], 1.40, 'LH', 0.66);
  add(t + 1.50, ['A#2', 'A#3'], 1.40, 'LH', 0.66);
  add(t + 3.00, ['F#2', 'C#3'], 4.80, 'LH', 0.68);
  add(t + 0.00, 'F#5', 1.40, 'RH', 0.90);
  add(t + 1.50, 'F#5', 1.40, 'RH', 0.90);
  add(t + 3.00, ['B3', 'C#4', 'F#4', 'B4', 'F#5'], 4.60, 'RH', 0.90);
  t += 8;

  // =========================================================================
  // 7. D.S. REPRISE -> 2/4 CODA -> FINAL CHORUS -> TAG -> OUTRO
  // =========================================================================
  versePartA(t, 0.84);        t += 8;
  verseRiff2Bars(t, true);    t += 8;

  // "And I still need you," + "and I still miss you,"
  preChorusBurst(t, 0.88);
  seq(t + 2.5, [['B3', 0.25], ['B3', 0.25], ['F#4', 0.50], ['D#4', 0.50]], 'RH', 0.88);
  t += 4;
  preChorusBurst(t, 0.88);
  seq(t + 2.5, [['B3', 0.25], ['B3', 0.25], ['F#4', 0.50], ['D#4', 0.50]], 'RH', 0.88);
  t += 4;

  // Coda Bar 1 (4/4): "and now I"
  preChorusBurst(t, 0.88);
  seq(t + 2.5, [['D#4', 0.50], ['E4', 0.50], ['F#4', 0.50]], 'RH', 0.88);
  t += 4;

  // Coda Bar 2 (2/4! Page 5 bottom right): "won-"
  add(t, 'E2', 1.9, 'LH', 0.60);
  add(t, ['G#4', 'B4', 'E5'], 1.9, 'RH', 0.84);
  t += 2;

  // Coda Bar 3 (4/4, Page 6 top left): "-der... If"
  add(t, 'F#2', 3.8, 'LH', 0.60);
  add(t, ['F#4', 'A#4', 'C#5'], 3.4, 'RH', 0.82);
  add(t + 3.5, 'B4', 0.46, 'RH', 0.86);
  t += 4;

  // Final Chorus (32 beats, quiet tender first half -> driving second half)
  t = chorus(t, { quietFirstHalf: true, isCoda: true });

  // Page 7 System 1 Tag: "If I could just hold you... to-night."
  add(t + 2.5, 'B4', 0.48, 'RH', 0.82);
  add(t + 3.0, 'C#5', 0.48, 'RH', 0.82);
  add(t + 3.5, 'D#5', 0.48, 'RH', 0.82);
  t += 4;

  add(t + 0.0, 'G#2', 1.45, 'LH', 0.62);
  add(t + 1.5, 'A#2', 1.45, 'LH', 0.62);
  add(t + 3.0, 'B2', 0.95, 'LH', 0.62);
  add(t + 0.0, ['B4', 'E5', 'G#5'], 1.45, 'RH', 0.88);
  add(t + 1.5, ['C#5', 'F#5', 'A#5'], 1.45, 'RH', 0.88);
  add(t + 3.0, ['B4', 'D#5', 'F#5'], 3.40, 'RH', 0.86);
  t += 4;

  add(t, ['F#2', 'C#3'], 3.8, 'LH', 0.60);
  add(t + 3.5, 'C#5', 0.48, 'RH', 0.80); // "to-"
  t += 4;

  // 4-Bar Outro Riff (Page 7 Systems 2–3, "night." lands on Beat 1)
  add(t, 'D#4', 1.5, 'RH', 0.76);
  lhIntro(t, 0.56); rhRiffA(t, 0.84); t += 4;
  lhIntro(t, 0.56); rhRiffB(t, 0.84); t += 4;

  // Outro Bars 3–4 with [B2, F#3] syncopated fifths & F#7sus unresolved ending
  const lhOutroB = (st) => {
    add(st + 0.00, ['B2', 'F#3'], 0.70, 'LH', 0.58);
    add(st + 0.75, ['B2', 'F#3'], 0.70, 'LH', 0.56);
    add(st + 1.50, ['B2', 'F#3'], 1.40, 'LH', 0.56);
    add(st + 3.00, ['B2', 'F#3'], 0.90, 'LH', 0.54);
  };
  lhOutroB(t); rhRiffA(t, 0.80); t += 4;

  // Final Bar: F#/B -> F#7sus hold
  add(t + 0.00, ['B2', 'F#3'], 0.70, 'LH', 0.56);
  add(t + 0.75, ['B2', 'F#3'], 0.70, 'LH', 0.54);
  add(t + 1.50, ['B2', 'F#3'], 0.48, 'LH', 0.54);
  add(t + 2.00, ['F#2', 'C#3'], 2.80, 'LH', 0.58);

  seq(t, [
    ['D#5', 0.25], ['E5', 0.25], ['F#5', 0.50],
    ['D#5', 0.25], ['E5', 0.25], ['G#5', 0.50],
    [['B3', 'C#4', 'E4', 'F#4'], 2.80],
  ], 'RH', 0.78);
});

export default SONG_A_THOUSAND_MILES;
