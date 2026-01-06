/**
 * Musical Instrument Sandbox - Keyboard Input
 * 
 * Handles computer keyboard input with multiple layout options.
 * 
 * LAYOUTS:
 * - 'piano': Piano-style keyboard mapping (C3-C5)
 * - 'drumpad': 4x4 drum pad (0-15)
 * - 'chromatic': Chromatic scale (lower keys)
 */

class KeyboardInput {
    constructor(manager, config = {}) {
        this.manager = manager;
        this.layout = config.layout || 'piano';
        this.keysPressed = new Set();
        this.baseOctave = config.baseOctave || 4; // C4 by default

        // Define keyboard layouts
        this.layouts = {
            // Piano layout: two rows of piano keys
            piano: {
                // Lower row (white keys: C3-C4)
                'z': 48, 'x': 50, 'c': 52, 'v': 53, 'b': 55, 'n': 57, 'm': 59, ',': 60,
                // Lower row (black keys)
                's': 49, 'd': 51, 'g': 54, 'h': 56, 'j': 58,
                
                // Upper row (white keys: C4-C5)
                'q': 60, 'w': 62, 'e': 64, 'r': 65, 't': 67, 'y': 69, 'u': 71, 'i': 72,
                // Upper row (black keys)
                '2': 61, '3': 63, '5': 66, '6': 68, '7': 70
            },

            // Drum pad layout: 4x4 grid
            drumpad: {
                // Row 1
                'q': 0, 'w': 1, 'e': 2, 'r': 3,
                // Row 2
                'a': 4, 's': 5, 'd': 6, 'f': 7,
                // Row 3
                'z': 8, 'x': 9, 'c': 10, 'v': 11,
                // Row 4
                '1': 12, '2': 13, '3': 14, '4': 15
            },

            // Chromatic scale (simpler layout)
            chromatic: {
                'a': 0, 's': 1, 'd': 2, 'f': 3, 'g': 4, 'h': 5, 'j': 6,
                'k': 7, 'l': 8, ';': 9, '\'': 10, 'z': 11, 'x': 12
            }
        };

        this.setupListeners();
    }

    setupListeners() {
        // Keydown event
        const handleKeyDown = (e) => {
            // Ignore if typing in input field
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            // Ignore modifier keys
            if (e.ctrlKey || e.metaKey || e.altKey) {
                return;
            }

            const key = e.key.toLowerCase();
            
            // Prevent key repeat
            if (this.keysPressed.has(key)) {
                return;
            }

            const mapping = this.layouts[this.layout][key];
            
            if (mapping !== undefined) {
                e.preventDefault(); // Prevent scrolling, etc.
                this.keysPressed.add(key);

                let note = mapping;
                
                // For piano/chromatic, use absolute MIDI numbers
                // For drumpad, it's just an index
                if (this.layout === 'drumpad') {
                    this.manager.emitMusicalEvent('trigger', {
                        index: mapping,
                        velocity: 0.7,
                        key: key
                    });
                } else {
                    this.manager.emitMusicalEvent('note-on', {
                        note: note,
                        velocity: 0.7,
                        key: key
                    });
                }
            }
        };

        // Keyup event
        const handleKeyUp = (e) => {
            const key = e.key.toLowerCase();
            this.keysPressed.delete(key);

            const mapping = this.layouts[this.layout][key];
            
            if (mapping !== undefined) {
                let note = mapping;
                
                if (this.layout !== 'drumpad') {
                    this.manager.emitMusicalEvent('note-off', {
                        note: note,
                        key: key
                    });
                }
            }
        };

        // Handle window blur (release all keys)
        const handleBlur = () => {
            // Release all pressed keys when window loses focus
            this.keysPressed.forEach(key => {
                const mapping = this.layouts[this.layout][key];
                if (mapping !== undefined && this.layout !== 'drumpad') {
                    const note = mapping;
                    this.manager.emitMusicalEvent('note-off', {
                        note: note,
                        key: key
                    });
                }
            });
            this.keysPressed.clear();
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        window.addEventListener('blur', handleBlur);

        // Store for cleanup
        this.listeners = [
            { element: document, event: 'keydown', handler: handleKeyDown },
            { element: document, event: 'keyup', handler: handleKeyUp },
            { element: window, event: 'blur', handler: handleBlur }
        ];
    }

    /**
     * Get the current layout's key mapping
     */
    getKeyMapping() {
        return this.layouts[this.layout];
    }

    /**
     * Get a visual representation of the current layout
     */
    getLayoutHelp() {
        const mapping = this.layouts[this.layout];
        const keys = Object.keys(mapping);
        
        if (this.layout === 'piano') {
            return `
                Piano Layout:
                Upper row: Q W E R T Y U I (white keys)
                           2 3   5 6 7   (black keys)
                Lower row: Z X C V B N M , (white keys)
                           S D   G H J   (black keys)
            `;
        } else if (this.layout === 'drumpad') {
            return `
                Drum Pad Layout:
                Q W E R
                A S D F
                Z X C V
                1 2 3 4
            `;
        } else if (this.layout === 'chromatic') {
            return `
                Chromatic Layout:
                A S D F G H J K L ; '
            `;
        }
    }

    /**
     * Cleanup listeners
     */
    cleanup() {
        this.listeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        this.listeners = [];
    }
}

// Make available globally
window.KeyboardInput = KeyboardInput;

