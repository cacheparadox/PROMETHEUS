import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const models = [
  'openai/gpt-4o-mini',
  'openai/gpt-4o',
  'anthropic/claude-3-haiku',
  'anthropic/claude-3.5-sonnet',
  'meta-llama/llama-3-70b-instruct'
];

const SettingsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { apiKey, setApiKey, selectedModel, setSelectedModel, validatorModel, setValidatorModel } = useAppStore();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg glass-panel rounded-2xl p-8 shadow-2xl"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
          
          <h2 className="text-2xl font-bold mb-6 text-glow">Configuration</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                OpenRouter API Key
              </label>
              <input 
                type="password" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-or-v1-..."
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              />
              <p className="mt-2 text-xs text-white/40">
                Stored locally in your browser. Never sent to our servers.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Challenge Model
              </label>
              <select 
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent appearance-none cursor-pointer"
              >
                {models.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Validator Model (For AI graded levels)
              </label>
              <select 
                value={validatorModel}
                onChange={(e) => setValidatorModel(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-secondary appearance-none cursor-pointer"
              >
                {models.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-colors"
            >
              Save & Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SettingsModal;
