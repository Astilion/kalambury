import { View, Text, StyleSheet } from 'react-native';
import Header from './Header';
import ButtonComponent from '../ButtonComponent';
import { Player } from '@/stores/gameStore';
import { useGameStore } from '@/stores/gameStore';

interface WordDisplayPhaseProps {
  currentPlayer: Player | null;
  onEndRound: () => void;
  onChangeWord: () => void;
  onEndGame: () => void;
  onViewScoreboard: () => void;
}
export default function DisplayPhase({
  currentPlayer,
  onEndRound,
  onChangeWord,
  onEndGame,
  onViewScoreboard,
}: WordDisplayPhaseProps) {
  const { currentWord, wordChangesRemaining } = useGameStore();
  return (
    <View style={styles.container}>
      <Header title='Twoje Hasło' currentPlayer={currentPlayer} />

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

      <View style={styles.actionsContainer}>
        <ButtonComponent
          title='Zakończ Rundę'
          variant='warning'
          onPress={onEndRound}
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
          onPress={onChangeWord}
          animation={{ press: true, pulse: false }}
        />
        <ButtonComponent
          title='Wyniki'
          variant='info'
          animation={{ press: true, pulse: false }}
          onPress={onViewScoreboard}
          iconName='trophy'
        />
        <ButtonComponent
          title='Zakończ grę'
          variant='danger'
          animation={{ press: true, pulse: false }}
          onPress={onEndGame}
          iconName='close'
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  word: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  noWord: {
    fontSize: 20,
    color: '#999',
    textAlign: 'center',
  },
  changesRemaining: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  actionsContainer: {
    flexDirection: 'column',
    gap: 15,
    marginBottom: 20,
  },
});
