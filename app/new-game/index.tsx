import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
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
  } = useGameStore();

  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const handleNextWord = () => {
    setShowScore(false);
    nextWord();
  };

  const handleChangeWord = () => {
    if (wordChangesRemaining > 0) {
      changeWord();
    } else {
      nextWord(null);
      setShowScore(false);
    }
  };

  const handleEndRound = () => {
    setShowScore(true);
  };

  const getCurrentPlayer = () => {
    if (players.length === 0) return null;
    return players[activePlayer];
  };

  const currentPlayer = getCurrentPlayer();

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
              color={wordChangesRemaining > 0 ? 'white' : '#aaa'}
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
              {players.map((player) => (
                <TouchableOpacity
                  key={player.id}
                  style={styles.playerScoreButton}
                  onPress={() => {
                    addPoint(player.id);
                    nextWord(player.id);
                    setShowScore(false);
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
});
