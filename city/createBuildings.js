import * as THREE from 'three';

import { getScene } from '../core/setupScene.js';

import {
    getCityGrid,
    getGridSize,
    getCellSize
} from './gridManager.js';

import { getSimulator } from '../physics/setupSimulatorInstance.js';

import { buildingGenerator } from './buildingGenerator.js';

// Identificar que no este ocupado.
// Crear, o no, un edificio en la grilla. --> buildingGenerator()
export function createBuildings(){

    const simulator = getSimulator();

    const gridSize = getGridSize();
    const cellSize = getCellSize();
    const halfCell = cellSize / 2;
    const halfGrid = (gridSize * cellSize) / 2;


    const scene = getScene();
    
    const grid = getCityGrid();
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const cell = grid[i][j];
            if (cell.occupied || Math.random() >= 0.9) continue;

            const { mesh, capStart, capEnd } = buildingGenerator();

            const group = new THREE.Group();
            group.add(mesh, capStart, capEnd);
            group.position.set(j * cellSize - halfGrid + halfCell, 0, i * cellSize - halfGrid + halfCell);
            group.updateMatrixWorld(true);

            scene.add(group);

            if (simulator?.initComplete) {
                simulator.addTrimeshCollider(mesh, 0.2);
            }
        }
    }

}