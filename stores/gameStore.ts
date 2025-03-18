// stores/gameStore.ts
import { create } from 'zustand';
import { CATEGORIES } from '../constants/Categories';

interface GameState {
  selectedCategories: Record<string, boolean>;
  currentWord: string | null;
  players: Player[];
  activePlayer: number;
  toggleCategory: (categoryId: string) => void;
  startNewGame: () => void;
  nextWord: () => void;
  addPoint: (playerId: string) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  // Initialize with all categories selected by default
  selectedCategories: CATEGORIES.reduce((acc, category) => {
    acc[category.id] = true;
    return acc;
  }, {} as Record<string, boolean>),
  
  currentWord: null,
  players: [],
  activePlayer: 0,
  
  toggleCategory: (categoryId: string) => set((state) => ({
    selectedCategories: {
      ...state.selectedCategories,
      [categoryId]: !state.selectedCategories[categoryId]
    }
  })),
  
  startNewGame: () => {
    const state = get();
    
    // Get all words from selected categories
    const selectedWords = CATEGORIES
      .filter(category => state.selectedCategories[category.id])
      .flatMap(category => category.words);
    
    // If no categories selected, don't change the word
    if (selectedWords.length === 0) {
      return;
    }
    
    // Select random word
    const randomIndex = Math.floor(Math.random() * selectedWords.length);
    const randomWord = selectedWords[randomIndex];
    
    set({ currentWord: randomWord });
  },
  
  nextWord: () => {
    const state = get();
    state.startNewGame();
    
    // Increment active player if there are any
    if (state.players.length > 0) {
      set({ activePlayer: (state.activePlayer + 1) % state.players.length });
    }
  },
  
  addPoint: (playerId: string) => set((state) => ({
    players: state.players.map(player => 
      player.id === playerId ? { ...player, score: player.score + 1 } : player
    )
  }))
}));