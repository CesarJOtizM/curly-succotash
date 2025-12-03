export type VehicleType = 'CAR' | 'BUS' | 'EMERGENCY';

export interface Vehicle {
  id: string;
  type: VehicleType;
  x: number;
  y: number;
  speedKmh: number;
  connected: boolean;
}

export type NodeType = 'RSU' | 'TRAFFIC_LIGHT';

export interface InfrastructureNode {
  id: string;
  type: NodeType;
  x: number;
  y: number;
}

export type V2XMessageType =
  | 'SPEED_ALERT'
  | 'COLLISION_WARNING'
  | 'SIGNAL_REQUEST'
  | 'SIGNAL_RESPONSE';

export interface V2XEvent {
  id: string;
  timestamp: number;
  from: string;
  to: string;
  type: V2XMessageType;
  payload: string;
}

export interface SimulationState {
  vehicles: Vehicle[];
  nodes: InfrastructureNode[];
  events: V2XEvent[];
}

