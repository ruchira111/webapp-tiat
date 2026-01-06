/**
 * Musical Instrument Sandbox - WebAudioFont Engine
 * 
 * Uses WebAudioFont library for realistic instrument sounds.
 * Based on the soundfont pattern from the DNA Music project.
 */

class WebAudioFontEngine {
    constructor(audioContext) {
        this.audioContext = audioContext;
        this.player = new WebAudioFontPlayer();
        this.currentInstrument = null;
        this.currentPreset = null;
        
        // Available instruments (will be loaded from actual soundfont files)
        this.instruments = {
            organ: null,    // _tone_0161_SoundBlasterOld_sf2
            choir: null,    // _tone_0530_Aspirin_sf2_file
            vibes: null     // _tone_0110_Aspirin_sf2_file
        };
        
        this.envelopes = {};
    }

    /**
     * Load a specific instrument
     */
    async loadInstrument(name) {
        console.log(`🎹 Loading instrument: ${name}`);

        if (!this.instruments.hasOwnProperty(name)) {
            throw new Error(`Unknown instrument: ${name}. Available: organ, choir, flute`);
        }

        // Check if soundfont is loaded
        const presetVar = this.getPresetVariable(name);
        console.log(`   Looking for global variable: ${presetVar}`);
        
        if (typeof window[presetVar] === 'undefined') {
            console.error(`❌ Variable ${presetVar} not found in window object`);
            console.log('Available soundfont variables:', 
                Object.keys(window).filter(k => k.includes('_tone_')));
            throw new Error(`Soundfont not loaded for ${name}. Variable "${presetVar}" not found. Please include the soundfont script.`);
        }

        this.currentInstrument = name;
        this.currentPreset = window[presetVar];
        
        console.log(`   Preset has ${this.currentPreset.zones.length} zones`);
        
        // Adjust preset for WebAudioFont
        this.player.adjustPreset(this.audioContext, this.currentPreset);
        
        // Set envelope
        this.setEnvelope(name);

        console.log(`✅ Instrument loaded: ${name}`);
    }

    /**
     * Get the global variable name for a preset
     */
    getPresetVariable(name) {
        // These match the variable names in the soundfont files
        const presetMap = {
            organ: '_tone_0161_SoundBlasterOld_sf2',
            choir: '_tone_0530_Aspirin_sf2_file',
            vibes: '_tone_0110_Aspirin_sf2_file'
        };
        
        return presetMap[name];
    }

    /**
     * Set envelope for instrument
     */
    setEnvelope(name) {
        const envelopes = {
            organ: { duration: 0.7, volume: 0.8 },
            choir: { duration: 1.0, volume: 0.7 },
            vibes: { duration: 1.5, volume: 0.7 }
        };

        const envelope = envelopes[name] || { duration: 0.7, volume: 0.8 };

        // Apply envelope to all zones
        if (this.currentPreset && this.currentPreset.zones) {
            for (let i = 0; i < this.currentPreset.zones.length; i++) {
                this.currentPreset.zones[i].ahdsr = [{
                    duration: envelope.duration,
                    volume: envelope.volume
                }];
            }
        }
    }

    /**
     * Play a note
     */
    playNote(note, duration, velocity) {
        if (!this.currentPreset) {
            console.error('No instrument loaded!');
            return;
        }

        this.player.queueWaveTable(
            this.audioContext,
            this.audioContext.destination,
            this.currentPreset,
            this.audioContext.currentTime,
            note,
            duration,
            velocity
        );
    }

    /**
     * Trigger note (sustain)
     */
    triggerNote(note, velocity) {
        if (!this.currentPreset) {
            console.error('No instrument loaded!');
            return;
        }

        this.player.queueWaveTable(
            this.audioContext,
            this.audioContext.destination,
            this.currentPreset,
            this.audioContext.currentTime,
            note,
            9999, // Very long duration (effectively sustained)
            velocity
        );
    }

    /**
     * Release note
     */
    releaseNote(note) {
        // WebAudioFont doesn't have a built-in note-off
        // Notes will naturally decay based on their envelope
    }

    /**
     * Stop all sounds
     */
    stopAll() {
        // WebAudioFont doesn't provide a stopAll method
        // Notes will naturally decay
    }
}

// Make available globally
window.WebAudioFontEngine = WebAudioFontEngine;

