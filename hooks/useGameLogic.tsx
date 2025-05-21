// hooks/useGameLogic.ts
import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '@/stores/gameStore';
import { Player } from '@/stores/gameStore';

export default function useGameLogic() {
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
    resetScores,
  } = useGameStore();

  const [showScore, setShowScore] = useState<boolean>(false);
  const [categorySelectionStep, setCategorySelectionStep] =
    useState<boolean>(true);
  const [showFinalScores, setShowFinalScores] = useState<boolean>(false);
  const [selectingCategory, setSelectingCategory] = useState<boolean>(false);

  // Get current player
  const getCurrentPlayer = (): Player | null => {
    if (players.length === 0) return null;
    return players[activePlayer];
  };

  const currentPlayer = getCurrentPlayer();

  // Sort players by score (highest first) for final score display
  const sortedPlayersByScore = [...players].sort((a, b) => b.score - a.score);

  const handleChangeWord = (): void => {
    if (wordChangesRemaining > 0) {
      changeWord();
    } else {
      nextWord(null);
      setShowScore(false);
      setCategorySelectionStep(true);
    }
  };

  const handleEndRound = (): void => {
    setShowScore(true);
  };

  const handleCategorySelect = async (categoryId: string): Promise<void> => {
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

  const handleEndGame = (): void => {
    setShowFinalScores(true);
  };

  const handleReturnToMainMenu = (): void => {
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

  return {
    categorySelectionStep,
    showScore,
    showFinalScores,
    selectingCategory,
    currentPlayer,
    sortedPlayersByScore,
    handleCategorySelect,
    handleEndRound,
    handleChangeWord,
    handleEndGame,
    handleReturnToMainMenu,
    handlePlayerScored,
    handleNoOneScored,
    setShowFinalScores,
  };
}
