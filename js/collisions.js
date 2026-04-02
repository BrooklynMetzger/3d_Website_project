import * as THREE from 'three';

// Export the array so other files can add boxes to it
export const collisionBoxes = [];

// Export the function for main.js 
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