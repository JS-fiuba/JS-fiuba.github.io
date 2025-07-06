import { createGroundCity } from './groundCity.js';

import { gridManager } from './gridManager.js';

import { createBuildings } from './createBuildings.js';

import { createWorldLimits } from './createWorldLimits.js';

import { createLights } from './addRoadLights.js';

import { createRamps } from './createRamps.js';
import { addTunnelAlongCurve } from './addTunnel.js';
import { addArcAlongCurve } from './addArc.js';

export function cityGenerator(){
    
    // Estructura principal para la creación (o no) de edificios.
    gridManager();

    // Crear geometria y textura del suelo de la ciudad.
    createGroundCity();

    // Limites del mapa.
    createWorldLimits();

    // Crear edificios.
    createBuildings();

    // Postes de la ruta.
    createLights();

    // Crear objetos en ruta.
    createRamps(0.65);
    addTunnelAlongCurve(0.10);
    addTunnelAlongCurve(0.30);
    addTunnelAlongCurve(0.50);
    addArcAlongCurve(0.86);
    addArcAlongCurve(0.88);
    addArcAlongCurve(0.90);
    addArcAlongCurve(0.92);

}