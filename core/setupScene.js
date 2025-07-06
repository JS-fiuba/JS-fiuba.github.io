import * as THREE from 'three';

import { getCamera } from './setupCamera';

let scene, renderer, container;
let camera;

export function setupScene(){

    container = document.getElementById('container3D');

    // ---------- RENDERER ----------
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // ---------- SCENE ----------
    scene = new THREE.Scene();
    //scene.add(new THREE.AxesHelper(8));
    //scene.add(new THREE.GridHelper(200, 200));

    window.addEventListener('resize', onWindowResize);

}

function onWindowResize(){

    camera = getCamera();
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth, container.clientHeight);

}

// ---------- GETTERS ----------
export function getScene(){ return scene; }
export function getRenderer(){ return renderer; }
export function getContainer(){ return container; }