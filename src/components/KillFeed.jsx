
import React, { useState } from 'react';
import { Target, Crosshair, Bomb, Flame, Shield, Scissors, Skull, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";

const WEAPON_ICONS = {
  'AK-47': <Flame className="w-4 h-4 text-orange-400" />,
  'M4A4': <Shield className="w-4 h-4 text-blue-400" />,
  'M4A1-S': <Shield className="w-4 h-4 text-blue-400" />,
  'AWP': <Crosshair className="w-4 h-4 text-red-500" />,
  'USP-S': <Target className="w-4 h-4 text-slate-400" />,
  'Glock-18': <Target className="w-4 h-4 text-slate-400" />,
  'Deagle': <Target className="w-4 h-4 font-bold text-yellow-400" />,
  'HE Grenade': <Bomb className="w-4 h-4 text-red-400" />,
  'Knife': <Scissors className="w-4 h-4 text-gray-300" />,
  default: <Target className="w-4 h-4 text-slate-400" />
};

export default function KillFeed({ killEvents, deathEvents = [] }) {
  const [showKills, setShowKills] = useState(true);
  const [showDeaths, setShowDeaths] = useState(true);

  const getWeaponIcon = (weapon) => WEAPON_ICONS[weapon] || WEAPON_ICONS.default;

  // Combine and sort all events by timestamp
  const allEvents = [
    ...(showKills ? (killEvents || []).map(event => ({ ...event, type: 'kill' })) : []),
    ...(showDeaths ? (deathEvents || []).map(event => ({ ...event, type: 'death' })) : [])
  ].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-medium text-slate-300">Show:</span>
        </div>
        <Button
          variant={showKills ? "default" : "outline"}
          size="sm"
          onClick={() => setShowKills(!showKills)}
          className={`text-xs ${showKills ? "bg-green-500 hover:bg-green-600" : "border-green-500 text-green-400 hover:bg-green-500/20"}`}
        >
          <Target className="w-3 h-3 mr-1" />
          Kills
        </Button>
        <Button
          variant={showDeaths ? "default" : "outline"}
          size="sm"
          onClick={() => setShowDeaths(!showDeaths)}
          className={`text-xs ${showDeaths ? "bg-red-500 hover:bg-red-600" : "border-red-500 text-red-400 hover:bg-red-500/20"}`}
        >
          <Skull className="w-3 h-3 mr-1" />
          Deaths
        </Button>
      </div>

      {/* Event Feed */}
      <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
        {allEvents.map((event, index) => (
          <div 
            key={index} 
            className={`flex items-center justify-between p-3 rounded-lg text-sm ${
              event.type === 'kill' 
                ? 'bg-green-500/10 border border-green-500/20' 
                : 'bg-red-500/10 border border-red-500/20'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-slate-400 w-12">
                {Math.floor(event.timestamp / 60)}:{(event.timestamp % 60).toString().padStart(2, '0')}
              </span>
              
              {event.type === 'kill' ? (
                <>
                  <Target className="w-4 h-4 text-green-400 flex-shrink-0" />
                  {getWeaponIcon(event.weapon)}
                  <span className="font-medium text-white">{event.weapon}</span>
                  <span className="text-slate-300 capitalize text-xs">
                    {event.kill_type?.replace('_', ' ')}
                  </span>
                </>
              ) : (
                <>
                  <Skull className="w-4 h-4 text-red-400 flex-shrink-0" />
                  {getWeaponIcon(event.cause_of_death)}
                  <span className="font-medium text-white">
                    Killed by {event.cause_of_death}
                  </span>
                </>
              )}
            </div>
          </div>
        ))}
        
        {allEvents.length === 0 && (
          <p className="text-center text-slate-400 py-8">
            No {!showKills && !showDeaths ? '' : !showKills ? 'death' : !showDeaths ? 'kill' : ''} events to display.
          </p>
        )}
      </div>
    </div>
  );
}
