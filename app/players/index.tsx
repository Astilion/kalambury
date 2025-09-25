// screens/PlayersSelectionScreen.tsx
import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '@/stores/gameStore';
import ButtonComponent from '@/components/ButtonComponent';
import PlayerInput from '@/components/PlayerInput';
import PlayersList from '@/components/PlayerList';
// Constants
const MAX_PLAYERS = 19;
const MIN_PLAYERS = 2;

export default function PlayersSelectionScreen() {
  const router = useRouter();
  const {
    players,
    addPlayer,
    removePlayer,
    areCategoriesSelected,
    resetScores,
  } = useGameStore();

  // Event handlers
  const handleAddPlayer = useCallback(
    (playerName: string) => {
      addPlayer(playerName);
    },
    [addPlayer],
  );

  const handleRemovePlayer = useCallback(
    (playerId: string) => {
      removePlayer(playerId);
    },
    [removePlayer],
  );

  const handleStartGame = useCallback(() => {
    if (players.length < MIN_PLAYERS) {
      Alert.alert(
        'Za mało graczy',
        `Dodaj conajmniej ${MIN_PLAYERS} graczy, aby wystartować grę.`,
      );
      return;
    }

    if (!areCategoriesSelected()) {
      Alert.alert('Nie wybrano Kategorii');
      return;
    }

    router.push('/new-game');
  }, [players.length, areCategoriesSelected, router]);

  const handleResetScores = useCallback(() => {
    Alert.alert(
      'Zresetuj Wyniki',
      'To zresetuje punktację. Nie będzie można tego cofnąć.',
      [
        { text: 'anuluj', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: resetScores,
        },
      ],
    );
  }, [resetScores]);

  const handleGoHome = useCallback(() => {
    router.push('/home');
  }, [router]);

  const canStartGame = useMemo(
    () => players.length >= MIN_PLAYERS && areCategoriesSelected(),
    [players.length, areCategoriesSelected],
  );

  const startButtonTitle = useMemo(() => {
    if (canStartGame) return 'Rozpocznij Grę';

    if (players.length < MIN_PLAYERS) {
      const playersNeeded = MIN_PLAYERS - players.length;
      return `Rozpocznij grę (Potrzeba graczy: ${playersNeeded})`;
    }

    if (!areCategoriesSelected()) {
      return 'Rozpocznij grę (Wybierz kategorie)';
    }

    return 'Rozpocznij grę';
  }, [canStartGame, players.length, areCategoriesSelected]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Wybierz Graczy</Text>
        </View>

        <PlayerInput
          onAddPlayer={handleAddPlayer}
          existingPlayers={players}
          maxPlayers={MAX_PLAYERS}
        />

        <PlayersList
          players={players}
          onRemovePlayer={handleRemovePlayer}
          maxPlayers={MAX_PLAYERS}
        />

        <View style={styles.bottomActions}>
          <ButtonComponent
            title={startButtonTitle}
            variant={canStartGame ? 'success' : 'secondary'}
            iconName='play'
            onPress={handleStartGame}
            animation={{ press: true, pulse: false }}
            disabled={!canStartGame}
          />

          {players.length > 0 && (
            <ButtonComponent
              title='Zresetuj Wyniki'
              variant='warning'
              iconName='refresh'
              onPress={handleResetScores}
              animation={{ press: true, pulse: false }}
            />
          )}

          <ButtonComponent
            title='Zamknij'
            variant='danger'
            iconName='home'
            onPress={handleGoHome}
            animation={{ press: true, pulse: false }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f4511e',
  },
  bottomActions: {
    flexDirection: 'column',
    gap: 15,
    marginVertical: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
});
