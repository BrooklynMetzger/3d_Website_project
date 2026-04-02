import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { addMetPainting, interactableObjects } from './artworks.js';

export let theCube;

export function buildWorld(scene, collisionBoxes) {
    // Floor
    const floorTexture = new THREE.TextureLoader().load("./Textures/laminate_floor_02_diff_4k.jpg");
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(10, 10);

    const planeGeometry = new THREE.PlaneGeometry(50, 50);
    const planeMaterial = new THREE.MeshStandardMaterial({
        map: floorTexture,
        side: THREE.DoubleSide
    });
    let planeFloor = new THREE.Mesh(planeGeometry, planeMaterial);
    planeFloor.rotation.x = Math.PI / 2;
    planeFloor.position.y = -Math.PI;
    scene.add(planeFloor);

    // Walls and Collision
    const wallGroup = new THREE.Group();
    scene.add(wallGroup);

    const wallTexture = new THREE.TextureLoader().load("./Textures/brick_floor_003_rough_4k.jpg");
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(8, 8);

    const frontWall = new THREE.Mesh(new THREE.BoxGeometry(50, 20, 0.001), new THREE.MeshStandardMaterial({ map: wallTexture }));
    frontWall.position.z = -20;

    const backWall = new THREE.Mesh(new THREE.BoxGeometry(50, 20, 0.001), new THREE.MeshStandardMaterial({ map: wallTexture }));
    backWall.position.z = 23;

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(50, 20, 0.001), new THREE.MeshStandardMaterial({ map: wallTexture }));
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.x = -20;

    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(50, 20, 0.001), new THREE.MeshStandardMaterial({ map: wallTexture }));
    rightWall.rotation.y = Math.PI / 2;
    rightWall.position.x = 20;

    wallGroup.add(frontWall, backWall, leftWall, rightWall);

    // Create wall bounding boxes
    for (let i = 0; i < wallGroup.children.length; i++) {
        const wallBox = new THREE.Box3().setFromObject(wallGroup.children[i]);
        collisionBoxes.push(wallBox);
    }

    // Ceiling
    const ceilingGeometry = new THREE.PlaneGeometry(50, 50);
    const ceilingMaterial = new THREE.MeshStandardMaterial({ map: floorTexture });
    const ceilingPlane = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceilingPlane.rotation.x = Math.PI / 2;
    ceilingPlane.position.y = 10;
    scene.add(ceilingPlane);

    /* Right Wall */
    // The Toilette of Venus
    // 436106, 436896, 437283, 437879, 435868
    addMetPainting(scene, 435739, new THREE.Vector3(19.9, 3, -12), 6, 6.5, false, true);
    addMetPainting(scene, 436106, new THREE.Vector3(19.9, 0.5, -4), 4, 4, false, true);
    addMetPainting(scene, 436896, new THREE.Vector3(19.9, 3, 3), 4, 6, false, true);
    addMetPainting(scene, 437283, new THREE.Vector3(19.9, 1.5, 10), 6, 4, false, true);
    addMetPainting(scene, 437879, new THREE.Vector3(19.9, 2.2, 18), 5, 5, false, true);
    addMetPainting(scene, 435868, new THREE.Vector3(19.9, 5, -4), 4, 4, false, true);

    /* Van gogh wall front from camera */
    addMetPainting(scene, 436532, new THREE.Vector3(0, 2, -19.99), 5, 5);
    addMetPainting(scene, 436535, new THREE.Vector3(-8, 2, -19.99), 5, 5);
    addMetPainting(scene, 336327, new THREE.Vector3(7, 2, -19.99), 5, 5);
    addMetPainting(scene, 436524, new THREE.Vector3(14, 1.7, -19.99), 5, 4);
    addMetPainting(scene, 437980, new THREE.Vector3(-15, 2, -19.99), 4, 5);

    /* Back wall */
    addMetPainting(scene, 400924, new THREE.Vector3(-5, 3, 22.99), 4, 5, false, false, true)
    addMetPainting(scene, 824771, new THREE.Vector3(5, 3, 22.99), 4, 5, false, false, true)
    addMetPainting(scene, 344210, new THREE.Vector3(12, 3, 22.99), 4, 5, false, false, true)
    addMetPainting(scene, 337262, new THREE.Vector3(-12, 2.45, 22.99), 3, 4, false, false, true)

    /* Left wall */
    addMetPainting(scene, 39799, new THREE.Vector3(-19.9, 4, -6), 7, 4, true, false);

    addMetPainting(scene, 45312, new THREE.Vector3(-19.9, 4, 17), 6, 5, true, false);

    addMetPainting(scene, 51136, new THREE.Vector3(-19.9, 4, 2), 6, 4, true, false);

    addMetPainting(scene, 55997, new THREE.Vector3(-19.9, 4, 9), 5, 4, true, false);

    addMetPainting(scene, 36591, new THREE.Vector3(-19.9, 2.5, -14), 4, 5, true, false);
    // Model Loading
    const loader = new GLTFLoader();
    /* Sofas */
    loadModel(loader, scene, collisionBoxes,
        './Assets/Models/Sofa_01_4k.gltf',
        -18.2, -3.2, -5, false, true, false, (Math.PI / 2), 5);
    loadModel(loader, scene, collisionBoxes,
        './Assets/Models/Sofa_01_4k.gltf',
        -18.2, -3.2, 10, false, true, false, (Math.PI / 2), 5);

    /* Plants */

    loadModel(loader, scene, collisionBoxes,
        './Assets/Models/potted_plant_01_4k.gltf',
        -18.2, -3.4, 3, false, false, false, 0, 5);
    loadModel(loader, scene, collisionBoxes,
        './Assets/Models/potted_plant_02_4k.gltf',
        10, -3.4, -9, false, false, false, 0, 6);
    loadModel(loader, scene, collisionBoxes,
        './Assets/Models/potted_plant_02_4k.gltf',
        10, -3.4, 12.5, false, false, false, 0, 6);
    loadModel(loader, scene, collisionBoxes,
        './Assets/Models/potted_plant_01_4k.gltf',
        -4.5, -3.4, -10, false, false, false, 0, 5);
    /* Table and Face */
    loadModel(loader, scene, collisionBoxes,
        './Assets/Models/marble_bust_01_4k.gltf',
        0, -1.5, 21.5, false, true, false, (Math.PI / 1), 10);
    loadModel(loader, scene, collisionBoxes,
        './Assets/Models/modern_coffee_table_01_4k.gltf',
        0, -3.2, 21.5, false, true, false, (Math.PI / 2), 5, false);

    /* Seating */
    loadModel(loader, scene, collisionBoxes,
        './Assets/Models/painted_wooden_sofa_4k.gltf',
        10, -3, -4, false, true, false, (Math.PI / 2), 2.5);
    loadModel(loader, scene, collisionBoxes,
        './Assets/Models/painted_wooden_sofa_4k.gltf',
        10, -3, 8, false, true, false, (Math.PI / 2), 2.5);
    loadModel(loader, scene, collisionBoxes,
        './Assets/Models/painted_wooden_sofa_4k.gltf',
        0, -3, -10, false, true, false, (Math.PI), 2.5);

    // THE CUBE
    theCube = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), new THREE.MeshBasicMaterial({ color: "blue" }));
    theCube.position.set(-18.5, 1.5, 21.5);
    scene.add(theCube);
    theCube.userData = {
        title: "theCube",
        description: "I reincarnated as a rendering cube in a computer science majors personal project"
    };
    interactableObjects.push(theCube);
    // The stool
    loadModel(loader, scene, collisionBoxes,
        './Assets/Models/painted_wooden_stool_4k.gltf',
        -18.5, -3.1, 21.5, false, true, false, 0, 5);
}
function loadModel(loader, scene, collisionBoxes, modelName, x, y, z,
    rotateFlagX = false, rotateFlagY = false, rotateFlagZ = false, rotation = 0, scale = 5, collisionOff = false) {
    loader.load(
        modelName,
        function (gltf) {
            const model = gltf.scene;
            scene.add(model);
            if (rotateFlagX)
                model.rotation.x = rotation;
            if (rotateFlagY)
                model.rotation.y = rotation;
            if (rotateFlagZ)
                model.rotation.z = rotation;
            gltf.scene.traverse((child) => {
                if (child.isMesh) { child.material.emissive = new THREE.Color(0x444444); }
            });
            gltf.scene.position.set(x, y, z);
            gltf.scene.scale.set(scale, scale, scale);
            gltf.scene.updateMatrixWorld(true);
            const modelBox = new THREE.Box3().setFromObject(model);
            if (collisionOff == false) // Testing loading model reasons
                collisionBoxes.push(modelBox);
        },
        function (xhr) { console.log((xhr.loaded / xhr.total * 100) + '% loaded'); },
        function (error) { console.error('An error happened loading the %s', modelName, error); }
    );
}