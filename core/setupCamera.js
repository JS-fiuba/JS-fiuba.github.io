import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

import { getRenderer } from './setupScene.js';
import { getScene } from './setupScene.js';

import { getChassis } from '../vehicle/car.js';

let scene, renderer;

let cameras = {};
let activeCameraKey = 'Orbital';
let orbitalControls, pointerControls;

let vehicle;

const CAMERA_KEYS = ['1', '2', '3', '4'];
const CAMERA_NAMES = ['Orbital', 'Follow', 'Cabin', 'First Person'];

const firstPersonControls = {
    forward: false,
    backward: false,
    left: false,
    right: false
};

export function setupCamera(){

    scene = getScene();
    renderer = getRenderer();

    vehicle = getChassis();

    const aspect = window.innerWidth / window.innerHeight;

    // ----- Orbital -----
    cameras['Orbital'] = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
    cameras['Orbital'].position.set(30, 30, 30);
    orbitalControls = new OrbitControls(cameras['Orbital'], renderer.domElement);
    orbitalControls.target.set(0, 2, 0);
    orbitalControls.update();

    // ----- Follow -----
    cameras['Follow'] = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
    vehicle.add(cameras['Follow']);
    cameras['Follow'].position.set(0, 4, -8);
    cameras['Follow'].lookAt(vehicle.position);

    // ----- Cabin -----
    cameras['Cabin'] = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    vehicle.add(cameras['Cabin']);
    cameras['Cabin'].position.set(0.25, 0.6, -0.2);
    cameras['Cabin'].lookAt(new THREE.Vector3(0.25, 0.6, 1));

    // ----- First Person -----
    cameras['First Person'] = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    pointerControls = new PointerLockControls(cameras['First Person'], renderer.domElement);
    pointerControls.object.position.set(0, 1, 0);
    scene.add(pointerControls.object);

    // Cambiar camaras (1 - 4)
    document.addEventListener('keydown', (e) => {
        const index = CAMERA_KEYS.indexOf(e.key);
        if (index !== -1) {
            setActiveCamera(CAMERA_NAMES[index]);
        }

        if (activeCameraKey !== 'First Person') return;

        if (e.key === 'i') firstPersonControls.forward = true;
        if (e.key === 'k') firstPersonControls.backward = true;
        if (e.key === 'j') firstPersonControls.left = true;
        if (e.key === 'l') firstPersonControls.right = true;
    });

    document.addEventListener('keyup', (e) => {
        if (activeCameraKey !== 'First Person') return;

        if (e.key === 'i') firstPersonControls.forward = false;
        if (e.key === 'k') firstPersonControls.backward = false;
        if (e.key === 'j') firstPersonControls.left = false;
        if (e.key === 'l') firstPersonControls.right = false;
    });

    // Activar PointerLock con click
    renderer.domElement.addEventListener('click', () => {
        if (activeCameraKey === 'First Person' && !pointerControls.isLocked) {
            pointerControls.lock();
        }
    });

    // Resize
    window.addEventListener('resize', () => {
        Object.values(cameras).forEach(cam => {
            cam.aspect = window.innerWidth / window.innerHeight;
            cam.updateProjectionMatrix();
        });
    });

}

function setActiveCamera(key) {
    activeCameraKey = key;

    if (orbitalControls) orbitalControls.enabled = false;
    if (pointerControls?.isLocked) pointerControls.unlock();

    if (key === 'Orbital') {
        orbitalControls.enabled = true;
    }
}

export function updateCameraControls() {
    if (!vehicle) return;

    switch (activeCameraKey) {
        case 'First Person': {
            const speed = 0.1;
            const direction = new THREE.Vector3();

            // Movimiento en First Person
            if (firstPersonControls.forward) direction.z += 1;
            if (firstPersonControls.backward) direction.z -= 1;
            if (firstPersonControls.left) direction.x -= 1;
            if (firstPersonControls.right) direction.x += 1;

            direction.normalize();
            pointerControls.moveRight(direction.x * speed);
            pointerControls.moveForward(direction.z * speed);
            break;
        }
    }
}

// -------- Setters y Getters --------

export function setCameraByName(name) {
    if (CAMERA_NAMES.includes(name)) {
        setActiveCamera(name);
    }
}

export function getCamera() {
    return cameras[activeCameraKey];
}

export function getAvailableCameraNames() {
    return CAMERA_NAMES;
}