/**
 * Musical Instrument Sandbox - Math Utilities
 * 
 * Common mathematical functions used across all examples.
 * These are the same utilities from your reference projects!
 */

const MusicMath = {
    /**
     * Map a value from one range to another
     * Example: map(5, 0, 10, 0, 100) returns 50
     * 
     * @param {number} value - The value to map
     * @param {number} inMin - Input range minimum
     * @param {number} inMax - Input range maximum
     * @param {number} outMin - Output range minimum
     * @param {number} outMax - Output range maximum
     * @returns {number} Mapped value
     */
    map: (value, inMin, inMax, outMin, outMax) => {
        // Guard against NaN and invalid inputs
        if (isNaN(value) || isNaN(inMin) || isNaN(inMax) || isNaN(outMin) || isNaN(outMax)) {
            return outMin; // Return minimum output value as safe default
        }
        const result = ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
        // Guard against NaN result (e.g., from division by zero)
        return isNaN(result) ? outMin : result;
    },

    /**
     * Random integer between min (inclusive) and max (exclusive)
     * Example: randRange(0, 10) returns 0-9
     */
    randRange: (min, max) => {
        return Math.floor(Math.random() * (max - min)) + min;
    },

    /**
     * Random float between min and max
     */
    randFloat: (min, max) => {
        return Math.random() * (max - min) + min;
    },

    /**
     * Clamp a value between min and max
     */
    clamp: (value, min, max) => {
        return Math.min(Math.max(value, min), max);
    },

    /**
     * Convert MIDI note number to frequency in Hz
     * MIDI 69 (A4) = 440 Hz
     */
    midiToFreq: (midi) => {
        return 440 * Math.pow(2, (midi - 69) / 12);
    },

    /**
     * Convert frequency to MIDI note number
     */
    freqToMidi: (freq) => {
        return 69 + 12 * Math.log2(freq / 440);
    },

    /**
     * Linear interpolation between two values
     */
    lerp: (start, end, amount) => {
        return start + (end - start) * amount;
    }
};

// Make available globally for easy use
window.MusicMath = MusicMath;

// Also export individual functions for convenience
const { map, randRange, randFloat, clamp, midiToFreq, freqToMidi, lerp } = MusicMath;

