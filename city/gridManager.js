import * as THREE from 'three';

import { getScene } from '../core/setupScene.js';

import { createRoadCurve } from './roadCurve.js';

const gridSize = 20;
const cellSize = 10;
const halfCitySize = (gridSize * cellSize) / 2;

let cityGrid = [];

export function gridManager(){

    // Inicializar la grilla de la ciudad. (Deja como libre cada uno).
    initGrid(); 

    const curvePoints = createRoadCurve();

    // Marcar ocupados según por donde pase la curva.
    markOccupiedCells(curvePoints);

    // Mostar grillas ocupadas por la curva en color rojo, o verde en caso
    // contrario.
    // drawGrid();

}

function initGrid(){
    cityGrid = Array.from({ length: gridSize }, () =>
        Array.from({ length: gridSize }, () => ({ occupied: false }))
    );
}

function markOccupiedCells(curvePoints) {
    for (const point of curvePoints) {
        const col = Math.floor((point.x + halfCitySize) / cellSize);
        const row = Math.floor((point.z + halfCitySize) / cellSize);

        if (
            row >= 0 && row < gridSize &&
            col >= 0 && col < gridSize
        ) {
            cityGrid[row][col].occupied = true;
        }
    }
}

function drawGrid() {
    const scene = getScene();

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const { occupied } = cityGrid[i][j];
            const color = occupied ? 0xff0000 : 0x00ff00;

            const geometry = new THREE.PlaneGeometry(cellSize, cellSize);
            const material = new THREE.MeshBasicMaterial({
                color,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.5,
            });

            const plane = new THREE.Mesh(geometry, material);
            plane.rotation.x = -Math.PI / 2;
            plane.position.set(
                j * cellSize - halfCitySize + cellSize / 2,
                0.01,
                i * cellSize - halfCitySize + cellSize / 2,
            );

            scene.add(plane);
        }
    }
}

// ------------- Getters -------------

export function getCityGrid() {
    return cityGrid;
}

export function getGridSize() {
    return gridSize;
}

export function getCellSize() {
    return cellSize;
}