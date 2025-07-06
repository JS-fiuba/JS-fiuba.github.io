import * as THREE from 'three';

import { getScene } from '../core/setupScene.js';

import { getGridSize, getCellSize } from './gridManager.js';

import { getSimulator } from '../physics/setupSimulatorInstance.js';

let groundCity;

// --------- Cargas texturas ---------
const textureLoader = new THREE.TextureLoader();

const texturePaths = {
    aoMap: '/textures/streetTextures/StreetAmbientOcclusion.jpg',
    colorMap: '/textures/streetTextures/StreetColor.jpg',
    displacementMap: '/textures/streetTextures/StreetDisplacement.jpg',
    normalMap: '/textures/streetTextures/StreetNormalDX.jpg',
    roughnessMap: '/textures/streetTextures/StreetRoughness.jpg',
};


const textures = {};
let texturesLoaded = false;

function loadTextures(gridSize) {
    if (texturesLoaded) return;

    for (const [key, path] of Object.entries(texturePaths)) {
        const tex = textureLoader.load(path);
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(gridSize, gridSize);
        textures[key] = tex;
    }

    texturesLoaded = true;
}

export function createGroundCity() {

    const scene = getScene();

    const gridSize = getGridSize();  
    const cellSize = getCellSize();   
    const groundSize = gridSize * cellSize;  

    const physics = getSimulator();

    loadTextures(gridSize);

    const geometry = new THREE.PlaneGeometry(groundSize, groundSize, 256, 256);
    geometry.rotateX(-Math.PI / 2);

    geometry.attributes.uv2 = geometry.attributes.uv;

    const material = new THREE.MeshStandardMaterial({
        aoMap: textures.aoMap,
        map: textures.colorMap,
        displacementMap: textures.displacementMap,
        displacementScale: 0.2,
        normalMap: textures.normalMap,
        roughnessMap: textures.roughnessMap,
    });

    groundCity = new THREE.Mesh(geometry, material);
    groundCity.position.set(0, 0, 0);
    groundCity.receiveShadow = true;

    physics.addTrimeshCollider(groundCity);

    scene.add(groundCity);


}