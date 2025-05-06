import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCategories, getPhrasesByCategory } from '@/utils/db';

export type Player = {
  id: string;
  name: string;
  score: number;
};

export type CategoryOption = {
  id: string;
  name: string;
};

interface GameState {
  selectedCategories: Record<string, boolean>;
  availableCategories: { id: string; name: string }[];
  currentWord: string | null;
  players: Player[];
  activePlayer: number;
  isLoading: boolean;
  wordChangesRemaining: number;
  categoryOptions: CategoryOption[];
  selectedCategoryId: string | null;

  loadCategories: () => Promise<void>;
  toggleCategory: (categoryId: string) => void;
  startNewGame: () => Promise<void>;
  nextWord: (guessingPlayerId?: string | null) => Promise<void>;
  changeWord: () => Promise<void>;
  getRandomWord: () => Promise<void>;
  addPoint: (playerId: string) => void;
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  resetScores: () => void;
  areCategoriesSelected: () => boolean;
  generateCategoryOptions: () => void;
  selectCategory: (categoryId: string) => Promise<void>;
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
      // Initialize new state variables
      categoryOptions: [],
      selectedCategoryId: null,

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

      // Generate two random category options for the player to choose from
      generateCategoryOptions: () => {
        const state = get();

        // Get active categories
        let activeCategories = state.availableCategories
          .filter((cat) => state.selectedCategories[cat.id])
          .map((cat) => ({ id: cat.id, name: cat.name }));

        // If no categories selected, use all categories
        if (activeCategories.length === 0) {
          activeCategories = state.availableCategories;

          set((prevState) => ({
            selectedCategories: state.availableCategories.reduce((acc, cat) => {
              acc[cat.id] = true;
              return acc;
            }, {} as Record<string, boolean>),
          }));
        }

        // If we have only one category, just use that one
        if (activeCategories.length === 1) {
          set({
            categoryOptions: activeCategories,
            selectedCategoryId: null,
          });
          return;
        }

        // Choose two random categories
        const shuffled = [...activeCategories].sort(() => 0.5 - Math.random());
        const options = shuffled.slice(0, 2);

        set({
          categoryOptions: options,
          selectedCategoryId: null,
        });
      },

      // Select a category and fetch a word from it
      selectCategory: async (categoryId: string) => {
        set({
          selectedCategoryId: categoryId,
          isLoading: true,
        });

        try {
          const phrases = await getPhrasesByCategory(categoryId);

          if (phrases.length === 0) {
            console.warn(`No phrases found for category: ${categoryId}`);
            set({ isLoading: false });
            return;
          }

          const randomPhraseIndex = Math.floor(Math.random() * phrases.length);
          const randomPhrase = phrases[randomPhraseIndex];

          set({
            currentWord: randomPhrase.text,
            isLoading: false,
            wordChangesRemaining: 3, // Reset word changes when selecting a new category
          });
        } catch (error) {
          console.error('Error selecting category:', error);
          set({ isLoading: false });
        }
      },

      // Updated to use the selected category when changing word
      changeWord: async () => {
        const state = get();

        // Don't do anything if no more changes are allowed
        if (state.wordChangesRemaining <= 0) return;

        set({ isLoading: true });

        try {
          // If a category is selected, use that category for new word
          if (state.selectedCategoryId) {
            const phrases = await getPhrasesByCategory(
              state.selectedCategoryId,
            );

            if (phrases.length === 0) {
              console.warn(
                `No phrases found for category: ${state.selectedCategoryId}`,
              );
              set({ isLoading: false });
              return;
            }

            const randomPhraseIndex = Math.floor(
              Math.random() * phrases.length,
            );
            const randomPhrase = phrases[randomPhraseIndex];

            set({
              currentWord: randomPhrase.text,
              isLoading: false,
              wordChangesRemaining: state.wordChangesRemaining - 1,
            });
          } else {
            // Fall back to old behavior if no category selected
            await get().getRandomWord();
            set((state) => ({
              wordChangesRemaining: state.wordChangesRemaining - 1,
            }));
          }
        } catch (error) {
          console.error('Error changing word:', error);
          set({ isLoading: false });
        }
      },

      // Gets a random word when no category is specifically selected
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
        // Instead of getting a random word, generate category options
        get().generateCategoryOptions();
        set({
          wordChangesRemaining: 3,
          currentWord: null, // Clear current word until a category is selected
          selectedCategoryId: null,
        });
      },

      nextWord: async (guessingPlayerId?: string | null) => {
        const state = get();
        // Start a new game (generate new category options)
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
      // Updated resetScores function - makes sure to reset all player scores to 0
      resetScores: () =>
        set((state) => ({
          players: state.players.map((player) => ({ ...player, score: 0 })),
          activePlayer: 0, // Reset active player to the first player
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
