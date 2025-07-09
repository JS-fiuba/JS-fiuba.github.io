import * as THREE from 'three';

import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry.js';

import { getSetting } from '../core/setupLights.js';

export const buildingInstances = [];

// ------- Texturas -------
const textureLoader = new THREE.TextureLoader();
const repeat = new THREE.Vector2(2, 2);

function loadTexture(path) {
    const tex = textureLoader.load(path);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.copy(repeat);
    return tex;
}

const colorMap       = loadTexture('/textures/buildingTextures/BuildingColor.jpg');
const metalnessMap   = loadTexture('/textures/buildingTextures/BuildingMetalness.jpg');
const emissiveMap    = loadTexture('/textures/buildingTextures/BuildingEmission.jpg');
const normalMap      = loadTexture('/textures/buildingTextures/BuildingNormalGL.jpg');
const roughnessMap   = loadTexture('/textures/buildingTextures/BuildingRoughness.jpg');
const displacementMap= loadTexture('/textures/buildingTextures/BuildingDisplacement.jpg');

// ------- EnvMap -------
const cubeLoader = new THREE.CubeTextureLoader();
const envMap = cubeLoader.load([
    '/textures/buildingTextures/px.png',
    '/textures/buildingTextures/nx.png',
    '/textures/buildingTextures/py.png',
    '/textures/buildingTextures/ny.png',
    '/textures/buildingTextures/pz.png',
    '/textures/buildingTextures/nz.png',
]);

const sharedMaterialParams = {
    map: colorMap,
    emissiveMap,
    emissive: new THREE.Color(0xffcc88),
    metalnessMap,
    normalMap,
    roughnessMap,
    displacementMap,
    displacementScale: 0,
    displacementBias: 0,
    roughness: 0.3,
    metalness: 0.6,
    side: THREE.DoubleSide,
    flatShading: false,
};

export function buildingGenerator(){

    const setting = getSetting();
    const emissiveIntensity = setting.mode === 'Day' ? 0.0 : 1.2;

    const profile = generateRandomProfile();
    const pathParams = {
        height: THREE.MathUtils.randFloat(10, 20),
        steps: THREE.MathUtils.randInt(10, 30),
        twist: THREE.MathUtils.randFloat(0, Math.PI * 0.5),
        minScale: THREE.MathUtils.randFloat(0.35, 1),
        scaleMode: randomChoice(['none', 'middle', 'end'])
    };

    const path = generatePathMatrices(pathParams);
    const geometry = new ParametricGeometry(makeSweepParametricFunction(profile, path), profile.length, path.length - 1);
    geometry.computeVertexNormals();

    const uvs = [];
    for (let i = 0; i <= path.length - 1; i++) {
        for (let j = 0; j <= profile.length; j++) {
            uvs.push(j / profile.length, i / (path.length - 1));
        }
    }
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

    const materialVariants = [
        new THREE.MeshStandardMaterial({
            ...sharedMaterialParams,
        }),
        new THREE.MeshStandardMaterial({
            ...sharedMaterialParams,
            metalness: 1.0,
            roughness: 0.05,
            envMap: envMap,
            envMapIntensity: 1.5,
        }),
        new THREE.MeshStandardMaterial({
            ...sharedMaterialParams,
            metalness: 0.8,
            roughness: 0.3,
            envMap: envMap,
            envMapIntensity: 0.8,
        }),
        new THREE.MeshStandardMaterial({
            ...sharedMaterialParams,
            roughness: 0.9,
            metalness: 0.2,
        }),
    ];
    const material = materialVariants[Math.floor(Math.random() * materialVariants.length)];
    material.emissiveIntensity = emissiveIntensity; 
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = mesh.receiveShadow = true;
    buildingInstances.push(mesh);

    const [capStart, capEnd] = createCaps(profile, path);
    return { mesh, capStart, capEnd };
}

