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
  wordChangesRemaining: number;
  loadCategories: () => Promise<void>;
  toggleCategory: (categoryId: string) => void;
  startNewGame: () => Promise<void>;
  nextWord: (guessingPlayerId?: string | null) => Promise<void>;
  changeWord: () => Promise<void>;
  getRandomWord: () => Promise<void>; // New function for Swift Play mode
  addPoint: (playerId: string) => void;
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  resetScores: () => void;
  areCategoriesSelected: () => boolean;
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
      wordChangesRemaining: 3,

      loadCategories: async () => {
        set({ isLoading: true });
        try {
          const categories = await getCategories();

          // If no previously selected categories, select all by default
          set((state) => {
            const currentSelectedCategories =
              Object.keys(state.selectedCategories).length > 0
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
      areCategoriesSelected: () => {
        const state = get();
        return Object.values(state.selectedCategories).some(
          (selected) => selected,
        );
      },

      // Gets a random word - core function used by other modes
      getRandomWord: async () => {
        const state = get();
        set({ isLoading: true });
        try {
          let activeCategories = Object.entries(state.selectedCategories)
            .filter(([_, isSelected]) => isSelected)
            .map(([id]) => id);

          // If no categories selected, select all
          if (activeCategories.length === 0) {
            const allCategories = state.availableCategories.map(
              (cat) => cat.id,
            );
            activeCategories = allCategories;

            set((prevState) => ({
              selectedCategories: allCategories.reduce((acc, id) => {
                acc[id] = true;
                return acc;
              }, {} as Record<string, boolean>),
            }));
          }

          console.log('Active Categories:', activeCategories);

          if (activeCategories.length === 0) {
            console.warn('No categories selected');
            set({ isLoading: false });
            return;
          }

          const randomCategoryIndex = Math.floor(
            Math.random() * activeCategories.length,
          );
          const randomCategoryId = activeCategories[randomCategoryIndex];

          console.log('Selected Category ID:', randomCategoryId);

          const phrases = await getPhrasesByCategory(randomCategoryId);

          if (phrases.length === 0) {
            console.warn(`No phrases found for category: ${randomCategoryId}`);
            set({ isLoading: false });
            return;
          }

          const randomPhraseIndex = Math.floor(Math.random() * phrases.length);
          const randomPhrase = phrases[randomPhraseIndex];

          console.log('Selected Phrase:', randomPhrase);

          set({
            currentWord: randomPhrase.text,
            isLoading: false,
          });
        } catch (error) {
          console.error('Error getting random word:', error);
          set({ isLoading: false });
        }
      },

      startNewGame: async () => {
        await get().getRandomWord();
        set({ wordChangesRemaining: 3 }); // Reset word changes for the new round
      },

      // Function to change word without changing player
      changeWord: async () => {
        const state = get();

        // Don't do anything if no more changes are allowed
        if (state.wordChangesRemaining <= 0) return;

        await get().getRandomWord();
        set((state) => ({
          wordChangesRemaining: state.wordChangesRemaining - 1, // Decrement remaining changes
        }));
      },

      nextWord: async (guessingPlayerId?: string | null) => {
        const state = get();
        await state.startNewGame();

        if (state.players.length <= 1) {
          // If only one player or no players, just keep the same player
          return;
        }

        if (guessingPlayerId) {
          // If someone guessed correctly, find their index to make them the next player
          const guessingPlayerIndex = state.players.findIndex(
            (player) => player.id === guessingPlayerId,
          );
          if (guessingPlayerIndex !== -1) {
            set({ activePlayer: guessingPlayerIndex });
            return;
          }
        }

        // No one guessed correctly or guessingPlayerId not found
        // Choose a random player, but exclude the current one
        const currentPlayerIndex = state.activePlayer;
        const otherPlayerIndices = Array.from(
          { length: state.players.length },
          (_, i) => i,
        ).filter((i) => i !== currentPlayerIndex);

        if (otherPlayerIndices.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * otherPlayerIndices.length,
          );
          const nextPlayerIndex = otherPlayerIndices[randomIndex];
          set({ activePlayer: nextPlayerIndex });
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
          // Reset active player if the current active player is removed
          activePlayer:
            state.players.findIndex((p) => p.id === id) === state.activePlayer
              ? 0
              : state.activePlayer >= state.players.length - 1
              ? 0
              : state.activePlayer,
        })),
      resetScores: () =>
        set((state) => ({
          players: state.players.map((player) => ({ ...player, score: 0 })),
        })),
    }),
    {
      name: 'game-storage', // unique name
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        selectedCategories: state.selectedCategories,
        players: state.players,
      }),
    },
  ),
);
