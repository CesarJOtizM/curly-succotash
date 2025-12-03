import { Vehicle, InfrastructureNode, V2XEvent, SimulationState, V2XMessageType } from './v2xTypes';

export type { SimulationState };

const GRID_SIZE = 10;
const MAX_EVENTS = 50;
const CONNECTION_CHANGE_PROBABILITY = 0.1;

const MESSAGE_TYPES: V2XMessageType[] = [
  'SPEED_ALERT',
  'COLLISION_WARNING',
  'SIGNAL_REQUEST',
  'SIGNAL_RESPONSE',
];

export function createInitialState(): SimulationState {
  return {
    vehicles: [
      { id: 'CAR_1', type: 'CAR', x: 1, y: 1, speedKmh: 40, connected: true },
      { id: 'CAR_2', type: 'CAR', x: 3, y: 3, speedKmh: 45, connected: true },
      { id: 'BUS_1', type: 'BUS', x: 5, y: 2, speedKmh: 30, connected: true },
      { id: 'EM_1', type: 'EMERGENCY', x: 0, y: 5, speedKmh: 60, connected: true },
      { id: 'CAR_3', type: 'CAR', x: 7, y: 7, speedKmh: 35, connected: true },
    ],
    nodes: [
      { id: 'RSU_1', type: 'RSU', x: 5, y: 5 },
      { id: 'TL_1', type: 'TRAFFIC_LIGHT', x: 2, y: 7 },
    ],
    events: [],
  };
}

function generatePayload(
  messageType: V2XMessageType,
  vehicle: Vehicle,
  node: InfrastructureNode
): string {
  switch (messageType) {
    case 'SPEED_ALERT':
      return `Vehicle ${vehicle.id} reported speed ${vehicle.speedKmh} km/h near ${node.id}`;
    case 'COLLISION_WARNING':
      return `Vehicle ${vehicle.id} detected potential collision near ${node.id}`;
    case 'SIGNAL_REQUEST':
      return `Vehicle ${vehicle.id} requesting signal status from ${node.id}`;
    case 'SIGNAL_RESPONSE':
      return `${node.id} responding to signal request from ${vehicle.id}`;
    default:
      return `Message from ${vehicle.id} to ${node.id}`;
  }
}

export function stepSimulation(state: SimulationState): SimulationState {
  // Move vehicles horizontally with wrap-around
  const vehicles = state.vehicles.map((v) => {
    let nx = v.x + 1;
    if (nx >= GRID_SIZE) nx = 0;
    
    // Handle connection state changes (10% probability)
    let connected = v.connected;
    if (Math.random() < CONNECTION_CHANGE_PROBABILITY) {
      connected = !connected;
    }
    
    return { ...v, x: nx, connected };
  });

  // Generate a random V2X event
  const now = Date.now();
  const randomVehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
  const randomNode = state.nodes[Math.floor(Math.random() * state.nodes.length)];
  const randomMessageType = MESSAGE_TYPES[Math.floor(Math.random() * MESSAGE_TYPES.length)];

  const newEvent: V2XEvent = {
    id: `event_${now}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: now,
    from: randomVehicle.id,
    to: randomNode.id,
    type: randomMessageType,
    payload: generatePayload(randomMessageType, randomVehicle, randomNode),
  };

  // Add new event and limit to MAX_EVENTS
  const events = [newEvent, ...state.events].slice(0, MAX_EVENTS);

  return {
    ...state,
    vehicles,
    events,
  };
}

