import * as THREE from 'three';

export function setupScene() {
    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
        75, // field of view
        window.innerWidth / window.innerHeight, // Aspect Ratio
        0.1, // near
        1000 // far
    );
    camera.position.z = 5; // move camera back 5 units

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff, 1)
    document.body.appendChild(renderer.domElement);

    // AmbientLight
    let ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    ambientLight.position.copy(camera.position);
    scene.add(ambientLight);

    // Right wall lighting effects
    let light = createPointLight(17.5, 2, -7.5, 10, 50, 1.5);
    let light2 = createPointLight(17.5, 2, 0, 10, 50, 1.5);
    let light3 = createPointLight(17.5, 2, 5, 10, 50, 1.5);
    let light4 = createPointLight(17.5, 2, 14, 10, 50, 1.5)
    // Front wall lighting effects
    let light5 = createPointLight(-4, 2, -17, 10, 50, 1);
    let light6 = createPointLight(4, 2, -17, 10, 50, 1);
    // Left wall lighting effects
    let light7 = createPointLight(-18, 4, -2, 10, 50, 1.5);
    let light8 = createPointLight(-18, 4, 5.5, 10, 50, 1.5);
    let light9 = createPointLight(-18, 4, 13, 10, 50, 1.5);
    // The cube light
    let theCubeLight = createPointLight(-18.5, 1.5, 21.5, 10, 40);
    // Add all lights to scene
    scene.add(light, light2, light3, light4, light5, light6, light7, light8, light9, theCubeLight);

    // Return for main.js
    return { scene, camera, renderer };
}
// Helper function to create point lights
function createPointLight(x, y, z, tens = 1, dis = 0, decay = 1) {
    let light = new THREE.PointLight(0xffffff, tens, dis, decay)
    light.position.set(x, y, z);
    return light;
}