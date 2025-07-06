import * as THREE from 'three';

import { getScene } from '../core/setupScene.js';

import { registerCarLights } from '../core/setupLights.js';

let physicsSimulator;
let chassis, wheels = [];

// Luces
let headLightRight, headLightLeft, tailLightRight, tailLightLeft;

export function createCarModel() {
    const scene = getScene();

    // ----- Crear chasis ----- 
    const geometry = new THREE.BoxGeometry(2 * 0.5, 1 * 0.5, 4 * 0.5);
    const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    chassis = new THREE.Mesh(geometry, material);
    scene.add(chassis);

    // ----- Ruedas ----- 
    const wheelGeometry = new THREE.CylinderGeometry(0.6 * 0.5, 0.6 * 0.5, 0.4 * 0.5, 16).rotateZ(Math.PI * 0.5);
    const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });

    for (let i = 0; i < 4; i++) {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        chassis.add(wheel);
        wheel.position.set(10 * i, 2, 20 * i);
        wheels.push(wheel);
    }

    // Faros delanteros
    headLightRight = createSpotlight(0xffddaa, 0.5, 0.3, -1.0, 0, 0, -10);
    headLightLeft = createSpotlight(0xffddaa, -0.5, 0.3, -1.0, 0, 0, -10);

    // Luces traseras
    tailLightRight = createSpotlight(0xff0000, 0.5, 0.3, 1.0, 0, 0, 10);
    tailLightLeft = createSpotlight(0xff0000, -0.5, 0.3, 1.0, 0, 0, 10);

    [headLightRight, headLightLeft, tailLightRight, tailLightLeft].forEach(light => {
        chassis.add(light);
        chassis.add(light.target);
        //scene.add(new THREE.SpotLightHelper(light));
    });

    registerCarLights(headLightRight, headLightLeft, tailLightRight, tailLightLeft);

}

function createSpotlight(color, x, y, z, tx, ty, tz) {
    const light = new THREE.SpotLight(color, 0); 
    light.decay = 2;
    light.penumbra = 0.5;
    light.distance = 20;
    light.angle = Math.PI / 8;
    light.position.set(x, y, z);
    light.target.position.set(tx, ty, tz);
    return light;
}

export function updateVehicleTransforms() {
    const vt = physicsSimulator?.getVehicleTransform();
    if (chassis && vt) {
        const { position, quaternion } = vt;
        chassis.position.set(position.x, position.y, position.z);
        chassis.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);

        wheels.forEach((wheel, i) => {
            const wt = physicsSimulator.getWheelTransform(i);
            if (wt) {
                wheel.position.set(wt.position.x, wt.position.y, wt.position.z);
                wheel.quaternion.set(wt.quaternion.x, wt.quaternion.y, wt.quaternion.z, wt.quaternion.w);
            }
        });
    }
}

// ---------- SETTERS y GETTERS ----------
export function setSimulatorCar(sim) {
    physicsSimulator = sim;
}

export function getChassis() {
    return chassis;
}
