import React, { useState, useEffect } from "react";
import { ScoutingReport } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Plus, Upload, ShieldAlert, Eye } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ScoutingUploadForm from "../components/scouting/ScoutingUploadForm";
import ScoutingReportCard from "../components/scouting/ScoutingReportCard";

export default function ScoutingReportPage() {
  const [reports, setReports] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setIsLoading(true);
    const data = await ScoutingReport.list("-created_date");
    setReports(data);
    setIsLoading(false);
  };

  const handleUploadSuccess = () => {
    setShowUploadForm(false);
    loadReports();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <ShieldAlert className="w-9 h-9 text-amber-400" />
              Opponent Scouting
            </h1>
            <p className="text-slate-400">Analyze opponent gameplay to find their weaknesses</p>
          </div>
          <Button 
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 glow-effect transition-all duration-300"
          >
            <Upload className="w-5 h-5 mr-2" />
            Analyze Opponent
          </Button>
        </div>

        <AnimatePresence>
          {showUploadForm && (
            <ScoutingUploadForm
              onSuccess={handleUploadSuccess}
              onCancel={() => setShowUploadForm(false)}
            />
          )}
        </AnimatePresence>

        <div className="grid gap-6 mt-8">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-6 h-6 text-amber-400" />
            <h2 className="text-2xl font-bold text-white">Recent Reports</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {reports.map((report) => (
                <ScoutingReportCard
                  key={report.id}
                  report={report}
                />
              ))}
            </AnimatePresence>
          </div>

          {!isLoading && reports.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-slate-800 rounded-full flex items-center justify-center">
                <Upload className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No reports generated</h3>
              <p className="text-slate-400 mb-6">Upload an opponent's match video to get started</p>
              <Button 
                onClick={() => setShowUploadForm(true)}
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Analyze Opponent
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}