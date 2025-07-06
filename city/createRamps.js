import * as THREE from 'three';
import { getScene } from '../core/setupScene.js';
import { getRoadCurve } from './roadCurve';
import { getSimulator } from '../physics/setupSimulatorInstance.js';

const rampGeometry = new THREE.BoxGeometry(3, 0.2, 6);
const rampMaterial = new THREE.MeshBasicMaterial({ color: 0x1bff00 });
const upVector = new THREE.Vector3(0, 1, 0);
const xAxis = new THREE.Vector3(1, 0, 0);

function createRampMesh(position, tangent, xAngle) {
  const rampMesh = new THREE.Mesh(rampGeometry, rampMaterial);
  rampMesh.position.copy(position);
  const yAngle = Math.atan2(tangent.x, tangent.z);
  const rotY = new THREE.Quaternion().setFromAxisAngle(upVector, yAngle);
  const rotX = new THREE.Quaternion().setFromAxisAngle(xAxis, xAngle);
  rampMesh.quaternion.copy(rotY.multiply(rotX));
  //rampMesh.add(new THREE.AxesHelper(10));
  return rampMesh;
}

export function createRamps(t, width = 3, height = 0.2, depth = 6) {
  const scene = getScene();
  const curve = getRoadCurve();
  const physics = getSimulator();

  if (
    rampGeometry.parameters.width !== width ||
    rampGeometry.parameters.height !== height ||
    rampGeometry.parameters.depth !== depth
  ) {
    rampGeometry.dispose();
    rampGeometry.copy(new THREE.BoxGeometry(width, height, depth));
  }

  const position = curve.getPointAt(t);
  const tangent = curve.getTangentAt(t).normalize();
  const rampMesh = createRampMesh(position, tangent, -Math.PI / 12);
  scene.add(rampMesh);
  physics.addTrimeshCollider(rampMesh);

  const tOffset = 0.03;
  const position1 = curve.getPointAt(t + tOffset);
  const tangent1 = curve.getTangentAt(t + tOffset).normalize();
  const rampMesh1 = createRampMesh(position1, tangent1, Math.PI / 12);
  scene.add(rampMesh1);
  physics.addTrimeshCollider(rampMesh1, 0);
}
