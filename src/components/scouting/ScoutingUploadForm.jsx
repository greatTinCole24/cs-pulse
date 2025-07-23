import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScoutingReport } from "@/api/entities";
import { UploadFile, InvokeLLM } from "@/api/integrations";
import { Upload, X, Loader2 } from "lucide-react";

const CS_MAPS = ["Dust2", "Mirage", "Inferno", "Cache", "Overpass", "Nuke", "Train", "Cobblestone", "Vertigo", "Ancient"];

export default function ScoutingUploadForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({ team_name: "", map_name: "" });
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      
      const analysisPrompt = `You are a world-class Counter-Strike coach. Analyze this gameplay video of the team "${formData.team_name}" on the map "${formData.map_name}". Your analysis must identify their strategic vulnerabilities and patterns. Provide a concise summary of their overall playstyle, a bulleted list of 3-5 specific, exploitable weaknesses (e.g., 'Over-rotate on A-site fakes', 'Predictable B-site executes'), and a bulleted list of 2-3 key player or team tendencies (e.g., 'AWPer plays overly aggressive angles with low support').`;

      const aiAnalysis = await InvokeLLM({
        prompt: analysisPrompt,
        file_urls: [file_url],
        response_json_schema: {
          type: "object",
          properties: {
            strategic_summary: { type: "string" },
            identified_weaknesses: { type: "array", items: { type: "string" } },
            key_tendencies: { type: "array", items: { type: "string" } }
          }
        }
      });

      await ScoutingReport.create({
        ...formData,
        video_url: file_url,
        ...aiAnalysis,
        analysis_status: "completed"
      });

      onSuccess();
    } catch (error) {
      console.error("Scouting analysis failed:", error);
    }
    setIsUploading(false);
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
              <Upload className="w-5 h-5 text-amber-400" />
              New Scouting Report
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onCancel} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="team_name" className="text-slate-300">Opponent Team Name</Label>
                <Input
                  id="team_name"
                  value={formData.team_name}
                  onChange={(e) => setFormData({...formData, team_name: e.target.value})}
                  placeholder="e.g., Team Liquid"
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
                      <SelectItem key={map} value={map} className="text-white hover:bg-slate-700">{map}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="video" className="text-slate-300">Opponent's Match Video</Label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-slate-400" />
                    <p className="mb-2 text-sm text-slate-400"><span className="font-medium">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-slate-500">MP4, WEBM (MAX. 500MB)</p>
                  </div>
                  <input id="video" type="file" className="hidden" accept="video/mp4,video/webm" onChange={(e) => setFile(e.target.files[0])} required />
                </label>
              </div>
              {file && <p className="text-sm text-amber-400 mt-2">Selected: {file.name}</p>}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} disabled={isUploading} className="border-slate-600 text-slate-300 hover:bg-slate-700">Cancel</Button>
              <Button type="submit" disabled={isUploading || !file} className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600">
                {isUploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analyzing...</> : <><Upload className="w-4 h-4 mr-2" />Analyze</>}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
