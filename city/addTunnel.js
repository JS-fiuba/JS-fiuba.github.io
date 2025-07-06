import * as THREE from 'three';
import { getScene } from '../core/setupScene.js';
import { getRoadCurve } from './roadCurve.js';

export function addTunnelAlongCurve(t, width = 7, height = 6, depth = 6) {
    const scene = getScene();
    const raceTrack = getRoadCurve();

    const position = raceTrack.getPointAt(t);
    const tangent = raceTrack.getTangentAt(t).normalize();

    const tunnelGroup = new THREE.Group();

    const wallThickness = 0.5;

    const wallLeft = new THREE.Mesh(
        new THREE.BoxGeometry(wallThickness, height, depth),
        new THREE.MeshStandardMaterial({ color: 0x333333 })
    );
    wallLeft.position.set(-width / 2 + wallThickness / 2, height / 2, 0);
    tunnelGroup.add(wallLeft);

    const wallRight = wallLeft.clone();
    wallRight.position.x = width / 2 - wallThickness / 2;
    tunnelGroup.add(wallRight);

    const roof = new THREE.Mesh(
        new THREE.BoxGeometry(width, wallThickness, depth),
        new THREE.MeshStandardMaterial({ color: 0x555555 })
    );
    roof.position.set(0, height - wallThickness / 2, 0);
    tunnelGroup.add(roof);

    tunnelGroup.position.copy(position);

    const angle = Math.atan2(tangent.x, tangent.z);
    tunnelGroup.rotation.y = angle;

    scene.add(tunnelGroup);
}