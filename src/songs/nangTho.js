import { buildSong } from './buildSong.js';
import { makeMelody } from './helpers.js';

/**
 * Nàng Thơ — Hoàng Dũng (C Major, 74 BPM)
 * Warm acoustic-ballad piano arrangement: nostalgic Intro, Verse 1, Pre-Chorus,
 * expressive Chorus (with G/B -> E7 -> Am7), Interlude, harmonized Final Chorus,
 * and bittersweet Fm6 -> Cmaj7 coda.
 */
const SONG_NANG_THO = buildSong('nang-tho', 'Nàng Thơ', 74, ({ add }) => {
  const mel = makeMelody(add);

  const CH = {
    C:     { b: 'C3', arp: ['C3', 'G3', 'C4', 'E4'],  tri: ['G3', 'E4'], pcs: [0, 4, 7] },
    Em7:   { b: 'E2', arp: ['E2', 'B2', 'E3', 'G3'],  tri: ['B2', 'G3'], pcs: [4, 7, 11, 2] },
    Am7:   { b: 'A2', arp: ['A2', 'E3', 'G3', 'C4'],  tri: ['E3', 'C4'], pcs: [9, 0, 4, 7] },
    Gm7:   { b: 'G2', arp: ['G2', 'D3', 'F3', 'Bb3'], tri: ['D3', 'F3'], pcs: [7, 10, 2, 5] },
    C7:    { b: 'C3', arp: ['C3', 'G3', 'Bb3', 'E3'], tri: ['G3', 'Bb3'], pcs: [0, 4, 7, 10] },
    Fmaj7: { b: 'F2', arp: ['F2', 'C3', 'E3', 'A3'],  tri: ['C3', 'E3'], pcs: [5, 9, 0, 4] },
    Fm6:   { b: 'F2', arp: ['F2', 'C3', 'D3', 'Ab3'], tri: ['C3', 'Ab3'], pcs: [5, 8, 0, 2] },
    Dm7:   { b: 'D3', arp: ['D3', 'A3', 'C4', 'F3'],  tri: ['A3', 'C4'], pcs: [2, 5, 9, 0] },
    G:     { b: 'G2', arp: ['G2', 'D3', 'G3', 'B3'],  tri: ['D3', 'B3'], pcs: [7, 11, 2] },
    G7:    { b: 'G2', arp: ['G2', 'D3', 'F3', 'B3'],  tri: ['D3', 'F3'], pcs: [7, 11, 2, 5] },
    GB:    { b: 'B2', arp: ['B2', 'D3', 'G3', 'B3'],  tri: ['D3', 'G3'], pcs: [7, 11, 2] },
    E7:    { b: 'E2', arp: ['E2', 'B2', 'D3', 'G#3'], tri: ['B2', 'G#3'], pcs: [4, 8, 11, 2] },
    CE:    { b: 'E2', arp: ['E2', 'C3', 'E3', 'G3'],  tri: ['C3', 'G3'], pcs: [0, 4, 7] },
  };

  const lhBar = (s, name, style, v) => {
    const c = CH[name];
    if (style === 'arp') {
      add(s + 0.0, c.arp[0], 3.6, 'LH', v + 0.05);
      add(s + 0.5, c.arp[1], 1.4, 'LH', v);
      add(s + 1.0, c.arp[2], 1.4, 'LH', v + 0.02);
      add(s + 1.5, c.arp[3], 1.2, 'LH', v - 0.02);
      add(s + 2.0, c.arp[2], 1.2, 'LH', v);
      add(s + 2.5, c.arp[3], 1.0, 'LH', v - 0.02);
      add(s + 3.0, c.arp[1], 0.9, 'LH', v - 0.04);
    } else if (style === 'half') {
      // Used when 2 chords share a 4-beat bar
      add(s + 0.0, c.arp[0], 1.85, 'LH', v + 0.05);
      add(s + 0.5, c.arp[1], 1.35, 'LH', v);
      add(s + 1.0, c.arp[2], 0.90, 'LH', v + 0.02);
      add(s + 1.5, c.arp[3], 0.45, 'LH', v - 0.03);
    } else {
      add(s + 0.0, c.b, 3.8, 'LH', v + 0.04);
      add(s + 0.12, c.tri, 3.6, 'LH', v - 0.04);
    }
  };

  // Intro (16 beats): C - Fmaj7 - G - C / Fmaj7 - Fm6 - Dm7 - G
  const intro = (s) => {
    const chords = ['C', 'Fmaj7', 'G', 'C', 'Fmaj7', 'Fm6', 'Dm7', 'G'];
    chords.forEach((c, i) => lhBar(s + i * 2, c, 'half', 0.50));
    mel(s, [
      ['E5', 1.0], ['G5', 1.0], ['F5', 1.0], ['E5', 1.0],
      ['D5', 1.0], ['C5', 0.5], ['D5', 0.5], ['E5', 2.0],
      ['A4', 1.0], ['C5', 1.0], ['Ab4', 1.0], ['C5', 1.0],
      ['F4', 1.0], ['A4', 1.0], ['G4', 1.5], [null, 0.5],
    ], { vel: 0.74 });
    return s + 16;
  };

  // Verse (32 beats)
  const verse = (s, o = {}) => {
    const style = o.lh || 'arp';
    const lv = o.lhVel ?? 0.52;
    lhBar(s + 0, 'C', style, lv);
    lhBar(s + 4, 'Em7', style, lv);
    lhBar(s + 8, 'Am7', style, lv);
    lhBar(s + 12, 'Gm7', 'half', lv);
    lhBar(s + 14, 'C7', 'half', lv);
    lhBar(s + 16, 'Fmaj7', style, lv);
    lhBar(s + 20, 'Dm7', style, lv);
    lhBar(s + 24, 'G', style, lv);
    lhBar(s + 28, 'C', style, lv);

    mel(s, [
      ['G4', 1.0], ['E4', 0.5], ['G4', 0.5], ['C5', 1.0], ['B4', 1.0],
      ['G4', 1.0], ['G4', 0.5], ['E4', 0.5], ['A4', 2.0],
      ['G4', 0.5], ['G4', 0.5], ['F4', 0.5], ['E4', 0.5], ['F4', 1.0], ['G4', 0.5], ['C4', 0.5],
      ['F4', 0.5], ['E4', 0.5], ['F4', 0.5], ['E4', 0.5], ['F4', 1.0], ['G4', 1.0],
      ['D4', 2.0], ['E4', 1.0], ['F4', 1.0],
      ['G4', 1.0], ['E4', 0.5], ['G4', 0.5], ['C5', 1.0], ['D5', 1.0],
      ['C5', 1.0], ['B4', 1.0], ['B4', 0.5], ['C5', 0.5], ['C5', 1.0],
      ['C5', 0.5], ['C5', 0.5], ['D5', 0.5], ['E5', 1.5], [null, 1.0],
    ], { oct: o.oct || 0, vel: o.vel ?? 0.78 });
    return s + 32;
  };

  // Pre-Chorus (16 beats)
  const preChorus = (s, o = {}) => {
    const lv = o.lhVel ?? 0.54;
    ['Am7', 'G', 'Fmaj7', 'CE', 'Am7', 'G', 'Fmaj7', 'G'].forEach((c, i) => {
      lhBar(s + i * 2, c, 'half', lv);
    });
    mel(s, [
      ['C5', 0.5], ['C5', 0.5], ['C5', 0.5], ['B4', 0.5], ['C5', 0.5], ['D5', 0.5], ['C5', 0.5], ['B4', 0.5],
      ['B4', 0.5], ['B4', 0.5], ['C5', 0.5], ['A4', 1.5], [null, 1.0],
      ['C5', 0.5], ['C5', 0.5], ['C5', 0.5], ['B4', 0.5], ['C5', 0.5], ['D5', 0.5], ['C5', 0.5], ['B4', 0.5],
      ['B4', 0.5], ['B4', 0.5], ['C5', 0.5], ['A4', 0.5], ['G4', 0.5], ['A4', 0.5], ['G4', 1.0],
    ], { oct: o.oct || 0, vel: o.vel ?? 0.80 });
    return s + 16;
  };

  // Chorus (32 beats): "Em không là nàng thơ..."
  const chorus = (s, o = {}) => {
    const lv = o.lhVel ?? 0.58;
    lhBar(s + 0, 'C', 'arp', lv);
    lhBar(s + 4, 'GB', 'half', lv);
    lhBar(s + 6, 'E7', 'half', lv);
    lhBar(s + 8, 'Am7', 'arp', lv);
    lhBar(s + 12, 'Gm7', 'half', lv);
    lhBar(s + 14, 'C7', 'half', lv);
    lhBar(s + 16, 'Fmaj7', 'arp', lv);
    lhBar(s + 20, 'Em7', 'half', lv);
    lhBar(s + 22, 'Am7', 'half', lv);
    lhBar(s + 24, 'Dm7', 'arp', lv);
    lhBar(s + 28, 'G7', 'arp', lv);

    const pcsMap = [
      [4, CH.C.pcs], [6, CH.GB.pcs], [8, CH.E7.pcs], [12, CH.Am7.pcs],
      [14, CH.Gm7.pcs], [16, CH.C7.pcs], [20, CH.Fmaj7.pcs], [22, CH.Em7.pcs],
      [24, CH.Am7.pcs], [28, CH.Dm7.pcs], [32, CH.G7.pcs],
    ];
    const pcsAt = (time) => {
      const rel = time - s;
      const hit = pcsMap.find(([end]) => rel < end - 1e-4);
      return hit ? hit[1] : CH.G7.pcs;
    };

    mel(s, [
      ['G4', 0.5], ['F4', 0.5], ['E4', 0.5], ['G4', 0.5], ['E5', 2.0],
      ['E5', 0.5], ['F5', 0.5], ['E5', 0.5], ['B4', 0.5], ['B4', 0.5], ['C5', 0.5], ['D5', 0.5], ['C5', 0.5],
      ['C5', 0.5], ['C5', 0.5], ['C5', 0.5], ['C5', 0.5], ['D5', 0.5], ['E5', 0.5], ['F5', 1.0],
      ['G4', 0.5], ['G5', 0.5], ['F5', 0.5], ['E5', 0.5], ['E5', 0.5], ['E5', 0.5], ['F5', 0.5], ['D5', 0.5],
      ['G4', 0.5], ['F4', 0.5], ['E4', 0.5], ['G4', 0.5], ['E5', 2.0],
      ['D5', 0.5], ['E5', 0.5], ['G5', 1.0], ['D5', 0.5], ['E5', 0.5], ['C5', 1.0],
      ['F5', 0.5], ['E5', 0.5], ['D5', 1.0], ['C5', 0.5], ['D5', 0.5], ['A4', 0.5], ['C5', 0.5],
      ['D5', 1.0], ['B4', 1.0], ['C5', 1.5], [null, 0.5],
    ], { oct: o.oct || 0, harm: o.harm || 0, pcsAt, floor: 62, vel: o.vel ?? 0.84 });
    return s + 32;
  };

  let t = 0;
  t = intro(t);
  t = verse(t, { lh: 'arp', vel: 0.78, lhVel: 0.50 });
  t = preChorus(t, { vel: 0.80, lhVel: 0.54 });
  t = chorus(t, { harm: 1, vel: 0.84, lhVel: 0.58 });
  t = intro(t); // Instrumental interlude
  t = verse(t, { lh: 'arp', oct: 12, vel: 0.80, lhVel: 0.54 });
  t = chorus(t, { oct: 12, harm: 1, vel: 0.88, lhVel: 0.62 });

  // Bittersweet Fm6 -> Cmaj7 coda
  lhBar(t, 'Fm6', 'half', 0.50);
  add(t, ['Ab4', 'C5', 'F5'], 1.9, 'RH', 0.74);
  t += 2;
  add(t, 'C3', 4.8, 'LH', 0.58);
  add(t + 0.15, 'G3', 4.6, 'LH', 0.50);
  add(t + 0.30, 'C4', 4.4, 'LH', 0.50);
  add(t + 0.45, ['E4', 'G4', 'B4', 'E5'], 4.2, 'RH', 0.76);
});

export default SONG_NANG_THO;
