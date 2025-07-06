import * as THREE from 'three';

import { getScene } from '../core/setupScene';

// ----- Configuración texturas ----- 
const textureLoader = new THREE.TextureLoader();

const colorMap = textureLoader.load('../textures/roadTextures/RoadColor.jpg');
const normalMap = textureLoader.load('../textures/roadTextures/RoadNormalGL.jpg');
const roughnessMap = textureLoader.load('../textures/roadTextures/RoadRoughness.jpg');

[colorMap, normalMap, roughnessMap].forEach(tex => {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 100);
});

let globalCurve = null;

// Crear curva Catmull-Rom
export function createRoadCurve(){

    const scene = getScene();

    const points = [
        new THREE.Vector3(-60, 0, 0),
        new THREE.Vector3(-80, 0, 30),
        new THREE.Vector3(-50, 0, 60),
        new THREE.Vector3(0, 0, 70),
        new THREE.Vector3(50, 0, 60),
        new THREE.Vector3(80, 0, 30),
        new THREE.Vector3(60, 0, 0),
        new THREE.Vector3(40, 0, -30),
        new THREE.Vector3(0, 0, -60),
        new THREE.Vector3(-40, 0, -30),
    ];
    const curve = new THREE.CatmullRomCurve3(points, true);
    const curvePoints = curve.getPoints(500);
    const geometryLine = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const materialLine = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const line = new THREE.Line(geometryLine, materialLine);
    scene.add(line);

    // Aplicar textura
    createRoadMesh(curve);

    globalCurve = curve;
    
    return curvePoints;
}

function createRoadMesh(curve) {
    
    const scene = getScene();

    const roadWidth = 5;
    const segments = 600;
    const points = curve.getSpacedPoints(segments);

    const vertices = [];
    const uvs = [];
    const indices = [];

    const normal = new THREE.Vector3(0, 1, 0);
    const tangent = new THREE.Vector3();
    const binormal = new THREE.Vector3();

    for (let i = 0; i < points.length; i++) {
        const p = points[i];
        curve.getTangent(i / (points.length - 1), tangent);
        binormal.crossVectors(normal, tangent).normalize();

        const left = p.clone().addScaledVector(binormal, -roadWidth / 2);
        const right = p.clone().addScaledVector(binormal, roadWidth / 2);

        vertices.push(left.x, left.y, left.z);
        vertices.push(right.x, right.y, right.z);

        const v = i / (points.length - 1);
        uvs.push(0, v);
        uvs.push(1, v);
    }

    for (let i = 0; i < points.length - 1; i++) {
        const base = i * 2;
        indices.push(base, base + 1, base + 2);
        indices.push(base + 1, base + 3, base + 2);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    let groundTextureMesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
        map: colorMap,
        normalMap,
        roughnessMap,
        metalness: 0.0,
        roughness: 1.0,
        side: THREE.DoubleSide,
    }));
    groundTextureMesh.position.set(0, 0.15, 0);

    scene.add(groundTextureMesh);
}

// ------- Getters -------
export function getRoadCurve() { return globalCurve; }