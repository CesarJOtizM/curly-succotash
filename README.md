# Trivex V2X Mini Simulation

A front-end only dashboard that simulates a V2X (Vehicle-to-Everything) environment with vehicles moving in an urban grid, infrastructure nodes (RSUs, traffic lights), and simulated V2X messages in real-time.

## Overview

This is a prototype simulation that demonstrates V2X communication concepts through a visual dashboard. The simulation shows:

- **Vehicles** (Cars, Buses, Emergency vehicles) moving in a 10x10 grid
- **Infrastructure nodes** (RSU - Road Side Units, Traffic Lights) at fixed positions
- **V2X events** generated in real-time showing communication between vehicles and infrastructure
- **Interactive controls** to play, pause, and reset the simulation

## Stack

- **Next.js 16+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Lucide React** (Iconos)
- **React Hooks** (useState, useEffect)

No backend, no real APIs, no authentication - just a pure front-end simulation.

## Features

- ✅ **Fully Responsive**: Mobile-first design, adapts to all screen sizes
- ✅ **Interactive Controls**: Play, Pause, Reset simulation
- ✅ **Real-time Updates**: Vehicles move, events generate every second
- ✅ **Vehicle Selection**: Click vehicles to highlight on map
- ✅ **Professional UI**: Modern design with icons, animations, and smooth transitions
- ✅ **Connection States**: Vehicles can lose/regain connection dynamically
- ✅ **Event Log**: Scrollable log with color-coded message types

## Project Structure

```
src/
  app/
    layout.tsx          # Root layout with Tailwind
    page.tsx            # Main simulation page
  components/
    Controls.tsx        # Play/Pause/Reset buttons
    VehicleList.tsx     # Vehicle list with selection
    SimulationMap.tsx   # 10x10 grid visualization
    EventLog.tsx        # V2X event log
  domain/
    v2xTypes.ts         # TypeScript type definitions
    v2xSimulation.ts    # Simulation logic (state, movement, events)
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## How the Simulation Works

### Simulation Loop

The simulation runs on a 1-second interval (tick):

1. **Vehicle Movement**: All vehicles move one cell to the right. When they reach the edge, they wrap around to the left side of the same row.
2. **Connection States**: Each tick has a 10% probability of changing a vehicle's connection status (connected ↔ lost).
3. **V2X Event Generation**: One random event is generated per tick:
   - Random vehicle and infrastructure node are selected
   - Random message type is chosen (SPEED_ALERT, COLLISION_WARNING, SIGNAL_REQUEST, SIGNAL_RESPONSE)
   - Event is added to the log (max 50 events, oldest discarded)

### Initial State

On load or reset:
- **5 vehicles** with varied types, positions, and speeds
- **2 infrastructure nodes** (1 RSU, 1 Traffic Light)
- Empty event log
- Simulation starts **running** by default

### Vehicle Types

- **CAR** (Blue): Regular passenger vehicles
- **BUS** (Yellow): Public transport vehicles
- **EMERGENCY** (Red): Emergency response vehicles

### Infrastructure Nodes

- **RSU** (Green 📡): Road Side Units - fixed communication points
- **TRAFFIC_LIGHT** (Orange 🚦): Traffic signal infrastructure

### V2X Message Types

- **SPEED_ALERT**: Vehicle reports its speed near infrastructure
- **COLLISION_WARNING**: Potential collision detected
- **SIGNAL_REQUEST**: Vehicle requests signal status
- **SIGNAL_RESPONSE**: Infrastructure responds to signal request

## Features

### Controls

- **Play/Pause**: Toggle simulation running state
- **Reset**: Return to initial state, clear event log, deselect vehicle
- **Status Badge**: Visual indicator of simulation state (Running/Paused)

### Vehicle List

- Shows all vehicles with:
  - ID and type
  - Current speed (km/h)
  - Connection status (Connected/Lost)
- Click any vehicle to select it
- Selected vehicle is highlighted in both list and map

### Simulation Map

- 10x10 grid visualization
- Vehicles shown as colored circles
- Infrastructure nodes shown with icons
- Selected vehicle has a blue ring highlight
- Disconnected vehicles appear with reduced opacity

### Event Log

- Scrollable list of V2X events (most recent first)
- Each event shows:
  - Timestamp (HH:MM:SS format)
  - From → To (vehicle → infrastructure)
  - Message type (color-coded)
  - Payload description
- Maximum 50 events (oldest auto-removed)

## How This Relates to Real V2X Projects

In a real V2X system:

- **Vehicles** would have actual OBUs (On-Board Units) with GPS, sensors, and communication hardware
- **Infrastructure** would be physical RSUs deployed at intersections and highways
- **Communication** would use DSRC (Dedicated Short-Range Communications) or C-V2X (Cellular V2X) protocols
- **Backend** would process real-time data, manage routing, and provide analytics
- **Security** would include authentication, encryption, and message signing

This simulation demonstrates the **conceptual flow** of V2X communication in a simplified, visual way - useful for demos, presentations, or as a starting point for more complex implementations.

## Development Notes

- All simulation logic is in `src/domain/v2xSimulation.ts`
- State management uses React hooks (no external state library)
- UI is built with Tailwind CSS for rapid styling
- No external dependencies beyond Next.js and React

## License

This is a prototype/demo project.
