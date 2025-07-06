import * as THREE from 'three';
import { getScene } from '../core/setupScene.js';
import { getRoadCurve } from './roadCurve.js';

export function addArcAlongCurve(t, radius = 4, tube = 0.5) {
    const scene = getScene();
    const raceTrack = getRoadCurve();
    
    const position = raceTrack.getPointAt(t);
    const tangent = raceTrack.getTangentAt(t).normalize();

    const arco = new THREE.Mesh(
        new THREE.TorusGeometry(radius, tube, 8, 32, Math.PI),
        new THREE.MeshStandardMaterial({ color: 0xff0000 })
    );
    arco.rotation.z = 0; 
    arco.position.y = 0;

    const angle = Math.atan2(tangent.x, tangent.z);
    arco.rotation.y = angle;
    arco.position.x = position.x;
    arco.position.z = position.z;

    scene.add(arco);
}