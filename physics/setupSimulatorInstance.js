import { PhysicsSimulator } from './PhysicsSimulator.js';

import { setSimulatorCar } from '../vehicle/car.js';

let simulator;

export async function initSimulator() {
    simulator = new PhysicsSimulator();
    await simulator.initSimulation();
    setSimulatorCar(simulator);
}

export function getSimulator() {
    return simulator;
}