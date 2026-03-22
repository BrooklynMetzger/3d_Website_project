import * as THREE from 'three';

export const interactablePaintings = [];

export function buildWorld(scene, collisionBoxes) {
    // ==========================================
    // 1. FLOOR
    // ==========================================
    const floorTexture = new THREE.TextureLoader().load("./Textures/laminate_floor_02_diff_4k.jpg");
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(10, 10);

    const planeGeometry = new THREE.PlaneGeometry(50, 50);
    const planeMaterial = new THREE.MeshBasicMaterial({
        map: floorTexture,
        side: THREE.DoubleSide
    });
    let planeFloor = new THREE.Mesh(planeGeometry, planeMaterial);
    planeFloor.rotation.x = Math.PI / 2;
    planeFloor.position.y = -Math.PI;  
    scene.add(planeFloor);

    // ==========================================
    // 2. WALLS & COLLISIONS
    // ==========================================
    const wallGroup = new THREE.Group(); 
    scene.add(wallGroup);

    const wallTexture = new THREE.TextureLoader().load("./Textures/brick_floor_003_rough_4k.jpg");
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(8, 8);

    const frontWall = new THREE.Mesh(new THREE.BoxGeometry(50, 20, 0.001), new THREE.MeshBasicMaterial({ map: wallTexture}));
    frontWall.position.z = -20;

    const backWall = new THREE.Mesh(new THREE.BoxGeometry(50, 20, 0.001), new THREE.MeshBasicMaterial({ map: wallTexture}));
    backWall.position.z = 23;

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(50, 20, 0.001), new THREE.MeshBasicMaterial({ map: wallTexture}));
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.x = -20;

    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(50, 20, 0.001), new THREE.MeshBasicMaterial({ map: wallTexture}));
    rightWall.rotation.y = Math.PI / 2;
    rightWall.position.x = 20;

    wallGroup.add(frontWall, backWall, leftWall, rightWall);

    // Create wall bounding boxes
    for (let i = 0; i < wallGroup.children.length; i++) {
        const wallBox = new THREE.Box3().setFromObject(wallGroup.children[i]);
        collisionBoxes.push(wallBox);
    }

    // ==========================================
    // 3. CEILING
    // ==========================================
    const ceilingGeometry = new THREE.PlaneGeometry(50,50);
    const ceilingMaterial = new THREE.MeshBasicMaterial({ map: floorTexture });
    const ceilingPlane = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceilingPlane.rotation.x = Math.PI / 2;
    ceilingPlane.position.y = 11;
    scene.add(ceilingPlane);

    // ==========================================
    // 4. PAINTINGS
    // ==========================================
    
    // NEW FUNCTION: Draws text onto a 3D rectangle
    function createPlacard(title, description) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const context = canvas.getContext('2d');

        // Draw a white background with a black border
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.lineWidth = 10;
        context.strokeStyle = 'black';
        context.strokeRect(0, 0, canvas.width, canvas.height);

        // Draw the Title
        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.font = 'bold 40px sans-serif';
        context.fillText(title, 256, 80);

        // Draw the Description
        context.font = '24px sans-serif';
        context.fillText(description, 256, 140);

        // Turn this drawing into a 3D material
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const placard = new THREE.Mesh(new THREE.PlaneGeometry(3, 1.5), material);
        
        return placard;
    }

    // UPDATED FUNCTION: Now attaches the 3D placard directly to the painting
    function createPainting(imageURL, width, height, position, title, description) {
        const textureLoader = new THREE.TextureLoader();
        const paintingTexture = textureLoader.load(imageURL);
        const paintingMaterial = new THREE.MeshBasicMaterial({ map: paintingTexture });
        const paintingGeometry = new THREE.PlaneGeometry(width, height);
        const painting = new THREE.Mesh(paintingGeometry, paintingMaterial);
        painting.position.set(position.x, position.y, position.z);
        
        // Create the 3D placard and position it directly below the painting
        const placard = createPlacard(title, description);
        placard.position.set(0, -(height / 2) - 1, 0.01); 
        placard.visible = false; // Hide it by default!
        
        // Add the placard as a "child" of the painting so they are grouped together
        painting.add(placard);
        
        // Save a reference to the placard so the Raycaster can find it later
        painting.userData = { placard: placard };
        
        return painting;
    }

    const painting1 = createPainting(
        './photo_meme/Untitled.jpg',
         5,
          5,
           new THREE.Vector3(10, 5, -19.99),
        "Meme 1",
         "This is the first piece in our collection.");
    const painting2 = createPainting('./photo_meme/cat_meme.png', 10, 10, new THREE.Vector3(-1, 4, -19.99), "Meme2", "Test2");
    const painting3 = createPainting('./photo_meme/so-me-he-art-so-me-he-art-20201126-142915.jpg', 8, 8, new THREE.Vector3(-12, 4, -19.99), "Mem3", "Test3");
    
    scene.add(painting1, painting2, painting3);
    interactablePaintings.push(painting1, painting2, painting3);
}