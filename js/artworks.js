import * as THREE from 'three';

// Export the array for main.js 
export const interactableObjects = [];

// Export the function for world.js 
export async function addMetPainting(scene, objectID, position, width, height, rotateLeft = false, rotateRight = false, rotateFlip = false) {
    // Url needed to call met api
    const url = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`;
    // attempt to call api
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Artwork not found");
        const data = await response.json();

        // Get text data
        const title = data.title || "Untitled";
        const description = `${data.artistDisplayName || "Unknown Artist"}\n${data.medium}`;
        // Check if painting is in the public domain        
        if (!data.isPublicDomain) {
            console.warn(`Skipped Object ${objectID}: Not in the public domain.`);
            return;
        }
        // Get painting image
        const imageURL = data.primaryImageSmall || data.primaryImage;
        if (!imageURL) {
            console.warn(`Object ${objectID} has no image url!`);
            return;
        }
        // Create the object
        const textureLoader = new THREE.TextureLoader();
        textureLoader.setCrossOrigin('anonymous');
        // Route through proxy to bypass CORS
        const proxiedImageUrl = `https://wsrv.nl/?url=${imageURL}`;
        textureLoader.load(proxiedImageUrl, (paintingTexture) => {
            const paintingMaterial = new THREE.MeshStandardMaterial({ map: paintingTexture });
            const paintingGeometry = new THREE.PlaneGeometry(width, height);
            const painting = new THREE.Mesh(paintingGeometry, paintingMaterial);

            painting.position.copy(position);

            // Attach UI data
            painting.userData = {
                title: title,
                description: description
            };

            scene.add(painting);

            if (rotateRight) {
                painting.rotation.y = -Math.PI / 2;
            }
            if (rotateLeft) {
                painting.rotation.y = Math.PI / 2;
            }
            if (rotateFlip) {
                painting.rotation.y = Math.PI;
            }
            // Push it to the array 
            interactableObjects.push(painting);
        });

        /*Adds cute little frames to each painting*/
        const frameTexture = textureLoader.load('./Textures/frame.png');
        const frameMaterial = new THREE.MeshBasicMaterial({
            map: frameTexture,
            transparent: true,
            side: THREE.DoubleSide
        });
        const frameGeo = new THREE.PlaneGeometry(width + 1, height + 1.5);
        const frame = new THREE.Mesh(frameGeo, frameMaterial);
        // Simple math to convert frames to right size and positon
        // Based on if painting is rotated to determine which wall painting is located
        let frameZ = position.z + 0.05;
        let frameX = position.x;
        if (rotateRight) {
            frame.rotation.y = -Math.PI / 2;
            frameX = position.x - 0.05;
        }
        if (rotateLeft) {
            frame.rotation.y = Math.PI / 2;
            frameX = position.x + 0.05;
        }
        if (rotateFlip) {
            frame.rotation.y = Math.PI;
            frameZ = position.z - 0.05;
        }
        frame.position.set(frameX, position.y - .2, frameZ);
        scene.add(frame);
    } catch (error) {
        console.error(`Error loading Met Object ${objectID}:`, error);
    }
}