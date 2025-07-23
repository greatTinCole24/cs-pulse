
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Target, Zap, TrendingUp, ExternalLink, ArrowRight } from "lucide-react";
import { format } from "date-fns";

export default function AnalysisCard({ analysis }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'processing': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className="bg-slate-800/40 border-slate-700 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300 h-full flex flex-col">
        <CardHeader className="border-b border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-white font-bold">{analysis.title}</CardTitle>
              <p className="text-sm text-slate-400 mt-1">
                {format(new Date(analysis.created_date), "MMM d, yyyy")}
              </p>
            </div>
            <Badge className={`${getStatusColor(analysis.analysis_status)} border`}>
              {analysis.analysis_status}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 flex-grow">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-slate-300">{analysis.player_name}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{analysis.team}</span>
            </div>
            
            {analysis.map_name && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400">Map:</span>
                <Badge variant="outline" className="border-slate-600 text-slate-300">
                  {analysis.map_name}
                </Badge>
              </div>
            )}

            {analysis.analysis_status === 'completed' && (
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-slate-400 uppercase tracking-wide">K/D</span>
                  </div>
                  <p className="text-lg font-bold text-white">
                    {analysis.kills || 0}/{analysis.deaths || 0}
                  </p>
                </div>
                
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-slate-400 uppercase tracking-wide">Accuracy</span>
                  </div>
                  <p className="text-lg font-bold text-white">
                    {analysis.accuracy ? `${analysis.accuracy.toFixed(1)}%` : 'N/A'}
                  </p>
                </div>
              </div>
            )}

            {analysis.improvement_suggestions && analysis.improvement_suggestions.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium text-slate-300">Key Insights</span>
                </div>
                <ul className="text-xs text-slate-400 space-y-1">
                  {analysis.improvement_suggestions.slice(0, 2).map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>

        <div className="p-6 pt-0 mt-auto">
          <Button
            variant="outline"
            size="sm"
            className="w-full border-blue-500/30 text-blue-300 hover:bg-blue-500/20 bg-blue-500/10"
          >
            View Full Analysis
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
