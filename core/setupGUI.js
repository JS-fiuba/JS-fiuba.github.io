import * as dat from 'dat.gui';

import { setCameraByName, getAvailableCameraNames } from './setupCamera.js';

import { getSetting, updateLights } from './setupLights.js';

let gui;

export function setupGUI() {

    const setting = getSetting();

    gui = new dat.GUI();

    // Selección modo dia/noche.
    gui.add(setting, 'mode', ['Day', 'Night']).onChange((value) => {
        updateLights(value);
    });

    // Selección cámara.
    const cameraOptions = getAvailableCameraNames();
    const cameraParams = { camera: cameraOptions[0] };

    gui.add(cameraParams, 'camera', cameraOptions)
        .name('Cámara')
        .onChange((value) => {
            setCameraByName(value);
        });
}
