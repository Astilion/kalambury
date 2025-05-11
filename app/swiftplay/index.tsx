import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '@/stores/gameStore';
import ButtonComponent from '@/components/ButtonComponent';

export default function SwiftPlayScreen() {
  const router = useRouter();
  const { currentWord, startNewGame, getRandomWord } = useGameStore();

  useEffect(() => {
    startNewGame();
    getRandomWord();
  }, []);

  const handleNextPhrase = () => {
    getRandomWord();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Szybka Gra</Text>
      </View>

      <View style={styles.wordContainer}>
        {currentWord ? (
          <Text style={styles.word}>{currentWord}</Text>
        ) : (
          <Text style={styles.noWord}>Brak hasła!</Text>
        )}
      </View>

      <View style={styles.actionsContainer}>
        <ButtonComponent
          title='Następne Hasło'
          onPress={handleNextPhrase}
          variant='success'
          iconName='refresh'
          animation={{ pulse: false, press: true }}
        />
        <ButtonComponent
          title='Zakończ Grę'
          onPress={() => router.push('/home')}
          variant='danger'
          iconName='close'
          animation={{ pulse: false, press: true }}
        />
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
    marginVertical: 20,
    marginTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f4511e',
    marginBottom: 10,
  },
  phraseCounter: {
    fontSize: 18,
    color: '#666',
  },
  wordContainer: {
    flex: 0.6,
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
    alignItems: 'center',
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
