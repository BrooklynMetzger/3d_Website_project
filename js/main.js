import * as THREE from "three";
import { collisionBoxes, checkCollision } from './collisions.js';
import { buildWorld, theCube } from './world.js';
import { setupControls, move } from './controls.js';
import { setupScene } from './setupScene.js';
import { interactableObjects } from "./artworks.js";

// Set up the world 
const { scene, camera, renderer } = setupScene();
const controls = setupControls(camera);
buildWorld(scene, collisionBoxes);

// Movement speed
const speed = 0.09;
let bobTimer = 0;
const bobAmount = 0.1;   // Amplitude: How high/low the head bobs
const defaultCameraY = camera.position.y


// Get the UI elements from the HTML
const infoCard = document.getElementById('info-card');
const infoTitle = document.getElementById('info-title');
const infoDesc = document.getElementById('info-desc');

// Raycaster setup 
const raycaster = new THREE.Raycaster();
const centerScreen = new THREE.Vector2(0, 0);

// Start animation
function animate() {
    requestAnimationFrame(animate);

    if (controls.isLocked === true) {
        const oldPosition = camera.position.clone();

        const isMoving = move.forward || move.backward || move.left || move.right;

        // Movement logic     
        if (move.forward) controls.moveForward(speed);
        if (move.backward) controls.moveForward(-speed);
        if (move.right) controls.moveRight(speed);
        if (move.left) controls.moveRight(-speed);
        // Collision logic
        if (checkCollision(camera)) {
            camera.position.copy(oldPosition);
        }

        // Head bobbing logic
        if (isMoving) {
            bobTimer += 0.15;
            // Math.sin creates the up-and-down oscillation
            camera.position.y = defaultCameraY + Math.sin(bobTimer) * bobAmount;
        } else {
            // Smoothly return to default height when not moving
            bobTimer = 0;
            camera.position.y += (defaultCameraY - camera.position.y) * 0.1;
        }

        // Raycasting logic
        let lookingAtPainting = false;
        raycaster.setFromCamera(centerScreen, camera);
        const intersects = raycaster.intersectObjects(interactableObjects);
        // If painting is hit show UI data
        if (intersects.length > 0 && intersects[0].distance < 7) {
            const hitPainting = intersects[0].object;
            // Update the HTML 
            infoTitle.innerText = hitPainting.userData.title;
            infoDesc.innerText = hitPainting.userData.description;
            // Make the UI card visible
            infoCard.style.display = 'block';
            lookingAtPainting = true;
        }
        // ELse not hit hide UI card
        if (!lookingAtPainting) {
            infoCard.style.display = 'none';
        }
    } else {
        const panSpeed = 0.0003; // How fast the camera pans
        const panWidth = 1;    // How far 

        const targetRotationY = Math.sin(Date.now() * panSpeed) * panWidth;

        // transition the Y-axis to the pan
        camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, targetRotationY, 0.02);
        // level the head on the X and Z axes
        camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, 0, 0.02);
        camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, 0, 0.02);
        //Settle the camera height back to default
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, defaultCameraY, 0.05);
    }

    // Animate the cube
    if (theCube) {
        theCube.rotation.x += 0.01;
        theCube.rotation.y += 0.01;
    }

    renderer.render(scene, camera);
}

// start everything
animate();