function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomProfile() {
    const type = THREE.MathUtils.randInt(1, 4);
    switch (type) {
        case 1: return getCircularProfile(THREE.MathUtils.randFloat(1.5, 2.5));
        case 2: return getSquareProfile(THREE.MathUtils.randFloat(2, 3), THREE.MathUtils.randInt(4, 20));
        case 3: return getRegularPolygonProfile(THREE.MathUtils.randInt(5, 10), THREE.MathUtils.randFloat(1.5, 2.5));
        case 4: return getEllipseProfile(THREE.MathUtils.randFloat(1.5, 2.5), THREE.MathUtils.randFloat(0.8, 1.5));
    }
}

// ------------- Crear capas (base y techo del edificio) -------------

function createCaps(profile, path) {
    const shape = new THREE.Shape(profile);
    const geometryCap = new THREE.ShapeGeometry(shape);
    geometryCap.computeVertexNormals();

    const capMaterial = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, metalness: 0.2, roughness: 0.7 });

    const createCap = (matrix) => {
        const cap = new THREE.Mesh(geometryCap, capMaterial);
        cap.rotation.x = -Math.PI / 2;
        cap.applyMatrix4(matrix);
        cap.castShadow = cap.receiveShadow = true;
        return cap;
    };

    return [createCap(path[0]), createCap(path[path.length - 1])];
}

// Funcion para ParametricGeometry

function makeSweepParametricFunction(profile, matrices) {
    return (u, v, target) => {
        const pi = u * profile.length;
        const i = Math.floor(pi);
        const frac = pi - i;

        const p1 = profile[i % profile.length];
        const p2 = profile[(i + 1) % profile.length];
        const x = p1.x + (p2.x - p1.x) * frac;
        const y = p1.y + (p2.y - p1.y) * frac;

        const mi = Math.floor(v * (matrices.length - 1));
        target.copy(new THREE.Vector3(x, 0, y).applyMatrix4(matrices[mi]));
    };
}

// ------------- Path del edificio -------------
function generatePathMatrices({ height, steps, twist, minScale, scaleMode }) {
    return Array.from({ length: steps + 1 }, (_, i) => {
        const t = i / steps;
        const y = t * height;

        let s = 1;
        if (scaleMode === 'middle') {
            s = t < 0.5
                ? 1 - (1 - minScale) * (t * 2)
                : minScale + (1 - minScale) * ((t - 0.5) * 2);
        } else if (scaleMode === 'end') {
            s = 1 - (1 - minScale) * t;
        }

        return new THREE.Matrix4()
            .makeRotationY(twist * t)
            .premultiply(new THREE.Matrix4().makeScale(s, 1, s))
            .premultiply(new THREE.Matrix4().makeTranslation(0, y, 0));
    });
}

// ------------- Profiles -------------
function getCircularProfile(radius, segments = 200) {
    return Array.from({ length: segments }, (_, i) => {
        const theta = (i / segments) * 2 * Math.PI;
        return new THREE.Vector2(Math.cos(theta) * radius, Math.sin(theta) * radius);
    });
}

function getSquareProfile(size, segments = 1) {
    const points = [], half = size / 2, step = size / segments;
    for (let i = 0; i < segments; i++) points.push(new THREE.Vector2(-half + i * step, -half));
    for (let i = 0; i < segments; i++) points.push(new THREE.Vector2(half, -half + i * step));
    for (let i = 0; i < segments; i++) points.push(new THREE.Vector2(half - i * step, half));
    for (let i = 0; i < segments; i++) points.push(new THREE.Vector2(-half, half - i * step));
    return points;
}

function getRegularPolygonProfile(sides, radius) {
    return Array.from({ length: sides }, (_, i) => {
        const theta = (i / sides) * 2 * Math.PI;
        return new THREE.Vector2(Math.cos(theta) * radius, Math.sin(theta) * radius);
    });
}

function getEllipseProfile(rx, ry, segments = 200) {
    return Array.from({ length: segments }, (_, i) => {
        const theta = (i / segments) * 2 * Math.PI;
        return new THREE.Vector2(Math.cos(theta) * rx, Math.sin(theta) * ry);
    });
}