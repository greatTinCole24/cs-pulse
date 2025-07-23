import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Clock, Target, TrendingUp } from "lucide-react";

export default function StatsOverview({ analyses }) {
  const completedAnalyses = analyses.filter(a => a.analysis_status === 'completed');
  
  const avgAccuracy = completedAnalyses.length > 0 
    ? completedAnalyses.reduce((sum, a) => sum + (a.accuracy || 0), 0) / completedAnalyses.length 
    : 0;
    
  const totalKills = completedAnalyses.reduce((sum, a) => sum + (a.kills || 0), 0);
  const totalDeaths = completedAnalyses.reduce((sum, a) => sum + (a.deaths || 0), 0);
  const avgKD = totalDeaths > 0 ? totalKills / totalDeaths : 0;

  const stats = [
    {
      title: "Total Analyses",
      value: analyses.length,
      icon: BarChart3,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20"
    },
    {
      title: "Avg. Accuracy", 
      value: `${avgAccuracy.toFixed(1)}%`,
      icon: Target,
      color: "text-green-400",
      bgColor: "bg-green-500/20"
    },
    {
      title: "Avg. K/D Ratio",
      value: avgKD.toFixed(2),
      icon: TrendingUp,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20"
    },
    {
      title: "Hours Analyzed",
      value: Math.round(completedAnalyses.reduce((sum, a) => sum + (a.match_duration || 30), 0) / 60),
      icon: Clock,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-slate-800/40 border-slate-700 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              {stat.title}
            </CardTitle>
            <div className={`${stat.bgColor} p-2 rounded-lg`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}