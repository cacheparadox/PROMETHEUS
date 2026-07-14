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
        className="text-center max-w-4xl px-4"
      >
        <h1 className="text-5xl sm:text-7xl md:text-9xl font-display font-bold tracking-tight mb-4 sm:mb-6 text-glow bg-clip-text text-transparent bg-gradient-to-br from-white via-blue-200 to-cyan-300">
          PROMETHEUS
        </h1>
        <h2 className="text-xs sm:text-sm md:text-base font-sans font-medium uppercase tracking-[0.3em] text-white/50 mb-10 sm:mb-14">
          The AI doesn't want you to know what's inside
        </h2>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(apiKey ? '/levels' : '?settings=true')}
          className="px-10 py-4 text-sm uppercase tracking-widest font-bold bg-white text-black rounded-full shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] transition-shadow"
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
