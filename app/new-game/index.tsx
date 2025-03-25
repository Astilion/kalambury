// app/new-game.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '@/stores/gameStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function NewGameScreen() {
  const router = useRouter();
  const { currentWord, startNewGame, nextWord } = useGameStore();

  useEffect(() => {
    startNewGame();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Twoje Hasło</Text>
      </View>

      <View style={styles.wordContainer}>
        {currentWord ? (
          <Text style={styles.word}>{currentWord}</Text>
        ) : (
          <Text style={styles.noWord}>Nie wybrano kategorii!</Text>
        )}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.nextButton]}
          onPress={nextWord}
        >
          <MaterialCommunityIcons name='refresh' size={24} color='white' />
          <Text style={styles.buttonText}>Następne Hasło</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.backButton]}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name='close' size={24} color='white' />
          <Text style={styles.buttonText}>Zakończ Grę</Text>
        </TouchableOpacity>
      </View>
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
    marginVertical: 40,
    marginTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f4511e',
  },
  wordContainer: {
    flex: 0.5,
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
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
