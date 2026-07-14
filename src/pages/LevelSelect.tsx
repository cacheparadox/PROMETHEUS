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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
      >
        {levels.map((level) => {
          const isUnlocked = level.levelNumber <= unlockedLevels;
          const score = scores[level.id];
          const isCompleted = !!score;

          return (
            <motion.div
              key={level.id}
              variants={item}
              whileHover={isUnlocked ? { scale: 1.02, y: -5 } : {}}
              onClick={() => isUnlocked && navigate(`/challenge/${level.id}`)}
              className={`
                group relative p-8 rounded-3xl glass-panel transition-all duration-500 ease-out flex flex-col justify-between min-h-[220px]
                ${isUnlocked ? 'cursor-pointer hover:shadow-[0_20px_60px_rgba(0,85,255,0.3)] hover:border-accent/40' : 'opacity-40 grayscale cursor-not-allowed'}
                ${isCompleted ? 'border-highlight/40 bg-highlight/5' : ''}
              `}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />
              
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="text-xs font-mono px-3 py-1 bg-white/10 rounded-full text-white/80 tracking-widest backdrop-blur-md border border-white/5">
                    LVL {level.levelNumber.toString().padStart(2, '0')}
                  </span>
                  {isUnlocked ? (
                    <Unlock size={18} className={isCompleted ? 'text-highlight' : 'text-accent'} />
                  ) : (
                    <Lock size={18} className="text-white/30" />
                  )}
                </div>
                
                <h3 className="text-2xl font-display font-bold mb-3 tracking-tight group-hover:text-glow transition-all">{level.title}</h3>
              </div>
              
              <div className="mt-auto">
                <div className="flex space-x-1.5 mb-4">
                  {[...Array(10)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1 flex-1 rounded-full ${i < level.difficulty ? 'bg-accent shadow-[0_0_10px_rgba(0,85,255,0.5)]' : 'bg-white/5'}`} 
                    />
                  ))}
                </div>

                {isCompleted && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1 font-mono">Security Rating</p>
                    <p className="text-xl font-black text-highlight text-glow font-display">{score.securityRating || 'Pass'}</p>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default LevelSelect;
