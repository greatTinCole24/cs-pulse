
import React, { useState, useEffect } from "react";
import { VideoAnalysis } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Play } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import VideoUploadForm from "../components/video/VideoUploadForm";
import AnalysisCard from "../components/video/AnalysisCard";
import StatsOverview from "../components/video/StatsOverview";

export default function VideoAnalysisPage() {
  const [analyses, setAnalyses] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalyses();
  }, []);

  const loadAnalyses = async () => {
    setIsLoading(true);
    const data = await VideoAnalysis.list("-created_date");
    setAnalyses(data);
    setIsLoading(false);
  };

  const handleUploadSuccess = () => {
    setShowUploadForm(false);
    loadAnalyses();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Video Analysis</h1>
            <p className="text-slate-400">Upload match videos and get detailed performance insights</p>
          </div>
          <Button 
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 glow-effect transition-all duration-300"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload Video
          </Button>
        </div>

        <StatsOverview analyses={analyses} />

        <AnimatePresence>
          {showUploadForm && (
            <VideoUploadForm
              onSuccess={handleUploadSuccess}
              onCancel={() => setShowUploadForm(false)}
            />
          )}
        </AnimatePresence>

        <div className="grid gap-6 mt-8">
          <div className="flex items-center gap-3 mb-4">
            <Play className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Recent Analyses</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {analyses.map((analysis) => (
                <Link to={createPageUrl(`AnalysisDetail?id=${analysis.id}`)} key={analysis.id}>
                  <AnalysisCard
                    analysis={analysis}
                    onUpdate={loadAnalyses}
                  />
                </Link>
              ))}
            </AnimatePresence>
          </div>

          {!isLoading && analyses.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-slate-800 rounded-full flex items-center justify-center">
                <Upload className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No analyses yet</h3>
              <p className="text-slate-400 mb-6">Upload your first match video to get started</p>
              <Button 
                onClick={() => setShowUploadForm(true)}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Upload Video
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
