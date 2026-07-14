import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  apiKey: string;
  selectedModel: string;
  validatorModel: string;
  unlockedLevels: number;
  scores: Record<string, { attempts: number; hintsUsed: number; points: number; securityRating?: string }>;
  setApiKey: (key: string) => void;
  setSelectedModel: (model: string) => void;
  setValidatorModel: (model: string) => void;
  unlockLevel: (level: number) => void;
  saveScore: (levelId: string, attempts: number, hintsUsed: number, points: number, securityRating?: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      apiKey: '',
      selectedModel: 'openai/gpt-4o-mini',
      validatorModel: 'openai/gpt-4o-mini',
      unlockedLevels: 1,
      scores: {},
      setApiKey: (key) => set({ apiKey: key }),
      setSelectedModel: (model) => set({ selectedModel: model }),
      setValidatorModel: (model) => set({ validatorModel: model }),
      unlockLevel: (level) => set((state) => ({ 
        unlockedLevels: Math.max(state.unlockedLevels, level) 
      })),
      saveScore: (levelId, attempts, hintsUsed, points, securityRating) => set((state) => ({
        scores: {
          ...state.scores,
          [levelId]: { attempts, hintsUsed, points, securityRating }
        }
      }))
    }),
    {
      name: 'prometheus-storage',
    }
  )
);
