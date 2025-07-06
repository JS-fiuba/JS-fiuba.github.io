import Stats from 'stats.js';

import { getRenderer, getScene } from './setupScene.js';

import { getCamera } from './setupCamera.js';
import { updateCameraControls } from './setupCamera.js';

import {
    getTargetBackgroundColor,
    getCurrentBackgroundColor,
    getSunLight,
    getHemisphericalLight,
    getTargetSolarIntensity,
    getTargetHemiIntensity,
    getSetting
} from './setupLights.js';

import { buildingInstances } from '../city/buildingGenerator.js';

import { updateVehicleTransforms } from '../vehicle/car.js';

import { getSimulator } from '../physics/setupSimulatorInstance.js';

import { updateStreetLightIntensities } from '../city/addRoadLights.js';

let scene, renderer, camera;
let stats;
let simulator;

const deltaTime = 1 / 60;

export function animate(){

    requestAnimationFrame(animate);

    if (!scene || !renderer || !camera) {
        scene = getScene();
        renderer = getRenderer();
        
        stats = new Stats();
        stats.showPanel(2);
        document.body.appendChild(stats.dom);
    }

    const sunLight = getSunLight();
    const hemiLight = getHemisphericalLight();
    const targetBackgroundColor = getTargetBackgroundColor();
    const currentBackgroundColor = getCurrentBackgroundColor();
    const targetSolarIntensity = getTargetSolarIntensity();
    const targetHemiIntensity = getTargetHemiIntensity();
    const setting = getSetting();

    camera = getCamera();

    simulator = getSimulator();
    simulator.update(deltaTime);

        // Fondo gradual
    if (targetBackgroundColor) {
        currentBackgroundColor.lerp(targetBackgroundColor, 0.05);
        scene.background = currentBackgroundColor.clone();
    }

    // Luz solar y hemisferica
    sunLight.intensity += (targetSolarIntensity - sunLight.intensity) * 0.05;
    hemiLight.intensity += (targetHemiIntensity - hemiLight.intensity) * 0.05;

    // Emisión edificios
    const targetEmissive = setting.mode === 'Night' ? 1.2 : 0.0;
    for (const mesh of buildingInstances) {
        if (mesh.material?.emissiveIntensity !== undefined) {
            mesh.material.emissiveIntensity += (targetEmissive - mesh.material.emissiveIntensity) * 0.05;
        }
    }

    updateStreetLightIntensities();

    stats.begin();

    updateVehicleTransforms();
    updateCameraControls();
    renderer.render(scene, camera);
    stats.end();

}