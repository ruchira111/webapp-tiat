/**
 * Musical Instrument Sandbox - Mouse Input
 * 
 * Handles mouse and touch input.
 * 
 * MODES:
 * - 'trigger': Click anywhere to play a note (position determines pitch)
 * - 'continuous': Move mouse to control pitch/volume (theremin style)
 * - 'xy-pad': XY pad for continuous control
 */

class MouseInput {
    constructor(manager, config = {}) {
        this.manager = manager;
        this.mode = config.mode || 'trigger';
        this.container = config.container || document.body;
        this.minNote = config.minNote || 48; // C3
        this.maxNote = config.maxNote || 84; // C6

        this.isPressed = false;
        this.listeners = [];

        this.setupListeners();
    }

    setupListeners() {
        if (this.mode === 'trigger') {
            this.setupTriggerMode();
        } else if (this.mode === 'continuous') {
            this.setupContinuousMode();
        } else if (this.mode === 'xy-pad') {
            this.setupXYPadMode();
        }
    }

    /**
     * Trigger mode: Click to play note
     */
    setupTriggerMode() {
        const handleClick = (e) => {
            const x = e.clientX || (e.touches && e.touches[0].clientX);
            const y = e.clientY || (e.touches && e.touches[0].clientY);

            const note = this.xyToNote(x, y);
            const velocity = this.yToVelocity(y);

            this.manager.emitMusicalEvent('note-on', {
                note: note,
                velocity: velocity,
                x: x,
                y: y
            });
        };

        this.container.addEventListener('click', handleClick);
        this.container.addEventListener('touchstart', handleClick);

        this.listeners.push(
            { element: this.container, event: 'click', handler: handleClick },
            { element: this.container, event: 'touchstart', handler: handleClick }
        );
    }

    /**
     * Continuous mode: Drag to control
     */
    setupContinuousMode() {
        const handleMove = (e) => {
            if (!this.isPressed) return;

            const x = e.clientX || (e.touches && e.touches[0].clientX);
            const y = e.clientY || (e.touches && e.touches[0].clientY);

            this.manager.emitMusicalEvent('continuous', {
                x: x / window.innerWidth,
                y: y / window.innerHeight,
                pressure: 0.7
            });
        };

        const handleDown = (e) => {
            this.isPressed = true;
            const x = e.clientX || (e.touches && e.touches[0].clientX);
            const y = e.clientY || (e.touches && e.touches[0].clientY);

            const note = this.xyToNote(x, y);
            this.manager.emitMusicalEvent('note-on', {
                note: note,
                velocity: 0.7,
                x: x,
                y: y
            });
        };

        const handleUp = () => {
            this.isPressed = false;
            this.manager.emitMusicalEvent('note-off', {});
        };

        this.container.addEventListener('mousedown', handleDown);
        this.container.addEventListener('mousemove', handleMove);
        this.container.addEventListener('mouseup', handleUp);
        this.container.addEventListener('touchstart', handleDown);
        this.container.addEventListener('touchmove', handleMove);
        this.container.addEventListener('touchend', handleUp);

        this.listeners.push(
            { element: this.container, event: 'mousedown', handler: handleDown },
            { element: this.container, event: 'mousemove', handler: handleMove },
            { element: this.container, event: 'mouseup', handler: handleUp },
            { element: this.container, event: 'touchstart', handler: handleDown },
            { element: this.container, event: 'touchmove', handler: handleMove },
            { element: this.container, event: 'touchend', handler: handleUp }
        );
    }

    /**
     * XY Pad mode: Similar to continuous but always active
     */
    setupXYPadMode() {
        const handleMove = (e) => {
            const x = e.clientX || (e.touches && e.touches[0].clientX);
            const y = e.clientY || (e.touches && e.touches[0].clientY);

            this.manager.emitMusicalEvent('continuous', {
                x: x / window.innerWidth,
                y: y / window.innerHeight,
                pressure: this.isPressed ? 1.0 : 0.5
            });
        };

        const handleDown = () => {
            this.isPressed = true;
        };

        const handleUp = () => {
            this.isPressed = false;
        };

        this.container.addEventListener('mousemove', handleMove);
        this.container.addEventListener('touchmove', handleMove);
        this.container.addEventListener('mousedown', handleDown);
        this.container.addEventListener('mouseup', handleUp);
        this.container.addEventListener('touchstart', handleDown);
        this.container.addEventListener('touchend', handleUp);

        this.listeners.push(
            { element: this.container, event: 'mousemove', handler: handleMove },
            { element: this.container, event: 'touchmove', handler: handleMove },
            { element: this.container, event: 'mousedown', handler: handleDown },
            { element: this.container, event: 'mouseup', handler: handleUp },
            { element: this.container, event: 'touchstart', handler: handleDown },
            { element: this.container, event: 'touchend', handler: handleUp }
        );
    }

    /**
     * Convert X/Y position to MIDI note
     */
    xyToNote(x, y) {
        const normalizedX = x / window.innerWidth;
        const note = Math.floor(map(normalizedX, 0, 1, this.minNote, this.maxNote));
        return clamp(note, this.minNote, this.maxNote);
    }

    /**
     * Convert Y position to velocity
     */
    yToVelocity(y) {
        const normalizedY = 1 - (y / window.innerHeight);
        return clamp(normalizedY, 0.2, 1.0);
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
window.MouseInput = MouseInput;

