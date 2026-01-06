# Musical Instruments on the Web

[ README written by AI ]

A workshop-ready sandbox for creating web-based musical instruments using the Web Audio API. This project provides examples, templates, and a modular architecture for building interactive audio experiences in the browser.

## 🚀 Quick Start

### Running the Project

The easiest way to run this project is using Python's built-in HTTP server:

**Python 3.x (recommended):**
```bash
python3 -m http.server 8000
```

**Python 2.x:**
```bash
python -m SimpleHTTPServer 8000
```

Then open your browser and navigate to:
```
http://localhost:8000
```

### Sharing Your Work (Workshop Mode)

When running on a local WiFi network, the index page automatically detects and displays your local IP address at the bottom. Students can:

1. Start the server on their machine
2. Copy the displayed URL (e.g., `http://192.168.1.123:8000/index.html`)
3. Share it with instructors or other participants on the same network

Everyone on the same WiFi can then view and interact with the student's work in real-time!

## 📁 Project Structure

```
musical_instrument/
├── index.html                  # Main landing page with all examples and projects
│
├── examples/                   # Progressive tutorial examples
│   ├── 01-play-a-beep/        # Basic sound generation with multiple input methods
│   ├── 02-theremin/           # Mouse/hand-controlled pitch and volume
│   ├── 03-polyphony/          # Multiple simultaneous notes with ADSR envelopes
│   ├── 04-step-sequencer/     # Grid-based pattern sequencer
│   └── 05-game-of-life-sequencer/  # Generative sequencer with cellular automata
│
├── projects/                   # Student workspace
│   ├── index.html             # Starter project (copy of example 1)
│   └── colors.html            # Additional project template
│
├── templates/                  # Blank templates for new projects
│   └── blank-template.html    # Minimal starting point
│
├── js/                        # Modular JavaScript library
│   ├── audio/                 # Audio engine modules
│   │   ├── tone-engine.js             # Simple oscillator-based synth
│   │   ├── webaudiofont-engine.js     # SoundFont-based sampler
│   │   ├── audio-output-manager.js    # Unified audio interface
│   │   └── midi-output.js             # MIDI output support
│   │
│   ├── input/                 # Input handling modules
│   │   ├── input-manager.js   # Unified input interface
│   │   ├── keyboard.js        # Computer keyboard support
│   │   ├── mouse.js           # Mouse/touch input
│   │   ├── midi.js            # MIDI device support
│   │   └── mediapipe.js       # Hand tracking (MediaPipe)
│   │
│   ├── visuals/               # Visual feedback system
│   │   └── visual-manager.js  # Canvas-based visualizations
│   │
│   ├── ui/                    # UI components
│   │   └── dropdowns.js       # Dropdown menus for settings
│   │
│   ├── utils/                 # Utility functions
│   │   └── math.js            # Math helpers (MIDI, frequency conversion)
│   │
│   └── core/                  # Core framework
│       └── example-layout.js  # Standard layout and controls
│
├── css/                       # Stylesheets
│   ├── base.css              # Global styles and variables
│   ├── example-layout.css    # Standard example page layout
│   └── visual-feedback.css   # Canvas and visual styles
│
├── audio/                     # Audio assets
│   └── soundfonts/           # WebAudioFont sound files
│       ├── WebAudioFont.js   # Main library
│       └── *.js              # Individual instrument files
│
└── references/                # Reference implementations
    ├── midi2/                # Bezier curve musical visualizer
    └── binaural-tuner/       # Stereo audio experiment

```

## 🎹 Examples Overview

### 01 - Play a Beep
**Concepts:** Basic tone generation, multiple input methods (mouse, keyboard, MIDI)

Learn the fundamentals of triggering sounds in the browser. Click anywhere, press keys, or use a MIDI controller to make beeps. Includes visual feedback showing active notes.

### 02 - Theremin
**Concepts:** Continuous parameter control, mouse position mapping

Classic electronic instrument where horizontal position controls pitch and vertical position controls volume. Supports both mouse and hand tracking via webcam.

### 03 - Polyphonic Synth
**Concepts:** Multiple simultaneous voices, ADSR envelopes

Play chords and melodies with a full keyboard-style instrument. Demonstrates how to manage multiple active notes with proper attack, decay, sustain, and release.

### 04 - Step Sequencer
**Concepts:** Rhythm programming, grid-based interface, timing/scheduling

Create repeating patterns by clicking cells in a 16-step grid. Each row represents a different pitch in the selected scale (major, minor, or chromatic).

### 05 - Game of Life Sequencer
**Concepts:** Generative music, cellular automata, Conway's Game of Life, 2-octave range

