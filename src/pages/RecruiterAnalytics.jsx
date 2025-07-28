import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import { Upload, BarChart3, UserPlus } from "lucide-react";

export default function RecruiterAnalytics() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [prospects, setProspects] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const parseCSV = (text) => {
    const lines = text.trim().split(/\r?\n/);
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
      const values = line.split(',');
      const obj = {};
      headers.forEach((h, i) => {
        obj[h.trim()] = values[i] ? values[i].trim() : '';
      });
      return obj;
    });
  };

  const computeProjections = (data) => {
    return data.map(p => {
      const rating = parseFloat(p.rating || p.elo || p.current_rating) || 1000;
      const impact = parseFloat(p.impact) || 1;
      return {
        name: p.name || p.player_name || 'Unknown',
        currentRating: rating,
        projectedElo: Math.round(rating + impact * 25),
        projectedImpact: (impact * 1.1).toFixed(2)
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    try {
      const text = await file.text();
      let data;
      if (file.name.toLowerCase().endsWith('.csv')) {
        data = parseCSV(text);
      } else {
        data = JSON.parse(text);
        if (!Array.isArray(data)) {
          data = data.players || data.prospects || [];
        }
      }
      setProspects(computeProjections(data));
    } catch (err) {
      console.error('Failed to parse file:', err);
      setError('Failed to parse file');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-2">
            <UserPlus className="w-9 h-9 text-green-400" />
            Recruiter Analytics
          </h1>
          <p className="text-slate-400">Upload prospect data to forecast player potential</p>
        </div>

        <Card className="bg-slate-800/40 border-slate-700 backdrop-blur-sm mb-6">
          <CardHeader className="border-b border-slate-700">
            <CardTitle className="text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-green-400" />
              Prospect Data
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <Input type="file" accept=".csv,application/json" onChange={handleFileChange} className="bg-slate-700 border-slate-600 text-white" />
              <Button type="submit" disabled={!file} className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                <Upload className="w-4 h-4 mr-2" />
                Analyze
              </Button>
            </form>
          </CardContent>
        </Card>

        {prospects.length > 0 && (
          <Card className="bg-slate-800/40 border-slate-700 backdrop-blur-sm">
            <CardHeader className="border-b border-slate-700">
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                Projected Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-400">
                      <th className="py-2 pr-4">Name</th>
                      <th className="py-2 pr-4">Rating</th>
                      <th className="py-2 pr-4">Projected ELO</th>
                      <th className="py-2">Impact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prospects.map((p, i) => (
                      <tr key={i} className="border-t border-slate-700">
                        <td className="py-2 pr-4 text-white">{p.name}</td>
                        <td className="py-2 pr-4 text-blue-400">{p.currentRating}</td>
                        <td className="py-2 pr-4 text-green-400">{p.projectedElo}</td>
                        <td className="py-2 text-purple-400">{p.projectedImpact}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ChartContainer config={{}}>
                <BarChart data={prospects}>
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="projectedElo" fill="#60a5fa" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
