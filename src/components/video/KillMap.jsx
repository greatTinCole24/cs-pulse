import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Target, Skull, Crosshair, Filter, Eye, EyeOff } from 'lucide-react';

const MAP_LAYOUTS = {
  Dust2: {
    background: 'linear-gradient(135deg, #d4a574 0%, #c19a6b 50%, #b8906b 100%)',
    zones: [
      { name: 'A Site', x: 75, y: 25, width: 20, height: 15 },
      { name: 'B Site', x: 15, y: 70, width: 20, height: 15 },
      { name: 'Mid', x: 45, y: 45, width: 10, height: 20 },
      { name: 'Long A', x: 60, y: 15, width: 25, height: 8 },
      { name: 'Cat', x: 50, y: 25, width: 15, height: 8 }
    ]
  },
  Mirage: {
    background: 'linear-gradient(135deg, #e8d4a0 0%, #d4c088 50%, #c4b078 100%)',
    zones: [
      { name: 'A Site', x: 70, y: 20, width: 25, height: 20 },
      { name: 'B Site', x: 10, y: 65, width: 25, height: 20 },
      { name: 'Mid', x: 40, y: 40, width: 20, height: 15 },
      { name: 'Connector', x: 35, y: 55, width: 15, height: 10 },
      { name: 'Ramp', x: 60, y: 45, width: 12, height: 15 }
    ]
  },
  Inferno: {
    background: 'linear-gradient(135deg, #8b7355 0%, #7a6249 50%, #6b5540 100%)',
    zones: [
      { name: 'A Site', x: 65, y: 25, width: 30, height: 20 },
      { name: 'B Site', x: 5, y: 60, width: 30, height: 25 },
      { name: 'Mid', x: 40, y: 45, width: 20, height: 15 },
      { name: 'Banana', x: 15, y: 45, width: 20, height: 10 },
      { name: 'Apps', x: 50, y: 25, width: 10, height: 15 }
    ]
  }
};

export default function KillMap({ mapName, killEvents, deathEvents = [] }) {
  const [showKills, setShowKills] = useState(true);
  const [showDeaths, setShowDeaths] = useState(true);
  
  const mapLayout = MAP_LAYOUTS[mapName] || MAP_LAYOUTS.Dust2;

  const getKillColor = (killType) => {
    switch (killType) {
      case 'headshot': return 'bg-red-500 border-red-600';
      case 'wallbang': return 'bg-yellow-400 border-yellow-500';
      default: return 'bg-cyan-400 border-cyan-500';
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-lg">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-300">Display:</span>
        </div>
        <Button
          variant={showKills ? "default" : "outline"}
          size="sm"
          onClick={() => setShowKills(!showKills)}
          className={showKills ? "bg-green-500 hover:bg-green-600" : "border-green-500 text-green-400 hover:bg-green-500/20"}
        >
          <Target className="w-4 h-4 mr-1" />
          Kills ({killEvents?.length || 0})
        </Button>
        <Button
          variant={showDeaths ? "default" : "outline"}
          size="sm"
          onClick={() => setShowDeaths(!showDeaths)}
          className={showDeaths ? "bg-red-500 hover:bg-red-600" : "border-red-500 text-red-400 hover:bg-red-500/20"}
        >
          <Skull className="w-4 h-4 mr-1" />
          Deaths ({deathEvents?.length || 0})
        </Button>
      </div>

      {/* Map with Events */}
      <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-slate-600" 
           style={{ background: mapLayout.background }}>
        
        {/* Map Zones */}
        {mapLayout.zones.map((zone, index) => (
          <div
            key={index}
            className="absolute bg-black/20 border border-slate-800/50 rounded flex items-center justify-center"
            style={{
              left: `${zone.x}%`,
              top: `${zone.y}%`,
              width: `${zone.width}%`,
              height: `${zone.height}%`
            }}
          >
            <span className="text-xs font-bold text-white/80 text-center">{zone.name}</span>
          </div>
        ))}

        {/* Kill Events */}
        {showKills && killEvents?.map((kill, index) => (
          <HoverCard key={`kill-${index}`}>
            <HoverCardTrigger asChild>
              <motion.div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                style={{ top: `${kill.location.y}%`, left: `${kill.location.x}%` }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className={`relative w-4 h-4 rounded-full ${getKillColor(kill.kill_type)} border-2 border-slate-900 cursor-pointer shadow-lg flex items-center justify-center`}>
                  <div className={`absolute w-full h-full rounded-full animate-ping ${getKillColor(kill.kill_type).replace('border-', '')} opacity-75`}></div>
                </div>
              </motion.div>
            </HoverCardTrigger>
            <HoverCardContent className="w-auto bg-slate-800 border-slate-700 text-white p-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-400" />
                  <span className="font-semibold text-green-400">KILL</span>
                </div>
                <div className="flex items-center gap-2">
                  <Crosshair className="w-4 h-4 text-blue-400" />
                  <span>{kill.weapon}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 flex items-center justify-center">🎯</span>
                  <span className="capitalize">{kill.kill_type.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Skull className="w-4 h-4 text-slate-400" />
                  <span>Time: {Math.floor(kill.timestamp / 60)}:{(kill.timestamp % 60).toString().padStart(2, '0')}</span>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}

        {/* Death Events */}
        {showDeaths && deathEvents?.map((death, index) => (
          <HoverCard key={`death-${index}`}>
            <HoverCardTrigger asChild>
              <motion.div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                style={{ top: `${death.location.y}%`, left: `${death.location.x}%` }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: (killEvents?.length || 0) * 0.05 + index * 0.05 }}
              >
                <div className="relative w-4 h-4 bg-red-600 border-2 border-slate-900 cursor-pointer shadow-lg transform rotate-45 flex items-center justify-center">
                  <div className="absolute w-full h-full bg-red-600 animate-pulse opacity-75 transform rotate-0"></div>
                </div>
              </motion.div>
            </HoverCardTrigger>
            <HoverCardContent className="w-auto bg-slate-800 border-slate-700 text-white p-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skull className="w-4 h-4 text-red-400" />
                  <span className="font-semibold text-red-400">DEATH</span>
                </div>
                <div className="flex items-center gap-2">
                  <Crosshair className="w-4 h-4 text-orange-400" />
                  <span>Killed by: {death.cause_of_death}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 flex items-center justify-center">⏰</span>
                  <span>Time: {Math.floor(death.timestamp / 60)}:{(death.timestamp % 60).toString().padStart(2, '0')}</span>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}

        {/* Map Title */}
        <div className="absolute top-4 left-4 bg-slate-800/80 backdrop-blur-sm rounded-lg px-3 py-2">
          <h3 className="text-lg font-bold text-white">{mapName}</h3>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-slate-800/80 backdrop-blur-sm rounded-lg p-3 space-y-2">
          <h4 className="text-xs font-semibold text-white uppercase tracking-wide">Legend</h4>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <div className="w-3 h-3 rounded-full bg-green-400 border border-green-500"></div>
            <span>Kills</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <div className="w-3 h-3 bg-red-600 border border-red-700 transform rotate-45"></div>
            <span>Deaths</span>
          </div>
        </div>
      </div>
    </div>
  );
}
