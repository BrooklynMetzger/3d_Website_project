import * as THREE from "three";
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
//import { array } from "three/src/nodes/core/ArrayNode.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// 1. Import your custom collision logic!
import { collisionBoxes, checkCollision } from './collisions.js';
import { buildWorld, interactablePaintings } from './world.js';
import { setupControls, move } from './controls.js';
import { setupScene } from './setupScene.js';


// Set up the world base
const { scene, camera, renderer } = setupScene();

const controls = setupControls(camera);

buildWorld(scene, collisionBoxes);

const loader = new GLTFLoader();
loader.load(
    // resource URL
    './Assets/Models/painted_wooden_stool_4k.gltf',
    // called when the resource is loaded
    function ( gltf ) {
        scene.add( gltf.scene );
        // Loop through the stool and make it artificially brighter
        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                // Adds a soft white/grey glow from inside the model itself
                child.material.emissive = new THREE.Color(0x444444); 
            }
        });
       
        // Optional: Adjust position, scale, etc.
        gltf.scene.position.set(0, -3.1, 0);
        gltf.scene.scale.set(5.0, 5.0, 5.0);

        gltf.scene.updateMatrixWorld(true); 

        // 2. Draw a box around the entire 3D model
        const modelBox = new THREE.Box3().setFromObject(gltf.scene);

        // 3. Add the box to our universal collision list!
        collisionBoxes.push(modelBox);
    },
    // called while loading is progressing
    function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    // called when loading has errors
    function ( error ) {
        console.error( 'An error happened', error );
    }
);

let cube = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), new THREE.MeshBasicMaterial({ color: "blue" }));
cube.position.set(0, 1.5, 0);
scene.add(cube);

// 6. Run the Game Loop!
const speed = 0.09; 


// --- Raycaster Setup ---
const raycaster = new THREE.Raycaster();
const centerScreen = new THREE.Vector2(0, 0); // (0,0) is exactly the middle of the screen in Three.js coordinates

function animate() {
    requestAnimationFrame(animate);

    if (controls.isLocked === true) {
        const oldPosition = camera.position.clone();
        
        if (move.forward) controls.moveForward(speed);
        if (move.backward) controls.moveForward(-speed);
        if (move.right) controls.moveRight(speed);
        if (move.left) controls.moveRight(-speed);

        if (checkCollision(camera)) {
            camera.position.copy(oldPosition);
        }

        // --- RAYCASTING LOGIC ---
        
        // 1. Hide ALL placards to start the frame
        interactablePaintings.forEach(p => {
            if (p.userData.placard) p.userData.placard.visible = false;
        });

        // 2. Point the laser
        raycaster.setFromCamera(centerScreen, camera);
        const intersects = raycaster.intersectObjects(interactablePaintings);

        // 3. If we hit something and are close enough, make ONLY that 3D placard visible!
        if (intersects.length > 0 && intersects[0].distance < 40) {
            const hitPainting = intersects[0].object;
            if (hitPainting.userData.placard) {
                hitPainting.userData.placard.visible = true;
            }
        }
    }
    
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}

// start everything
animate();