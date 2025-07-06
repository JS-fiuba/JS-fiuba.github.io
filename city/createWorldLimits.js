import * as THREE from 'three';

import { getSimulator } from '../physics/setupSimulatorInstance.js';

import { getScene } from '../core/setupScene.js';

const SIZE = 200/2;
const THICKNESS = 2;
const HEIGHT = 5;

export function createWorldLimits() {
    const scene = getScene();
    const simulator = getSimulator();

    const boundaries = [
        { x: 0, z:  SIZE + THICKNESS / 2, width: 200, depth: THICKNESS },
        { x: 0, z: -SIZE - THICKNESS / 2, width: 200, depth: THICKNESS },
        { x: -SIZE - THICKNESS / 2, z: 0, width: THICKNESS, depth: 200 },
        { x:  SIZE + THICKNESS / 2, z: 0, width: THICKNESS, depth: 200 },
    ];

    for (const { x, z, width, depth } of boundaries) {
        addBoundary(scene, simulator, x, z, width, depth);
    }
}

function addBoundary(scene, simulator, x, z, width, depth) {
    const geometry = new THREE.BoxGeometry(width, HEIGHT, depth);
    const material = new THREE.MeshBasicMaterial({ color: 0x39f900, visible: false });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x, HEIGHT / 2, z);

    if (simulator?.initComplete) {
        simulator.addTrimeshCollider(mesh);
    }

    scene.add(mesh);
}
