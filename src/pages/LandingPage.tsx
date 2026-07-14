import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

const LandingPage = () => {
  const navigate = useNavigate();
  const apiKey = useAppStore(state => state.apiKey);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center max-w-4xl"
      >
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-6 text-glow bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-cyan-200">
          PROMETHEUS
        </h1>
        <h2 className="text-xl md:text-2xl font-light text-white/60 mb-12 tracking-wide">
          The AI doesn't want you to know what's inside.
        </h2>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(apiKey ? '/levels' : '?settings=true')}
          className="px-12 py-5 text-xl font-bold bg-white text-black rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-shadow"
        >
          Initiate Sequence
        </motion.button>
        
        {!apiKey && (
          <p className="mt-6 text-white/40 text-sm">
            Please configure your OpenRouter API key in settings (top right) to begin.
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default LandingPage;
