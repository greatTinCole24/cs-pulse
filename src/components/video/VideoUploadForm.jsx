
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { VideoAnalysis } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Upload, X, Loader2, AlertCircle, CheckCircle } from "lucide-react";

const CS_MAPS = [
  "Dust2", "Mirage", "Inferno", "Cache", "Overpass", 
  "Nuke", "Train", "Cobblestone", "Vertigo", "Ancient"
];

const SUPPORTED_FORMATS = ['mp4', 'webm', 'avi'];

export default function VideoUploadForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    player_name: "",
    team: "",
    map_name: ""
  });
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const analyzeVideo = async (fileUrl) => {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ video_url: fileUrl })
    });

    if (!response.ok) {
      throw new Error('Analysis request failed');
    }

    return await response.json();
  };

  const validateFile = (selectedFile) => {
    if (!selectedFile) return { valid: false, error: "No file selected" };
    
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    const fileSizeMB = selectedFile.size / (1024 * 1024);
    
    if (fileSizeMB > 500) {
      return { valid: false, error: "File size must be less than 500MB" };
    }
    
    if (!selectedFile.type.startsWith('video/')) {
      return { valid: false, error: "Please select a video file" };
    }

    return { valid: true, supported: SUPPORTED_FORMATS.includes(fileExtension) };
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const validation = validateFile(selectedFile);
    if (!validation.valid) {
      setError(validation.error);
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError(null);
    
    if (!validation.supported) {
      setUploadStatus('unsupported');
    } else {
      setUploadStatus('supported');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      // Upload the file first
      const { file_url } = await UploadFile({ file });

      setIsUploading(false);
      setIsAnalyzing(true);

      // Request analysis from backend
      const analysisData = await analyzeVideo(file_url);

      // Save the analysis
      await VideoAnalysis.create({
        ...formData,
        video_url: file_url,
        ...analysisData,
        analysis_status: "completed"
      });

      onSuccess();
    } catch (error) {
      console.error("Analysis failed:", error);
      setError("Analysis failed. Please try again later.");
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-8"
    >
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="border-b border-slate-700">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-400" />
              Upload Match Video
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-300">Analysis Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., FaZe vs Astralis - Mirage"
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="player_name" className="text-slate-300">Player Name</Label>
                <Input
                  id="player_name"
                  value={formData.player_name}
                  onChange={(e) => setFormData({...formData, player_name: e.target.value})}
                  placeholder="e.g., s1mple"
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="team" className="text-slate-300">Team</Label>
                <Input
                  id="team"
                  value={formData.team}
                  onChange={(e) => setFormData({...formData, team: e.target.value})}
                  placeholder="e.g., NAVI"
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="map" className="text-slate-300">Map</Label>
                <Select
                  value={formData.map_name}
                  onValueChange={(value) => setFormData({...formData, map_name: value})}
                  required
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select map" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {CS_MAPS.map((map) => (
                      <SelectItem key={map} value={map} className="text-white hover:bg-slate-700">
                        {map}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="video" className="text-slate-300">Match Video</Label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-slate-400" />
                    <p className="mb-2 text-sm text-slate-400">
                      <span className="font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-slate-500">MP4, WEBM, AVI, MOV (MAX. 500MB)</p>
                  </div>
                  <input
                    id="video"
                    type="file"
                    className="hidden"
                    accept="video/*"
                    onChange={handleFileChange}
                    required
                  />
                </label>
              </div>
              
              {file && (
                <div className="mt-3 p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{file.name}</p>
                      <p className="text-xs text-slate-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    {uploadStatus === 'supported' && (
                      <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs">Supported</span>
                      </div>
                    )}
                    {uploadStatus === 'unsupported' && (
                      <div className="flex items-center gap-2 text-yellow-400">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-xs">Limited Analysis</span>
                      </div>
                    )}
                  </div>
                  {uploadStatus === 'unsupported' && (
                    <Alert className="mt-2 bg-yellow-500/10 border-yellow-500/30">
                      <AlertCircle className="h-4 w-4 text-yellow-400" />
                      <AlertDescription className="text-yellow-300 text-sm">
                        This file format has limited analysis capabilities. We'll provide basic statistics.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isUploading || isAnalyzing}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUploading || isAnalyzing || !file}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload & Analyze
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
