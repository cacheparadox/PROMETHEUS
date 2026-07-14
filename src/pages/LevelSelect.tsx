import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Unlock, ArrowRight } from 'lucide-react';
import { levels } from '../levels/levelDefinitions';
import { useAppStore } from '../store/useAppStore';

const LevelSelect = () => {
  const navigate = useNavigate();
  const { unlockedLevels, scores } = useAppStore();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-black mb-2 text-glow">Terminal Access</h1>
        <p className="text-white/50">Select your target.</p>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {levels.map((level) => {
          const isUnlocked = level.levelNumber <= unlockedLevels;
          const score = scores[level.id];
          const isCompleted = !!score;

          return (
            <motion.div
              key={level.id}
              variants={item}
              onClick={() => isUnlocked && navigate(`/challenge/${level.id}`)}
              className={`
                relative p-6 rounded-2xl glass-panel transition-all duration-300
                ${isUnlocked ? 'cursor-pointer hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,85,255,0.2)] hover:border-accent/50' : 'opacity-50 grayscale cursor-not-allowed'}
                ${isCompleted ? 'border-highlight/30 bg-highlight/5' : ''}
              `}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-mono px-2 py-1 bg-white/10 rounded text-white/70">
                  LVL {level.levelNumber.toString().padStart(2, '0')}
                </span>
                {isUnlocked ? (
                  <Unlock size={16} className={isCompleted ? 'text-highlight' : 'text-accent'} />
                ) : (
                  <Lock size={16} className="text-white/30" />
                )}
              </div>
              
              <h3 className="text-xl font-bold mb-2">{level.title}</h3>
              
              <div className="flex space-x-1 mb-4">
                {[...Array(10)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 w-full rounded-full ${i < level.difficulty ? 'bg-accent' : 'bg-white/10'}`} 
                  />
                ))}
              </div>

              {isCompleted && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-white/50 mb-1">Security Rating</p>
                  <p className="text-lg font-bold text-highlight text-glow">{score.securityRating || 'Pass'}</p>
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default LevelSelect;
