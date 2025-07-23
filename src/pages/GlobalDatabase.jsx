import React, { useState, useEffect } from "react";
import { Team } from "@/api/entities";
import { Player } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Users, User, Trophy, Globe, TrendingUp } from "lucide-react";

export default function GlobalDatabase() {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadTeams();
    loadPlayers();
  }, []);

  const loadTeams = async () => {
    const data = await Team.list("world_ranking");
    setTeams(data);
  };

  const loadPlayers = async () => {
    const data = await Player.list("-rating");
    setPlayers(data);
  };

  const filteredTeams = teams.filter(team =>
    team.team_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.region?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPlayers = players.filter(player =>
    player.player_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.team?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.country?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRegionColor = (region) => {
    const colors = {
      'Europe': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'North America': 'bg-red-500/20 text-red-400 border-red-500/30',
      'South America': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Asia': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Oceania': 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    };
    return colors[region] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  const getFormDisplay = (recentForm) => {
    if (!recentForm || !Array.isArray(recentForm)) return null;
    return recentForm.map((result, index) => (
      <span
        key={index}
        className={`inline-block w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center mr-1 ${
          result === 'W' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}
      >
        {result}
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Global Database</h1>
            <p className="text-slate-400">Comprehensive esports data for teams and players worldwide</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search teams or players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-slate-800 border-slate-700 text-white w-64"
            />
          </div>
        </div>

        <Tabs defaultValue="teams" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="teams" className="data-[state=active]:bg-blue-500">
              <Users className="w-4 h-4 mr-2" />
              Teams ({teams.length})
            </TabsTrigger>
            <TabsTrigger value="players" className="data-[state=active]:bg-blue-500">
              <User className="w-4 h-4 mr-2" />
              Players ({players.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="teams">
            <div className="grid gap-6">
              {filteredTeams.map((team) => (
                <Card key={team.id} className="bg-slate-800/40 border-slate-700 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300">
                  <CardHeader className="border-b border-slate-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold">
                          #{team.world_ranking || '?'}
                        </div>
                        <div>
                          <CardTitle className="text-white text-xl">{team.team_name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Globe className="w-4 h-4 text-slate-400" />
                            <Badge className={`${getRegionColor(team.region)} border text-sm`}>
                              {team.region}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <Trophy className="w-4 h-4 text-yellow-400" />
                          <span className="text-lg font-bold text-white">{team.win_rate || 0}%</span>
                        </div>
                        <p className="text-sm text-slate-400">Win Rate</p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-400">{team.wins || 0}</p>
                        <p className="text-sm text-slate-400">Wins</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-400">{team.losses || 0}</p>
                        <p className="text-sm text-slate-400">Losses</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-400">{team.average_rating?.toFixed(2) || 'N/A'}</p>
                        <p className="text-sm text-slate-400">Avg Rating</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-400">${(team.prize_money || 0).toLocaleString()}</p>
                        <p className="text-sm text-slate-400">Prize Money</p>
                      </div>
                    </div>

                    {team.recent_form && team.recent_form.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-700">
                        <div className="flex items-center gap-3">
                          <TrendingUp className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-400">Recent Form:</span>
                          <div className="flex">
                            {getFormDisplay(team.recent_form)}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {filteredTeams.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <p className="text-slate-400 text-lg">No teams found</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="players">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlayers.map((player) => (
                <Card key={player.id} className="bg-slate-800/40 border-slate-700 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300">
                  <CardHeader className="border-b border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {player.player_name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <CardTitle className="text-white">{player.player_name}</CardTitle>
                        <p className="text-sm text-slate-400">{player.team}</p>
                        {player.country && (
                          <p className="text-xs text-slate-500">{player.country}</p>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {player.role && (
                        <Badge className="bg-slate-700/50 text-slate-300 border-slate-600">
                          {player.role}
                        </Badge>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <p className="text-xl font-bold text-blue-400">{player.rating?.toFixed(2) || 'N/A'}</p>
                          <p className="text-xs text-slate-400">Rating</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold text-green-400">{player.kd_ratio?.toFixed(2) || 'N/A'}</p>
                          <p className="text-xs text-slate-400">K/D Ratio</p>
                        </div>
                      </div>

                      {player.headshot_percentage && (
                        <div className="text-center">
                          <p className="text-lg font-bold text-red-400">{player.headshot_percentage}%</p>
                          <p className="text-xs text-slate-400">Headshot %</p>
                        </div>
                      )}

                      {player.maps_played && (
                        <div className="text-center pt-2 border-t border-slate-700">
                          <p className="text-sm text-slate-400">{player.maps_played} maps played</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredPlayers.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <User className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <p className="text-slate-400 text-lg">No players found</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}