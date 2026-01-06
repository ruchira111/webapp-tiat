/**
 * Musical Instrument Sandbox - MediaPipe Hand Tracking Input
 * 
 * Uses MediaPipe Hands to track hand gestures and trigger musical events.
 * 
 * Default mode: Horizontal line crossing
 * - Move finger across a horizontal line to trigger notes
 * - X position determines pitch (like mouse input)
 * 
 * USAGE:
 *   await inputManager.enableInput('mediapipe', {
 *       lineY: 0.5,           // Line position (0-1)
 *       fingerTips: [8],      // Which fingers (8 = index)
 *       triggerMode: 'cross'  // 'cross' | 'continuous'
 *   });
 */

class MediaPipeInput {
    constructor(manager, config = {}) {
        this.manager = manager;
        
        // Configuration
        this.config = {
            lineY: config.lineY || 0.5,              // Horizontal line position (0-1)
            fingerTips: config.fingerTips || [8],    // Index finger by default
            triggerMode: config.triggerMode || 'cross',
            minNote: config.minNote || 48,
            maxNote: config.maxNote || 84,
            showLine: config.showLine !== false,
            showFingerDots: config.showFingerDots !== false,
            showVideo: config.showVideo !== false,
            mirror: config.mirror !== false,
            videoWidth: config.videoWidth || 640,
            videoHeight: config.videoHeight || 480
        };
        
        // State
        this.hands = null;
        this.camera = null;
        this.videoElement = null;
        this.canvasElement = null;
        this.canvasCtx = null;
        this.previousPositions = {};  // Track finger Y positions
        this.activeNotes = new Set(); // Track which notes are playing
        
        // Visual elements
        this.overlay = null;
    }

    /**
     * Static factory method to create and initialize
     */
    static async create(manager, config = {}) {
        const mediaPipeInput = new MediaPipeInput(manager, config);
        await mediaPipeInput.init();
        return mediaPipeInput;
    }

