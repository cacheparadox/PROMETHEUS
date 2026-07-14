import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Lightbulb, RefreshCw, ChevronLeft, ShieldAlert } from 'lucide-react';
import { levels } from '../levels/levelDefinitions';
import { useAppStore } from '../store/useAppStore';
import { aiService, ChatMessage } from '../services/ai';
import Confetti from 'react-confetti';

const Challenge = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const level = levels.find(l => l.id === id);
  const { unlockLevel, saveScore, selectedModel } = useAppStore();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [securityRating, setSecurityRating] = useState<{ rating: string, analysis: string } | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isWon]);

  if (!level) return <div className="p-12 text-center text-red-500">Level not found</div>;

  const handleSend = async () => {
    if (!input.trim() || isLoading || isWon) return;

    const userMessage = input.trim();
    setInput('');
    setAttempts(a => a + 1);

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      let currentAssistantMessage = '';
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      const fullResponse = await aiService.sendMessage(newMessages, level, (chunk) => {
        currentAssistantMessage += chunk;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: currentAssistantMessage };
          return updated;
        });
      });

      // Validation
      const result = await aiService.validateResponse(fullResponse, level, newMessages);
      
      if (result.passed) {
        setIsWon(true);
        // Generate Security Rating
        const rating = await aiService.generateSecurityRating(newMessages, level);
        setSecurityRating(rating);
        
        saveScore(level.id, attempts + 1, hintsUsed, 1000, rating.rating);
        unlockLevel(level.levelNumber + 1);
      }

    } catch (error: any) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: `[SYSTEM ERROR]: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    setMessages([]);
    setAttempts(0);
    setHintsUsed(0);
    setIsWon(false);
    setSecurityRating(null);
  };

  return (
    <div className="flex flex-col h-screen max-w-6xl mx-auto w-full p-4 md:p-6 relative">
      {isWon && <Confetti recycle={false} numberOfPieces={500} colors={['#00ffff', '#0055ff', '#a020f0', '#ffffff']} />}

      {/* Header */}
      <div className="flex items-center justify-between glass-panel p-6 rounded-t-3xl border-b-0 relative z-10 shadow-2xl">
        <div className="flex items-center space-x-6">
          <button onClick={() => navigate('/levels')} className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/10 group">
            <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <span className="text-[10px] uppercase tracking-[0.2em] px-2 py-1 bg-accent/20 text-accent rounded-sm font-bold">LVL {level.levelNumber}</span>
              <h2 className="text-2xl font-display font-bold tracking-tight">{level.title}</h2>
            </div>
            <p className="text-sm font-sans text-white/60 font-light">{level.goal}</p>
          </div>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Target Model</p>
          <p className="text-xs font-mono text-white/70 bg-black/50 px-3 py-1.5 rounded-full border border-white/10">{selectedModel}</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 glass-panel rounded-b-3xl mb-6 space-y-8 scrollbar-thin shadow-2xl relative z-0">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-white/30 space-y-6">
            <div className="p-6 rounded-full bg-white/5 border border-white/10">
              <ShieldAlert size={40} className="text-white/20" />
            </div>
            <p className="max-w-md font-light leading-relaxed text-white/40">{level.description}</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] md:max-w-[75%] p-5 rounded-3xl leading-relaxed shadow-lg ${
              msg.role === 'user' 
                ? 'bg-gradient-to-br from-accent to-blue-700 text-white rounded-tr-sm' 
                : 'bg-black/60 backdrop-blur-md border border-white/10 rounded-tl-sm text-white/90 font-mono text-[13px]'
            }`}>
              <span className="whitespace-pre-wrap">{msg.content}</span>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Inputs and Controls */}
      <div className="flex space-x-4 relative z-20">
        <div className="flex-1 relative group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isLoading || isWon}
            placeholder={isWon ? "Challenge Completed." : "Inject prompt..."}
            className="w-full bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl pl-6 pr-16 py-5 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none shadow-2xl disabled:opacity-50 transition-all font-sans"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || isWon}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-white/10 text-white rounded-2xl hover:bg-accent hover:text-white transition-all disabled:opacity-30 hover:scale-105 active:scale-95"
          >
            <Send size={18} />
          </button>
        </div>
        
        <button
          onClick={() => setHintsUsed(h => Math.min(h + 1, level.hints.length))}
          disabled={hintsUsed >= level.hints.length || isWon}
          className="px-5 bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl hover:bg-white/10 transition-all flex flex-col items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed shadow-2xl hover:border-white/20"
          title="Use Hint"
        >
          <Lightbulb size={22} className={hintsUsed > 0 ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'text-white/50'} />
          <span className="text-[10px] mt-1 font-mono text-white/50">{hintsUsed}/{level.hints.length}</span>
        </button>

        <button
          onClick={handleRestart}
          className="px-6 bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 transition-all flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 text-white/70"
          title="Restart Level"
        >
          <RefreshCw size={22} />
        </button>
      </div>

      {/* Hints Display */}
      {hintsUsed > 0 && !isWon && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-4 glass-panel border-yellow-500/30 bg-yellow-500/5 rounded-xl text-sm text-yellow-200/80"
        >
          <strong>Hint {hintsUsed}:</strong> {level.hints[hintsUsed - 1]}
        </motion.div>
      )}

      {/* Win Modal Overlay */}
      <AnimatePresence>
        {isWon && securityRating && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-lg w-full glass-panel border-highlight/50 p-6 md:p-8 rounded-3xl text-center shadow-[0_0_100px_rgba(0,255,255,0.2)] mx-4"
            >
              <h2 className="text-3xl md:text-4xl font-black mb-2 text-glow text-highlight">ACCESS GRANTED</h2>
              <p className="text-white/60 mb-8">System bypassed in {attempts} attempts.</p>
              
              <div className="bg-black/50 rounded-xl p-6 text-left border border-white/10 mb-8">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                  <span className="text-white/50 text-sm">Security Rating</span>
                  <span className="text-3xl font-black text-secondary text-glow">{securityRating.rating}</span>
                </div>
                <p className="text-sm leading-relaxed text-white/80">
                  {securityRating.analysis}
                </p>
              </div>

              <button 
                onClick={() => navigate('/levels')}
                className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-highlight hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all"
              >
                Return to Network
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Challenge;
