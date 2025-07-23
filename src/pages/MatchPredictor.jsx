import React, { useState, useEffect } from "react";
import { Team } from "@/api/entities";
import { Match } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, Trophy, Zap, Users, BarChart3 } from "lucide-react";

export default function MatchPredictor() {
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    loadTeams();
    loadMatches();
  }, []);

  const loadTeams = async () => {
    const data = await Team.list("world_ranking");
    setTeams(data);
  };

  const loadMatches = async () => {
    const data = await Match.list("-match_date", 10);
    setMatches(data);
  };

  const calculateWinProbability = (teamA, teamB) => {
    if (!teamA || !teamB) return null;

    const rankingDiff = teamB.world_ranking - teamA.world_ranking;
    const winRateDiff = (teamA.win_rate || 0) - (teamB.win_rate || 0);
    const ratingDiff = (teamA.average_rating || 0) - (teamB.average_rating || 0);
    
    let probability = 50 + (rankingDiff * 2) + (winRateDiff * 0.5) + (ratingDiff * 10);
    probability = Math.max(15, Math.min(85, probability));

    return {
      team1Prob: probability,
      team2Prob: 100 - probability,
      confidence: Math.abs(probability - 50) > 20 ? "High" : Math.abs(probability - 50) > 10 ? "Medium" : "Low"
    };
  };

  const handlePredict = () => {
    const teamAData = teams.find(t => t.team_name === team1);
    const teamBData = teams.find(t => t.team_name === team2);
    
    if (teamAData && teamBData) {
      setPrediction({
        team1: teamAData,
        team2: teamBData,
        ...calculateWinProbability(teamAData, teamBData)
      });
    }
  };

  const getRecentMatches = () => {
    return matches.slice(0, 5);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Match Predictor</h1>
            <p className="text-slate-400">AI-powered win probability calculations for team matchups</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/40 border-slate-700 backdrop-blur-sm mb-6">
              <CardHeader className="border-b border-slate-700">
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  Team Matchup Predictor
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Team 1</label>
                    <Select value={team1} onValueChange={setTeam1}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select first team" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {teams.map((team) => (
                          <SelectItem key={team.id} value={team.team_name} className="text-white hover:bg-slate-700">
                            #{team.world_ranking} {team.team_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Team 2</label>
                    <Select value={team2} onValueChange={setTeam2}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select second team" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {teams.map((team) => (
                          <SelectItem key={team.id} value={team.team_name} className="text-white hover:bg-slate-700">
                            #{team.world_ranking} {team.team_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={handlePredict}
                  disabled={!team1 || !team2 || team1 === team2}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 glow-effect"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Calculate Win Probability
                </Button>
              </CardContent>
            </Card>

            {prediction && (
              <Card className="bg-slate-800/40 border-slate-700 backdrop-blur-sm glow-effect">
                <CardHeader className="border-b border-slate-700">
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-400" />
                    Prediction Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="text-center p-6 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Users className="w-5 h-5 text-blue-400" />
                        <h3 className="text-xl font-bold text-white">{prediction.team1.team_name}</h3>
                      </div>
                      <p className="text-3xl font-bold text-blue-400 mb-2">{prediction.team1Prob.toFixed(1)}%</p>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        Rank #{prediction.team1.world_ranking}
                      </Badge>
                    </div>

                    <div className="text-center p-6 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Users className="w-5 h-5 text-cyan-400" />
                        <h3 className="text-xl font-bold text-white">{prediction.team2.team_name}</h3>
                      </div>
                      <p className="text-3xl font-bold text-cyan-400 mb-2">{prediction.team2Prob.toFixed(1)}%</p>
                      <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                        Rank #{prediction.team2.world_ranking}
                      </Badge>
                    </div>
                  </div>

                  <div className="text-center">
                    <Badge className={`text-sm ${
                      prediction.confidence === 'High' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                      prediction.confidence === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                      'bg-red-500/20 text-red-400 border-red-500/30'
                    } border`}>
                      {prediction.confidence} Confidence
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-6 text-sm">
                    <div>
                      <h4 className="font-semibold text-white mb-2">{prediction.team1.team_name} Stats</h4>
                      <p className="text-slate-400">Win Rate: {prediction.team1.win_rate || 0}%</p>
                      <p className="text-slate-400">Avg Rating: {prediction.team1.average_rating || 'N/A'}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">{prediction.team2.team_name} Stats</h4>
                      <p className="text-slate-400">Win Rate: {prediction.team2.win_rate || 0}%</p>
                      <p className="text-slate-400">Avg Rating: {prediction.team2.average_rating || 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <Card className="bg-slate-800/40 border-slate-700 backdrop-blur-sm mb-6">
              <CardHeader className="border-b border-slate-700">
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Top Teams
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {teams.slice(0, 5).map((team, index) => (
                    <div key={team.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-yellow-500 text-black' :
                          index === 1 ? 'bg-slate-300 text-black' :
                          index === 2 ? 'bg-amber-600 text-white' :
                          'bg-slate-600 text-white'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-white">{team.team_name}</p>
                          <p className="text-xs text-slate-400">{team.region}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-green-400">{team.win_rate || 0}%</p>
                        <p className="text-xs text-slate-400">Win Rate</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/40 border-slate-700 backdrop-blur-sm">
              <CardHeader className="border-b border-slate-700">
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  Recent Matches
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {getRecentMatches().map((match, index) => (
                    <div key={index} className="p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-white">{match.team1} vs {match.team2}</span>
                        <Badge variant="outline" className="border-slate-600 text-slate-300 text-xs">
                          {match.match_type}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400">{match.tournament}</p>
                      {match.winner && (
                        <p className="text-xs text-green-400 mt-1">Winner: {match.winner}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}