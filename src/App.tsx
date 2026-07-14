import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LevelSelect from './pages/LevelSelect';
import Challenge from './pages/Challenge';
import SettingsModal from './components/SettingsModal';
import { Settings } from 'lucide-react';
import { useAppStore } from './store/useAppStore';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const apiKey = useAppStore(state => state.apiKey);

  return (
    <Router>
      <div className="min-h-screen bg-black text-foreground relative overflow-hidden mesh-bg">
        {/* Background Effects */}
        <div className="bg-noise mix-blend-overlay opacity-50"></div>
        <div className="absolute inset-0 bg-aurora bg-[length:300%_300%] animate-aurora-move opacity-30 pointer-events-none mix-blend-screen"></div>
        
        {/* Global Settings Button */}
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="fixed top-6 right-6 z-50 p-3 rounded-full glass-panel hover:bg-surface-hover transition-colors text-white/70 hover:text-white"
        >
          <Settings size={24} />
        </button>

        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

        <div className="relative z-10 min-h-screen flex flex-col">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route 
              path="/levels" 
              element={apiKey ? <LevelSelect /> : <Navigate to="/" />} 
            />
            <Route 
              path="/challenge/:id" 
              element={apiKey ? <Challenge /> : <Navigate to="/" />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
