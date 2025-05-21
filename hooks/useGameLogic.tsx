import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '@/stores/gameStore';

export interface GameState {
  showScore: boolean;
  categorySelectionStep: boolean;
  showFinalScores: boolean;
  selectingCategory: boolean;
}

export interface GameActions {
  handleChangeWord: () => void;
  handleEndRound: () => void;
  handleCategorySelect: (categoryId: string) => Promise<void>;
  handleEndGame: () => void;
  handleReturnToMainMenu: () => void;
  handlePlayerScored: (playerId: string) => void;
  handleNoOneScored: () => void;
  getCurrentPlayer: () => any | null;
  getSortedPlayersByScore: () => any[];
}

export const useGameLogic = (): [GameState, GameActions] => {
  const router = useRouter();
  const {
    currentWord,
    startNewGame,
    nextWord,
    players,
    activePlayer,
    addPoint,
    changeWord,
    wordChangesRemaining,
    selectCategory,
    isLoading,
    resetScores,
  } = useGameStore();

  const [showScore, setShowScore] = useState(false);
  const [categorySelectionStep, setCategorySelectionStep] = useState(true);
  const [showFinalScores, setShowFinalScores] = useState(false);
  const [selectingCategory, setSelectingCategory] = useState(false);

  useEffect(() => {
    setShowFinalScores(false);
    resetScores();
    setSelectingCategory(false);
    setCategorySelectionStep(true);
    startNewGame();

    return () => {
      setShowFinalScores(false);
      setSelectingCategory(false);
    };
  }, []);

  const handleChangeWord = () => {
    if (wordChangesRemaining > 0) {
      changeWord();
    } else {
      nextWord(null);
      setShowScore(false);
      setCategorySelectionStep(true);
    }
  };

  const handleEndRound = () => {
    setShowScore(true);
  };

  const handleCategorySelect = async (categoryId: string) => {
    if (selectingCategory) return;
    setSelectingCategory(true);

    try {
      useGameStore.setState({ currentWord: null });
      await selectCategory(categoryId);

      const latestState = useGameStore.getState();

      if (latestState.currentWord) {
        setCategorySelectionStep(false);
      } else {
        console.warn('First attempt failed, trying again');
        await selectCategory(categoryId);

        const secondAttemptState = useGameStore.getState();
        if (secondAttemptState.currentWord) {
          setCategorySelectionStep(false);
        } else {
          Alert.alert(
            'Problem z hasłem',
            'Nie udało się załadować hasła. Spróbuj inną kategorię.',
            [{ text: 'OK' }],
          );
        }
      }
    } catch (error) {
      console.error('Error selecting category:', error);
      Alert.alert('Błąd', 'Wystąpił nieoczekiwany problem. Spróbuj ponownie.', [
        { text: 'OK' },
      ]);
    } finally {
      setSelectingCategory(false);
    }
  };

  const handleEndGame = () => {
    setShowFinalScores(true);
  };

  const handleReturnToMainMenu = () => {
    // First reset scores
    resetScores();
    // Close the modal
    setShowFinalScores(false);
    // Use a small delay to ensure clean navigation
    setTimeout(() => {
      router.replace('/home');
    }, 100);
  };

  const handlePlayerScored = (playerId: string): void => {
    addPoint(playerId);
    nextWord(playerId);
    setShowScore(false);
    setCategorySelectionStep(true);
  };

  const handleNoOneScored = (): void => {
    nextWord(null);
    setShowScore(false);
    setCategorySelectionStep(true);
  };

  const getCurrentPlayer = () => {
    if (players.length === 0) return null;
    return players[activePlayer];
  };

  const getSortedPlayersByScore = () => {
    return [...players].sort((a, b) => b.score - a.score);
  };

  const state: GameState = {
    showScore,
    categorySelectionStep,
    showFinalScores,
    selectingCategory,
  };

  const actions: GameActions = {
    handleChangeWord,
    handleEndRound,
    handleCategorySelect,
    handleEndGame,
    handleReturnToMainMenu,
    handlePlayerScored,
    handleNoOneScored,
    getCurrentPlayer,
    getSortedPlayersByScore,
  };

  return [state, actions];
};
