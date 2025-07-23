

import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Play, 
  BarChart3, 
  Trophy, 
  Target, 
  Users,
  Zap,
  Database,
  ShieldAlert
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Video Analysis",
    url: createPageUrl("VideoAnalysis"),
    icon: Play,
  },
  {
    title: "Player Stats",
    url: createPageUrl("PlayerDashboard"),
    icon: BarChart3,
  },
  {
    title: "Team Analytics",
    url: createPageUrl("TeamAnalytics"),
    icon: Users,
  },
  {
    title: "Match Predictor",
    url: createPageUrl("MatchPredictor"),
    icon: Target,
  },
  {
    title: "Global Database",
    url: createPageUrl("GlobalDatabase"),
    icon: Database,
  }
];

const scoutingNav = [
  {
    title: "Opponent Scouting",
    url: createPageUrl("ScoutingReport"),
    icon: ShieldAlert,
  }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  useEffect(() => {
    const formatPageName = (name) => {
      if (!name) return 'CS Analytics';
      // Add spaces before capital letters, then trim
      const formatted = name.replace(/([A-Z])/g, ' $1').trim();
      return `${formatted} | CS Analytics`;
    };
    
    document.title = formatPageName(currentPageName);
  }, [currentPageName]);

  return (
    <SidebarProvider>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        :root {
          --background: 15 23 42;
          --foreground: 248 250 252;
          --card: 30 41 59;
          --card-foreground: 248 250 252;
          --primary: 59 130 246;
          --primary-foreground: 248 250 252;
          --secondary: 51 65 85;
          --secondary-foreground: 248 250 252;
          --muted: 51 65 85;
          --muted-foreground: 148 163 184;
          --accent: 34 197 94;
          --accent-foreground: 15 23 42;
          --destructive: 239 68 68;
          --destructive-foreground: 248 250 252;
          --border: 51 65 85;
          --input: 51 65 85;
          --ring: 59 130 246;
        }
        
        body {
          background: rgb(15 23 42);
          color: rgb(248 250 252);
          font-family: 'Inter', system-ui, sans-serif;
        }
        
        .glow-effect {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
        }
      `}</style>
      
      <div className="min-h-screen flex w-full bg-slate-900">
        <Sidebar className="border-r border-slate-700 bg-slate-800/50">
          <SidebarHeader className="border-b border-slate-700 p-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h2 className="font-bold text-white text-lg">CS Analytics</h2>
                <p className="text-xs text-slate-400">Elite Performance Data</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-2">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-slate-400 uppercase tracking-wider px-2 py-3">
                Analysis Tools
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`transition-all duration-300 rounded-lg mb-1 ${
                            isActive 
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 glow-effect' 
                              : 'hover:bg-slate-700/50 hover:text-blue-300 text-slate-300'
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-3 py-3">
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-slate-400 uppercase tracking-wider px-2 py-3">
                Competitive Edge
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {scoutingNav.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`transition-all duration-300 rounded-lg mb-1 ${
                            isActive 
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 glow-effect' 
                              : 'hover:bg-slate-700/50 hover:text-amber-300 text-slate-300'
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-3 py-3">
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-slate-400 uppercase tracking-wider px-2 py-3">
                Quick Stats
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 py-2 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Videos Analyzed</span>
                    <span className="font-bold text-green-400">0</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Teams Tracked</span>
                    <span className="font-bold text-blue-400">0</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Accuracy Rate</span>
                    <span className="font-bold text-cyan-400">98.7%</span>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-700 p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Trophy className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm truncate">Pro Analyst</p>
                <p className="text-xs text-slate-400 truncate">Esports Data Expert</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col bg-slate-900">
          <header className="bg-slate-800/30 border-b border-slate-700 px-6 py-4 md:hidden backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-700 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-white">CS Analytics</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

