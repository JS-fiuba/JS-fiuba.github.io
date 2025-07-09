import { setupScene } from "./core/setupScene";
import { setupCamera } from "./core/setupCamera";
import { setupLights } from "./core/setupLights";
import { setupGUI } from './core/setupGUI.js';
import { animate } from "./core/animate";

import { initSimulator } from './physics/setupSimulatorInstance.js';
import { createCarModel } from './vehicle/car.js';

import { cityGenerator } from './city/cityGenerator.js';

async function init(){

    // Configuraciones principales
    setupScene();
    setupLights();
    setupGUI();

    // Activar físicas. 
    await initSimulator();

    // Creación del auto.
    await createCarModel();

    // Creacion de ciudad: Edificios, Texturas, Ruta, etc.
    cityGenerator();

    // Configuracion camaras.
    setupCamera();

    // Ocultar pantalla de carga
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
    loadingScreen.style.display = 'none';
    }

    // Animaciones.
    animate();

}

init();