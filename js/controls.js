import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

// 1. Export the movement state so main.js can read it
export const move = {
    forward: false,
    backward: false,
    left: false,
    right: false
};

// 2. Export a function to build and wire up the controls
export function setupControls(camera) {
    const controls = new PointerLockControls(camera, document.body);

    // --- Menu UI Logic ---
    const menu = document.getElementById("menu");
    const playButton = document.getElementById("play_button");

    playButton.addEventListener("click", () => {
        controls.lock();
        menu.style.display = 'none'; // Hide menu when playing
    });

    controls.addEventListener('unlock', () => {
        menu.style.display = 'block'; // Show menu when paused (ESC)
    });

    // --- Keyboard Logic ---
    document.addEventListener('keydown', (event) => {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                move.forward = true;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                move.left = true;
                break;
            case 'ArrowDown':
            case 'KeyS':
                move.backward = true;
                break;
            case 'ArrowRight':
            case 'KeyD':
                move.right = true;
                break;
        }
    });

    document.addEventListener('keyup', (event) => {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                move.forward = false;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                move.left = false;
                break;
            case 'ArrowDown':
            case 'KeyS':
                move.backward = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                move.right = false;
                break;
        }
    });

    // Return the configured controls object back to main.js
    return controls;
}