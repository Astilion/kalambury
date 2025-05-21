import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useGameStore } from '@/stores/gameStore';
import { useRouter } from 'expo-router';
import { useGameLogic } from '@/hooks/useGameLogic';

import FinalScoreModal from '@/components/game/FinalScoreModal';
import LoadingIndicator from '@/components/LoadingIndicator';
import CategorySelectionPhase from '@/components/game/CategorySelectionPhase';
import DisplayPhase from '@/components/game/DisplayPhase';
import ScoringPhase from '@/components/game/ScoringPhase';

export default function NewGameScreen() {
  const router = useRouter();
  const { isLoading } = useGameStore();

  const [
    { showScore, categorySelectionStep, showFinalScores, selectingCategory },
    {
      handleChangeWord,
      handleEndRound,
      handleCategorySelect,
      handleEndGame,
      handleReturnToMainMenu,
      handlePlayerScored,
      handleNoOneScored,
      getCurrentPlayer,
      getSortedPlayersByScore,
    },
  ] = useGameLogic();

  const currentPlayer = getCurrentPlayer();
  const sortedPlayersByScore = getSortedPlayersByScore();

  // Show loading indicator during category selection transition
  if (selectingCategory) {
    <LoadingIndicator />;
  }

  // Category selection UI
  if (categorySelectionStep) {
    return (
      <View style={styles.container}>
        <FinalScoreModal
          visible={showFinalScores}
          players={sortedPlayersByScore}
          onClose={() => handleReturnToMainMenu()}
          onReturnToMenu={handleReturnToMainMenu}
        />

        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <CategorySelectionPhase
            currentPlayer={currentPlayer}
            onCategorySelect={handleCategorySelect}
            onEndGame={handleEndGame}
            isLoading={isLoading}
          />
        )}
      </View>
    );
  }

  // Word display and guessing UI (original game flow)
  return (
    <View style={styles.container}>
      <FinalScoreModal
        visible={showFinalScores}
        players={sortedPlayersByScore}
        onClose={() => handleReturnToMainMenu()}
        onReturnToMenu={handleReturnToMainMenu}
      />
      {!showScore ? (
        <DisplayPhase
          currentPlayer={currentPlayer}
          onEndRound={handleEndRound}
          onChangeWord={handleChangeWord}
          onEndGame={handleEndGame}
          onViewScoreboard={() => router.push('/scoreboard')}
        />
      ) : (
        <ScoringPhase
          currentPlayer={currentPlayer}
          players={useGameStore.getState().players}
          onPlayerScored={handlePlayerScored}
          onNoOneScored={handleNoOneScored}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
});
