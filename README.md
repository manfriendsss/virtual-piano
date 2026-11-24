# Virtual Piano

A single-file, browser-based virtual piano with sampled grand-piano sound, auto-playing
song arrangements, and a chord helper. No build step, no dependencies to install —
everything lives in [`index.html`](index.html).

**Live demo:** https://manfriendsss.github.io/virtual-piano/

## Features

- **Sampled grand piano** — Tone.js `Sampler` loaded with Salamander Grand Piano samples,
  routed through a subtle reverb and a master volume stage. Falls back to a `PolySynth`
  if the samples cannot be fetched.
- **Playable three ways** — mouse/pointer, multi-touch (several keys at once), or the
  computer keyboard across two octaves:
  - lower octave: `Z S X D C V G B H N J M`
  - upper octave: `Q 2 W 3 E R 5 T 6 Y 7 U`
- **Octave shift** — move the two-octave window from C2–B3 up to C6–B7.
- **Sustain pedal** toggle, volume slider with mute, and an on/off note-name overlay.
- **Auto-play songs** — five two-hand arrangements (Canon in D, Bella Ciao, Wedding March,
  Ode to Joy, Jingle Bells) with play/pause, stop, 0.5×–1.25× speed, and a scrubbable
  progress bar. The keyboard auto-expands to the song's range; "Free Play" returns it to
  two octaves.
- **Chord helper** — C, Dm, Em, F, G, Am, Bdim and G7. Picking a chord tints the keys to
  play, and it can be struck as a block chord.
- **Colour-coded key feedback** — ocean blue for your own presses and the auto-play right
  hand, warm orange for the left hand and chord guides, with a warm, glare-free palette
  (no pure white or pure black anywhere).
- **Responsive** — the keyboard scrolls sideways on narrow screens, with a swipe hint.

## Running it

Just open `index.html` in a browser, or serve the folder:

```powershell
python -m http.server 8000
```

Then visit http://localhost:8000. Browsers require a user gesture before audio can start,
so the first click or key press unlocks the audio engine.

An internet connection is needed on first load: Tailwind CSS, the Inter font, Tone.js, and
the piano samples all come from CDNs.

## Built with

- [Tone.js](https://tonejs.github.io/) 14.8.49 — Web Audio scheduling, sampler, reverb
- [Salamander Grand Piano](https://theremin.music.uiowa.edu/) samples, served via the Tone.js CDN
- [Tailwind CSS](https://tailwindcss.com/) (CDN build) and the Inter typeface
