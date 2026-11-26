import canon from './canon.js';
import bellaCiao from './bellaCiao.js';
import weddingMarch from './weddingMarch.js';
import odeToJoy from './odeToJoy.js';
import jingleBells from './jingleBells.js';
import noiNayCoAnh from './noiNayCoAnh.js';
import nangTho from './nangTho.js';
import aThousandMiles from './aThousandMiles.js';
import aThousandYears from './aThousandYears.js';
import beautifulInWhite from './beautifulInWhite.js';
import piratesOfTheCaribbean from './piratesOfTheCaribbean.js';
import concerningHobbits from './concerningHobbits.js';

// Display metadata for the song library
const META = {
  'noi-nay-co-anh': { composer: 'Sơn Tùng M-TP · arr. Jason Srey', key: 'C major', accent: '#E28C4D' },
  'nang-tho': { composer: 'Hoàng Dũng', key: 'C major', accent: '#9A6B9E' },
  'a-thousand-miles': { composer: 'Vanessa Carlton', key: 'B major', accent: '#4E94BE' },
  'a-thousand-years': { composer: 'Christina Perri · David Hodges', key: 'F major', accent: '#C2604A' },
  'beautiful-in-white': { composer: 'Westlife · Shane Filan', key: 'C → D → E major', accent: '#B48A3C' },
  'pirates-of-the-caribbean': { composer: 'Hans Zimmer · Klaus Badelt (arr. Jiri)', key: 'D minor', accent: '#3A7BA3' },
  'concerning-hobbits': { composer: 'Howard Shore', key: 'D major', accent: '#6A9E78' },
  canon: { composer: 'Johann Pachelbel', key: 'D major', accent: '#4E94BE' },
  'bella-ciao': { composer: 'Italian folk', key: 'A minor', accent: '#C2604A' },
  'wedding-march': { composer: 'Felix Mendelssohn', key: 'C major', accent: '#B48A3C' },
  'ode-to-joy': { composer: 'Ludwig van Beethoven', key: 'C major', accent: '#6A9E78' },
  'jingle-bells': { composer: 'James Lord Pierpont', key: 'C major', accent: '#E28C4D' },
};

export const SONGS = [
  noiNayCoAnh,
  nangTho,
  aThousandMiles,
  aThousandYears,
  beautifulInWhite,
  piratesOfTheCaribbean,
  concerningHobbits,
  canon,
  bellaCiao,
  weddingMarch,
  odeToJoy,
  jingleBells,
].map((song) => ({
  ...song,
  ...META[song.id],
  durationSec: (song.totalBeats * 60) / song.bpm,
}));

export const getSong = (id) => SONGS.find((s) => s.id === id) || null;
