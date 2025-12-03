## 1. Idea del proyecto

**Nombre:** `trivex-v2x-mini-sim`

**Descripción corta:**

Un dashboard frontend que simula un pequeño entorno V2X: varios vehículos moviéndose en una cuadrícula urbana, algunos puntos de infraestructura (RSU / semáforos), mensajes V2X simulados y un event log en tiempo real.

Todo **frontend only**, con **datos mock** y una **simulación por intervalos**.

---

## 2. Alcance (realista para 4h)

### MVP (lo que *sí o sí* debería tener)

1. **Vista principal (una sola página)**
    - Layout en 3 columnas (por ejemplo):
        - Izquierda: **controles y filtros**
        - Centro: **mapa simplificado / grid**
        - Derecha: **lista de vehículos + event log**
2. **“Mapa” 2D simplificado**
    - Un grid (por ejemplo 10x10) dibujado con CSS o usando `<svg>`.
    - Vehículos representados como pequeños cuadrados/círculos con un color según el estado (OK, warning, alerta).
    - Uno o dos “nodos” de infraestructura (ej. RSU, semáforo).
3. **Simulación básica**
    - Un `setInterval` que cada X ms:
        - Actualiza la posición de los vehículos (se mueven en el grid).
        - Genera eventos V2X simulados (ej.: `CAR_1 -> RSU_1: SPEED_ALERT`).
    - Botones: **Play / Pause / Reset** de la simulación.
4. **Lista de vehículos**
    - Tabla o lista con:
        - ID
        - Tipo (Car, Bus, Emergency)
        - Velocidad
        - Estado de conexión (Connected / Lost)
    - Posibilidad de **seleccionar un vehículo** y resaltarlo en el mapa + mostrar detalle.
5. **Event Log**
    - Lista de los últimos N eventos:
        - Timestamp
        - Emisor
        - Receptor
        - Tipo de mensaje (`SPEED_ALERT`, `COLLISION_WARNING`, `SIGNAL_REQUEST`, etc.).
    - Scrollable, con los eventos más recientes arriba.

### Extra (solo si te da el tiempo)

- Filtros por tipo de vehículo.
- Cambiar la velocidad de simulación (x0.5, x1, x2).
- Pequeños badges de estado (latencia estimada, packet loss fake, etc.).

---

## 3. Stack sugerido

Yo iría con algo alineado al job y rápido para ti:

- **Next.js + TypeScript** (App Router, layout sencillo).
- **CSS / Tailwind** (si lo tienes dominado, te acelera maquetación).
- Sin librerías pesadas extra (ni mapas reales), para no perder tiempo.

Estructura mínima:

```
src/
  app/
    layout.tsx
    page.tsx
  components/
    SimulationMap.tsx
    VehicleList.tsx
    EventLog.tsx
    Controls.tsx
  domain/
    v2xTypes.ts
    v2xSimulation.ts

```

---

## 4. Modelo de datos (Typescript)

Algo así de simple te da “olor” a dominio sin pasarte de rosca:

```tsx
// src/domain/v2xTypes.ts
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

```

---

## 5. Lógica de simulación

Archivo pequeño que encapsule el “tick”:

```tsx
// src/domain/v2xSimulation.ts
import { Vehicle, InfrastructureNode, V2XEvent } from './v2xTypes';

export interface SimulationState {
  vehicles: Vehicle[];
  nodes: InfrastructureNode[];
  events: V2XEvent[];
}

export function createInitialState(): SimulationState {
  return {
    vehicles: [
      { id: 'CAR_1', type: 'CAR', x: 1, y: 1, speedKmh: 40, connected: true },
      { id: 'BUS_1', type: 'BUS', x: 3, y: 2, speedKmh: 30, connected: true },
      { id: 'EM_1', type: 'EMERGENCY', x: 0, y: 5, speedKmh: 60, connected: true },
    ],
    nodes: [
      { id: 'RSU_1', type: 'RSU', x: 5, y: 5 },
      { id: 'TL_1', type: 'TRAFFIC_LIGHT', x: 2, y: 7 },
    ],
    events: [],
  };
}

export function stepSimulation(
  state: SimulationState,
): SimulationState {
  // mover vehículos en una dirección simple por ahora
  const vehicles = state.vehicles.map((v) => {
    let nx = v.x + 1;
    if (nx > 9) nx = 0;
    return { ...v, x: nx };
  });

  // generar un evento aleatorio
  const now = Date.now();
  const randomVehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
  const randomNode = state.nodes[Math.floor(Math.random() * state.nodes.length)];

  const newEvent: V2XEvent = {
    id: `${now}`,
    timestamp: now,
    from: randomVehicle.id,
    to: randomNode.id,
    type: 'SPEED_ALERT',
    payload: `Vehicle ${randomVehicle.id} reported speed ${randomVehicle.speedKmh} km/h`,
  };

  const events = [newEvent, ...state.events].slice(0, 50);

  return {
    ...state,
    vehicles,
    events,
  };
}

```

---

## 6. Página principal (esqueleto)

```tsx
// src/app/page.tsx
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
    <main className="min-h-screen p-4 grid grid-cols-[2fr_3fr_3fr] gap-4 bg-slate-950 text-slate-50">
      <section className="space-y-4">
        <h1 className="text-xl font-semibold">Trivex V2X Mini Simulation</h1>
        <Controls running={running} onToggle={() => setRunning(r => !r)} onReset={handleReset} />
        <VehicleList
          vehicles={state.vehicles}
          selectedId={selectedVehicleId}
          onSelect={setSelectedVehicleId}
        />
      </section>

      <section>
        <SimulationMap
          vehicles={state.vehicles}
          nodes={state.nodes}
          selectedVehicleId={selectedVehicleId}
        />
      </section>

      <section>
        <EventLog events={state.events} />
      </section>
    </main>
  );
}

```

Con eso ya tienes el esqueleto prácticamente listo.

---

## 7. Plan de trabajo (4 horas)

**Hora 1**

- Crear proyecto Next.js + TS.
- Definir tipos (`v2xTypes.ts`) y lógica base (`createInitialState`, `stepSimulation`).
- Montar layout básico con Tailwind.

**Hora 2**

- Implementar `SimulationMap` (grid CSS, vehículos, nodos).
- Implementar `VehicleList` con selección.

**Hora 3**

- Implementar `EventLog` + formato bonito de timestamp.
- Implementar `Controls` (Play/Pause/Reset).
- Integrar el loop de simulación.

**Hora 4**

- Ajustes visuales (colores, spacing, hover).
- Pequeña documentación en `README.md` explicando:
    - Objetivo
    - Stack
    - Cómo corre la simulación
    - Cómo esto se relaciona con un proyecto V2X real.

---

## 1. Objetivo del proyecto

Construir un **dashboard front-end** que simule un entorno V2X sencillo:

- Hay **vehículos** moviéndose en una “ciudad” representada como una cuadrícula.
- Hay **nodos de infraestructura** (RSUs, semáforos).
- En cada “tick” de simulación:
    - Los vehículos cambian de posición.
    - Se generan **mensajes V2X simulados** entre vehículos e infraestructura.
- El usuario puede:
    - Ver el mapa con el tráfico.
    - Ver información detallada de los vehículos.
    - Ver un registro de mensajes V2X en tiempo “casi real”.
    - Controlar la simulación (play/pause/reset).

Todo es **mock**, no hay backend ni datos reales.