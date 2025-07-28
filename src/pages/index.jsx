import Layout from "./Layout.jsx";

import VideoAnalysis from "./VideoAnalysis";

import PlayerDashboard from "./PlayerDashboard";

import MatchPredictor from "./MatchPredictor";

import GlobalDatabase from "./GlobalDatabase";

import TeamAnalytics from "./TeamAnalytics";

import AnalysisDetail from "./AnalysisDetail";

import ScoutingReport from "./ScoutingReport";
import RecruiterAnalytics from "./RecruiterAnalytics";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    VideoAnalysis: VideoAnalysis,
    
    PlayerDashboard: PlayerDashboard,
    
    MatchPredictor: MatchPredictor,
    
    GlobalDatabase: GlobalDatabase,
    
    TeamAnalytics: TeamAnalytics,

    AnalysisDetail: AnalysisDetail,

    ScoutingReport: ScoutingReport,

    RecruiterAnalytics: RecruiterAnalytics,

}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<VideoAnalysis />} />
                
                
                <Route path="/VideoAnalysis" element={<VideoAnalysis />} />
                
                <Route path="/PlayerDashboard" element={<PlayerDashboard />} />
                
                <Route path="/MatchPredictor" element={<MatchPredictor />} />
                
                <Route path="/GlobalDatabase" element={<GlobalDatabase />} />
                
                <Route path="/TeamAnalytics" element={<TeamAnalytics />} />
                
                <Route path="/AnalysisDetail" element={<AnalysisDetail />} />
                
                <Route path="/ScoutingReport" element={<ScoutingReport />} />

                <Route path="/RecruiterAnalytics" element={<RecruiterAnalytics />} />

            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}