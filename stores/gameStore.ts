import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCategories, getPhrasesByCategory } from '@/utils/db';

export type Player = {
  id: string;
  name: string;
  score: number;
};

interface GameState {
  selectedCategories: Record<string, boolean>;
  availableCategories: { id: string; name: string }[];
  currentWord: string | null;
  players: Player[];
  activePlayer: number;
  isLoading: boolean;
  loadCategories: () => Promise<void>;
  toggleCategory: (categoryId: string) => void;
  startNewGame: () => Promise<void>;
  nextWord: () => Promise<void>;
  addPoint: (playerId: string) => void;
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      selectedCategories: {},
      availableCategories: [],
      currentWord: null,
      players: [],
      activePlayer: 0,
      isLoading: false,
      loadCategories: async () => {
        set({ isLoading: true });
        try {
          const categories = await getCategories();
          
          // If no previously selected categories, select all by default
          set((state) => {
            const currentSelectedCategories = Object.keys(state.selectedCategories).length > 0
              ? state.selectedCategories
              : categories.reduce((acc, category) => {
                  acc[category.id] = true;
                  return acc;
                }, {} as Record<string, boolean>);
            
            return {
              availableCategories: categories,
              selectedCategories: currentSelectedCategories,
              isLoading: false,
            };
          });
        } catch (error) {
          console.error('Error loading categories:', error);
          set({ isLoading: false });
        }
      },
      toggleCategory: (categoryId: string) =>
        set((state) => ({
          selectedCategories: {
            ...state.selectedCategories,
            [categoryId]: !state.selectedCategories[categoryId],
          },
        })),
      startNewGame: async () => {
        const state = get();
        set({ isLoading: true });
        try {
          const activeCategories = Object.entries(state.selectedCategories)
            .filter(([_, isSelected]) => isSelected)
            .map(([id]) => id);
          
          if (activeCategories.length === 0) {
            set({ isLoading: false });
            return;
          }
          
          const randomCategoryIndex = Math.floor(
            Math.random() * activeCategories.length,
          );
          const randomCategoryId = activeCategories[randomCategoryIndex];
          
          const phrases = await getPhrasesByCategory(randomCategoryId);
          
          if (phrases.length === 0) {
            set({ isLoading: false });
            return;
          }
          
          const randomPhraseIndex = Math.floor(Math.random() * phrases.length);
          const randomPhrase = phrases[randomPhraseIndex];
          
          set({
            currentWord: randomPhrase.text,
            isLoading: false,
          });
        } catch (error) {
          console.error('Error starting new game:', error);
          set({ isLoading: false });
        }
      },
      nextWord: async () => {
        const state = get();
        await state.startNewGame();
        if (state.players.length > 0) {
          set({ activePlayer: (state.activePlayer + 1) % state.players.length });
        }
      },
      addPoint: (playerId: string) =>
        set((state) => ({
          players: state.players.map((player) =>
            player.id === playerId
              ? { ...player, score: player.score + 1 }
              : player,
          ),
        })),
      addPlayer: (name: string) =>
        set((state) => ({
          players: [
            ...state.players,
            { id: Date.now().toString(), name, score: 0 },
          ],
        })),
      removePlayer: (id: string) =>
        set((state) => ({
          players: state.players.filter((player) => player.id !== id),
        })),
    }),
    {
      name: 'game-storage', // unique name
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        selectedCategories: state.selectedCategories,
      }),
    }
  )
);