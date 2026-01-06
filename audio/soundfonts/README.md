# WebAudioFont Soundfonts

These soundfont files were copied from the `references/midi2/` project.

## Files

| File | Size | Instrument | Variable Name |
|------|------|------------|---------------|
| `WebAudioFont.js` | 122KB | Core Player | `WebAudioFontPlayer` |
| `0161_SoundBlasterOld_sf2.js` | 15KB | Organ | `_tone_0161_SoundBlasterOld_sf2` |
| `0530_Aspirin_sf2_file.js` | 20KB | Choir (Vocals) | `_tone_0530_Aspirin_sf2_file` |
| `0110_Aspirin_sf2_file.js` | 2.8KB | Vibraphone | `_tone_0110_Aspirin_sf2_file` |

## Usage

### In HTML:
```html
<script src="audio/soundfonts/WebAudioFont.js"></script>
<script src="audio/soundfonts/0161_SoundBlasterOld_sf2.js"></script>
<script src="audio/soundfonts/0530_Aspirin_sf2_file.js"></script>
<script src="audio/soundfonts/0110_Aspirin_sf2_file.js"></script>
```

### In JavaScript:
```javascript
const player = new WebAudioFontPlayer();
const audioContext = new AudioContext();

// Organ
player.adjustPreset(audioContext, _tone_0161_SoundBlasterOld_sf2);
player.queueWaveTable(audioContext, audioContext.destination, 
    _tone_0161_SoundBlasterOld_sf2, 0, 60, 1.0, 0.7);

// Choir
player.adjustPreset(audioContext, _tone_0530_Aspirin_sf2_file);

// Vibes
player.adjustPreset(audioContext, _tone_0110_Aspirin_sf2_file);
```

## Adding More Instruments

To add more soundfonts from the references:

1. Check `references/midi2/` or `references/DNAMusic/src/soundfonts/`
2. Copy the `.js` file here
3. Add to `webaudiofont-engine.js`
4. Add to dropdown in `dropdowns.js`

## Notes

- These are **standalone** files (use `var`, not `export`)
- Work directly in browser without build tools
- Sourced from https://surikov.github.io/webaudiofont/

