import React, { useState, useEffect } from "react";
import { Team } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Trophy, TrendingUp, Target, Globe, DollarSign } from "lucide-react";

export default function TeamAnalytics() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    const data = await Team.list("world_ranking");
    setTeams(data);
    if (data.length > 0) {
      setSelectedTeam(data[0]);
    }
  };

  const getRegionStats = () => {
    const regionStats = {};
    teams.forEach(team => {
      if (!regionStats[team.region]) {
        regionStats[team.region] = { count: 0, avgRating: 0, totalPrize: 0 };
      }
      regionStats[team.region].count++;
      regionStats[team.region].avgRating += team.average_rating || 0;
      regionStats[team.region].totalPrize += team.prize_money || 0;
    });
    
    Object.keys(regionStats).forEach(region => {
      regionStats[region].avgRating /= regionStats[region].count;
    });
    
    return regionStats;
  };

  const getTopPerformers = () => {
    return teams.slice(0, 10);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Team Analytics</h1>
            <p className="text-slate-400">Deep insights into team performance and regional trends</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/40 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Teams</CardTitle>
              <Users className="w-4 h-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{teams.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Avg Win Rate</CardTitle>
              <Target className="w-4 h-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {teams.length > 0 ? (teams.reduce((sum, t) => sum + (t.win_rate || 0), 0) / teams.length).toFixed(1) : 0}%
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Prize Pool</CardTitle>
              <DollarSign className="w-4 h-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ${teams.reduce((sum, t) => sum + (t.prize_money || 0), 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Regions</CardTitle>
              <Globe className="w-4 h-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {Object.keys(getRegionStats()).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/40 border-slate-700 backdrop-blur-sm">
              <CardHeader className="border-b border-slate-700">
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {getTopPerformers().map((team, index) => (
                    <div
                      key={team.id}
                      className={`p-4 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors cursor-pointer ${
                        selectedTeam?.id === team.id ? 'bg-slate-700/50' : ''
                      }`}
                      onClick={() => setSelectedTeam(team)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                            index === 0 ? 'bg-yellow-500' :
                            index === 1 ? 'bg-slate-400' :
                            index === 2 ? 'bg-amber-600' :
                            'bg-slate-600'
                          }`}>
                            #{team.world_ranking || index + 1}
                          </div>
                          <div>
                            <h3 className="font-bold text-white">{team.team_name}</h3>
                            <p className="text-sm text-slate-400">{team.region}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-400">{team.win_rate || 0}%</p>
                          <p className="text-sm text-slate-400">Win Rate</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            {selectedTeam ? (
              <Card className="bg-slate-800/40 border-slate-700 backdrop-blur-sm">
                <CardHeader className="border-b border-slate-700">
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    {selectedTeam.team_name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-400">World Ranking</p>
                      <p className="text-2xl font-bold text-white">#{selectedTeam.world_ranking || 'N/A'}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-slate-400">Region</p>
                      <Badge className="bg-slate-700/50 text-slate-300 border-slate-600 mt-1">
                        {selectedTeam.region}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-400">Wins</p>
                        <p className="text-xl font-bold text-green-400">{selectedTeam.wins || 0}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Losses</p>
                        <p className="text-xl font-bold text-red-400">{selectedTeam.losses || 0}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-slate-400">Win Rate</p>
                      <p className="text-xl font-bold text-blue-400">{selectedTeam.win_rate || 0}%</p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-400">Average Rating</p>
                      <p className="text-xl font-bold text-purple-400">{selectedTeam.average_rating?.toFixed(2) || 'N/A'}</p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-400">Prize Money</p>
                      <p className="text-xl font-bold text-yellow-400">${(selectedTeam.prize_money || 0).toLocaleString()}</p>
                    </div>

                    {selectedTeam.recent_form && selectedTeam.recent_form.length > 0 && (
                      <div className="pt-4 border-t border-slate-700">
                        <p className="text-sm text-slate-400 mb-2">Recent Form</p>
                        <div className="flex gap-1">
                          {selectedTeam.recent_form.map((result, index) => (
                            <span
                              key={index}
                              className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                                result === 'W' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                              }`}
                            >
                              {result}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-slate-800/40 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                  <p className="text-slate-400">Select a team to view detailed analytics</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}