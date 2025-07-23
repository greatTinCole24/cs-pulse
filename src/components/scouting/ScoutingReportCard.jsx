import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Map, ShieldAlert, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

export default function ScoutingReportCard({ report }) {
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
              <CardTitle className="text-white font-bold flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                {report.team_name}
              </CardTitle>
              <p className="text-sm text-slate-400 mt-1">
                {format(new Date(report.created_date), "MMM d, yyyy")}
              </p>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 border">
              Completed
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 flex-grow">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <Map className="w-4 h-4 text-blue-400" />
              <span className="text-slate-400">Map:</span>
              <Badge variant="outline" className="border-slate-600 text-slate-300">{report.map_name}</Badge>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-sm font-medium text-slate-300">Identified Weaknesses</span>
              </div>
              <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                {(report.identified_weaknesses || []).slice(0, 3).map((weakness, index) => (
                  <li key={index}>{weakness}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>

        <div className="p-6 pt-0 mt-auto">
          {/* This would link to a detail page in a full implementation */}
          <Button
            variant="outline"
            size="sm"
            className="w-full border-amber-500/30 text-amber-300 hover:bg-amber-500/20 bg-amber-500/10"
            onClick={() => alert("Full report view is a planned feature!")}
          >
            <Eye className="w-4 h-4 mr-2" />
            View Full Report
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
