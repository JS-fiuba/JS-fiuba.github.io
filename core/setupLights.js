import * as THREE from 'three';

import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

import { getScene } from './setupScene';
import { getRenderer } from './setupScene';

let scene;

// Configuraciones luces general
let sunLight, hemisphericalLight;
let setting = { mode: 'Day' };
let targetBackgroundColor;
let currentBackgroundColor = new THREE.Color();
let targetSolarIntensity = 1.2;
let targetHemiIntensity = 0.6;

// HDR para reflejos de día
let hdrTexture = null;
const hdrPath = '/textures/skyTextures/skyHDR.hdr';

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

    scene.add(sunLight);
    scene.add(hemisphericalLight);

    updateLights(setting.mode);
}

export function updateLights(mode) {

    const renderer = getRenderer();

    setting.mode = mode;

    if (mode === 'Day') {
        targetSolarIntensity = 1.2;
        targetHemiIntensity = 0.6;
        targetBackgroundColor = new THREE.Color(0xbfdfff);

        if (!hdrTexture) {
            const loader = new RGBELoader();
            loader.load(hdrPath, function (texture) {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                hdrTexture = texture;

                scene.environment = hdrTexture;
                scene.background = hdrTexture;

                // IMPORTANTE: aplicar exposición DESPUÉS de asignar el HDR
                renderer.toneMappingExposure = 0.2;
            });
        } else {
            scene.environment = hdrTexture;
            scene.background = hdrTexture;
            renderer.toneMappingExposure = 0.2;
        }

        // Intensidades luces auto
        if (carLights.headLightRight) carLights.headLightRight.intensity = 0.0;
        if (carLights.headLightLeft) carLights.headLightLeft.intensity = 0.0;
        if (carLights.tailLightRight) carLights.tailLightRight.intensity = 0.2;
        if (carLights.tailLightLeft) carLights.tailLightLeft.intensity = 0.2;

    } else if (mode === 'Night') {
        targetSolarIntensity = 0.0;
        targetHemiIntensity = 0.0;
        targetBackgroundColor = new THREE.Color(0x000610);

        // Noche: sin HDR
        scene.environment = null;
        scene.background = targetBackgroundColor;
        renderer.toneMappingExposure = 0.6;

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
