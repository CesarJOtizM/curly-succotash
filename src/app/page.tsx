'use client';

import { useEffect, useState } from 'react';
import { createInitialState, stepSimulation, SimulationState } from '@/domain/v2xSimulation';
import { SimulationMap } from '@/components/SimulationMap';
import { VehicleList } from '@/components/VehicleList';
import { EventLog } from '@/components/EventLog';
import { Controls } from '@/components/Controls';

export default function HomePage() {
  const [state, setState] = useState<SimulationState>(() => createInitialState());
  const [running, setRunning] = useState(true);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  useEffect(() => {
    if (!running) return;

    const id = setInterval(() => {
      setState((prev) => stepSimulation(prev));
    }, 1000);

    return () => clearInterval(id);
  }, [running]);

  const handleReset = () => {
    setState(createInitialState());
    setSelectedVehicleId(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <div className="container mx-auto p-4 lg:p-6 max-w-[1920px]">
        {/* Header */}
        <header className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-100 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
               V2X Simulation
              </h1>
              <p className="text-sm text-slate-400 mt-1">Front-end only prototype • Real-time V2X communication</p>
            </div>
          </div>
        </header>

        {/* Main Content - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Left Panel - Controls & Vehicle List */}
          <section className="lg:col-span-3 space-y-4 animate-in fade-in slide-in-from-left-4 duration-500 delay-100">
            <Controls running={running} onToggle={() => setRunning((r) => !r)} onReset={handleReset} />
            <VehicleList
              vehicles={state.vehicles}
              selectedId={selectedVehicleId}
              onSelect={setSelectedVehicleId}
            />
          </section>

          {/* Center Panel - Map */}
          <section className="lg:col-span-5 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <SimulationMap
              vehicles={state.vehicles}
              nodes={state.nodes}
              selectedVehicleId={selectedVehicleId}
            />
          </section>

          {/* Right Panel - Event Log */}
          <section className="lg:col-span-4 animate-in fade-in slide-in-from-right-4 duration-500 delay-300">
            <EventLog events={state.events} />
          </section>
        </div>
      </div>
    </main>
  );
}
