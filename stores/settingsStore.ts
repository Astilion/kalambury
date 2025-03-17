// stores/settingsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  showAds: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  // Actions
  setShowAds: (show: boolean) => void;
  setDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void;
  setTimeLimit: (seconds: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      showAds: true,
      difficulty: 'medium',
      timeLimit: 60,

      setShowAds: (showAds) => set({ showAds }),
      setDifficulty: (difficulty) => set({ difficulty }),
      setTimeLimit: (timeLimit) => set({ timeLimit }),
    }),
    {
      name: 'kalambury-settings-storage',
    },
  ),
);
