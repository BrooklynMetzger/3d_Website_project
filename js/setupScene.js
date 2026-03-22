import * as THREE from 'three';

export function setupScene() {
    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
        75, // field of view
        window.innerWidth / window.innerHeight, // Aspect Ratio
        0.1, // near
        1000 // far
    );
    camera.position.z = 5; // move camera back 5 units

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff, 1) // Background color (Fixed missing 'f' typo!)
    document.body.appendChild(renderer.domElement);

    // 4. Lights
    let ambientLight = new THREE.AmbientLight(0xffffff, 0.6); 
    ambientLight.position.copy(camera.position); 
    scene.add(ambientLight);

    let sunLight = new THREE.DirectionalLight(0xffffff, 1.5); 
    sunLight.position.set(5, 15, 5);
    scene.add(sunLight);

    // Return them so main.js can use them!
    return { scene, camera, renderer };
}