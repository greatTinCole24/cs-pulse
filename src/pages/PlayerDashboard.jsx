import React, { useState, useEffect } from "react";
import { Player } from "@/api/entities";
import { VideoAnalysis } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, User, Trophy, Target, TrendingUp } from "lucide-react";

export default function PlayerDashboard() {
  const [players, setPlayers] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    loadPlayers();
    loadAnalyses();
  }, []);

  const loadPlayers = async () => {
    const data = await Player.list("-rating");
    setPlayers(data);
  };

  const loadAnalyses = async () => {
    const data = await VideoAnalysis.list("-created_date");
    setAnalyses(data);
  };

  const filteredPlayers = players.filter(player =>
    player.player_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.team?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPlayerAnalyses = (playerName) => {
    return analyses.filter(a => a.player_name === playerName && a.analysis_status === 'completed');
  };

  const getRoleColor = (role) => {
    const colors = {
      'AWPer': 'bg-red-500/20 text-red-400 border-red-500/30',
      'Entry Fragger': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'Support': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'IGL': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Lurker': 'bg-green-500/20 text-green-400 border-green-500/30'
    };
    return colors[role] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Player Statistics</h1>
            <p className="text-slate-400">Track individual player performance and improvements</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search players or teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-slate-800 border-slate-700 text-white w-64"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/40 border-slate-700 backdrop-blur-sm">
              <CardHeader className="border-b border-slate-700">
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-400" />
                  Player Rankings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {filteredPlayers.map((player, index) => {
                    const playerAnalyses = getPlayerAnalyses(player.player_name);
                    return (
                      <div
                        key={player.id}
                        className={`p-4 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors cursor-pointer ${
                          selectedPlayer?.id === player.id ? 'bg-slate-700/50' : ''
                        }`}
                        onClick={() => setSelectedPlayer(player)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                              #{index + 1}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-white">{player.player_name}</h3>
                                {player.role && (
                                  <Badge className={`${getRoleColor(player.role)} border text-xs`}>
                                    {player.role}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-slate-400">{player.team}</p>
                              {player.country && (
                                <p className="text-xs text-slate-500">{player.country}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <p className="text-xl font-bold text-white">{player.rating?.toFixed(2) || 'N/A'}</p>
                              <p className="text-xs text-slate-400">Rating</p>
                            </div>
                            <div>
                              <p className="text-xl font-bold text-green-400">{player.kd_ratio?.toFixed(2) || 'N/A'}</p>
                              <p className="text-xs text-slate-400">K/D</p>
                            </div>
                            <div>
                              <p className="text-xl font-bold text-blue-400">{playerAnalyses.length}</p>
                              <p className="text-xs text-slate-400">Analyses</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredPlayers.length === 0 && (
                  <div className="text-center py-12">
                    <User className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                    <p className="text-slate-400">No players found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            {selectedPlayer ? (
              <Card className="bg-slate-800/40 border-slate-700 backdrop-blur-sm">
                <CardHeader className="border-b border-slate-700">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    {selectedPlayer.player_name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-400">Team</p>
                      <p className="font-semibold text-white">{selectedPlayer.team}</p>
                    </div>
                    
                    {selectedPlayer.role && (
                      <div>
                        <p className="text-sm text-slate-400">Role</p>
                        <Badge className={`${getRoleColor(selectedPlayer.role)} border mt-1`}>
                          {selectedPlayer.role}
                        </Badge>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-400">Rating</p>
                        <p className="text-xl font-bold text-white">{selectedPlayer.rating?.toFixed(2) || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">K/D Ratio</p>
                        <p className="text-xl font-bold text-green-400">{selectedPlayer.kd_ratio?.toFixed(2) || 'N/A'}</p>
                      </div>
                    </div>

                    {selectedPlayer.headshot_percentage && (
                      <div>
                        <p className="text-sm text-slate-400">Headshot %</p>
                        <p className="text-xl font-bold text-red-400">{selectedPlayer.headshot_percentage}%</p>
                      </div>
                    )}

                    {selectedPlayer.adr && (
                      <div>
                        <p className="text-sm text-slate-400">ADR</p>
                        <p className="text-xl font-bold text-blue-400">{selectedPlayer.adr}</p>
                      </div>
                    )}

                    <div className="pt-4 border-t border-slate-700">
                      <p className="text-sm text-slate-400 mb-2">Recent Performance</p>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-green-400">
                          {getPlayerAnalyses(selectedPlayer.player_name).length} analyses completed
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-slate-800/40 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <Target className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                  <p className="text-slate-400">Select a player to view detailed statistics</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}