'use client';

import { Vehicle, InfrastructureNode, VehicleType } from '@/domain/v2xTypes';

interface SimulationMapProps {
  vehicles: Vehicle[];
  nodes: InfrastructureNode[];
  selectedVehicleId: string | null;
}

const GRID_SIZE = 10;

function getVehicleColor(type: VehicleType): string {
  switch (type) {
    case 'CAR':
      return 'bg-blue-500';
    case 'BUS':
      return 'bg-yellow-500';
    case 'EMERGENCY':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
}

function getNodeColor(type: InfrastructureNode['type']): string {
  switch (type) {
    case 'RSU':
      return 'bg-green-500';
    case 'TRAFFIC_LIGHT':
      return 'bg-orange-500';
    default:
      return 'bg-gray-500';
  }
}

function getNodeIcon(type: InfrastructureNode['type']): string {
  switch (type) {
    case 'RSU':
      return '📡';
    case 'TRAFFIC_LIGHT':
      return '🚦';
    default:
      return '●';
  }
}

export function SimulationMap({
  vehicles,
  nodes,
  selectedVehicleId,
}: SimulationMapProps) {
  // Create a 2D array to track what's in each cell
  const grid: Array<Array<'vehicle' | 'node' | null>> = Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(null));

  // Mark nodes in the grid
  nodes.forEach((node) => {
    if (node.x >= 0 && node.x < GRID_SIZE && node.y >= 0 && node.y < GRID_SIZE) {
      grid[node.y][node.x] = 'node';
    }
  });

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
        <span>Simulation Map</span>
        <span className="text-xs font-normal text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded">
          {vehicles.length} vehicles
        </span>
      </h2>
      <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            aspectRatio: '1',
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => {
            const y = Math.floor(index / GRID_SIZE);
            const x = index % GRID_SIZE;
            const vehicle = vehicles.find((v) => v.x === x && v.y === y);
            const node = nodes.find((n) => n.x === x && n.y === y);
            const isSelected = vehicle?.id === selectedVehicleId;

            return (
              <div
                key={`${x}-${y}`}
                className="relative aspect-square bg-slate-800/50 border border-slate-700/50 rounded flex items-center justify-center transition-colors duration-150"
              >
                {vehicle && (
                  <div
                    className={`absolute w-3/4 h-3/4 rounded-full ${getVehicleColor(
                      vehicle.type
                    )} transition-all duration-300 ${
                      !vehicle.connected ? 'opacity-40' : 'opacity-100'
                    } ${
                      isSelected
                        ? 'ring-4 ring-blue-400 ring-offset-2 ring-offset-slate-900 scale-110 shadow-lg shadow-blue-400/50'
                        : 'hover:scale-105'
                    }`}
                    title={`${vehicle.id} (${vehicle.type})`}
                  />
                )}
                {node && !vehicle && (
                  <div
                    className={`absolute w-2/3 h-2/3 rounded flex items-center justify-center ${getNodeColor(
                      node.type
                    )} text-xs`}
                    title={`${node.id} (${node.type})`}
                  >
                    <span className="text-lg">{getNodeIcon(node.type)}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="text-xs text-slate-400 space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span>Car</span>
          <div className="w-3 h-3 rounded-full bg-yellow-500 ml-4" />
          <span>Bus</span>
          <div className="w-3 h-3 rounded-full bg-red-500 ml-4" />
          <span>Emergency</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500" />
          <span>RSU</span>
          <div className="w-3 h-3 rounded bg-orange-500 ml-4" />
          <span>Traffic Light</span>
        </div>
      </div>
    </div>
  );
}

