import * as THREE from 'three';
import { getRoadCurve } from './roadCurve';
import { getScene } from '../core/setupScene';

import { getSetting } from '../core/setupLights';

const streetLights = [];

export function createLights() {
    const scene = getScene();
    const curve = getRoadCurve();

    const lateralOffset = 5;
    const tSpacing = 0.04;
    const maxT = 0.99;

    const lightsGroup = new THREE.Group();

    const postGeometry = new THREE.CylinderGeometry(0.1, 0.1, 4);
    const postMaterial = new THREE.MeshStandardMaterial({
        color: 0xaaaaaa,
        metalness: 1,
        roughness: 0.3,
    });

    const baseGeometry = new THREE.BoxGeometry(0.3, 0.1, 0.8);
    const baseMaterial = new THREE.MeshStandardMaterial({
        color: 0x444444,
        metalness: 1,
        roughness: 0.2,
    });

    let isRight = true;

    for (let t = 0; t < maxT; t += tSpacing) {
        const postMesh = createPostMesh(
            curve, t,
            isRight ? lateralOffset : -lateralOffset,
            isRight ? Math.PI : 0,
            postGeometry, postMaterial,
            baseGeometry, baseMaterial
        );

        lightsGroup.add(postMesh);
        isRight = !isRight;
    }

    scene.add(lightsGroup);
}

function createPostMesh(
    curve, t, lateralOffset, rotationY,
    postGeometry, postMaterial,
    baseGeometry, baseMaterial
) {
    const postMesh = new THREE.Mesh(postGeometry, postMaterial);

    const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
    baseMesh.position.set(0.2, 4 / 2, 0);
    baseMesh.rotation.y = Math.PI / 2;
    postMesh.add(baseMesh);

    const position = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t).normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const normal = new THREE.Vector3().crossVectors(up, tangent).normalize();
    const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();

    const matrix = new THREE.Matrix4().makeBasis(normal, binormal, tangent);

    postMesh.position.copy(position);
    postMesh.position.y += 2;
    postMesh.setRotationFromMatrix(matrix);
    postMesh.rotateY(rotationY);
    postMesh.position.add(normal.clone().multiplyScalar(lateralOffset));

    const setting = getSetting();
    const light = new THREE.SpotLight(0xffffff, setting.mode === 'Night' ? 3 : 0, 30, Math.PI / 6, 0.3, 1);
    light.position.set(0, 0, 0);
    baseMesh.add(light);

    const target = new THREE.Object3D();
    target.position.set(0, -2, 1.5);
    baseMesh.add(target);
    light.target = target;

    streetLights.push(light);

    return postMesh;
}

export function updateStreetLightIntensities() {
    const setting = getSetting();
    const targetIntensity = setting.mode === 'Night' ? 3.0 : 0.0;
    for (const light of streetLights) {
        light.intensity += (targetIntensity - light.intensity) * 0.05;
    }
}
