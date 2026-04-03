import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

// Export the movement state for main.js 
export const move = {
    forward: false,
    backward: false,
    left: false,
    right: false
};

export function setupControls(camera) {
    const controls = new PointerLockControls(camera, document.body);

    // Menu UI logic 
    const menu = document.getElementById("menu");
    const playButton = document.getElementById("play_button");
    const overlay = document.getElementById("fade-overlay");

    // Hide social buttons with menu WIP
    const socialbuttons = document.getElementById('social')
    
    // Controls UI elements
    const infoToggle = document.getElementById("info_toggle");
    const controlsModal = document.getElementById("controls-modal");
    const closeControls = document.getElementById("close_controls");

    // Show the modal when clicking the info button
    infoToggle.addEventListener("click", () => {
        controlsModal.style.display = 'block';
    });

    // Hide the modal when clicking 'Got it!'
    closeControls.addEventListener("click", () => {
        controlsModal.style.display = 'none';
    });


    // Audio UI elements
    const musicToggle = document.getElementById("music_toggle");
    const bgMusic = document.getElementById("bg-music");
    let isMusicPlaying = false; // Keep track of the state

    // Toggle Music Event
    musicToggle.addEventListener("click", () => {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicToggle.innerText = "🔇 Music: Off";
        } else {
            bgMusic.play();
            musicToggle.innerText = "🔊 Music: On";
            bgMusic.volume = 0.3;
        }
        isMusicPlaying = !isMusicPlaying; // Flip the state
    });

    playButton.addEventListener("click", () => {
        controls.lock();             // Lock the mouse
        menu.style.display = 'none'; // Hide the menu
    });

    controls.addEventListener('unlock', () => {
        overlay.style.opacity = '1';
        // Used a short fade in and out screen
        // to make transiton to panning camera less
        // jaring
        setTimeout(() => {
            menu.style.display = 'block';
            overlay.style.opacity = '0';
        }, 700);
    });

    // Keyboard logic 
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

    return controls;
}