    /**
     * Initialize MediaPipe and camera
     */
    async init() {
        console.log('🤚 Initializing MediaPipe Hand Tracking...');

        try {
            // Check if MediaPipe is loaded
            if (typeof Hands === 'undefined') {
                throw new Error('MediaPipe Hands library not loaded. Please include the MediaPipe CDN scripts.');
            }

            // Create video element
            this.createVideoElement();
            
            // Create overlay canvas
            this.createOverlay();

            // Initialize MediaPipe Hands
            this.hands = new Hands({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
                }
            });

            this.hands.setOptions({
                maxNumHands: 1,              // Track one hand
                modelComplexity: 1,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            });

            this.hands.onResults((results) => this.onResults(results));

            // Initialize camera
            this.camera = new Camera(this.videoElement, {
                onFrame: async () => {
                    await this.hands.send({ image: this.videoElement });
                },
                width: this.config.videoWidth,
                height: this.config.videoHeight
            });

            await this.camera.start();

            console.log('✅ MediaPipe Hand Tracking initialized!');
            console.log('Configuration:', this.config);

        } catch (error) {
            console.error('❌ Failed to initialize MediaPipe:', error);
            this.cleanup();
            throw error;
        }
    }

    /**
     * Create video element for camera feed
     */
    createVideoElement() {
        this.videoElement = document.createElement('video');
        this.videoElement.style.display = 'none'; // Hidden - we'll draw to canvas
        document.body.appendChild(this.videoElement);
        
        // Create canvas for video + debug overlay
        this.videoCanvas = document.createElement('canvas');
        this.videoCanvas.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 240px;
            height: 180px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 5px;
            z-index: 998;
            display: ${this.config.showVideo ? 'block' : 'none'};
        `;
        this.videoCanvas.width = 640;
        this.videoCanvas.height = 480;
        this.videoCanvasCtx = this.videoCanvas.getContext('2d');
        document.body.appendChild(this.videoCanvas);
    }

    /**
     * Create overlay canvas for visualization
     */
    createOverlay() {
        this.canvasElement = document.createElement('canvas');
        this.canvasElement.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 997;
        `;
        this.canvasElement.width = window.innerWidth;
        this.canvasElement.height = window.innerHeight;
        this.canvasCtx = this.canvasElement.getContext('2d');
        document.body.appendChild(this.canvasElement);
    }

    /**
     * Handle MediaPipe results
     */
    onResults(results) {
        // Clear overlay canvas
        this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

        // Draw video feed with hand skeleton on video canvas
        if (this.config.showVideo && this.videoCanvasCtx) {
            this.drawVideoWithHands(results);
        }

        // Draw the trigger line on main canvas
        if (this.config.showLine) {
            this.drawTriggerLine();
        }

        // Process hand landmarks
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const hand = results.multiHandLandmarks[0];
            this.processHand(hand);
        }
    }

    /**
     * Draw video feed with hand skeleton overlay
     */
    drawVideoWithHands(results) {
        const ctx = this.videoCanvasCtx;
        const width = this.videoCanvas.width;
        const height = this.videoCanvas.height;

        // Save context state
        ctx.save();
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Flip horizontally for mirror effect
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
        
        // Draw video frame
        ctx.drawImage(results.image, 0, 0, width, height);
        
        // Draw hand skeleton if present
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            for (const landmarks of results.multiHandLandmarks) {
                // Draw connections (bones)
                this.drawConnectors(ctx, landmarks, width, height);
                
                // Draw landmarks (joints)
                this.drawLandmarks(ctx, landmarks, width, height);
            }
        }
        
        // Restore context
        ctx.restore();
    }

    /**
     * Draw hand connectors (bones)
     */
    drawConnectors(ctx, landmarks, width, height) {
        const connections = [
            [0, 1], [1, 2], [2, 3], [3, 4],           // Thumb
            [0, 5], [5, 6], [6, 7], [7, 8],           // Index
            [0, 9], [9, 10], [10, 11], [11, 12],      // Middle
            [0, 13], [13, 14], [14, 15], [15, 16],    // Ring
            [0, 17], [17, 18], [18, 19], [19, 20],    // Pinky
            [5, 9], [9, 13], [13, 17]                 // Palm
        ];

        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;

        connections.forEach(([start, end]) => {
            const startPoint = landmarks[start];
            const endPoint = landmarks[end];
            
            ctx.beginPath();
            ctx.moveTo(startPoint.x * width, startPoint.y * height);
            ctx.lineTo(endPoint.x * width, endPoint.y * height);
            ctx.stroke();
        });
    }

    /**
     * Draw hand landmarks (joints)
     */
    drawLandmarks(ctx, landmarks, width, height) {
        landmarks.forEach((landmark, index) => {
            const x = landmark.x * width;
            const y = landmark.y * height;
            
            // Fingertips are larger and different color
            const isFingertip = [4, 8, 12, 16, 20].includes(index);
            const radius = isFingertip ? 5 : 3;
            const color = isFingertip ? '#ff0000' : '#ffffff';
            
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 1;
            ctx.stroke();
        });
    }

    /**
     * Process hand landmarks and detect line crossings
     */
    processHand(hand) {
        this.config.fingerTips.forEach(tipIndex => {
            const tip = hand[tipIndex];
            
            if (!tip) return;

            // FLIP X axis - MediaPipe is mirrored, so flip it back
            const flippedX = 1 - tip.x;
            
            // Convert normalized coords (0-1) to screen coords
            const screenX = flippedX * window.innerWidth;
            const screenY = tip.y * window.innerHeight;
            const lineYPixels = this.config.lineY * window.innerHeight;

            // Check if finger crossed the line
            const crossed = this.checkLineCrossing(tipIndex, tip.y);

            // Draw finger dot
            if (this.config.showFingerDots) {
                this.drawFingerDot(screenX, screenY, crossed);
            }

            // Trigger note if crossed
            if (crossed) {
                this.triggerNote(flippedX, tip.y, tipIndex);
            }
        });
    }

    /**
     * Check if finger crossed the line
     */
    checkLineCrossing(fingerIndex, currentY) {
        const prevY = this.previousPositions[fingerIndex];
        
        // Store current position for next frame
        this.previousPositions[fingerIndex] = currentY;

        // First frame - no previous position
        if (prevY === undefined) {
            return false;
        }

        // Check for crossing based on mode
        if (this.config.triggerMode === 'cross') {
            // Trigger only when crossing from above to below
            return (prevY < this.config.lineY && currentY >= this.config.lineY);
        } else if (this.config.triggerMode === 'continuous') {
            // Trigger continuously while below line
            return currentY >= this.config.lineY;
        }

        return false;
    }

    /**
     * Trigger a note
     */
    triggerNote(normalizedX, normalizedY, fingerIndex) {
        // Map X position to note (like mouse input)
        const note = Math.floor(
            map(normalizedX, 0, 1, this.config.minNote, this.config.maxNote)
        );

        // Convert to screen coordinates for visual feedback
        const screenX = normalizedX * window.innerWidth;
        const screenY = normalizedY * window.innerHeight;

        // Emit note-on event
        this.manager.emitMusicalEvent('note-on', {
            note: note,
            velocity: 0.7,
            x: screenX,
            y: screenY,
            fingerIndex: fingerIndex
        });

        console.log(`🎵 MediaPipe note: ${note} (finger ${fingerIndex})`);
    }

    /**
     * Draw the horizontal trigger line
     */
    drawTriggerLine() {
        const y = this.config.lineY * window.innerHeight;
        const ctx = this.canvasCtx;

        ctx.beginPath();
        ctx.setLineDash([10, 10]); // Dashed line
        ctx.strokeStyle = '#4caf50';
        ctx.lineWidth = 3;
        ctx.moveTo(0, y);
        ctx.lineTo(window.innerWidth, y);
        ctx.stroke();
        ctx.setLineDash([]); // Reset
    }

    /**
     * Draw a dot where the finger is
     */
    drawFingerDot(x, y, crossed = false) {
        const ctx = this.canvasCtx;
        
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, 2 * Math.PI);
        ctx.fillStyle = crossed ? '#4caf50' : 'rgba(255, 255, 255, 0.5)';
        ctx.fill();
        
        // Outer ring
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, 2 * Math.PI);
        ctx.strokeStyle = crossed ? '#4caf50' : 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    /**
     * Cleanup resources
     */
    cleanup() {
        console.log('🧹 Cleaning up MediaPipe...');

        if (this.camera) {
            this.camera.stop();
            this.camera = null;
        }

        if (this.hands) {
            this.hands.close();
            this.hands = null;
        }

        if (this.videoElement && this.videoElement.parentNode) {
            this.videoElement.parentNode.removeChild(this.videoElement);
            this.videoElement = null;
        }

        if (this.videoCanvas && this.videoCanvas.parentNode) {
            this.videoCanvas.parentNode.removeChild(this.videoCanvas);
            this.videoCanvas = null;
        }

        if (this.canvasElement && this.canvasElement.parentNode) {
            this.canvasElement.parentNode.removeChild(this.canvasElement);
            this.canvasElement = null;
        }

        this.previousPositions = {};
        this.activeNotes.clear();
    }
}

// Make available globally
window.MediaPipeInput = MediaPipeInput;

