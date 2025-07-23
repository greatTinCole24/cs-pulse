import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { VideoAnalysis } from "@/api/entities";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Target, Zap, TrendingUp, BrainCircuit, BarChart3, Clock, Map } from "lucide-react";
import KillMap from "../components/video/KillMap";
import KillFeed from "../components/video/KillFeed";

export default function AnalysisDetail() {
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get the ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (id) {
      loadAnalysis(id);
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadAnalysis = async (id) => {
    setIsLoading(true);
    try {
      const analyses = await VideoAnalysis.list();
      const foundAnalysis = analyses.find(a => a.id === id);
      setAnalysis(foundAnalysis);
    } catch (error) {
      console.error("Failed to load analysis:", error);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-400 text-lg">Loading analysis...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Button asChild variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
              <Link to={createPageUrl("VideoAnalysis")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Analyses
              </Link>
            </Button>
          </div>
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-white mb-2">Analysis Not Found</h2>
            <p className="text-slate-400">The requested analysis could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Kills", value: analysis.kills || 0, icon: Target, color: "text-green-400" },
    { label: "Deaths", value: analysis.deaths || 0, icon: Zap, color: "text-red-400" },
    { label: "Assists", value: analysis.assists || 0, icon: TrendingUp, color: "text-blue-400" },
    { label: "Accuracy", value: `${(analysis.accuracy || 0).toFixed(1)}%`, icon: BarChart3, color: "text-purple-400" },
    { label: "Duration", value: `${analysis.match_duration || 0} min`, icon: Clock, color: "text-cyan-400" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Button asChild variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
            <Link to={createPageUrl("VideoAnalysis")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Analyses
            </Link>
          </Button>
        </div>

        <Card className="bg-slate-800/40 border-slate-700 backdrop-blur-sm mb-6">
          <CardHeader className="border-b border-slate-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="text-3xl font-bold text-white">{analysis.title}</CardTitle>
                <div className="flex items-center gap-4 mt-2 text-slate-400">
                  <span>Player: <span className="font-semibold text-white">{analysis.player_name}</span></span>
                  <span>Team: <span className="font-semibold text-white">{analysis.team}</span></span>
                  <span>Map: <Badge variant="secondary" className="bg-slate-700 text-slate-300">{analysis.map_name}</Badge></span>
                </div>
              </div>
              <Button asChild className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 glow-effect">
                <a href={analysis.video_url} target="_blank" rel="noopener noreferrer">
                  <Play className="w-4 h-4 mr-2" />
                  Watch Full Video
                </a>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-2 md:grid-cols-5 gap-6">
            {stats.map(stat => (
              <div key={stat.label} className="text-center p-4 bg-slate-700/30 rounded-lg">
                <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/40 border-slate-700 backdrop-blur-sm h-full">
              <CardHeader className="border-b border-slate-700">
                <CardTitle className="text-white flex items-center gap-2">
                  <Map className="w-5 h-5 text-blue-400" />
                  Tactical Map Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <KillMap 
                  mapName={analysis.map_name}
                  killEvents={analysis.kill_events || []}
                  deathEvents={analysis.death_events || []}
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="bg-slate-800/40 border-slate-700 backdrop-blur-sm">
              <CardHeader className="border-b border-slate-700">
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-green-400" />
                  Event Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <KillFeed 
                  killEvents={analysis.kill_events || []} 
                  deathEvents={analysis.death_events || []}
                />
              </CardContent>
            </Card>

            <Card className="bg-slate-800/40 border-slate-700 backdrop-blur-sm">
              <CardHeader className="border-b border-slate-700">
                <CardTitle className="text-white flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-purple-400" />
                  AI Improvement Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3 text-slate-300">
                  {(analysis.improvement_suggestions || []).map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-purple-400 pt-1">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}