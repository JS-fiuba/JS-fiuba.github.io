import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { getScene } from '../core/setupScene.js';

import { registerCarLights } from '../core/setupLights.js';

let physicsSimulator;
let chassis, wheels = [];

// Luces
let headLightRight, headLightLeft, tailLightRight, tailLightLeft;

export function createCarModel() {
    return new Promise((resolve, reject) => {
        const scene = getScene();
        const loader = new GLTFLoader();

        loader.load(
            '/textures/car/LowPolyCar.glb',
            function (gltf) {
                const model = gltf.scene;
                scene.add(model);

                const wheelNames = ['Wheel_FL_0', 'Wheel_FR_1', 'Wheel_RL_2', 'Wheel_RR_3'];
                model.traverse(child => {
                    if (child.isMesh || child.isObject3D) {
                        if (wheelNames.includes(child.name)) {
                            wheels.push(child);
                        }
                    }
                });

                chassis = model;

                headLightRight = createSpotlight(0xffddaa, 0.5, 0.3,  0.7, 0, 0,  10);
                headLightLeft  = createSpotlight(0xffddaa, -0.5, 0.3,  0.7, 0, 0, 10);
                tailLightRight = createSpotlight(0xff0000, 0.5, 0.3, -0.7, 0, 0, -10);
                tailLightLeft  = createSpotlight(0xff0000, -0.5, 0.3, -0.7, 0, 0, -10);

                [headLightRight, headLightLeft, tailLightRight, tailLightLeft].forEach(light => {
                    chassis.add(light);
                    chassis.add(light.target);
                });

                registerCarLights(headLightRight, headLightLeft, tailLightRight, tailLightLeft);

                resolve(); // <- ¡Indica que ya terminó!
            },
            undefined,
            function (error) {
                console.error("Error cargando el modelo GLTF:", error);
                reject(error);
            }
        );
    });
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
