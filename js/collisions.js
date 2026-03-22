import * as THREE from 'three';

// Export the array so other files can add boxes to it
export const collisionBoxes = []; 

// Export the function so main.js can use it in the animate loop
// Notice we pass 'camera' in as a parameter now!
export function checkCollision(camera) {
    const playerBoundingBox = new THREE.Box3();
    const cameraWorldPosition = new THREE.Vector3();
    camera.getWorldPosition(cameraWorldPosition);
    
    playerBoundingBox.setFromCenterAndSize(
        cameraWorldPosition,
        new THREE.Vector3(1, 1, 1)
    );

    for (let i = 0; i < collisionBoxes.length; i++) {
        if (playerBoundingBox.intersectsBox(collisionBoxes[i])) {
            return true; 
        }
    }
    return false; 
}