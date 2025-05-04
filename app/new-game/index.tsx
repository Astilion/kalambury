import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '@/stores/gameStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
    selectedCategoryId,
    selectCategory,
    isLoading,
  } = useGameStore();

  const [showScore, setShowScore] = useState(false);
  const [categorySelectionStep, setCategorySelectionStep] = useState(true);

  useEffect(() => {
    startNewGame();
    setCategorySelectionStep(true);
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
    await selectCategory(categoryId);
    setCategorySelectionStep(false); // Move to word display after category selection
  };

  const getCurrentPlayer = () => {
    if (players.length === 0) return null;
    return players[activePlayer];
  };

  const currentPlayer = getCurrentPlayer();

  // Category selection UI
  if (categorySelectionStep) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Wybierz Kategorię</Text>
          {currentPlayer && (
            <Text style={styles.currentPlayer}>
              Gracz: <Text style={styles.playerName}>{currentPlayer.name}</Text>
            </Text>
          )}
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size='large' color='#f4511e' />
            <Text style={styles.loadingText}>Wczytywanie kategorii...</Text>
          </View>
        ) : (
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryPrompt}>
              Wybierz jedną z kategorii:
            </Text>
            {categoryOptions.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryButton}
                onPress={() => handleCategorySelect(category.id)}
              >
                <Text style={styles.categoryButtonText}>{category.name}</Text>
              </TouchableOpacity>
            ))}

            {categoryOptions.length === 0 && (
              <Text style={styles.noCategories}>
                Brak dostępnych kategorii. Sprawdź ustawienia.
              </Text>
            )}
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, styles.backButton]}
          onPress={() => router.push('/home')}
        >
          <MaterialCommunityIcons name='close' size={24} color='white' />
          <Text style={styles.buttonText}>Zakończ Grę</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Word display and guessing UI (original game flow)
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Twoje Hasło</Text>
        {currentPlayer && (
          <Text style={styles.currentPlayer}>
            Gracz: <Text style={styles.playerName}>{currentPlayer.name}</Text>
          </Text>
        )}
      </View>

      <View style={styles.wordContainer}>
        {currentWord ? (
          <>
            <Text style={styles.word}>{currentWord}</Text>
            {!showScore && (
              <Text style={styles.changesRemaining}>
                Pozostałe zmiany: {wordChangesRemaining}
              </Text>
            )}
          </>
        ) : (
          <Text style={styles.noWord}>Nie wybrano kategorii!</Text>
        )}
      </View>

      {!showScore ? (
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.endRoundButton]}
            onPress={handleEndRound}
          >
            <MaterialCommunityIcons name='check' size={24} color='white' />
            <Text style={styles.buttonText}>Zakończ rundę</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.changeWordButton,
              wordChangesRemaining <= 0 && styles.disabledButton,
            ]}
            onPress={handleChangeWord}
          >
            <MaterialCommunityIcons
              name={
                wordChangesRemaining > 0 ? 'swap-horizontal' : 'flag-outline'
              }
              size={24}
              color={'white'}
            />
            <Text
              style={[
                styles.buttonText,
                wordChangesRemaining <= 0 && styles.disabledButtonText,
              ]}
            >
              {wordChangesRemaining > 0
                ? `Zmień Hasło (${wordChangesRemaining})`
                : 'Poddaj się'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.scoreboardButton]}
            onPress={() => router.push('/scoreboard')}
          >
            <MaterialCommunityIcons name='trophy' size={24} color='white' />
            <Text style={styles.buttonText}>Wyniki</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={() => router.push('/home')}
          >
            <MaterialCommunityIcons name='close' size={24} color='white' />
            <Text style={styles.buttonText}>Zakończ Grę</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreTitle}>Kto odgadł hasło?</Text>

          {players.length > 0 ? (
            <View style={styles.playerButtons}>
              {players
                .filter((player) => player.id !== currentPlayer?.id)
                .map((player) => (
                  <TouchableOpacity
                    key={player.id}
                    style={styles.playerScoreButton}
                    onPress={() => {
                      addPoint(player.id);
                      nextWord(player.id);
                      setShowScore(false);
                      setCategorySelectionStep(true);
                    }}
                  >
                    <Text style={styles.playerScoreButtonText}>
                      {player.name} (+1)
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
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
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
  },
  word: {
    fontSize: 40,
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
  playerButtons: {
    marginBottom: 20,
    gap: 10,
  },
  playerScoreButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  playerScoreButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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
  loadingContainer: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});
