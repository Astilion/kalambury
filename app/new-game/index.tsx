import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '@/stores/gameStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ButtonComponent from '@/components/ButtonComponent';
import FinalScoreModal from '@/components/game/FinalScoreModal';
import LoadingIndicator from '@/components/LoadingIndicator';

export default function NewGameScreen() {
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
    categoryOptions,
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

  const getCurrentPlayer = () => {
    if (players.length === 0) return null;
    return players[activePlayer];
  };

  const currentPlayer = getCurrentPlayer();

  // Sort players by score (highest first) for final score display
  const sortedPlayersByScore = [...players].sort((a, b) => b.score - a.score);

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
          onClose={() => setShowFinalScores}
          onReturnToMenu={handleReturnToMainMenu}
        />
        <View style={styles.header}>
          <Text style={styles.title}>Wybierz Kategorię</Text>
          {currentPlayer && (
            <Text style={styles.currentPlayer}>
              Gracz: <Text style={styles.playerName}>{currentPlayer.name}</Text>
            </Text>
          )}
        </View>

        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryPrompt}>
              Wybierz jedną z kategorii:
            </Text>
            {categoryOptions.map((category) => (
              <ButtonComponent
                title={category.name}
                key={category.id}
                variant='info'
                size='large'
                onPress={() => handleCategorySelect(category.id)}
                disabled={selectingCategory}
              />
            ))}

            {categoryOptions.length === 0 && (
              <Text style={styles.noCategories}>
                Brak dostępnych kategorii. Sprawdź ustawienia.
              </Text>
            )}
          </View>
        )}
        <ButtonComponent
          title='Zakończ Grę'
          onPress={handleEndGame}
          variant='danger'
          iconName='close'
          animation={{ pulse: false, press: true }}
        />
      </View>
    );
  }

  // Word display and guessing UI (original game flow)
  return (
    <View style={styles.container}>
      <FinalScoreModal
        visible={showFinalScores}
        players={sortedPlayersByScore}
        onClose={() => setShowFinalScores}
        onReturnToMenu={handleReturnToMainMenu}
      />
      <View style={styles.header}>
        <Text style={styles.title}>
          {showScore ? 'Kto odgadł hasło?' : 'Twoje Hasło'}
        </Text>
        {currentPlayer && (
          <Text style={styles.currentPlayer}>
            Gracz: <Text style={styles.playerName}>{currentPlayer.name}</Text>
          </Text>
        )}
      </View>

      {!showScore ? (
        // Full-size word container when showing the word
        <View style={styles.wordContainer}>
          {currentWord ? (
            <>
              <Text style={styles.word}>{currentWord}</Text>
              <Text style={styles.changesRemaining}>
                Pozostałe zmiany: {wordChangesRemaining}
              </Text>
            </>
          ) : (
            <Text style={styles.noWord}>Nie wybrano kategorii!</Text>
          )}
        </View>
      ) : (
        // Compact word container when selecting who answered
        <View style={styles.compactWordContainer}>
          {currentWord && (
            <Text style={styles.compactWord}>Hasło: "{currentWord}"</Text>
          )}
        </View>
      )}

      {!showScore ? (
        <View style={styles.actionsContainer}>
          <ButtonComponent
            title='Zakończ Rundę'
            variant='warning'
            onPress={handleEndRound}
            iconName='check'
          />
          <ButtonComponent
            title={
              wordChangesRemaining > 0
                ? `Zmień Hasło (${wordChangesRemaining})`
                : 'Poddaj Się'
            }
            variant={wordChangesRemaining > 0 ? 'primary' : 'danger'}
            iconName={
              wordChangesRemaining > 0 ? 'swap-horizontal' : 'flag-outline'
            }
            onPress={handleChangeWord}
            animation={{ press: true, pulse: false }}
          />
          <ButtonComponent
            title='Wyniki'
            variant='info'
            animation={{ press: true, pulse: false }}
            onPress={() => router.push('/scoreboard')}
            iconName='trophy'
          />
          <ButtonComponent
            title='Zakończ grę'
            variant='danger'
            animation={{ press: true, pulse: false }}
            onPress={handleEndGame}
            iconName='close'
          />
        </View>
      ) : (
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreTitle}>Kto odgadł hasło?</Text>

          {players.length > 0 ? (
            <ScrollView style={styles.playerButtonsScrollView}>
              <View style={styles.playerButtons}>
                {players
                  .filter((player) => player.id !== currentPlayer?.id)
                  .map((player) => {
                    return (
                      <TouchableOpacity
                        key={player.id}
                        style={[styles.playerScoreButton]}
                        onPress={() => {
                          addPoint(player.id);
                          nextWord(player.id);
                          setShowScore(false);
                          setCategorySelectionStep(true);
                        }}
                      >
                        <View style={styles.playerScoreContent}>
                          <Text
                            style={styles.playerScoreButtonText}
                            numberOfLines={1}
                            ellipsizeMode='tail'
                          >
                            {player.name}
                          </Text>
                          <Text style={styles.pointsText}>(+1)</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
              </View>
            </ScrollView>
          ) : (
            <Text style={styles.noPlayers}>Brak graczy</Text>
          )}

          <TouchableOpacity
            style={[styles.button, styles.skipButton]}
            onPress={() => {
              nextWord(null);
              setShowScore(false);
              setCategorySelectionStep(true);
            }}
          >
            <MaterialCommunityIcons name='skip-next' size={24} color='white' />
            <Text style={styles.buttonText}>Nikt nie odgadł</Text>
          </TouchableOpacity>
        </View>
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
  header: {
    alignItems: 'center',
    marginVertical: 20,
    marginTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f4511e',
    marginBottom: 10,
  },
  currentPlayer: {
    fontSize: 18,
    color: '#666',
  },
  playerName: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  wordContainer: {
    padding: 16,
    margin: 16,
    borderRadius: 12,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    maxHeight: 150,
  },
  compactWordContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
    marginHorizontal: 20,
  },
  word: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  compactWord: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  changesRemaining: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  noWord: {
    fontSize: 20,
    color: '#999',
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'column',
    gap: 15,
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    gap: 10,
  },
  nextButton: {
    backgroundColor: '#4CAF50',
  },
  backButton: {
    backgroundColor: '#F44336',
  },
  endRoundButton: {
    backgroundColor: '#FFC107',
  },
  changeWordButton: {
    backgroundColor: '#FF9800',
  },
  disabledButton: {
    backgroundColor: '#D32F2F',
  },
  disabledButtonText: {
    color: 'white',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoreContainer: {
    flex: 0.6,
  },
  scoreTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  playerButtonsScrollView: {
    maxHeight: 600,
  },
  playerButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 15,
  },
  playerScoreButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginHorizontal: 5,
    width: '46%',
  },
  playerScoreContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  playerScoreButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    marginRight: 5,
  },
  pointsText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    width: 40,
    textAlign: 'right',
  },
  skipButton: {
    backgroundColor: '#9E9E9E',
    marginTop: 10,
  },
  noPlayers: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
  },
  scoreboardButton: {
    backgroundColor: '#2196F3',
  },
  categoryContainer: {
    flex: 0.7,
    padding: 20,
    alignItems: 'center',
  },
  categoryPrompt: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  categoryButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  noCategories: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 30,
  },

  // Modal styles
});
