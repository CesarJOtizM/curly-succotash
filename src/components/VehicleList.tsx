'use client';

import { Car, Bus, Ambulance, Wifi, WifiOff } from 'lucide-react';
import { Vehicle, VehicleType } from '@/domain/v2xTypes';

interface VehicleListProps {
  vehicles: Vehicle[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function getVehicleTypeColor(type: VehicleType): string {
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

function getVehicleTypeLabel(type: VehicleType): string {
  switch (type) {
    case 'CAR':
      return 'Car';
    case 'BUS':
      return 'Bus';
    case 'EMERGENCY':
      return 'Emergency';
    default:
      return type;
  }
}

function getVehicleIcon(type: VehicleType) {
  switch (type) {
    case 'CAR':
      return Car;
    case 'BUS':
      return Bus;
    case 'EMERGENCY':
      return Ambulance;
    default:
      return Car;
  }
}

export function VehicleList({ vehicles, selectedId, onSelect }: VehicleListProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
        <span>Vehicles</span>
        <span className="text-xs font-normal text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded">
          {vehicles.length}
        </span>
      </h2>
      <div className="space-y-2">
        {vehicles.map((vehicle) => {
          const isSelected = vehicle.id === selectedId;
          const Icon = getVehicleIcon(vehicle.type);
          return (
            <div
              key={vehicle.id}
              onClick={() => onSelect(vehicle.id)}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'bg-blue-600/30 border-2 border-blue-500 shadow-lg shadow-blue-500/20 scale-[1.02]'
                  : 'bg-slate-800/50 border-2 border-transparent hover:bg-slate-800/70 hover:border-slate-600 hover:scale-[1.01]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getVehicleTypeColor(vehicle.type)}/20`}>
                  <Icon className={`w-4 h-4 ${getVehicleTypeColor(vehicle.type).replace('bg-', 'text-')}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200">{vehicle.id}</span>
                    <span className="text-xs text-slate-400 bg-slate-700/50 px-1.5 py-0.5 rounded">
                      {getVehicleTypeLabel(vehicle.type)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs">
                    <span className="text-slate-400">{vehicle.speedKmh} km/h</span>
                    <div className={`flex items-center gap-1 ${
                      vehicle.connected ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {vehicle.connected ? (
                        <Wifi className="w-3 h-3" />
                      ) : (
                        <WifiOff className="w-3 h-3" />
                      )}
                      <span className="font-medium">
                        {vehicle.connected ? 'Connected' : 'Lost'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

