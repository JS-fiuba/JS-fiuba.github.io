import * as THREE from 'three';

import { getScene } from './setupScene';

let scene;

// Configuraciones luces general
let sunLight, hemisphericalLight;
let setting = { mode: 'Day' };
let targetBackgroundColor;
let currentBackgroundColor = new THREE.Color();
let targetSolarIntensity = 1.2;
let targetHemiIntensity = 0.6;

// Luces del auto
let carLights = { headLightRight: null, headLightLeft: null, tailLightRight: null, tailLightLeft: null };


export function setupLights(){
    
    scene = getScene();

    sunLight = new THREE.DirectionalLight(
        0xffffff,
        1.2
    );
    sunLight.position.set(100, 100, 50);
    sunLight.castShadow = true;

    hemisphericalLight = new THREE.HemisphereLight(
        0x87ceeb,
        0x444444,
        0.6
    );

    updateLights(setting.mode);

    scene.add(sunLight);
    scene.add(hemisphericalLight);
}

export function updateLights(mode) {
    setting.mode = mode;

    if (mode === 'Day') {
        targetSolarIntensity = 1.2;
        targetHemiIntensity = 0.6;
        targetBackgroundColor = new THREE.Color(0xbfdfff);

        // Intesidades luces auto
        if (carLights.headLightRight) carLights.headLightRight.intensity = 0.0;
        if (carLights.headLightLeft) carLights.headLightLeft.intensity = 0.0;
        if (carLights.tailLightRight) carLights.tailLightRight.intensity = 0.2;
        if (carLights.tailLightLeft) carLights.tailLightLeft.intensity = 0.2;

    } else if (mode === 'Night') {
        targetSolarIntensity = 0.0;
        targetHemiIntensity = 0.0;
        targetBackgroundColor = new THREE.Color(0x0a0a2a);

        // Intesidades luces auto
        if (carLights.headLightRight) carLights.headLightRight.intensity = 53.0;
        if (carLights.headLightLeft) carLights.headLightLeft.intensity = 53.0;
        if (carLights.tailLightRight) carLights.tailLightRight.intensity = 53.0;
        if (carLights.tailLightLeft) carLights.tailLightLeft.intensity = 53.0;        
    }
}

export function registerCarLights(headRight, headLeft, tailRight, tailLeft) {
    carLights.headLightRight = headRight;
    carLights.headLightLeft = headLeft;
    carLights.tailLightRight = tailRight;
    carLights.tailLightLeft = tailLeft;
}


// --------------- Getters ---------------
export function getSunLight() { return sunLight; }
export function getHemisphericalLight() { return hemisphericalLight; }

export function getTargetBackgroundColor() {
    return targetBackgroundColor;
}
export function getCurrentBackgroundColor() {
    return currentBackgroundColor;
}
export function getTargetSolarIntensity() {
    return targetSolarIntensity;
}
export function getTargetHemiIntensity() {
    return targetHemiIntensity;
}
export function getSetting() {
    return setting;
}
