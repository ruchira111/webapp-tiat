/**
 * Musical Instrument Sandbox - Audio Output Manager
 * 
 * Unified interface for multiple audio output types:
 * - Tone.js (synth)
 * - WebAudioFont (realistic instruments)
 * - Drums (sample playback)
 * - MIDI Output (external devices)
 */

class AudioOutputManager extends EventTarget {
    constructor() {
        super();
        this.outputs = {
            tonejs: null,
            webaudiofont: null,
            drums: null,
            midiout: null
        };
        this.currentOutput = 'tonejs';
        this.currentConfig = {};
        this.audioContext = null;
    }

    /**
     * Initialize the output manager
     */
    async init(audioContext) {
        this.audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
        
        // Initialize Tone.js by default (fast, no loading)
        await this.loadOutput('tonejs');
        
        console.log('🔊 Audio Output Manager initialized');
    }

    /**
     * Load a specific output type
     */
    async loadOutput(type, config = {}) {
        console.log(`🔊 Loading ${type} output...`, config);
        
        this.dispatchEvent(new CustomEvent('loading', { detail: { type, config } }));

        try {
            switch (type) {
                case 'tonejs':
                    if (!this.outputs.tonejs) {
                        this.outputs.tonejs = new ToneEngine();
                        await this.outputs.tonejs.init();
                    }
                    break;

                case 'webaudiofont':
                    if (!this.outputs.webaudiofont) {
                        this.outputs.webaudiofont = new WebAudioFontEngine(this.audioContext);
                    }
                    // Load specific instrument
                    if (config.instrument) {
                        await this.outputs.webaudiofont.loadInstrument(config.instrument);
                    }
                    break;

                case 'drums':
                    if (!this.outputs.drums) {
                        this.outputs.drums = new DrumSampler();
                        await this.outputs.drums.init();
                    }
                    break;

                case 'midiout':
                    if (!this.outputs.midiout) {
                        this.outputs.midiout = new MidiOutput();
                    }
                    // Select specific device
                    if (config.deviceId) {
                        await this.outputs.midiout.selectDevice(config.deviceId);
                    } else {
                        await this.outputs.midiout.init();
                    }
                    break;

                default:
                    throw new Error(`Unknown output type: ${type}`);
            }

            this.dispatchEvent(new CustomEvent('ready', { detail: { type, config } }));
            console.log(`✅ ${type} output ready`);
            return true;

        } catch (error) {
            console.error(`❌ Failed to load ${type}:`, error);
            this.dispatchEvent(new CustomEvent('error', { detail: { type, error } }));
            throw error;
        }
    }

    /**
     * Set the active output
     */
    async setOutput(type, config = {}) {
        // Load if not already loaded
        if (!this.outputs[type]) {
            await this.loadOutput(type, config);
        }

        // If WebAudioFont or MIDI, might need to reconfigure
        if (type === 'webaudiofont' && config.instrument) {
            await this.outputs.webaudiofont.loadInstrument(config.instrument);
        } else if (type === 'midiout' && config.deviceId) {
            await this.outputs.midiout.selectDevice(config.deviceId);
        }

        this.currentOutput = type;
        this.currentConfig = config;

        this.dispatchEvent(new CustomEvent('output-changed', { 
            detail: { type, config } 
        }));

        console.log(`🔊 Active output: ${type}`, config);
    }

    /**
     * Play a note (triggers and releases automatically)
     */
    playNote(note, duration, velocity) {
        const output = this.outputs[this.currentOutput];
        if (!output) {
            console.error('No active output!');
            return;
        }

        output.playNote(note, duration, velocity);
    }

    /**
     * Trigger a note (sustains until released)
     */
    triggerNote(note, velocity) {
        const output = this.outputs[this.currentOutput];
        if (!output) {
            console.error('No active output!');
            return;
        }

        if (output.triggerNote) {
            output.triggerNote(note, velocity);
        } else {
            // Fallback for outputs that don't support sustain
            output.playNote(note, 1.0, velocity);
        }
    }

    /**
     * Release a sustained note
     */
    releaseNote(note) {
        const output = this.outputs[this.currentOutput];
        if (!output) return;

        if (output.releaseNote) {
            output.releaseNote(note);
        }
    }

    /**
     * Get available MIDI output devices
     */
    async getMidiOutputDevices() {
        try {
            const midiAccess = await navigator.requestMIDIAccess();
            const devices = [];
            
            for (const output of midiAccess.outputs.values()) {
                devices.push({
                    id: output.id,
                    name: output.name,
                    manufacturer: output.manufacturer
                });
            }
            
            return devices;
        } catch (error) {
            console.error('Failed to get MIDI devices:', error);
            return [];
        }
    }

    /**
     * Stop all sounds
     */
    stopAll() {
        Object.values(this.outputs).forEach(output => {
            if (output && output.stopAll) {
                output.stopAll();
            }
        });
    }
}

// Make available globally
window.AudioOutputManager = AudioOutputManager;

