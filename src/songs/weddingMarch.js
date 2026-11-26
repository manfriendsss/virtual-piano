import { buildSong } from './buildSong.js';
import { makeMelody } from './helpers.js';

/**
 * 3) Wedding March — Felix Mendelssohn (C Major, 120 BPM) — FULL VERSION
 * Fanfare, main theme, contrasting minor episode, theme, lyrical trio (twice),
 * fanfare recall, theme and grand coda (~1:55).
 */
const SONG_WEDDING_MARCH = buildSong('wedding-march', 'Wedding March', 120, ({ add, seq }) => {
  const mel = makeMelody(add);
  const T = 1 / 3; // Eighth-note triplet duration in beats

  const triplet = (startBeat, note, vel = 0.78) => {
    add(startBeat,         note, T * 0.9, 'RH', vel);
    add(startBeat + T,     note, T * 0.9, 'RH', vel);
    add(startBeat + 2 * T, note, T * 0.9, 'RH', vel + 0.04);
  };

  const march = (s, b1, chord, b2, v = 0.6) => {
    add(s, b1, 0.9, 'LH', v + 0.06);
    add(s + 1, chord, 0.9, 'LH', v - 0.02);
    add(s + 2, b2, 0.9, 'LH', v + 0.03);
    add(s + 3, chord, 0.9, 'LH', v - 0.04);
  };

  // ---- Fanfare intro (16 beats) ----
  const fanfare = (s) => {
    triplet(s, 'C4', 0.74);
    add(s + 1, 'C4', 2.6, 'RH', 0.82);
    triplet(s + 4, 'C4', 0.78);
    add(s + 5, 'C4', 0.9, 'RH', 0.84);
    triplet(s + 6, 'C4', 0.80);
    add(s + 7, 'C4', 0.9, 'RH', 0.86);
    triplet(s + 8, 'C4', 0.82);
    add(s + 9, 'G4', 1.9, 'RH', 0.88);
    add(s + 9, ['C3', 'G3'], 1.9, 'LH', 0.62);
    seq(s + 11, [['F4', 0.5, 0.84], ['E4', 0.5, 0.82], ['D4', 0.5, 0.80], ['C4', 2.0, 0.86]], 'RH');
    add(s + 11, ['G3', 'B3'], 1.0, 'LH', 0.58);
    add(s + 12, ['C3', 'G3'], 2.2, 'LH', 0.64);
    triplet(s + 15, 'C4', 0.84);
  };

  // ---- Main theme, lower statement (16 beats) ----
  const themeLow = (s) => {
    add(s, ['E4', 'G4'], 1.4, 'RH', 0.90);
    add(s, ['C3', 'G3', 'C4'], 1.5, 'LH', 0.68);
    add(s + 1.5, 'G4', 0.45, 'RH', 0.84);
    triplet(s + 2, 'G4', 0.84);
    add(s + 2, ['C3', 'G3', 'C4'], 1.0, 'LH', 0.64);
    add(s + 3, ['F4', 'A4'], 0.95, 'RH', 0.90);
    add(s + 3, ['F3', 'A3', 'C4'], 0.95, 'LH', 0.68);

    add(s + 4, ['E4', 'G4'], 1.4, 'RH', 0.88);
    add(s + 4, ['C3', 'G3', 'C4'], 1.5, 'LH', 0.66);
    add(s + 5.5, 'F4', 0.45, 'RH', 0.82);
    add(s + 6, 'E4', 0.95, 'RH', 0.84);
    add(s + 6, ['G3', 'B3'], 0.95, 'LH', 0.62);
    add(s + 7, 'D4', 0.95, 'RH', 0.82);
    add(s + 7, ['G2', 'G3', 'B3'], 0.95, 'LH', 0.64);

    seq(s + 8, [
      ['E4', 0.5, 0.84], ['F4', 0.5, 0.84], [['E4', 'G4'], 1.0, 0.88],
      [['F4', 'A4'], 0.5, 0.88], ['G4', 0.5, 0.86], ['F4', 0.5, 0.84], ['E4', 0.5, 0.82],
    ], 'RH');
    add(s + 8, ['C3', 'G3'], 1.0, 'LH', 0.64);
    add(s + 9, ['E3', 'B3'], 1.0, 'LH', 0.64);
    add(s + 10, ['F3', 'C4'], 1.0, 'LH', 0.66);
    add(s + 11, ['C3', 'G3'], 1.0, 'LH', 0.64);

    seq(s + 12, [['D4', 0.75, 0.84], ['G4', 0.75, 0.88], ['E4', 0.5, 0.84], ['C4', 1.0, 0.88]], 'RH');
    add(s + 12, ['G2', 'G3', 'B3'], 1.5, 'LH', 0.66);
    add(s + 13.5, ['G2', 'F3', 'B3'], 0.5, 'LH', 0.64);
    add(s + 14, ['C3', 'E3', 'G3'], 1.5, 'LH', 0.70);
    triplet(s + 15, 'C5', 0.86);
  };

  // ---- Main theme, upper statement with climax (16 beats) ----
  const themeHigh = (s) => {
    add(s, ['E5', 'G5'], 1.4, 'RH', 0.92);
    add(s, ['C3', 'G3', 'C4'], 1.5, 'LH', 0.70);
    add(s + 1.5, 'G5', 0.45, 'RH', 0.86);
    triplet(s + 2, 'G5', 0.86);
    add(s + 2, ['C3', 'G3', 'C4'], 1.0, 'LH', 0.66);
    add(s + 3, ['F5', 'A5'], 0.95, 'RH', 0.92);
    add(s + 3, ['F3', 'A3', 'C4'], 0.95, 'LH', 0.70);

    add(s + 4, ['E5', 'G5'], 1.4, 'RH', 0.90);
    add(s + 4, ['C3', 'G3', 'C4'], 1.5, 'LH', 0.68);
    add(s + 5.5, 'F5', 0.45, 'RH', 0.84);
    add(s + 6, 'E5', 0.95, 'RH', 0.86);
    add(s + 6, ['G3', 'B3'], 0.95, 'LH', 0.64);
    add(s + 7, 'D5', 0.95, 'RH', 0.84);
    add(s + 7, ['G3', 'B3', 'D4'], 0.95, 'LH', 0.66);

    seq(s + 8, [
      ['E5', 0.5, 0.86], ['F5', 0.5, 0.88], [['E5', 'G5'], 1.0, 0.90],
      [['F5', 'A5'], 1.0, 0.92], [['G5', 'B5'], 1.0, 0.94],
    ], 'RH');
    add(s + 8, ['C3', 'G3'], 1.0, 'LH', 0.66);
    add(s + 9, ['E3', 'B3'], 1.0, 'LH', 0.66);
    add(s + 10, ['F3', 'C4'], 1.0, 'LH', 0.68);
    add(s + 11, ['G3', 'D4', 'F4'], 1.0, 'LH', 0.70);

    add(s + 12, ['E5', 'G5', 'C6'], 1.8, 'RH', 0.95);
    add(s + 12, ['C3', 'G3', 'C4'], 1.8, 'LH', 0.74);
    seq(s + 14, [['G5', 0.5, 0.86], ['E5', 0.5, 0.86], ['D5', 0.5, 0.84], ['G5', 0.5, 0.88]], 'RH');
    add(s + 14, ['C3', 'G3'], 1.0, 'LH', 0.66);
    add(s + 15, ['G3', 'B3', 'D4'], 1.0, 'LH', 0.68);
  };

  // ---- Contrasting episode in A minor (32 beats) ----
  const episode = (s) => {
    const bars = [
      [['A2', ['E3', 'A3', 'C4'], 'E3'], [9, 0, 4], [['E5', 1.5], ['D5', 0.5], ['C5', 1], ['B4', 1]]],
      [['F2', ['F3', 'A3', 'C4'], 'C3'], [5, 9, 0], [['A4', 1.5], ['B4', 0.5], ['C5', 1], ['D5', 1]]],
      [['G2', ['F3', 'G3', 'B3'], 'D3'], [7, 11, 2, 5], [['B4', 1.5], ['A4', 0.5], ['G4', 1], ['F4', 1]]],
      [['C3', ['E3', 'G3', 'C4'], 'G2'], [0, 4, 7], [['E4', 2], ['G4', 1], ['C5', 1]]],
      [['A2', ['E3', 'A3', 'C4'], 'E3'], [9, 0, 4], [['E5', 1.5], ['D5', 0.5], ['C5', 1], ['A5', 1]]],
      [['D3', ['F#3', 'A3', 'C4'], 'A2'], [2, 6, 9, 0], [['F#5', 1.5], ['E5', 0.5], ['D5', 1], ['C5', 1]]],
      [['G2', ['F3', 'G3', 'B3'], 'D3'], [7, 11, 2, 5], [['B4', 1], ['D5', 1], ['G5', 1], ['F5', 1]]],
      [['G2', ['G3', 'B3', 'D4'], 'D3'], [7, 11, 2], [['D5', 2]]],
    ];
    bars.forEach(([lh, pcs, items], i) => {
      const st = s + i * 4;
      march(st, lh[0], lh[1], lh[2], 0.58);
      mel(st, items, { harm: 1, pcsAt: () => pcs, floor: 62, vel: 0.84 });
    });
    triplet(s + 31, 'G4', 0.82);
  };

  // ---- Lyrical trio in F major (32 beats) ----
  const trio = (s, o) => {
    const bars = [
      [['F2', 'C3', 'F3', 'A3'], [5, 9, 0], [['C5', 2], ['A4', 1], ['C5', 1]]],
      [['Bb2', 'F3', 'Bb3', 'D4'], [10, 2, 5], [['F5', 2], ['D5', 1], ['Bb4', 1]]],
      [['C3', 'F3', 'A3', 'C4'], [5, 9, 0], [['A4', 1.5], ['Bb4', 0.5], ['C5', 1], ['A4', 1]]],
      [['C3', 'G3', 'Bb3', 'E4'], [0, 4, 7, 10], [['G4', 2], ['E4', 1], ['G4', 1]]],
      [['F2', 'C3', 'F3', 'A3'], [5, 9, 0], [['C5', 2], ['A4', 1], ['C5', 1]]],
      [['Bb2', 'F3', 'Bb3', 'D4'], [10, 2, 5], [['F5', 2], ['D5', 1], ['F5', 1]]],
      [['C3', 'G3', 'Bb3', 'E4'], [0, 4, 7, 10], [['E5', 1], ['D5', 1], ['C5', 1], ['Bb4', 1]]],
      [['F2', 'C3', 'F3', 'A3'], [5, 9, 0], [['A4', 1], ['G4', 1], ['F4', 2]]],
    ];
    bars.forEach(([arp, pcs, items], i) => {
      const st = s + i * 4;
      for (let k = 0; k < 8; k++) {
        add(st + k * 0.5, arp[k % 4], 0.45, 'LH', o.lhVel + (k % 4 === 0 ? 0.06 : 0));
      }
      mel(st, items, { oct: o.oct, harm: o.harm, pcsAt: () => pcs, floor: 62, vel: o.vel });
    });
  };

  // ---- Short fanfare recall (8 beats) ----
  const recall = (s) => {
    triplet(s, 'C5', 0.80);
    add(s + 1, 'C5', 0.9, 'RH', 0.86);
    triplet(s + 2, 'C5', 0.82);
    add(s + 3, 'C5', 0.9, 'RH', 0.88);
    triplet(s + 4, 'C5', 0.84);
    add(s + 5, ['C5', 'G5'], 1.9, 'RH', 0.90);
    add(s + 5, ['C3', 'G3', 'C4'], 1.9, 'LH', 0.66);
    triplet(s + 7, 'C4', 0.86);
  };

  // ---- Grand coda (~12 beats) ----
  const coda = (s) => {
    add(s, ['C5', 'E5', 'G5', 'C6'], 1.8, 'RH', 0.94);
    add(s, ['C3', 'G3', 'C4'], 1.8, 'LH', 0.74);
    add(s + 2, ['F4', 'A4', 'C5', 'F5'], 0.9, 'RH', 0.88);
    add(s + 2, ['F3', 'A3', 'C4'], 0.9, 'LH', 0.66);
    add(s + 3, ['G4', 'B4', 'D5', 'G5'], 0.9, 'RH', 0.90);
    add(s + 3, ['G2', 'D3', 'B3'], 0.9, 'LH', 0.68);
    add(s + 4, ['E5', 'G5', 'C6'], 1.4, 'RH', 0.94);
    add(s + 4, ['C3', 'G3', 'C4'], 1.4, 'LH', 0.72);
    triplet(s + 6, 'G4', 0.86);
    add(s + 7, ['G4', 'B4', 'D5', 'F5'], 0.9, 'RH', 0.90);
    add(s + 7, ['G2', 'G3', 'B3'], 0.9, 'LH', 0.70);
    add(s + 8, ['C5', 'E5', 'G5', 'C6'], 3.5, 'RH', 0.96);
    add(s + 8, ['C3', 'G3', 'C4'], 3.5, 'LH', 0.78);
  };

  fanfare(0);
  themeLow(16);
  themeHigh(32);
  episode(48);
  themeLow(80);
  themeHigh(96);
  trio(112, { oct: 0, harm: 0, vel: 0.76, lhVel: 0.50 });
  trio(144, { oct: 12, harm: 1, vel: 0.82, lhVel: 0.55 });
  recall(176);
  themeLow(184);
  themeHigh(200);
  coda(216);
});

export default SONG_WEDDING_MARCH;
