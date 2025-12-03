'use client';

import { Play, Pause, RotateCcw } from 'lucide-react';

interface ControlsProps {
  running: boolean;
  onToggle: () => void;
  onReset: () => void;
}

export function Controls({ running, onToggle, onReset }: ControlsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          onClick={onToggle}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
            running
              ? 'bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg shadow-yellow-600/20'
              : 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20'
          }`}
        >
          {running ? (
            <>
              <Pause className="w-4 h-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Play
            </>
          )}
        </button>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium bg-gray-700 hover:bg-gray-600 text-white transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
            running
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              running ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'
            }`}
          />
          {running ? 'Running' : 'Paused'}
        </span>
      </div>
    </div>
  );
}

