import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
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
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {currentWord ? (
            <Text style={styles.word}>{currentWord}</Text>
          ) : (
            <Text style={styles.noWord}>Brak hasła!</Text>
          )}
        </ScrollView>
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
  wordContainer: {
    flex: 0.6,
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  word: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    flexWrap: 'wrap',
    width: '100%',
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
});
