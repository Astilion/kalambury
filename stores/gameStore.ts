// stores/gameStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CATEGORIES } from '../constants/Categories';
import { Player, Category } from '../types';

interface GameState {
  players: Player[];
  currentPlayer: Player | null;
  selectedCategories: Record<string, boolean>;
  // Actions
  setPlayers: (players: Player[]) => void;
  setCurrentPlayer: (player: Player | null) => void;
  toggleCategory: (categoryId: string) => void;
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  updateScore: (playerId: string, points: number) => void;
}

const initialSelectedCategories = CATEGORIES.reduce<Record<string, boolean>>(
  (acc, category) => {
    acc[category.id] = true;
    return acc;
  },
  {},
);

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      players: [],
      currentPlayer: null,
      selectedCategories: initialSelectedCategories,

      setPlayers: (players) => set({ players }),
      setCurrentPlayer: (currentPlayer) => set({ currentPlayer }),

      toggleCategory: (categoryId) =>
        set((state) => ({
          selectedCategories: {
            ...state.selectedCategories,
            [categoryId]: !state.selectedCategories[categoryId],
          },
        })),

      addPlayer: (name) =>
        set((state) => ({
          players: [
            ...state.players,
            { id: Date.now().toString(), name, score: 0 },
          ],
        })),

      removePlayer: (id) =>
        set((state) => ({
          players: state.players.filter((player) => player.id !== id),
        })),

      updateScore: (playerId, points) =>
        set((state) => ({
          players: state.players.map((player) =>
            player.id === playerId
              ? { ...player, score: player.score + points }
              : player,
          ),
        })),
    }),
    {
      name: 'kalambury-game-storage',
    },
  ),
);