A step sequencer that evolves using Conway's Game of Life rules. Features a 16x16 grid (2 octaves) that automatically evolves when the playhead reaches the end. Includes re-seed button for generating random patterns.

## 🛠️ Architecture

### Modular Design

Each example is **self-contained** (single HTML file) for easy sharing with AI assistants like ChatGPT or Claude, but they all use the same modular JavaScript libraries located in the `/js` folder.

### Key Modules

**Audio Engines:**
- `ToneEngine` - Simple oscillator-based synthesis (sine, square, sawtooth, triangle)
- `WebAudioFontEngine` - Sample-based synthesis using SoundFont instruments

**Input Management:**
- `InputManager` - Unified interface for all input types
- Supports: keyboard, mouse, MIDI devices, MediaPipe hand tracking

**Visual Feedback:**
- `VisualManager` - Canvas-based visualization system
- Automatically highlights active notes and provides visual feedback

**Layout System:**
- `ExampleLayout` - Standard controls (volume, octave, waveform, etc.)
- Consistent UI across all examples

## 🎨 Creating Your Own Instrument

### Option 1: Start from a Template

Copy `templates/blank-template.html` or any example to `projects/` and start modifying.

### Option 2: Use AI Assistance

1. Open any example file
2. Copy the entire contents
3. Paste into ChatGPT, Claude, or your favorite AI assistant
4. Ask questions like:
   - "How do I add a delay effect?"
   - "Can you make it play arpeggios instead of chords?"
   - "Add a drum machine on the bottom row"

### Option 3: Mix and Match Modules

Import only what you need from the `/js` folder:

```html
<script src="../js/audio/tone-engine.js"></script>
<script src="../js/input/keyboard.js"></script>
<script src="../js/visuals/visual-manager.js"></script>
```

## 🎛️ Common Customizations

### Change the Sound
```javascript
// Switch waveform
toneEngine.setWaveform('sawtooth'); // sine, square, triangle, sawtooth

// Use different instruments (WebAudioFont)
audioEngine.setInstrument(0); // 0=piano, 24=guitar, 32=bass
```

### Modify the Scale
```javascript
// In step sequencer or keyboard mapping
const scale = [0, 2, 4, 5, 7, 9, 11]; // Major scale
const scale = [0, 2, 3, 5, 7, 8, 10]; // Minor scale
const scale = [0, 2, 4, 7, 9];        // Pentatonic
```

### Add Visual Effects
```javascript
visualManager.setBackgroundColor('#000033');
visualManager.setNoteColor('#00ff00');
```

## 📱 Browser Compatibility

- **Chrome/Edge** - Full support ✅
- **Firefox** - Full support ✅
- **Safari** - Full support (may require user gesture for audio) ✅
- **Mobile browsers** - Supported (touch events work) ✅

**Note:** MIDI support requires Chrome/Edge. MediaPipe hand tracking works best in Chrome.

## 🎓 Workshop Tips

### For Instructors

1. Have students start the local server before class
2. Everyone joins the same WiFi network
3. Students share their IP addresses from the index page
4. Visit student projects directly in your browser
5. No need for file transfers or deployment!

### For Students

- Use browser DevTools (F12) to see console messages and debug
- Each example includes helpful comments in the code
- Experiment! The worst that can happen is a sound you don't like
- Save your work frequently (Ctrl/Cmd + S)

## 🔊 Audio Troubleshooting

### No Sound?
1. Check volume slider in the UI
2. Make sure your system volume isn't muted
3. Try clicking or pressing a key (browser may require user interaction first)
4. Check browser console for errors (F12)

### Choppy/Glitchy Audio?
- Close other applications using audio
- Try reducing polyphony (number of simultaneous notes)
- Use a wired connection instead of WiFi if streaming

## 📚 Additional Resources

- [Web Audio API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [WebAudioFont](https://surikov.github.io/webaudiofont/)
- [MIDI.js](https://github.com/mudcube/MIDI.js/)
- [MediaPipe Hands](https://google.github.io/mediapipe/solutions/hands.html)

## 🤝 Contributing

This is a workshop project designed for learning and experimentation. Feel free to:

- Add new examples
- Create new instruments in the `/projects` folder
- Improve the documentation
- Share your creations!

## 📄 License

This project is licensed under the **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)** license.

**In simple terms:**
- ✅ Use for educational purposes
- ✅ Remix and adapt the code
- ✅ Share with others
- 🚫 **No commercial use**
- 📝 Give credit to the original author
- 🔄 Share adaptations under the same license

See the [LICENSE](LICENSE) file for full details.

Have fun making music! 🎵

---

**Happy music making! 🎹🎸🎺**
