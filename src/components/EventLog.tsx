'use client';

import { Activity, AlertTriangle, Radio, MessageSquare } from 'lucide-react';
import { V2XEvent, V2XMessageType } from '@/domain/v2xTypes';

interface EventLogProps {
  events: V2XEvent[];
}

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function getMessageTypeColor(type: V2XMessageType): string {
  switch (type) {
    case 'COLLISION_WARNING':
      return 'text-red-400 bg-red-500/20 border-red-500/30';
    case 'SPEED_ALERT':
      return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    case 'SIGNAL_REQUEST':
      return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
    case 'SIGNAL_RESPONSE':
      return 'text-green-400 bg-green-500/20 border-green-500/30';
    default:
      return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
  }
}

function getMessageIcon(type: V2XMessageType) {
  switch (type) {
    case 'COLLISION_WARNING':
      return AlertTriangle;
    case 'SPEED_ALERT':
      return Activity;
    case 'SIGNAL_REQUEST':
      return Radio;
    case 'SIGNAL_RESPONSE':
      return MessageSquare;
    default:
      return Activity;
  }
}

export function EventLog({ events }: EventLogProps) {
  return (
    <div className="space-y-3 h-full flex flex-col">
      <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
        <span>V2X Event Log</span>
        <span className="text-xs font-normal text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded">
          {events.length}
        </span>
      </h2>
      <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
        {events.length === 0 ? (
          <div className="text-slate-500 text-sm text-center py-12 flex flex-col items-center gap-2">
            <Activity className="w-8 h-8 text-slate-600" />
            <p>No events yet.</p>
            <p className="text-xs">Start the simulation to see V2X messages.</p>
          </div>
        ) : (
          events.map((event, index) => {
            const Icon = getMessageIcon(event.type);
            return (
              <div
                key={event.id}
                className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800/70 hover:border-slate-600 transition-all duration-200 animate-in fade-in slide-in-from-right-4"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs text-slate-400 font-mono">
                    {formatTimestamp(event.timestamp)}
                  </span>
                  <span
                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold border ${getMessageTypeColor(
                      event.type
                    )}`}
                  >
                    <Icon className="w-3 h-3" />
                    {event.type}
                  </span>
                </div>
                <div className="text-sm text-slate-300 mb-1.5">
                  <span className="font-semibold text-blue-400">{event.from}</span>
                  <span className="mx-2 text-slate-500">→</span>
                  <span className="font-semibold text-green-400">{event.to}</span>
                </div>
                <div className="text-xs text-slate-400 leading-relaxed">{event.payload}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

