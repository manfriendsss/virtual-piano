# Music Studio

Ứng dụng âm nhạc nhiều nhạc cụ (React + Vite + Tailwind v4 + Tone.js), chuyển từ `index.original.html`.

- **Độc tấu**: một nhạc cụ chơi bài. Nhạc cụ hợp âm (piano, guitar, harp…) chơi trọn bài; nhạc cụ đơn âm (violin, sáo, kèn…) chơi giai điệu; nhạc cụ trầm chơi bass; trống chơi nhịp.
- **Hoà tấu**: mixer theo bè (giai điệu, bè phụ, đệm, bass, nền hoà âm, trống). Mỗi bè có nhạc cụ, âm lượng, M (tắt tiếng), S (chỉ nghe bè này). Có preset Gợi ý cho bài, Giao hưởng, Tứ tấu dây, Ban nhạc pop, Acoustic, Kèn đồng, Bộ gỗ, Bộ gõ.
- Bàn phím có thể chơi bằng bất kỳ nhạc cụ nào, kể cả bộ trống.

Sample: Salamander Grand Piano và [tonejs-instruments](https://github.com/nbrosowsky/tonejs-instruments) (CC-BY 3.0), tải từ CDN khi dùng lần đầu. Marimba, glockenspiel, timpani và bộ trống được tổng hợp bằng Tone.js.

## Chạy

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # xuất ra dist/
```

## Cấu trúc

```
src/
  lib/music.js              hằng số & tiện ích nốt nhạc (MIDI, phím tắt, hợp âm)
  songs/                    mỗi bài một file + buildSong.js, helpers.js, index.js (metadata)
  engine/instruments.js     danh mục nhạc cụ (sample, tầm âm, vai trò)
  engine/voices.js          voice sampler / synth / bộ trống tổng hợp
  engine/audio.js           AudioEngine: tải nhạc cụ khi cần, reverb, limiter, master volume
  engine/arrange.js         tách bài thành bè, sinh nền hoà âm và trống, preset hoà tấu
  engine/PianoController.js toàn bộ logic: nốt tay, sustain, hợp âm, lịch phát bài
  hooks/                    PianoProvider, usePiano (useSyncExternalStore), phím máy tính
  components/
    layout/   Card, Header, StatusPill
    songs/    SongLibrary, SongCard
    player/   PlayerCard, TransportButtons, SpeedSelector, ProgressBar, HandLegend
    controls/ ControlBar, OctaveControl, VolumeControl, ToggleButton
    chords/   ChordHelper
    ensemble/ EnsembleCard, MixerTrack
    instruments/ InstrumentGrid, InstrumentSelect
    keyboard/ KeyboardCard, Keyboard, PianoKey
```

Thêm bài mới: tạo file trong `src/songs/` theo mẫu `buildSong(...)`, rồi khai báo trong `src/songs/index.js`.

## Deploy (Cloudflare Workers)

`wrangler.jsonc` phục vụ thư mục `dist/`. Chạy `npm run build` trước `npx wrangler deploy`; nếu dùng Workers Builds nối với GitHub, đặt build command là `npm run build`.
