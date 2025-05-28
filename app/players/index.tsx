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
        'Not Enough Players',
        `Add at least ${MIN_PLAYERS} players to start the game.`,
      );
      return;
    }

    if (!areCategoriesSelected()) {
      Alert.alert(
        'No Categories Selected',
        'Please go to settings and select game categories before starting.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Go to Settings',
            onPress: () => router.push('/settings'),
          },
        ],
      );
      return;
    }

    router.push('/new-game');
  }, [players.length, areCategoriesSelected, router]);

  const handleResetScores = useCallback(() => {
    Alert.alert(
      'Reset All Scores',
      'This will reset all player scores. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
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

  // Computed values
  const canStartGame = useMemo(
    () => players.length >= MIN_PLAYERS && areCategoriesSelected(),
    [players.length, areCategoriesSelected],
  );

  const startButtonTitle = useMemo(() => {
    if (canStartGame) return 'Start Game';
    const playersNeeded = MIN_PLAYERS - players.length;
    return `Start Game (${playersNeeded} more needed)`;
  }, [canStartGame, players.length]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Select Players</Text>
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
              title='Reset All Scores'
              variant='warning'
              iconName='refresh'
              onPress={handleResetScores}
              animation={{ press: true, pulse: false }}
            />
          )}

          <ButtonComponent
            title='Back to Home'
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
